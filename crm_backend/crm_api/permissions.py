from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Allows access only to superuser (admin) users.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


class IsAuthenticated(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsUserOrAdmin(BasePermission):
    """
    Allows access to both normal users and admins.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
