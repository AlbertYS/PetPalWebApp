from rest_framework import serializers

from ..models import BlogImage, Blog
from accounts.models import ShelterProfile

class BlogImageCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlogImage
        fields = ('content', 'index')

    def create(self, validated_data):
        request = self.context.get('request', None)
        user = request.user
        if user.user_type != 2:
            raise serializers.ValidationError("Must be logged in as a shelter")
        
        blog_id = self.context.get('blog_id', None)
        if blog_id is None:
            raise serializers.ValidationError("Must specify a blog")
        blogs = Blog.objects.filter(pk=blog_id)
        if len(blogs) <= 0:
            raise serializers.ValidationError("Blog does not exist")
        blog = blogs[0]
        # Check if the user owns this blog
        if blog.shelter_profile.user != user:
            raise serializers.ValidationError("This is not your blog")
        validated_data['blog'] = blog
        blogImage = BlogImage.objects.create(**validated_data)
        return blogImage