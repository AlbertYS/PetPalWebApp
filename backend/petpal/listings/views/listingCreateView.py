from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import Listing
from ..serializers import ListingCreateSerializer
class ListingCreateView(generics.CreateAPIView):
    queryset = Listing.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ListingCreateSerializer
