from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from ..models import Notification
from ..serializers import NotificationListSerializer

class SuperSmallPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    max_page_size = 10

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SuperSmallPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['creation_time']
    filterset_fields = ['status']

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)