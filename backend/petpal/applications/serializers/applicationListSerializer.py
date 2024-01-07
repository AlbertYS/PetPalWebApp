from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

from ..models import Application
from accounts.models import UserProfile
from comments.models import Comment

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('name', 'email', 'phoneNum', 'address', 'profilePic')

class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = ('id', 'content', 'replies', 'commenter')

    def get_replies(self, obj):
        # Get the current comment's content type
        current_content_type = ContentType.objects.get_for_model(obj)

        # Get replies based on the current comment's ID and content type
        replies_qs = Comment.objects.filter(
            content_type=current_content_type,
            object_id=obj.pk,
        )

        # Recursive call for each reply
        replies_data = []
        for reply in replies_qs:
            replies_data.append({
                'id': reply.id,
                'content': reply.content,
                'replies': self.get_replies(reply),
                'commenter': reply.commenter.id,
            })

        return replies_data

class ApplicationListSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = Application
        fields = ('first_name', 'last_name', 'email', 'phoneNum', 'address',
                  'proof_of_identity', 'user_profile', 'status', 'comments',
                  'last_modified', 'creation_time', 'listing', 'id')
