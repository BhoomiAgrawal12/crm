from rest_framework.permissions import BasePermission

class IsAdminUserCustom(BasePermission):
    """
    Custom permission to allow only admin users to access the view.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)