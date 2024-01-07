from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import Blog
from ..serializers import BlogCreateSerializer

class BlogCreateView(generics.CreateAPIView):
    queryset = Blog.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = BlogCreateSerializer