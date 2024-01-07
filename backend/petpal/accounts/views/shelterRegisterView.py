from rest_framework import generics
from rest_framework.permissions import AllowAny

from ..models import User
from ..serializers import ShelterRegistrationSerializer


class ShelterRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = ShelterRegistrationSerializer


