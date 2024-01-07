from django.urls import path

from .views import CommentCreateView, CommentListView

app_name = 'comments'

urlpatterns = [
    path('creation/<str:type>/<int:obj_id>/', CommentCreateView.as_view()),
    path('list/<str:type>/<int:obj_id>/', CommentListView.as_view(), name='commentlist'),
]