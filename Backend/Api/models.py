from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from Authentication.models import User

class ProfessionalProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    especialidad = models.CharField(max_length=100)
    horario_atencion = models.JSONField()  # Ejemplo: {"lunes": ["09:00-12:00", "14:00-18:00"], ...}

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.especialidad}"


class Reservation(models.Model):
    ESTADOS = [
        ('P', 'Pendiente'),
        ('A', 'Aceptada'),
        ('R', 'Rechazada'),
        ('C', 'Cancelada'),
    ]
    estado = models.CharField(max_length=1, choices=ESTADOS, default='P')
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='citas_clientes')
    fecha = models.DateTimeField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Evitar citas en el pasado
        fecha_hora = timezone.datetime.combine(self.fecha, self.hora_inicio)
        if fecha_hora < timezone.now():
            raise ValidationError("No se pueden agendar citas en el pasado.")
        
        # Validar disponibilidad: evitar solapamientos
        citas_conflictivas = Reservation.objects.filter(
            cliente=self.cliente,
            fecha=self.fecha,
            hora_inicio__lt=self.hora_fin,
            hora_fin__gt=self.hora_inicio
        )
        if self.pk:
            citas_conflictivas = citas_conflictivas.exclude(pk=self.pk)
        if citas_conflictivas.exists():
            raise ValidationError("El profesional ya tiene una cita en este horario.")
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Ejecuta validaciones antes de guardar
        super().save(*args, **kwargs)
    
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
