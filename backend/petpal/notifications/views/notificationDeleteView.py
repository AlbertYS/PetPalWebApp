from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Notification
from ..serializers import NotificationListSerializer

class NotificationDeleteView(generics.DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationListSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        notification = self.get_object()
        
        # Check to see if the notification's user is associated with the request user
        if notification.user != request.user:
            return self.permission_denied(request)

        # All checks have passed, delete the notification
        self.perform_destroy(notification)
        return Response(status=status.HTTP_204_NO_CONTENT)
    