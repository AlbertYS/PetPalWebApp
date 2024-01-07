from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Blog
from ..serializers import BlogGetSerializer

class BlogDeleteView(generics.DestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogGetSerializer
    permission_classes = [IsAuthenticated]
    
    def destroy(self, request, *args, **kwargs):

        blog = self.get_object()
        if blog.shelter_profile.user != request.user:
            return self.permission_denied(request)
        self.perform_destroy(blog)
        return Response(status=status.HTTP_204_NO_CONTENT)