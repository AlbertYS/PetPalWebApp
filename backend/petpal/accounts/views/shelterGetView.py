from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import ShelterProfile
from ..serializers import ShelterProfileSerializer

class ShelterGetView(generics.RetrieveAPIView):
    serializer_class = ShelterProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(ShelterProfile, id=self.kwargs['pk'])