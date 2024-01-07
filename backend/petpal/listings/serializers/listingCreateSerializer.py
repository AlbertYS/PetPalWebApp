from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q

from ..models import Listing, ImageModel, ImageAlbum
from accounts.models import ShelterProfile, UserProfile
from notifications.models import Notification

class ListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ('name', 'breed', 'age', 'gender', 'size', 'description', 'status', 'location')

    def create(self, validated_data):
        request = self.context.get('request', None)
        user = request.user
        if user.user_type != 2:
            raise serializers.ValidationError("User must be associated with Shelter")
        # Find the shelter profile associated with this user
        shelters = ShelterProfile.objects.all()
        user_shelter = None
        for shelter in shelters:
            if shelter.user == user:
                user_shelter = shelter
                break
        if user_shelter is None:
            raise serializers.ValidationError("User must be associated with Shelter")
        validated_data['shelter_profile'] = user_shelter
        listing = Listing.objects.create(**validated_data)
        # We need to create notifications for users with this breed set as a preference
        # Find all users that have this preference
        users_to_notify = UserProfile.objects.filter(
            Q(preference__iexact=validated_data['breed']) | Q(preference__iexact=validated_data['breed'].lower())
        )
        # Make a notification for each user
        for user in users_to_notify:
            content = f"{user_shelter.name} posting a listing for {listing.name} that you may be interested in!"
            notification = Notification.objects.create(
                content_type=ContentType.objects.get_for_model(model=Listing),
                object_id=listing.pk,
                content=content,
                user=user.user,
                status=1
            )
            notification.save()
        return listing
