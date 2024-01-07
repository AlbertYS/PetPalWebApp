from rest_framework import serializers

from ..models import Application

class ApplicationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ("status",)