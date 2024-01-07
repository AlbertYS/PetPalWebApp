from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from ..models import User, UserProfile


class UserRegistrationSerializer(serializers.ModelSerializer):
    repeat_password = serializers.CharField(write_only=True)

    # see https://gist.github.com/Vibhu-Agarwal/8f71bbef7072f1deea05c75abfb3c941 for how to create
    # the profile object in the user serializer (DELETE THIS COMMENT BEFORE SUBMISSION)
    class UserProfileTempSerializer(serializers.ModelSerializer):
        class Meta:
            model = UserProfile
            exclude = ['user']

    userProfile = UserProfileTempSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'userProfile', 'repeat_password')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('userProfile')
        validated_data['user_type'] = 1
        user_instance = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user_instance, **profile_data)
        return user_instance

    def validate(self, data):
        if data['password'] != data.pop('repeat_password'):
            raise ValidationError('Passwords do not match. ')
        return data

