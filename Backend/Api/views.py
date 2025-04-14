from rest_framework import viewsets, status
from rest_framework.decorators import action ,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ProfessionalProfile, Reservation, Notification
from .serializers import ProfessionalProfileSerializer, ReservationSerializer, NotificationSerializer
from Authentication.google_calendar import GoogleCalendarService
from allauth.socialaccount.models import SocialAccount


@permission_classes([IsAuthenticated])
class ProfessionalProfileViewSet(viewsets.ModelViewSet):
    queryset = ProfessionalProfile.objects.all()
    serializer_class = ProfessionalProfileSerializer

@permission_classes([IsAuthenticated])
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    
    def perform_create(self, serializer):
        reservation = serializer.save()
        self._sync_with_google_calendar(reservation)
        self._create_notification(reservation, "creada")

        user = reservation.cliente
        has_google_account = SocialAccount.objects.filter(
            user=user, 
            provider='google'
        ).exists()

        if not has_google_account:
            Notification.objects.create(
                user=user,
                mensaje="¿Quieres recibir recordatorios en Google Calendar? Vincula tu cuenta de Google para sincronizar tus citas automáticamente.",
                leido=False,
            )
    
    def perform_update(self, serializer):
        reservation = serializer.save()
        self._sync_with_google_calendar(reservation)
        self._create_notification(reservation, "actualizada")
    
    def perform_destroy(self, instance):
        if instance.google_calendar_event_id:
            if hasattr(instance.cliente, 'socialaccount_set'):
                social_account = SocialAccount.objects.filter(user=instance.cliente, provider='google').first()
                if social_account:
                    GoogleCalendarService.delete_calendar_event(instance.cliente, instance.google_calendar_event_id)
        
        self._create_notification(instance, "cancelada")
        super().perform_destroy(instance)
    
    def _sync_with_google_calendar(self, reservation):
        if hasattr(reservation.cliente, 'socialaccount_set'):
            social_account = SocialAccount.objects.filter(user=reservation.cliente, provider='google').first()
            if social_account:
                if reservation.google_calendar_event_id:
                    GoogleCalendarService.update_calendar_event(
                        reservation.cliente, 
                        reservation, 
                        reservation.google_calendar_event_id
                    )
                else:
                    event_id = GoogleCalendarService.create_calendar_event(
                        reservation.cliente, 
                        reservation
                    )
                    if event_id:
                        reservation.google_calendar_event_id = event_id
                        reservation.save(update_fields=['google_calendar_event_id'])
    
    def _create_notification(self, reservation, action_type):
        mensaje = f"Tu cita ha sido {action_type}. Fecha: {reservation.fecha.strftime('%d/%m/%Y')}, " \
                 f"Hora: {reservation.hora_inicio.strftime('%H:%M')} - {reservation.hora_fin.strftime('%H:%M')}"
        
        Notification.objects.create(
            user=reservation.cliente,
            mensaje=mensaje
        )
    
    @action(detail=False, methods=['get'], url_path='my-reservations')
    def my_reservations(self, request):
        user = request.user
        reservations = Reservation.objects.filter(cliente=user)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)

@permission_classes([IsAuthenticated])
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user).order_by('-fecha_envio')
