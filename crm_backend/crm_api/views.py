from django.shortcuts import get_object_or_404
import requests
import base64
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password, make_password
from .models import User, Account, Contact, Opportunity, Lead, ActivityLog, Task, Quote, Note
from .permissions import IsAdmin
from .serializers import UserSerializer, UserRegisterSerializer, AccountSerializer, ContactSerializer, OpportunitySerializer, LeadSerializer, ActivityLogSerializer, TaskSerializer, QuoteSerializer, NoteSerializer

# Google Mail
# from email.message import EmailMessage
# import google.auth
# from googleapiclient.discovery import build
# from googleapiclient.errors import HttpError
# from google_auth_oauthlib.flow import InstalledAppFlow


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
    filtered_data = [
        {
            "username": user["username"],
            "email": user["email"],
            "full_name": user["full_name"],
            "user_type": user["user_type"],
            "is_active": user["is_active"],
        }
        for user in serializer.data
    ]
    return Response(filtered_data, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def user_create_list(request):
    # if request.method == "GET":
    #     users = User.objects.all()
    #     serializer = UserSerializer(users, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    if request.method == "POST":
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
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        user.delete()
        return Response({"message": "User deleted"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request, username):
    # Check if the username matches the authenticated user's username
    if request.user.username != username and not request.user.is_superuser:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    # Return the current user's details
    return Response({
        "is_staff": request.user.is_staff,
        "is_active": request.user.is_active,
        "is_admin": request.user.is_superuser,
        "is_self": request.user.username == username,
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_choices(request):
    choices = {
        "user_type": User.user_type_choices
    }
    return Response(choices)


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


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def account_list_create(request):
    if request.method == "GET":
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        serializer = AccountSerializer(data=request.data, context={'request': request})
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
        serializer = AccountSerializer(account, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # Delete the account
        account.delete()
        return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def account_choices(request):
    choices = {
        "account_type": Account.account_type_choices,
        "industry_type": Account.industry_type_choices,
    }
    return Response(choices)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def contact_list_create(request):
    if request.method == "GET":
        contacts = Contact.objects.all()
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        serializer = ContactSerializer(data=request.data, context={'request': request})
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


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def opportunity_list_create(request):
    if request.method == "GET":
        opportunities = Opportunity.objects.all()
        serializer = OpportunitySerializer(opportunities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        serializer = OpportunitySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def opportunity_detail(request, opportunity_id):
    try:
        opportunity = Opportunity.objects.get(id=opportunity_id)
    except Opportunity.DoesNotExist:
        return Response({"error": "Opportunity not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        # Retrieve contact details
        serializer = OpportunitySerializer(opportunity)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        # Update contact details
        serializer = OpportunitySerializer(opportunity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # Delete the contact
        opportunity.delete()
        return Response({"message": "Opportunity deleted successfully"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def opportunity_choices(request):
    choices = {
        "sales_stage": Opportunity.sale_stage_choices,
        "business_type": Opportunity.business_type_choices,
        "lead_source": Opportunity.lead_source_choices,
        "currency": Opportunity.currency_choices,
    }
    return Response(choices)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def lead_list_create(request):
    if request.method == "GET":
        leads = Lead.objects.all()
        serializer = LeadSerializer(leads, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        serializer = LeadSerializer(data=request.data,  context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lead_choices(request):
    choices = {
        "title": Lead.title_choices,
        "status": Lead.status_choices,
        "lead_source": Lead.lead_source_choices,
    }
    return Response(choices)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def lead_detail(request, lead_id):
    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return Response({"error": "Lead not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        # Retrieve contact details
        serializer = LeadSerializer(lead)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        # Update contact details
        serializer = LeadSerializer(lead, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # Delete the contact
        lead.delete()
        return Response({"message": "Lead deleted successfully"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_activity_logs(request):
    limit = int(request.query_params.get("limit", 10))  # Default limit is 10
    activities = ActivityLog.objects.filter(user=request.user).order_by("-timestamp")[:limit]
    serializer = ActivityLogSerializer(activities, many=True)
    return Response(serializer.data, status=200)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def task_list_create(request):
    if request.method == "GET":
        # Retrieve all tasks
        tasks = Task.objects.all().order_by('created_at')
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        # Create a new task
        serializer = TaskSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def task_detail(request, task_id):
    try:
        # Retrieve the task by ID
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        # Retrieve task details
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        # Update task details
        serializer = TaskSerializer(task, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # Delete the task
        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_200_OK)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_metrics(request):
    # Count customers (accounts with account_type='Customer')
    customer_count = Account.objects.filter(account_type='Customer').count()
    
    # Count all opportunities (deals)
    deal_count = Opportunity.objects.all().count()
    
    # Get recent leads (only for admins)
    recent_leads_data = []
    if request.user.is_superuser:
        recent_leads = Lead.objects.all().order_by('-created_at')[:6]
        
        for lead in recent_leads:
            lead_data = {
                'id': lead.id,
                'first_name': lead.first_name,
                'last_name': lead.last_name,
                'status': lead.status,
                'email': lead.email_address,
                'phone': lead.mobile,
                'created_at': lead.created_at,
                'lead_source': lead.lead_source,
            }
            recent_leads_data.append(lead_data)
    
    # Get task statistics grouped by status
    from django.db.models import Count
    task_stats = Task.objects.values('status').annotate(count=Count('status'))
    
    # Get recent tasks with details for the task section
    tasks_by_status = {}
    for status_choice, _ in Task.status_choices:
        tasks_data = []
        tasks = Task.objects.filter(status=status_choice).order_by('-modified_at')[:3]
        
        for task in tasks:
            task_data = {
                'id': task.id,
                'subject': task.subject,
                'date': task.modified_at,
                'due_date': task.due_date,
                'priority': task.priority,
                'assigned_to': task.assigned_to.username if task.assigned_to else None,
            }
            tasks_data.append(task_data)
        
        tasks_by_status[status_choice] = tasks_data
    
    return Response({
        'customer_count': customer_count,
        'deal_count': deal_count,
        'recent_leads': recent_leads_data,
        'task_stats': task_stats,
        'tasks_by_status': tasks_by_status,
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_task_update(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    update_text = request.data.get("text", "").strip()
    if not update_text:
        return Response({"error": "Update text cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
    
    task.add_update(update_text)
    serializer = TaskSerializer(task, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def note_list_create(request):
    if request.method == "GET":
        # Get optional filter parameters
        related_to_type = request.query_params.get('related_to_type')
        related_to_id = request.query_params.get('related_to_id')
        
        # Apply filters if provided
        if related_to_type and related_to_id:
            notes = Note.objects.filter(related_to_type=related_to_type, related_to_id=related_to_id)
        else:
            notes = Note.objects.all()
            
        # Order by most recent
        notes = notes.order_by('-created_at')
        
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        # Create a new note
        serializer = NoteSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def note_detail(request, note_id):
    try:
        # Retrieve the note by ID
        note = Note.objects.get(id=note_id)
    except Note.DoesNotExist:
        return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        # Retrieve note details
        serializer = NoteSerializer(note)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        # Update note details
        serializer = NoteSerializer(note, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # Delete the note
        note.delete()
        return Response({"message": "Note deleted successfully"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def note_choices(request):
    choices = {
        "related_to_type": Note.related_to_type_choices,
    }
    return Response(choices)
