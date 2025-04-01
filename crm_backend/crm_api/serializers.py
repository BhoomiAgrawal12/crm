from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Account, Contact, Opportunity, Lead


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'is_staff', 'created_at', 'password']

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
            'assigned_to_username',  # Include the username
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
            'created_at',
        ]


# Contact Serializer
class ContactSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    account_name = serializers.CharField(source='account.name', read_only=True)
    class Meta:
        model = Contact
        fields = [
            'id',
            'first_name',
            'last_name',
            'office_phone',
            'mobile',
            'email_address',
            'job_title',
            'account',
            'account_name',  # Include the account name
            'assigned_to',
            'assigned_to_username',  # Include the username of the assigned user
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
            'created_at',
        ]


class OpportunitySerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    account_name = serializers.CharField(source='account.name', read_only=True)

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
            'account_name',  # Include the account name
            'expected_close_date',
            'business_type',
            'lead_source',
            'description',
            'assigned_to',
            'assigned_to_username',  # Include the username of the assigned user
            'created_at',
        ]

class LeadSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)

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
            'website',
            'assigned_to',
            'assigned_to_username',  # Include the username of the assigned user
            'status',
            'status_description',
            'lead_source',
            'lead_source_description',
            'opportunity_amount',
            'referred_by',
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
            'created_at',
        ]

