from django.contrib import admin
from .models import Account, Contact, User

# Register your models here.
admin.site.register(Account)
admin.site.register(Contact)
admin.site.register(User)