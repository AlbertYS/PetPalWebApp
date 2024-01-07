from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from django.contrib.auth.hashers import make_password

from ..models import User, ShelterProfile


class ShelterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShelterProfile
        exclude = ['user']


class ShelterUpdateSerializer(serializers.ModelSerializer):
    repeat_password = serializers.CharField(write_only=True)
    shelterProfile = ShelterProfileSerializer()

    class Meta:
        model = User
        fields = ('username', 'password', 'repeat_password', 'shelterProfile')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    # see this tutorial: https://riptutorial.com/django-rest-framework/example/25521/updatable-nested-serializers
    def update(self, instance, validated_data):
        # Update logic for ShelterProfile
        shelter_profile_data = validated_data.pop('shelterProfile', {})
        shelter_profile_serializer = self.fields['shelterProfile']
        shelter_profile_serializer.update(instance.shelterProfile, shelter_profile_data)

        # Update logic for User
        instance.username = validated_data.get('username', instance.username)
        if validated_data.get('password') is not None:
            instance.password = make_password(validated_data.get('password'))
        instance.save()

        return instance

    def validate(self, data):
        if 'password' in data and data['password'] != data.get('repeat_password'):
            if 'repeat_password' in data:
                data.pop('repeat_password')
            raise ValidationError('Passwords do not match. ')
        return data
