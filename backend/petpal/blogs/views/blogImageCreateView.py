from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import BlogImage
from ..serializers import BlogImageCreateSerializer

class BlogImageCreateView(generics.CreateAPIView):
    queryset = BlogImage.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = BlogImageCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['blog_id'] = self.kwargs.get('blog_id')
        return context