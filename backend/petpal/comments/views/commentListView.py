from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from django.shortcuts import get_object_or_404

from ..models import Comment
from ..serializers import CommentListSerializer
from accounts.models import ShelterProfile
from applications.models import Application
class SuperSmallPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    max_page_size = 10

class CommentListView(generics.ListAPIView):
    serializer_class = CommentListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SuperSmallPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['creation_time']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['type'] = self.kwargs.get('type')
        context['obj_id'] = self.kwargs.get('obj_id')
        return context

    def get_queryset(self):
        obj_id = self.kwargs.get('obj_id')
        user = self.request.user
        if self.kwargs.get('type') == 'application':
            content_type = ContentType.objects.get_for_model(model=Application)
            # Check if the user is allowed to view this application
            application = get_object_or_404(Application, pk=obj_id)
            # User type user - check the application's user
            if user.user_type == 1 and application.user_profile.user != user:
                self.permission_denied(self.request)
            # Shelter type user
            if user.user_type == 2 and application.listing.shelter_profile.user != user:
                self.permission_denied(self.request)
        else:
            content_type = ContentType.objects.get_for_model(model=ShelterProfile)
        # Query for:
        # - Any comment who points to content_type, object_id
        # - Any comment who's head points to content_type, object_id
        queryset = Comment.objects.filter(
            Q(
                content_type=content_type,
                object_id=obj_id
            )
            |
            Q (
                head__isnull=False,
                head__content_type=content_type,
                head__object_id=obj_id
            )
        )
        return queryset