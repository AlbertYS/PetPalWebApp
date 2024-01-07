from django.urls import path

from .views import ApplicationCreateView, ApplicationUpdateView, ApplicationListView, ApplicationGetView

app_name = 'applications'

urlpatterns = [
    path('creation/<int:listing_id>/', ApplicationCreateView.as_view()),
    path('updater/<int:pk>/', ApplicationUpdateView.as_view()),
    path('list/', ApplicationListView.as_view()),
    path('application/<int:pk>/', ApplicationGetView.as_view(), name='applicationget'),
]