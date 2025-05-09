from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet

router = DefaultRouter()
router.register(r'authentication', AuthViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
