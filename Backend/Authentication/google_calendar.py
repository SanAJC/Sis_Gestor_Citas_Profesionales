from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from django.conf import settings
from allauth.socialaccount.models import SocialToken, SocialAccount
import datetime
from django.utils import timezone

class GoogleCalendarService:
    """
    Servicio para interactuar con la API de Google Calendar
    """
    
    @staticmethod
    def get_credentials(user):
        """
        Obtiene las credenciales de Google para un usuario específico
        """
        try:
            social_account = SocialAccount.objects.get(user=user, provider='google')
            social_token = SocialToken.objects.get(account=social_account)
            
            credentials = Credentials(
                token=social_token.token,
                refresh_token=social_token.token_secret,
                token_uri='https://oauth2.googleapis.com/token',
                client_id=settings.GOOGLE_OAUTH_CLIENT_ID,
                client_secret=settings.GOOGLE_OAUTH_CLIENT_SECRET,
                scopes=['https://www.googleapis.com/auth/calendar']
            )
            
            return credentials
        except (SocialAccount.DoesNotExist, SocialToken.DoesNotExist):
            return None
    
    @staticmethod
    def create_calendar_event(user, reservation):
        """
        Crea un evento en Google Calendar para una reservación
        """
        credentials = GoogleCalendarService.get_credentials(user)
        if not credentials:
            return None
        
        service = build('calendar', 'v3', credentials=credentials)
        
        # Formatear fecha y hora para Google Calendar
        start_datetime = datetime.datetime.combine(reservation.fecha, reservation.hora_inicio)
        end_datetime = datetime.datetime.combine(reservation.fecha, reservation.hora_fin)
        
        # Crear evento
        event = {
            'summary': f'Cita con {reservation.cliente.username}',
            'description': f'Reservación ID: {reservation.id}',
            'start': {
                'dateTime': start_datetime.isoformat(),
                'timeZone': settings.TIME_ZONE,
            },
            'end': {
                'dateTime': end_datetime.isoformat(),
                'timeZone': settings.TIME_ZONE,
            },
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 30},
                ],
            },
        }
        
        try:
            event = service.events().insert(calendarId='primary', body=event).execute()
            return event.get('id')
        except Exception as e:
            print(f"Error al crear evento en Google Calendar: {e}")
            return None
    
    @staticmethod
    def update_calendar_event(user, reservation, event_id):
        """
        Actualiza un evento existente en Google Calendar
        """
        credentials = GoogleCalendarService.get_credentials(user)
        if not credentials:
            return False
        
        service = build('calendar', 'v3', credentials=credentials)
        
        # Formatear fecha y hora para Google Calendar
        start_datetime = datetime.datetime.combine(reservation.fecha, reservation.hora_inicio)
        end_datetime = datetime.datetime.combine(reservation.fecha, reservation.hora_fin)
        
        # Obtener evento existente
        try:
            event = service.events().get(calendarId='primary', eventId=event_id).execute()
            
            # Actualizar evento
            event['summary'] = f'Cita con {reservation.cliente.username}'
            event['description'] = f'Reservación ID: {reservation.id}'
            event['start'] = {
                'dateTime': start_datetime.isoformat(),
                'timeZone': settings.TIME_ZONE,
            }
            event['end'] = {
                'dateTime': end_datetime.isoformat(),
                'timeZone': settings.TIME_ZONE,
            }
            
            updated_event = service.events().update(calendarId='primary', eventId=event_id, body=event).execute()
            return True
        except Exception as e:
            print(f"Error al actualizar evento en Google Calendar: {e}")
            return False
    
    @staticmethod
    def delete_calendar_event(user, event_id):
        """
        Elimina un evento de Google Calendar
        """
        credentials = GoogleCalendarService.get_credentials(user)
        if not credentials:
            return False
        
        service = build('calendar', 'v3', credentials=credentials)
        
        try:
            service.events().delete(calendarId='primary', eventId=event_id).execute()
            return True
        except Exception as e:
            print(f"Error al eliminar evento en Google Calendar: {e}")
            return False
