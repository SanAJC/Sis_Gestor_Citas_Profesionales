from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from Authentication.models import User

class ProfessionalProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='photos/', blank=True, null=True)
    especialidad = models.CharField(max_length=100)
    horario_atencion = models.JSONField()  # Ejemplo: {"lunes": ["09:00-12:00", "14:00-18:00"], ...}
    def __str__(self):
        return f"{self.user} - {self.especialidad}"


class Reservation(models.Model):
    ESTADOS = [
        ('P', 'Pendiente'),
        ('A', 'Aceptada'),
        ('R', 'Rechazada'),
        ('C', 'Cancelada'),
    ]
    estado = models.CharField(max_length=1, choices=ESTADOS, default='P')
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='citas_clientes')
    profesional = models.ForeignKey(ProfessionalProfile, on_delete=models.CASCADE, related_name='citas_profesionales',null=True,blank=True)
    fecha = models.DateTimeField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    google_calendar_event_id = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"Cita de {self.cliente} con {self.profesional} el {self.fecha} de {self.hora_inicio} a {self.hora_fin}"
    

# appointments/models.py
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notificaciones')
    mensaje = models.TextField()
    leido = models.BooleanField(default=False)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Notificación para {self.user}: {self.mensaje[:50]}"
