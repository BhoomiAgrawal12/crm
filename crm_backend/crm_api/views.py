from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import User, Customer, Contact, Task


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        data = request.data
        print(f"Request data: {data}")  # Debug print
        if User.objects(username=data['username']).first():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error in register_user: {str(e)}")  # Debug print
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    return Response({'message': 'Logged out successfully. Discard your token on the client.'})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def customer_list(request):
    if request.method == 'GET':
        customers = Customer.objects.all()
        customers_list = [{'id': str(c.id), 'name': c.name, 'email': c.email, 'phone': c.phone, 'address': c.address, 'created_at': c.created_at} for c in customers]
        return Response(customers_list)
    elif request.method == 'POST':
        try:
            data = request.data
            customer = Customer(
                name=data['name'],
                email=data['email'],
                phone=data.get('phone', ''),
                address=data.get('address', ''),
                created_by=str(request.user.id)
            )
            customer.save()
            return Response({'id': str(customer.id), 'name': customer.name, 'email': customer.email, 'phone': customer.phone, 'address': customer.address, 'created_at': customer.created_at}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def customer_detail(request, pk):
    try:
        customer = Customer.objects.get(id=pk)
    except Customer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response({'id': str(customer.id), 'name': customer.name, 'email': customer.email, 'phone': customer.phone, 'address': customer.address, 'created_at': customer.created_at})
    elif request.method == 'PUT':
        try:
            data = request.data
            customer.name = data.get('name', customer.name)
            customer.email = data.get('email', customer.email)
            customer.phone = data.get('phone', customer.phone)
            customer.address = data.get('address', customer.address)
            customer.save()
            return Response({'id': str(customer.id), 'name': customer.name, 'email': customer.email, 'phone': customer.phone, 'address': customer.address, 'created_at': customer.created_at})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def contact_list(request):
    if request.method == 'GET':
        contacts = Contact.objects.all()
        contacts_list = [{'id': str(c.id), 'customer_id': c.customer_id, 'message': c.message, 'contact_date': c.contact_date, 'created_by': c.created_by} for c in contacts]
        return Response(contacts_list)
    elif request.method == 'POST':
        try:
            data = request.data
            contact = Contact(
                customer_id=data['customer_id'],
                message=data['message'],
                created_by=str(request.user.id)
            )
            contact.save()
            return Response({'id': str(contact.id), 'customer_id': contact.customer_id, 'message': contact.message, 'contact_date': contact.contact_date, 'created_by': contact.created_by}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        tasks_list = [{'id': str(t.id), 'title': t.title, 'description': t.description, 'assigned_to': t.assigned_to, 'status': t.status, 'due_date': t.due_date, 'created_at': t.created_at, 'created_by': t.created_by} for t in tasks]
        return Response(tasks_list)
    elif request.method == 'POST':
        try:
            data = request.data
            task = Task(
                title=data['title'],
                description=data.get('description', ''),
                assigned_to=data.get('assigned_to', ''),
                status=data.get('status', 'pending'),
                due_date=data['due_date'],
                created_by=str(request.user.id)
            )
            task.save()
            return Response({'id': str(task.id), 'title': task.title, 'description': task.description, 'assigned_to': task.assigned_to, 'status': task.status, 'due_date': task.due_date, 'created_at': task.created_at, 'created_by': task.created_by}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics(request):
    """Fetch basic analytics for the CRM."""
    try:
        customer_count = Customer.objects.count()
        contact_count = Contact.objects.count()
        task_counts = {
            "total": Task.objects.count(),
            "pending": Task.objects(status="pending").count(),
            "in_progress": Task.objects(status="in_progress").count(),
            "completed": Task.objects(status="completed").count()
        }
        analytics_data = {
            "customers": customer_count,
            "contacts": contact_count,
            "tasks": task_counts
        }
        return Response(analytics_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

#---------------------------------------------------------------------------------------------------------------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def contact_list(request):
    if request.method == 'GET':
        contacts = Contact.objects.all()
        contacts_list = [{'id': str(c.id), 'customer_id': c.customer_id, 'message': c.message, 'contact_date': c.contact_date, 'created_by': c.created_by} for c in contacts]
        return Response(contacts_list)
    elif request.method == 'POST':
        try:
            data = request.data
            contact = Contact(
                customer_id=data['customer_id'],
                message=data['message'],
                created_by=str(request.user.id)
            )
            contact.save()
            return Response({'id': str(contact.id), 'customer_id': contact.customer_id, 'message': contact.message, 'contact_date': contact.contact_date, 'created_by': contact.created_by}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def contact_detail(request, pk):
    try:
        contact = Contact.objects.get(id=pk)
    except Contact.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        return Response({
            'id': str(contact.id),
            'customer_id': contact.customer_id,
            'message': contact.message,
            'contact_date': contact.contact_date,
            'created_by': contact.created_by
        })
    elif request.method == 'PUT':
        try:
            data = request.data
            contact.customer_id = data.get('customer_id', contact.customer_id)
            contact.message = data.get('message', contact.message)
            contact.save()
            return Response({
                'id': str(contact.id),
                'customer_id': contact.customer_id,
                'message': contact.message,
                'contact_date': contact.contact_date,
                'created_by': contact.created_by
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        contact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        tasks_list = [{'id': str(t.id), 'title': t.title, 'description': t.description, 'assigned_to': t.assigned_to, 'status': t.status, 'due_date': t.due_date, 'created_at': t.created_at, 'created_by': t.created_by} for t in tasks]
        return Response(tasks_list)
    elif request.method == 'POST':
        try:
            data = request.data
            task = Task(
                title=data['title'],
                description=data.get('description', ''),
                assigned_to=data.get('assigned_to', ''),
                status=data.get('status', 'pending'),
                due_date=data['due_date'],
                created_by=str(request.user.id)
            )
            task.save()
            return Response({'id': str(task.id), 'title': task.title, 'description': task.description, 'assigned_to': task.assigned_to, 'status': task.status, 'due_date': task.due_date, 'created_at': task.created_at, 'created_by': task.created_by}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    try:
        task = Task.objects.get(id=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        return Response({
            'id': str(task.id),
            'title': task.title,
            'description': task.description,
            'assigned_to': task.assigned_to,
            'status': task.status,
            'due_date': task.due_date,
            'created_at': task.created_at,
            'created_by': task.created_by
        })
    elif request.method == 'PUT':
        try:
            data = request.data
            task.title = data.get('title', task.title)
            task.description = data.get('description', task.description)
            task.assigned_to = data.get('assigned_to', task.assigned_to)
            task.status = data.get('status', task.status)
            task.due_date = data.get('due_date', task.due_date)
            task.save()
            return Response({
                'id': str(task.id),
                'title': task.title,
                'description': task.description,
                'assigned_to': task.assigned_to,
                'status': task.status,
                'due_date': task.due_date,
                'created_at': task.created_at,
                'created_by': task.created_by
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)