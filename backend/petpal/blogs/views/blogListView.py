from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import FilterSet, CharFilter

from ..models import Blog
from ..serializers import BlogListSerializer

class SuperSmallPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    max_page_size = 10

class SearchFilters(FilterSet):
    shelter_profile__name = CharFilter(lookup_expr='icontains')
    title = CharFilter(lookup_expr='icontains')
    class Meta:
        model = Blog
        fields = ["shelter_profile__name", "title"]

class BlogListView(generics.ListAPIView):
    serializer_class = BlogListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SuperSmallPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['title', 'shelter_profile__name']
    filterset_class = SearchFilters

    def get_queryset(self):
        if self.request.user.user_type == 1:
            return Blog.objects.all()
        return Blog.objects.filter(shelter_profile__user=self.request.user)