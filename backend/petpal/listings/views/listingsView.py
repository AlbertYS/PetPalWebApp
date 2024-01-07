from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import FilterSet, CharFilter, NumberFilter

from ..models import Listing
from ..serializers import ListingSerializer

class SuperSmallPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    max_page_size = 10

class SearchFilters(FilterSet):
    shelter_profile__name = CharFilter(lookup_expr='icontains')
    breed = CharFilter(lookup_expr='icontains')
    age = NumberFilter(lookup_expr='icontains')
    class Meta:
        model = Listing
        fields = ["shelter_profile__name", "status", "breed", "age"]

class ListingsView(generics.ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SuperSmallPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = SearchFilters
    ordering_fields = ['name', 'age']