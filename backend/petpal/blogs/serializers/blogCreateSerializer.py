from rest_framework import serializers

from ..models import Blog
from accounts.models import ShelterProfile

class BlogCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blog
        fields = ('title', 'num_components', 'pk')

    def create(self, validated_data):
        request = self.context.get('request', None)
        user = request.user
        if user.user_type != 2:
            raise serializers.ValidationError("Must be logged in as a shelter")
        # Find the shelter profile associated with this user
        profiles = ShelterProfile.objects.all()
        shelter_profile = None
        for profile in profiles:
            if profile.user == user:
                shelter_profile = profile
                break
        if shelter_profile is None:
            raise serializers.ValidationError("Must be logged in as a shelter")

        validated_data['shelter_profile'] = shelter_profile

        blog = Blog.objects.create(**validated_data)
        return blog