from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import Notification
from ..serializers import NotificationListSerializer

class NotificationGetView(generics.RetrieveAPIView):
    serializer_class = NotificationListSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Notification, id=self.kwargs['pk'])