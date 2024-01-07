from rest_framework import serializers

from ..models import Notification


class NotificationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("status",)
