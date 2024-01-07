from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import Application
from ..serializers import ApplicationCreateSerializer

class ApplicationCreateView(generics.CreateAPIView):
    queryset = Application.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['listing_id'] = self.kwargs.get('listing_id')
        return context