from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.timezone import now as timezone_now


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)  # Ensures username is unique
    email = models.EmailField()  # Temporarily allow null and blank
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone_now)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username


class Account(models.Model):
    name = models.CharField(max_length=255, null=False)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    website = models.URLField(blank=True, null=True)
    office_phone = models.CharField(max_length=20)
    email_address = models.EmailField()
    billing_street = models.CharField(max_length=255, null=False)
    billing_postal_code = models.CharField(max_length=20, null=False)
    billing_city = models.CharField(max_length=100, null=False)
    billing_state = models.CharField(max_length=100, null=False)
    billing_country = models.CharField(max_length=100, null=False)
    shipping_street = models.CharField(max_length=255)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_country = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone_now)

    def __str__(self):
        return self.name


class Contact(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    office_phone = models.CharField(max_length=20)
    mobile = models.CharField(max_length=20)
    email_address = models.EmailField()
    job_title = models.CharField(max_length=100)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=100)
    primary_address_street = models.CharField(max_length=255, null=False)
    primary_address_postal_code = models.CharField(max_length=20, null=False)
    primary_address_city = models.CharField(max_length=100, null=False)
    primary_address_state = models.CharField(max_length=100, null=False)
    primary_address_country = models.CharField(max_length=100, null=False)
    alternate_address_street = models.CharField(max_length=255)
    alternate_address_postal_code = models.CharField(max_length=20)
    alternate_address_city = models.CharField(max_length=100)
    alternate_address_state = models.CharField(max_length=100)
    alternate_address_country = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone_now)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"






