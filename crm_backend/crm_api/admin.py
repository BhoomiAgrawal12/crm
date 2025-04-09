from django.contrib import admin
from .models import Account, Contact, User, Opportunity, Lead, ActivityLog, Task

# Register your models here.
admin.site.register(Account)
admin.site.register(Contact)
admin.site.register(User)
admin.site.register(Opportunity)
admin.site.register(Lead)
admin.site.register(ActivityLog)
admin.site.register(Task)