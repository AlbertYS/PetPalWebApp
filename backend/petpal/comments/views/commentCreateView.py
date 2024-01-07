from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import Comment
from ..serializers import CommentCreateSerializer

class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CommentCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['type'] = self.kwargs.get('type')
        context['obj_id'] = self.kwargs.get('obj_id')
        return context