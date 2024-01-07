from rest_framework import serializers

from ..models import BlogImage

class BlogImageGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogImage
        fields = '__all__'