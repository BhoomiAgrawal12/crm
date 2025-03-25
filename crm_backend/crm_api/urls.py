from django.urls import path
from .views import (
    # register_user,
    login_user,
    logout_user,
    user_create_list,
    user_detail,
    send_email,
    # customer_list,
    # customer_detail,
    # contact_list,
    # contact_detail,
    # task_list,
    # task_detail,
    # analytics
)

urlpatterns = [
    #path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('users/', user_create_list, name='users-list'),
    path('users/<str:username>/', user_detail, name='user-detail'),
    # path('customers/', customer_list, name='customer-list'),
    # path('customers/<str:pk>/', customer_detail, name='customer-detail'),
    # path('contacts/', contact_list, name='contact-list'),
    # path('contacts/<str:pk>/', contact_detail, name='contact-detail'),
    # path('tasks/', task_list, name='task-list'),
    # path('tasks/<str:pk>/', task_detail, name='task-detail'),
    # path('analytics/', analytics, name='analytics'),
    path("send_email/", send_email, name='send-email'),
    path("read_email/", read_email, name='read-email'),
    
]