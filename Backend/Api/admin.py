from django.contrib import admin
from .models import User, ProfessionalProfile, Reservation, Notification

admin.site.site_header = "Panel de Administración - Argon Dashboard"
admin.site.index_title = "Dashboard"

# Registra los modelos
admin.site.register(User)
admin.site.register(ProfessionalProfile)
admin.site.register(Reservation)
admin.site.register(Notification)
