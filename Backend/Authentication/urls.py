from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, GoogleLogin

router = DefaultRouter()
router.register(r'authentication', AuthViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('google/login/', GoogleLogin.as_view(), name='google-login'),
]
