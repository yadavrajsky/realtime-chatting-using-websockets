# serializers.py
from django.db import models 
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import Captcha
User = get_user_model() 

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model =User
        fields = ['id','email', 'name','password']
    def validate(self, args):
        email = args.get('email', None)
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': ('Email already exists')})
        return super().validate(args)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user  


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'password']  

class CustomTokenObtainPairSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=True)

    def validate(self, attrs):
        username_or_email = attrs.get('username_or_email')
        password = attrs.get('password')

        # Try to authenticate with username or email
        user = User.objects.filter(
            models.Q(username=username_or_email) | models.Q(email=username_or_email)
        ).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return data

        raise serializers.ValidationError('Invalid credentials')

class CaptchaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Captcha
        fields = "__all__"

    # def create(self, validated_data):
    #     captcha = Captcha.objects.create(
    #         captcha_answer=validated_data['captcha_answer'],
    #     )
    #     return captcha

