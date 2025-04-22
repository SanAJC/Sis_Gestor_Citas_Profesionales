from rest_framework import serializers
from .models import ProfessionalProfile, Reservation, Notification
from Authentication.serializers import UserSerializer
from Authentication.models import User

class ProfessionalProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    image = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        return obj.image.url if obj.image else None
    
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
