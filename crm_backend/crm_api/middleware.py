from .models import ActivityLog
from django.utils.timezone import now

class ActivityLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.user.is_authenticated:
            ActivityLog.objects.create(
                user=request.user,
                action=f"{request.method} request to {request.path.replace('/api', '')}",
                method=request.method,
                endpoint=request.path.replace("/api", ""),
                timestamp=now()
            )

        return response