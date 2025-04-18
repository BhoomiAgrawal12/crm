from django.urls import path
from .views import (
    login_user,
    logout_user,
    user_create_list,
    user_detail,
    user_list,
    account_list_create,
    account_detail,
    account_choices,  # Import the new account choices view
    contact_detail,
    contact_list_create,
    current_user,
    opportunity_list_create,
    opportunity_detail,
    opportunity_choices,
    lead_list_create,
    lead_detail,
    lead_choices,
    user_activity_logs,
    task_list_create,
    task_detail,
    dashboard_metrics,  # Import the dashboard metrics view
)

urlpatterns = [
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('create-user/', user_create_list, name='user-create-list'),
    path('users/', user_list, name='user-list'),
    path('users/<str:username>/', user_detail, name='user-detail'),
    path('accounts/', account_list_create, name='account-list-create'),
    path('accounts/<int:account_id>/', account_detail, name='account-detail'),
    path('account/choices/', account_choices, name='account-choices'),  # New endpoint for account choices
    path('contacts/', contact_list_create, name='contact-list-create'),
    path('contacts/<int:contact_id>/', contact_detail, name='contact-detail'),
    path('current-user/', current_user, name='current-user'),
    path('opportunities/', opportunity_list_create, name='opportunity-list-create'),
    path('opportunity/<int:opportunity_id>/', opportunity_detail, name='opportunity-detail'),
    path("opportunity-choices/", opportunity_choices, name="opportunity-choices"),
    path('leads/', lead_list_create, name='lead-list-create'),
    path('lead/<int:lead_id>/', lead_detail, name='lead-detail'),
    path("lead-choices/", lead_choices, name="lead-choices"),
    path("activity-logs/", user_activity_logs, name="user-activity-logs"),  # New endpoint for user activity logs
    path("tasks/", task_list_create, name="task-list-create"),
    path("task/<int:task_id>/", task_detail, name="task-detail"),
    path("dashboard-metrics/", dashboard_metrics, name="dashboard-metrics"),  # New endpoint for dashboard metrics
]