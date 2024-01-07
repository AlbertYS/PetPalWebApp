from rest_framework import serializers

from ..models import ShelterProfile


class ShelterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShelterProfile
        exclude = ['user']