from rest_framework import serializers
from .models import ProfessionalProfile, Reservation, Notification
from Authentication.serializers import UserSerializer
from Authentication.models import User

class ProfessionalProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = ProfessionalProfile
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    cliente = UserSerializer(read_only=True)
    class Meta:
        model = Reservation
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Notification
        fields = '__all__'
