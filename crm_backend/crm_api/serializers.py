from .models import User
from rest_framework import serializers

class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    is_admin = serializers.BooleanField(default=False)
    
