from rest_framework import serializers

from ..models import Blog
from .blogImageGetSerializer import BlogImageGetSerializer
from .blurbGetSerializer import BlurbGetSerializer

class BlogGetSerializer(serializers.ModelSerializer):
    blurbs = BlurbGetSerializer(many=True, read_only=True)
    blog_images = BlogImageGetSerializer(many=True, read_only=True)
    class Meta:
        model = Blog
        fields = '__all__'

class BlogListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'