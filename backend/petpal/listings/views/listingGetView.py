from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import Listing
from ..serializers import ListingSerializer

class ListingGetView(generics.RetrieveAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Listing, id=self.kwargs['pk'])
