from rest_framework import viewsets , status
from .models import User
from .serializers import UserSerializer
from .serializers import LoginSerializer , RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken , AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from rest_framework.response import Response
from rest_framework.decorators import action ,permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from allauth.socialaccount.models import SocialAccount , SocialToken
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
import urllib.parse
import json

class AuthViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny] , url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            access = AccessToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(access),
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated] , url_path='logout')
    def logout(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except (InvalidToken, TokenError):
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='register', permission_classes=[AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='refresh_token',permission_classes=[AllowAny])
    def refresh_token(self,request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response(
                {"error":"Refresh-Token is required"}
            )
        try:
            token = RefreshToken(refresh_token)
            new_access_token = token.access_token
            return Response(
                {
                    "access_token": str(new_access_token)
                },
                status=status.HTTP_200_OK
            )
        except TokenError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )



@login_required
def google_login_callback(request):
    user = request.user

    social_accounts = SocialAccount.objects.filter(user=user)
    print("Social Account for user:", social_accounts)

    social_account = social_accounts.first()

    if not social_account:
        print("No social account for user:", user)
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')
    
    token = SocialToken.objects.filter(account=social_account, account__provider='google').first()

    if token:
        print('Google token found:', token.token)
        refresh = RefreshToken.for_user(user)
        user_data = {
            'id': user.id,
            'email': user.email,
            'username': getattr(user, 'username', '') or user.email.split('@')[0],
        }
        tokens = {
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }
        payload = {
            'user': user_data,
            'tokens': tokens
        }
        encoded_data = urllib.parse.quote(json.dumps(payload))

        return redirect(f'http://localhost:5173/login/callback/?data={encoded_data}')
    else:
        print('No Google token found for user', user)
        return redirect(f'http://localhost:5173/login/callback/?error=NoGoogleToken')