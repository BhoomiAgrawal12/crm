from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from .models import User

class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token['user_id']
            user = User.objects.get(id=user_id)
            if not user.is_active:
                raise AuthenticationFailed('User is inactive', code='user_inactive')
            return user
        except User.DoesNotExist:
            raise AuthenticationFailed('No such user exists', code='user_not_found')
        except Exception as e:
            raise AuthenticationFailed(str(e))