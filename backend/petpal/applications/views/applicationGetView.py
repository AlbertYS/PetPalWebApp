from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from ..models import Application
from ..serializers import ApplicationListSerializer

class ApplicationGetView(generics.RetrieveAPIView):
    serializer_class = ApplicationListSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        application = get_object_or_404(Application, id=self.kwargs['pk'])
        if user != application.user_profile.user and user != application.listing.shelter_profile.user:
            raise PermissionDenied("You do not have permission to access this application.")
        return application
