from django.urls import path

from .views import BlogGetView, BlogListView, BlogCreateView, BlurbCreateView, BlogImageCreateView, BlogDeleteView

app_name = 'blogs'

urlpatterns = [
    path('blog/<int:pk>/', BlogGetView.as_view()),
    path('list/', BlogListView.as_view()),
    path('creation/', BlogCreateView.as_view()),
    path('blurb/creation/<int:blog_id>/', BlurbCreateView.as_view()),
    path('image/creation/<int:blog_id>/', BlogImageCreateView.as_view()),
    path('deletion/<int:pk>/', BlogDeleteView.as_view()),
]