from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import Notification
from ..serializers.notificationUpdateSerializer import NotificationUpdateSerializer


class NotificationUpdateView(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationUpdateSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        notification = self.get_object()
        print(notification)
        user = request.user
        if notification.user != user:
            raise self.permission_denied(request)

        serializer = self.get_serializer(notification, data=request.data)
        serializer.is_valid(raise_exception=True)

        if notification.status not in {1, 2}:
            raise self.permission_denied(request)

        self.perform_update(serializer)

        return Response(serializer.data)
