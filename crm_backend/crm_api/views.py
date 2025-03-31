import requests
import base64
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password, make_password
from .models import User, Account, Contact
from .permissions import IsAdmin
from .serializers import UserSerializer, AccountSerializer, ContactSerializer

# Google Mail
from email.message import EmailMessage
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username).first()
        if not user or not check_password(password, user.password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'is_admin': user.is_superuser,
            'is_active': user.is_active
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    return Response({'message': 'Logged out successfully. Discard your token on the client.'})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def user_create_list(request):
    if request.method == "GET":
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "POST":
        data = request.data
        if User.objects.filter(username=data["username"]).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User(username=data["username"], email=data["email"], password=make_password(data["password"]))
        user.save()
        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated, IsAdmin])
def user_detail(request, username):
    user = User.objects.filter(username=username).first()
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        data = request.data
        user.username = data.get("username", user.username)
        user.email = data.get("email", user.email)
        if data.get("password"):
            user.password = make_password(data["password"])
        user.is_staff = data.get("is_staff", user.is_staff)
        user.is_active = data.get("is_active", user.is_active)
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "DELETE":
        user.delete()
        return Response({"message": "User deleted"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "is_staff": user.is_staff,
        "is_active": user.is_active,
    })


# @api_view(["POST"])
# @permission_classes([IsAuthenticated, IsAdmin])
# def send_email(request):
#     SCOPES = ['https://mail.google.com/']
#     flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
#     creds = flow.run_local_server(port=0)

#     try:
#         service = build("gmail", "v1", credentials=creds)
#         message = EmailMessage()
#         email_content = request.data.get('email_content')
#         message.set_content(email_content)
#         message["To"] = request.data.get('to_email_id')
#         message["From"] = "immortalsoftwaregithub@gmail.com"
#         message["Subject"] = request.data.get('email_subject')

#         encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

#         send_message = {"raw": encoded_message}
#         sent_message = (
#             service.users()
#             .messages()
#             .send(userId="me", body=send_message)
#             .execute()
#         )
#         return Response({'Email Sent With ID': sent_message["id"]}, status=status.HTTP_200_OK)
#     except HttpError as error:
#         return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["GET"])
# @permission_classes([IsAuthenticated, IsAdmin])
# def read_email(request):
#     SCOPES = ['https://mail.google.com/']
#     flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
#     creds = flow.run_local_server(port=0)
#     try:
#         service = build("gmail", "v1", credentials=creds)
#         results = service.users().messages().list(userId="me", maxResults=5).execute()
#         messages = results.get("messages", [])

#         if not messages:
#             return Response({"message": "No messages found"}, status=status.HTTP_404_NOT_FOUND)

#         email_data = []
#         for message in messages:
#             msg = service.users().messages().get(userId="me", id=message["id"]).execute()
#             headers = msg.get("payload", {}).get("headers", [])
#             sender = next((header["value"] for header in headers if header["name"] == "From"), "Unknown Sender")
#             snippet = msg.get("snippet", "")
#             email_data.append({
#                 "message_id": message["id"],
#                 "sender": sender,
#                 "snippet": snippet,
#             })
#         return Response({'emails': email_data}, status=status.HTTP_200_OK)
#     except HttpError as error:
#         return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def account_list_create(request):
    if request.method == "GET":
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "POST":
        serializer = AccountSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def account_detail(request, account_id):
    try:
        account = Account.objects.get(id=account_id)
    except Account.DoesNotExist:
        return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        # Retrieve account details
        serializer = AccountSerializer(account)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        # Update account details
        serializer = AccountSerializer(account, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # Delete the account
        account.delete()
        return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)


@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def contact_list_create(request):
    if request.method == "GET":
        contacts = Contact.objects.all()
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "POST":
        serializer = ContactSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def contact_detail(request, contact_id):
    try:
        contact = Contact.objects.get(id=contact_id)
    except Contact.DoesNotExist:
        return Response({"error": "Contact not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        # Retrieve contact details
        serializer = ContactSerializer(contact)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        # Update contact details
        serializer = ContactSerializer(contact, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # Delete the contact
        contact.delete()
        return Response({"message": "Contact deleted successfully"}, status=status.HTTP_200_OK)
