from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import AllowAny

from ..models import Blog
from ..serializers import BlogGetSerializer

class BlogGetView(generics.RetrieveAPIView):
    serializer_class = BlogGetSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        blog = get_object_or_404(Blog, id=self.kwargs['pk'])
        return blog