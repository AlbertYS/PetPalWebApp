from rest_framework import generics
from rest_framework.response import Response

from ..serializers import UserSerializer, ShelterProfileSerializer


class ShelterProfileView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        data = {
            "user": UserSerializer(request.user).data,
            "profile": ShelterProfileSerializer(request.user.shelterProfile, context={"request": request}).data,
        }
        return Response(data=data)
