from django.urls import path

from .views import ListingCreateView, ListingUpdateView, ListingDeleteView, ListingsView, ListingGetView

app_name = 'listings'

urlpatterns = [
    path('creation/', ListingCreateView.as_view()),
    path('update/<int:pk>/', ListingUpdateView.as_view()),
    path('deletion/<int:pk>/', ListingDeleteView.as_view()),
    path('list/', ListingsView.as_view()),
    path('listing/<int:pk>/', ListingGetView.as_view()),
]