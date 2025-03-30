# appointments/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, ProfessionalProfileViewSet, ReservationViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r'citas', ReservationViewSet)
router.register(r'profesionales', ProfessionalProfileViewSet)
router.register(r'usuarios', AuthViewSet)
router.register(r'notificaciones', NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
