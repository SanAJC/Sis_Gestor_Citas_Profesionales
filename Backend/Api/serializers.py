from rest_framework import serializers
from .models import User, ProfessionalProfile, Reservation, Notification
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class LoginSerializer(serializers.Serializer):  
    email = serializers.CharField()  
    password = serializers.CharField()

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        print(f"Intentando autenticar con email: {email} y password: {password}")
        
        # Autenticar usando el email y password
        user = authenticate(username=email, password=password)
        
        if user is None:
            raise serializers.ValidationError("Error de autenticación")
        else:
            print(f"Autenticacion con exito {email}")

        if not user.is_active:
            raise serializers.ValidationError("Este usuario está inactivo")

        
        return user

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            last_name=validated_data['last_name'],
            phone=validated_data['phone']
        )
        return user

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
