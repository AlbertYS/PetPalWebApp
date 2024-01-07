from django.http import JsonResponse
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate


class LoginView(APIView):
    permission_classes = (AllowAny,)
    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = authenticate(username=username, password=password)

        if not user:
            raise NotFound(detail="Incorrect Credentials")

        refresh = RefreshToken.for_user(user)

        return JsonResponse(
            {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'usertype': user.user_type
            }
        )
