from rest_framework import generics

from ..models import ShelterProfile
from ..serializers import ShelterProfileSerializer


class ShelterListView(generics.ListAPIView):
    queryset = ShelterProfile.objects.all()
    serializer_class = ShelterProfileSerializer
