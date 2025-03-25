# models.py (unchanged)
from mongoengine import Document, fields
from django.contrib.auth.hashers import make_password
import datetime


class User(Document):
    @property
    def is_authenticated(self):
        return True
    username = fields.StringField(required=True, unique=True)
    email = fields.EmailField(required=True, unique=True)
    password = fields.StringField(required=True)
    is_active = fields.BooleanField(default=True)
    is_admin = fields.BooleanField(default=False)
    created_at = fields.DateTimeField(default=datetime.datetime.utcnow)
    meta = {'collection': 'users'}

