from rest_framework import serializers

from ..models import Listing
from applications.models import Application

class ListingSerializer(serializers.ModelSerializer):
    disable = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = '__all__'
    
    def get_disable(self, obj):
        current_user = self.context['request'].user
        has_application = Application.objects.filter(listing=obj, user_profile__user=current_user).exists()
        return has_application
