from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import Blurb
from ..serializers import BlurbCreateSerializer

class BlurbCreateView(generics.CreateAPIView):
    queryset = Blurb.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = BlurbCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['blog_id'] = self.kwargs.get('blog_id')
        return context