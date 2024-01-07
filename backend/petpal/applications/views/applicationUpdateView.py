from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType

from ..models import Application
from ..serializers import ApplicationUpdateSerializer
from accounts.models import ShelterProfile, UserProfile
from notifications.models import Notification

class ApplicationUpdateView(generics.UpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationUpdateSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        application = self.get_object()
        user = request.user

        if user.user_type == 1:
            # Find the shelter profile associated with this user
            profiles = UserProfile.objects.all()
            user_profile = None
            for profile in profiles:
                if profile.user == user:
                    user_profile = profile
                    break
            if user_profile is None:
                raise self.permission_denied(request)

            # We have found the profile of this user
            if application.user_profile != user_profile:
                raise self.permission_denied(request)

            partial = kwargs.pop('partial', False)
            serializer = self.get_serializer(application, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)

            validated_data = serializer.validated_data
            status = validated_data.get("status")
            if application.status not in {1, 2} or status != 4:
                raise self.permission_denied(request)

            self.perform_update(serializer)

            # Make a notification for the shelter
            content_type = ContentType.objects.get_for_model(model=Application)
            obj_id = application.pk
            user_notification = application.listing.shelter_profile.user
            content = f"{user.username} has withdrawn thier application for {application.listing.name}"
            notification = Notification.objects.create(
                content_type=content_type,
                object_id=obj_id,
                user=user_notification,
                content=content,
                status=1
            )
            notification.save()

            return Response(serializer.data)

        if user.user_type == 2:
            # Find the shelter profile associated with this user
            profiles = ShelterProfile.objects.all()
            shelter_profile = None
            for profile in profiles:
                if profile.user == user:
                    shelter_profile = profile
                    break
            if shelter_profile is None:
                raise self.permission_denied(request)

            # We have found the profile of this shelter
            if application.listing.shelter_profile != shelter_profile:
                raise self.permission_denied(request)

            partial = kwargs.pop('partial', False)
            serializer = self.get_serializer(application, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)

            validated_data = serializer.validated_data
            status = validated_data.get("status")
            print(application.status, status)
            if application.status != 1 or status not in {2, 3}:
                raise self.permission_denied(request)

            self.perform_update(serializer)

            # Make a notification for the shelter
            content_type = ContentType.objects.get_for_model(model=Application)
            obj_id = application.pk
            user_notification = application.user_profile.user
            if status == 2:
                content = f"{shelter_profile.name} has accepted your application for {application.listing.name}"
            else:
                content = f"{shelter_profile.name} has denied your application for {application.listing.name}"
            notification = Notification.objects.create(
                content_type=content_type,
                object_id=obj_id,
                user=user_notification,
                content=content,
                status=1
            )
            notification.save()

            return Response(serializer.data)

