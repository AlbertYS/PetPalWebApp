from rest_framework import serializers

from ..models import Listing

class ListingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ('name', 'breed', 'age', 'gender', 'size', 'description', 'status', 'location')
