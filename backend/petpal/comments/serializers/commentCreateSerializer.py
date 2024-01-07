from django.shortcuts import get_object_or_404
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

from ..models import Comment
from accounts.models import ShelterProfile
from applications.models import Application
from notifications.models import Notification

class CommentCreateSerializer(serializers.ModelSerializer):
    
    rating = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Comment
        fields = ('content', 'rating')

    def create(self, validated_data):
        request = self.context.get('request', None)
        user = request.user
        obj_id = self.context.get('obj_id', None)
        obj_type = self.context.get('type', None)

        if obj_type == "application":
            # Check if application is valid
            application = get_object_or_404(Application, pk=obj_id)
            # User comments on application not their own
            if user.user_type == 1 and application.user_profile.user != user:
                raise serializers.ValidationError("Can only comment on your application")
            # Shelter comments on application not their own
            if user.user_type == 2 and application.listing.shelter_profile.user != user:
                raise serializers.ValidationError("Can only comment on applications for your listings")
            content_type = ContentType.objects.get_for_model(model=Application)
            validated_data['content_type'] = content_type
            validated_data['object_id'] = obj_id
            validated_data['commenter'] = user
            comment = Comment.objects.create(**validated_data)
            # Refresh the last update time on the application
            application.save()
            # Create a notification for either the user or shelter
            content_type_notification = ContentType.objects.get_for_model(model=Comment)
            obj_id_notification = comment.pk
            if user.user_type == 1:
                user_notification = application.listing.shelter_profile.user
                content = f"{user.username} left a comment on their application for {application.listing.name}"
            else:
                user_notification = application.user_profile.user
                content = f"{application.listing.shelter_profile.name} left a comment on your application for {application.listing.name}"
            notification = Notification.objects.create(
                content_type=content_type_notification,
                object_id=obj_id_notification,
                content=content,
                user=user_notification,
                status=1
            )
            notification.save()

            return comment
        elif obj_type == "shelter":
            # Check if shelter is valid
            shelter = get_object_or_404(ShelterProfile, id=obj_id)
            content_type = ContentType.objects.get_for_model(model=ShelterProfile)
            validated_data['content_type'] = content_type
            validated_data['object_id'] = obj_id
            validated_data['commenter'] = user
            comment = Comment.objects.create(**validated_data)
            # Let the shelter know there's been a comment
            content_type_notification = ContentType.objects.get_for_model(model=Comment)
            obj_id_notification = comment.pk
            user_notification = shelter.user
            content = f"{user.username} commented on your shelter"
            notification = Notification.objects.create(
                content_type=content_type_notification,
                object_id=obj_id_notification,
                user=user_notification,
                content=content,
                status=1
            )
            notification.save()
            return comment
        elif obj_type == "reply":
            # Check to see if comment is valid
            comment = get_object_or_404(Comment, pk=obj_id)
            # Move to head of comment
            head = comment.head
            if head is None:
                head = comment

            if isinstance(head.reply_to, Application):
                application = get_object_or_404(Application, pk=head.object_id)
                # User comments on application not their own
                if user.user_type == 1 and application.user_profile.user != user:
                    raise serializers.ValidationError("Can only comment on your application")
                # Shelter comments on application not their own
                if user.user_type == 2 and application.listing.shelter_profile.user != user:
                    raise serializers.ValidationError("Can only comment on applications for your listings")
                content_type = ContentType.objects.get_for_model(model=Comment)
                validated_data['content_type'] = content_type
                validated_data['object_id'] = obj_id
                validated_data['commenter'] = user
                validated_data['head'] = head
                reply = Comment.objects.create(**validated_data)
                # Refresh the last update time on the application
                application.save()
                # Create a notification for either the user or shelter
                content_type_notification = ContentType.objects.get_for_model(model=Comment)
                obj_id_notification = comment.pk
                if user.user_type == 1:
                    user_notification = application.listing.shelter_profile.user
                    content = f"{user.username} left a comment on their application for {application.listing.name}"
                else:
                    user_notification = application.user_profile.user
                    content = f"{application.listing.shelter_profile.name} left a comment on your application for {application.listing.name}"
                notification = Notification.objects.create(
                    content_type=content_type_notification,
                    object_id=obj_id_notification,
                    content=content,
                    user=user_notification,
                    status=1
                )
                notification.save()
                return reply

            if isinstance(head.reply_to, ShelterProfile):
                shelter = get_object_or_404(ShelterProfile, pk=head.object_id)
                content_type = ContentType.objects.get_for_model(model=Comment)
                validated_data['content_type'] = content_type
                validated_data['object_id'] = obj_id
                validated_data['commenter'] = user
                validated_data['head'] = head
                reply = Comment.objects.create(**validated_data)
                    # Let the shelter know there's been a comment
                content_type_notification = ContentType.objects.get_for_model(model=Comment)
                obj_id_notification = comment.pk
                user_notification = shelter.user
                content = f"{user.username} commented on your shelter"
                notification = Notification.objects.create(
                    content_type=content_type_notification,
                    object_id=obj_id_notification,
                    user=user_notification,
                    content=content,
                    status=1
                )
                notification.save()
                return reply
        else:
            raise serializers.ValidationError("Can only comment on shelter, application or reply to comment")