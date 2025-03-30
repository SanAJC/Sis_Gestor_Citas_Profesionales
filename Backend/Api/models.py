from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.core.exceptions import ValidationError
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Crea y guarda un usuario con el email y la contraseña proporcionados.
        """
        if not email:
            raise ValueError("El email es obligatorio.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            # Esto se encarga de hashear la contraseña
            user.set_password(password)
        else:
            raise ValueError("La contraseña es obligatoria.")
        user.is_active = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Crea y guarda un superusuario con el email y la contraseña proporcionados.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, verbose_name="Correo Electrónico")
    name = models.CharField(max_length=100, verbose_name="Nombre")
    last_name = models.CharField(max_length=100, verbose_name="Apellido")
    phone = models.CharField(max_length=15, verbose_name="Teléfono")

    date_joined = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")
    last_login = models.DateTimeField(auto_now=True, verbose_name="Último Login")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    is_staff = models.BooleanField(default=False, verbose_name="Personal del Sitio")

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  

    def __str__(self):
        return self.email


class ProfessionalProfile(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='profile')
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
    cliente = models.ForeignKey('User', on_delete=models.CASCADE, related_name='citas_clientes')
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
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='notificaciones')
    mensaje = models.TextField()
    leido = models.BooleanField(default=False)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Notificación para {self.user}: {self.mensaje[:50]}"
