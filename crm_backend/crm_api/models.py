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



# def save(self, *args, **kwargs):
#         if not self.id:
#             self.password = make_password(self.password)
#         return super().save(*args, **kwargs)

# class Customer(Document):
#     name = fields.StringField(required=True)
#     email = fields.EmailField(required=True)
#     phone = fields.StringField()
#     address = fields.StringField()
#     created_at = fields.DateTimeField(default=datetime.datetime.utcnow)
#     created_by = fields.StringField()
#     meta = {'collection': 'customers'}

# class Contact(Document):
#     customer_id = fields.StringField(required=True)
#     message = fields.StringField(required=True)
#     contact_date = fields.DateTimeField(default=datetime.datetime.utcnow)
#     created_by = fields.StringField()
#     meta = {'collection': 'contacts'}

# class Task(Document):
#     title = fields.StringField(required=True)
#     description = fields.StringField()
#     assigned_to = fields.StringField()
#     status = fields.StringField(choices=['pending', 'in_progress', 'completed'], default='pending')
#     due_date = fields.DateTimeField(required=True)
#     created_at = fields.DateTimeField(default=datetime.datetime.utcnow)
#     created_by = fields.StringField()
#     meta = {'collection': 'tasks'}

