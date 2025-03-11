from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password, make_password
# from .models import User, Customer, Contact, Task
from .models import User
from .permissions import IsAdminUserCustom
from .serializers import UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects(username=username).first()
        if not user or not check_password(password, user.password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'is_admin': user.is_admin
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    return Response({'message': 'Logged out successfully. Discard your token on the client.'})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated, IsAdminUserCustom])
def user_create_list(request):
    if request.method == "GET":
        users = User.objects()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "POST":
        data = request.data
        if User.objects(username=data["username"]).first():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User(username=data["username"], email=data["email"], password=make_password(data["password"]))
        user.save()
        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)



# crm_backend/crm_api/views.py
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated, IsAdminUserCustom])
def user_detail(request, username):
    user = User.objects(username=username).first()
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        data = request.data
        # Update fields if provided, keep existing if not
        user.username = data.get("username", user.username)
        user.email = data.get("email", user.email)
        if data.get("password"):  # Only update password if provided
            user.password = make_password(data["password"])
        user.is_admin = data.get("is_admin", user.is_admin)
        user.is_active = data.get("is_active", user.is_active)
        user.save()  # Save updates
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "DELETE":
        user.delete()
        return Response({"message": "User deleted"}, status=status.HTTP_200_OK)