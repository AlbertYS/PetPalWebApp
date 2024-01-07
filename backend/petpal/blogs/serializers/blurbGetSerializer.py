from rest_framework import serializers

from ..models import Blurb

class BlurbGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blurb
        fields = '__all__'