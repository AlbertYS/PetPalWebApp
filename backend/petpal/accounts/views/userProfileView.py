from rest_framework import generics
from rest_framework.response import Response

from ..serializers import UserSerializer, UserProfileSerializer


class UserProfileView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        data = {
            "user": UserSerializer(request.user).data,
            "profile": UserProfileSerializer(request.user.userProfile, context={"request": request}).data,
        }
        return Response(data=data)
