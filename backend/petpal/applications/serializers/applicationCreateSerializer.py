from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

from ..models import Application
from accounts.models import UserProfile
from listings.models import Listing
from notifications.models import Notification

class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('first_name', 'last_name', 'email', 'phoneNum', 'address', 'proof_of_identity')

    def create(self, validated_data):
        request = self.context.get('request', None)
        user = request.user
        if user.user_type != 1:
            raise serializers.ValidationError("Must be logged in as a user")
        # Find the shelter profile associated with this user
        profiles = UserProfile.objects.all()
        user_profile = None
        for profile in profiles:
            if profile.user == user:
                user_profile = profile
                break
        if user_profile is None:
            raise serializers.ValidationError("Must be logged in as a user")

        validated_data['user_profile'] = user_profile

        listing_id = self.context.get('listing_id', None)
        if listing_id is None:
            raise serializers.ValidationError("Must specify a listing")

        listings = Listing.objects.filter(pk=listing_id)
        if len(listings) <= 0:
            raise serializers.ValidationError("Listing does not exist")
        validated_data['listing'] = listings[0]
        validated_data['status'] = 1
        application = Application.objects.create(**validated_data)
        # Make a notification for the shelter
        content_type = ContentType.objects.get_for_model(model=Application)
        obj_id = application.pk
        user_notification = application.listing.shelter_profile.user
        content = f"{user.username} has submitted an application for {application.listing.name}"
        notification = Notification.objects.create(
            content_type=content_type,
            object_id=obj_id,
            user=user_notification,
            content=content,
            status=1
        )
        return application
