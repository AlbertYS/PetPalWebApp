from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

from ..models import Comment
from accounts.models import UserProfile, User
from applications.models import Application

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username',)

class CommentListSerializer(serializers.ModelSerializer):
    commenter = UserProfileSerializer()

    class Meta:
        model = Comment
        fields = ('content', 'creation_time', 'pk', 'commenter', 'rating')
