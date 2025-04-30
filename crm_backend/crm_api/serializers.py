from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Account, Contact, Opportunity, Lead, ActivityLog, Task, Quote, Note


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    modified_by_username = serializers.CharField(source='modified_by.username', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'is_active',
            'is_staff',
            'is_superuser',
            'created_at',
            'modified_at',
            'password',
            'title',
            'full_name',
            'notify_on_assignment',
            'description',
            'department',
            'home_phone',
            'mobile',
            'work_phone',
            'address_street',
            'address_city',
            'address_state',
            'address_country',
            'address_postal_code',
            'user_type',
            'modified_by',
            'modified_by_username',  # Include the username of the user who modified
            'assigned_to',
            'assigned_to_username',  # Include the username of the assigned user
            'created_by',
            'created_by_username',  # Include the username of the user who created
        ]

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password' and value:
                setattr(instance, attr, make_password(value))
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance


# User Registration Serializer
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


# Account Serializer
class AccountSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)

    class Meta:
        model = Account
        fields = [
            'id',
            'name',
            'assigned_to',
            'assigned_to_username',  # Include the username of the assigned user
            'website',
            'office_phone',
            'email_address',
            'billing_street',
            'billing_postal_code',
            'billing_city',
            'billing_state',
            'billing_country',
            'shipping_street',
            'shipping_postal_code',
            'shipping_city',
            'shipping_state',
            'shipping_country',
            'description',
            'account_type',
            'industry_type',
            'annual_revenue',
            'employees',
            'modified_by',  # Include modified_by in the serializer
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['modified_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)


# Contact Serializer
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            'id',
            'title',
            'first_name',
            'last_name',
            'office_phone',
            'mobile',
            'email_address',
            'job_title',
            'account',
            'department',
            'primary_address_street',
            'primary_address_postal_code',
            'primary_address_city',
            'primary_address_state',
            'primary_address_country',
            'alternate_address_street',
            'alternate_address_postal_code',
            'alternate_address_city',
            'alternate_address_state',
            'alternate_address_country',
            'description',
            'lead_source',
            'reports_to',
            'assigned_to',
            'created_by',
            'modified_by',
        ]
        read_only_fields = ['created_by', 'modified_by']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
            validated_data['modified_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = [
            'id',
            'opportunity_name',
            'currency',
            'opportunity_amount',
            'sales_stage',
            'probability',
            'next_step',
            'account',
            'expected_close_date',
            'business_type',
            'lead_source',
            'description',
            'assigned_to',
            'created_by',
            'modified_by',
        ]
        read_only_fields = ['created_by', 'modified_by']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
            validated_data['modified_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            'id',
            'title',
            'first_name',
            'last_name',
            'email_address',
            'mobile',
            'office_phone',
            'job_title',
            'department',
            'account_name',
            'status',
            'status_description',
            'lead_source',
            'lead_source_description',
            'opportunity_amount',
            'referred_by',
            'reports_to',
            'primary_address_street',
            'primary_address_postal_code',
            'primary_address_city',
            'primary_address_state',
            'primary_address_country',
            'alternate_address_street',
            'alternate_address_postal_code',
            'alternate_address_city',
            'alternate_address_state',
            'alternate_address_country',
            'description',
            'assigned_to',
            'created_by',
            'modified_by',
        ]
        read_only_fields = ['created_by', 'modified_by']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
            validated_data['modified_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'action', 'method', 'endpoint', 'timestamp']
        read_only_fields = ['user', 'timestamp']


class TaskSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    modified_by_username = serializers.CharField(source='modified_by.username', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    contact_name_full = serializers.CharField(source='contact_name.first_name', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'subject',
            'created_at',
            'created_by',
            'created_by_username',  # Include the username of the creator
            'modified_at',
            'modified_by',
            'modified_by_username',  # Include the username of the last modifier
            'assigned_to',
            'assigned_to_username',  # Include the username of the assigned user
            'status',
            'start_date',
            'due_date',
            'priority',
            'contact_name',
            'contact_name_full',  # Include the full name of the contact
            'parent_type',
            'description',
        ]
        read_only_fields = ['created_by', 'modified_by', 'created_at', 'modified_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
            validated_data['modified_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)


class QuoteSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    opportunity_name = serializers.CharField(source='opportunity.opportunity_name', read_only=True)
    account_name = serializers.CharField(source='account.name', read_only=True)
    contact_name = serializers.CharField(source='contact.first_name', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    modified_by_username = serializers.CharField(source='modified_by.username', read_only=True)

    class Meta:
        model = Quote
        fields = [
            'id',
            'quote_title',
            'quote_number',
            'valid_until',
            'assigned_to',
            'assigned_to_username',  # Include the username of the assigned user
            'approval_status',
            'opportunity',
            'opportunity_name',  # Include the name of the related opportunity
            'quote_stage',
            'invoice_status',
            'payment_terms',
            'payment_terms_other',
            'approval_issues',
            'account',
            'account_name',  # Include the name of the related account
            'contact',
            'contact_name',  # Include the name of the related contact
            'billing_address_street',
            'billing_address_city',
            'billing_address_state',
            'billing_address_postalcode',
            'billing_address_country',
            'shipping_address_street',
            'shipping_address_city',
            'shipping_address_state',
            'shipping_address_postalcode',
            'shipping_address_country',
            'description',
            'currency',
            'total',
            'discount',
            'sub_total',
            'shipping',
            'shipping_tax',
            'tax',
            'grand_total',
            'created_at',
            'created_by',
            'created_by_username',
            'modified_at',
            'modified_by',
            'modified_by_username',
        ]
        read_only_fields = ['created_by', 'modified_by', 'created_at', 'modified_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
            validated_data['modified_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)


class NoteSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    modified_by_username = serializers.CharField(source='modified_by.username', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    
    class Meta:
        model = Note
        fields = [
            'id',
            'subject',
            'description',
            'related_to_type',
            'related_to_id',
            'assigned_to',
            'assigned_to_username',
            'created_at',
            'created_by',
            'created_by_username',
            'modified_at',
            'modified_by',
            'modified_by_username',
        ]
        read_only_fields = ['created_by', 'modified_by', 'created_at', 'modified_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
            validated_data['modified_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)
