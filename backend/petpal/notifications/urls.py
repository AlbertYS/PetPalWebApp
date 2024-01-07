from django.urls import path

from .views import NotificationListView, NotificationGetView, NotificationDeleteView, NotificationUpdateView

app_name = 'notifications'

urlpatterns = [
    path('notifications/', NotificationListView.as_view()),
    path('notification/<int:pk>/', NotificationGetView.as_view()),
    path('deletion/<int:pk>/', NotificationDeleteView.as_view()),
    path('update/<int:pk>/', NotificationUpdateView.as_view()),
]
