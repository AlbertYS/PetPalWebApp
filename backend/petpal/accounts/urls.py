from django.urls import path

from .views import UserRegisterView, ShelterRegisterView, LoginView, UserUpdateView, ShelterUpdateView, \
    ShelterProfileView, UserProfileView, ShelterListView, DeleteView, ShelterGetView

app_name = 'accounts'

urlpatterns = [
    path('user/registration/', UserRegisterView.as_view()),
    path('shelter/registration/', ShelterRegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('user/update/', UserUpdateView.as_view()),
    path('shelter/update/', ShelterUpdateView.as_view()),
    path('user/profile/', UserProfileView.as_view()),
    path('shelter/profile/', ShelterProfileView.as_view()),
    path('shelter/list/', ShelterListView.as_view()),
    path('deletion/', DeleteView.as_view()),
    path('shelter/shelter/<int:pk>/', ShelterGetView.as_view(), name='shelterget'),
]