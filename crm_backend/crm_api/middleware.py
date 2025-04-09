from .models import ActivityLog
from django.utils.timezone import now

class ActivityLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Define loggable paths and methods outside the conditional block
        loggable_paths = ["/contacts/", "/leads/", "/opportunities/", "/accounts/", "/logout/", "/login/"]
        loggable_methods = ["POST", "PUT", "DELETE", "GET"]

        # Exclude specific paths from logging
        excluded_paths = ["/activity-logs/", "/choices/"]

        response = self.get_response(request)

        # Log only authenticated users' activities
        if request.user.is_authenticated:
            # Skip logging for excluded paths
            if request.path.replace("/api", "") in excluded_paths:
                return response

            # Log only if the path or method matches the criteria
            if request.path.replace("/api", "") in loggable_paths or request.method in loggable_methods:
                ActivityLog.objects.create(
                    user=request.user,
                    action=f"{request.method} request to {request.path.replace('/api', '')}",
                    method=request.method,
                    endpoint=request.path.replace("/api", ""),
                    timestamp=now()
                )

        return response