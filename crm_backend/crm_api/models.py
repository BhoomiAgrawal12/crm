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
    email = models.EmailField()  # Email field
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone_now)

    # New fields
    title = models.CharField(max_length=255, blank=True, null=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    notify_on_assignment = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    password_last_changed = models.DateTimeField(auto_now=True)
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, related_name='modified_users'
    )
    assigned_to = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_users'
    )
    created_by = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_users'
    )
    department = models.CharField(max_length=255, blank=True, null=True)
    home_phone = models.CharField(max_length=20, blank=True, null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    work_phone = models.CharField(max_length=20, blank=True, null=True)
    address_street = models.CharField(max_length=255, blank=True, null=True)
    address_city = models.CharField(max_length=255, blank=True, null=True)
    address_state = models.CharField(max_length=255, blank=True, null=True)
    address_country = models.CharField(max_length=255, blank=True, null=True)
    address_postal_code = models.CharField(max_length=20, blank=True, null=True)
    user_type = models.CharField(
        max_length=50,
        choices=[('Admin', 'Admin'), ('Employee', 'Employee'), ('Guest', 'Guest')],
        default='Employee'
    )

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username


class Account(models.Model):
    
    account_type_choices = [
        ('Analyst', 'Analyst'),
        ('Competitor', 'Competitor'),
        ('Customer', 'Customer'),
        ('Integrator', 'Integrator'),
        ('Investor', 'Investor'),
        ('Parnter', 'Partner'),
        ('Press', 'Press'),
        ('Prospect', 'Prospect'),
        ('Reseller', 'Reseller'),
        ('Other', 'Other')
    ]
    industry_type_choices = [
        ('Apparel', 'Apparel'),
        ('Banking', 'Banking'),
        ('Biotechnology', 'Biotechnology'),
        ('Chemicals', 'Chemicals'),
        ('Communications', 'Communications'),
        ('Construction', 'Construction'),
        ('Consulting', 'Consulting'),
        ('Education', 'Education'),
        ('Energy', 'Energy'),
        ('Engineering', 'Engineering'),
        ('Entertainment', 'Entertainment'),
        ('Environment', 'Environment'),
        ('Finance', 'Finance'),
        ('Government', 'Government'),
        ('Healthcare', 'Hospitality'),
        ('Insurance', 'Insurance'),
        ('Machinery', 'Machinery'),
        ('Manufacturing', 'Manufacturing'),
        ('Media', 'Media'),
        ('Not For Profit', 'Not For Profit'),
        ('Recreation', 'Recreation'),
        ('Retail', 'Retail'),
        ('Shipping', 'Shipping'),
        ('Technology', 'Technology'),
        ('Telecommunications', 'Telecommunications'),
        ('Utilities', 'Utilities'),
        ('Other', 'Other')
    ]
    
    name = models.CharField(max_length=255, null=False)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assigned_accounts")
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
    account_type = models.CharField(max_length=100, choices=account_type_choices)
    industry_type = models.CharField(max_length=100, choices=industry_type_choices)
    annual_revenue = models.IntegerField()
    employees = models.CharField(max_length=255)
    #member_of = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone_now)
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(
        'User', on_delete=models.SET_NULL, null=True, blank=True, related_name='modified_accounts'
    )

    def __str__(self):
        return self.name



class Lead(models.Model):
    
    title_choices = [
        ('Mr.', 'Mr.'),
        ('Ms.', 'Ms.'),
        ('Mrs.', 'Mrs.'),
        ('Miss.', 'Miss.'),
        ('Dr.', 'Dr.'),
        ('Prof.', 'Prof.')
    ]
    
    status_choices = [
        ('New', 'New'),
        ('Assigned', 'Assigned'),
        ('In Process', 'In Process'),
        ('Converted', 'Converted'),
        ('Recycled', 'Recycled'),
        ('Dead', 'Dead')
    ]
    
    lead_source_choices = [
        ('Cold Call', 'Cold Call'),
        ('Existing Customer', 'Existing Customer'),
        ('Self Generated', 'Self Generated'),
        ('Employee', 'Employee'),
        ('Partner', 'Partner'),
        ('Public Relations', 'Public Relations'),
        ('Direct Mail', 'Direct Mail'),
        ('Conference', 'Conference'),
        ('Trade Show', 'Trade Show'),
        ('Web Site', 'Web Site'),
        ('Word of mouth', 'Word of mouth'),
        ('Email', 'Email'),
        ('Campaign', 'Campaign'),
        ('Other', 'Other')
    ]
    
    title = models.CharField(max_length=10, choices=title_choices)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email_address = models.EmailField()
    mobile = models.CharField(max_length=20)
    office_phone = models.CharField(max_length=20)
    job_title = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    account_name = models.CharField(max_length=100)
    website = models.URLField(blank=True, null=True)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assigned_leads")
    status = models.CharField(max_length=100, choices=status_choices)
    status_description = models.TextField(blank=True, null=True)
    lead_source = models.CharField(max_length=100, choices=lead_source_choices)
    lead_source_description = models.TextField(blank=True, null=True)
    opportunity_amount = models.CharField(max_length=10)
    referred_by = models.CharField(max_length=100)
    reports_to = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)
    # campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
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
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_leads")
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="modified_leads")

    
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"



class Contact(models.Model):
    title_choices = [
        ('Mr.', 'Mr.'),
        ('Ms.', 'Ms.'),
        ('Mrs.', 'Mrs.'),
        ('Miss.', 'Miss.'),
        ('Dr.', 'Dr.'),
        ('Prof.', 'Prof.')
    ]
    
    lead_source_choices = [
        ('Cold Call', 'Cold Call'),
        ('Existing Customer', 'Existing Customer'),
        ('Self Generated', 'Self Generated'),
        ('Employee', 'Employee'),
        ('Partner', 'Partner'),
        ('Public Relations', 'Public Relations'),
        ('Direct Mail', 'Direct Mail'),
        ('Conference', 'Conference'),
        ('Trade Show', 'Trade Show'),
        ('Web Site', 'Web Site'),
        ('Word of mouth', 'Word of mouth'),
        ('Email', 'Email'),
        ('Campaign', 'Campaign'),
        ('Other', 'Other')
    ]
    
    title = models.CharField(max_length=100, choices=title_choices)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    office_phone = models.CharField(max_length=20)
    mobile = models.CharField(max_length=20)
    email_address = models.EmailField()
    job_title = models.CharField(max_length=100)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assigned_contacts")
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
    lead_source = models.CharField(max_length=100, choices=lead_source_choices)
    # campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, blank=True, null=True)
    reports_to = models.ForeignKey(Lead, on_delete=models.CASCADE, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone_now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_contacts")
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="modified_contacts")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Opportunity(models.Model):
    
    sale_stage_choices = [
        ('Prospecting','Prospecting'),
        ('Qualification','Qualification'),
        ('Need Analysis', 'Need Analysis'),
        ('Value Proposition', 'Value Proposition'),
        ('Identifying Decision Makers', 'Identifying Decision Makers'),
        ('Perception Analysis', 'Perception Analysis'),
        ('Proposal/Price Quote', 'Proposal/Price Quote'),
        ('Negotiation/Review', 'Negotiation/Review'),
        ('Closed Won', 'Closed Won'),
        ('Closed Lost', 'Closed Lost'),
    ]
    
    business_type_choices = [
        ('Existing Business', 'Existing Business'),
        ('New Business', 'New Business')
    ]
    
    lead_source_choices = [
        ('Cold Call', 'Cold Call'),
        ('Existing Customer', 'Existing Customer'),
        ('Self Generated', 'Self Generated'),
        ('Employee', 'Employee'),
        ('Partner', 'Partner'),
        ('Public Relations', 'Public Relations'),
        ('Direct Mail', 'Direct Mail'),
        ('Conference', 'Conference'),
        ('Trade Show', 'Trade Show'),
        ('Web Site', 'Web Site'),
        ('Word of mouth', 'Word of mouth'),
        ('Email', 'Email'),
        ('Campaign', 'Campaign'),
        ('Other', 'Other')
    ]
    
    currency_choices = [
        ('INR', 'INR'),
        ('USD', 'USD'),
    ]
    
    opportunity_name = models.CharField(max_length=255, null=False)
    currency = models.CharField(max_length=10, choices=currency_choices)
    opportunity_amount = models.CharField(max_length=10)
    sales_stage = models.CharField(max_length=100, choices=sale_stage_choices)
    probability = models.IntegerField()
    next_step = models.CharField(max_length=255)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    # campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, blank=True, null=True)
    expected_close_date = models.DateField()
    business_type = models.CharField(max_length=100, choices=business_type_choices)
    lead_source = models.CharField(max_length=100, choices=lead_source_choices)
    description = models.TextField(blank=True, null=True)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assigned_opportunities")
    created_at = models.DateTimeField(default=timezone_now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_opportunities")
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="modified_opportunities")
    
    #To make Campaign Model
    # campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.opportunity_name


class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activity_logs")
    action = models.CharField(max_length=255)  # Description of the activity
    method = models.CharField(max_length=10)  # HTTP method (GET, POST, etc.)
    endpoint = models.CharField(max_length=255)  # API endpoint or page
    timestamp = models.DateTimeField(auto_now_add=True)  # When the activity occurred

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.timestamp}"


class Task(models.Model):
    status_choices = [
        ('Not Started', 'Not Started'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Pending Input', 'Pending Input'),
        ('Deferred', 'Deferred')
    ]
    parent_type_choices = [
        ('Account', 'Account'),
        ('Contact', 'Contact'),
        ('Task', 'Task'),
        ('Opportunity', 'Opportunity'),
        ('Bug', 'Bug'),
        ('Case', 'Case'),
        ('Lead', 'Lead'),
        ('Project', 'Project'),
        ('Project Task', 'Project Task'),
        ('Target', 'Target'),
        ('Contract', 'Contract'),
        ('Invoice', 'Invoice'),
        ('Quote', 'Quote'),
        ('Product', 'Product')
    ]
    subject = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone_now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_tasks")
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="modified_tasks")
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assigned_tasks")
    status = models.CharField(max_length=100, choices=status_choices)
    start_date = models.DateField()
    due_date = models.DateField()
    priority = models.CharField(max_length=100, choices=[('High', 'High'),('Medium', 'Medium'), ('Low', 'Low')])
    contact_name = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name="contact_tasks")
    parent_type = models.CharField(max_length=100, choices=parent_type_choices)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.subject


class Quote(models.Model):
    approval_status_choices = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    
    quote_stage_choices = [
        ('Draft', 'Draft'),
        ('Negotiation', 'Negotiation'),
        ('Delivered', 'Delivered'),
        ('On Hold', 'On Hold'),
        ('Confirmed', 'Confirmed'),
        ('Closed Accepted', 'Closed Accepted'),
        ('Closed Lost', 'Closed Lost'),
        ('Closed Dead', 'Closed Dead')
    ]
    
    invoice_status_choices = [
        ('Not Invoiced', 'Not Invoiced'),
        ('Invoiced', 'Invoiced'),
    ]
    
    payment_terms_choices = [
        ('Nett 15', 'Nett 15'),
        ('Nett 30', 'Nett 30'),
        ('Other', 'Other')
    ]
    
    currency_choices = [
        ('USD', 'USD'),
        ('INR', 'INR'),
    ]
    quote_title = models.CharField(max_length=255, null=False)
    quote_number = models.IntegerField(unique=True, null=False)
    valid_until = models.DateField(null=False)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='assigned_quotes')
    approval_status = models.CharField(max_length=50, null=False, choices=approval_status_choices)
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, null=True, related_name='opportunity_quotes')
    quote_stage = models.CharField(max_length=50, null=False, choices= quote_stage_choices)
    invoice_status = models.CharField(max_length=50, null=False, choices=invoice_status_choices)
    payment_terms = models.CharField(max_length=50, null=False, choices=payment_terms_choices)
    payment_terms_other =  models.CharField(max_length=50)
    approval_issues = models.TextField(null=True, blank=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, null=True, related_name='account_quotes')
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, null=True, related_name='contact_quotes')
    billing_address_street = models.CharField(max_length=255, null=True)
    billing_address_city = models.CharField(max_length=100, null=True)
    billing_address_state = models.CharField(max_length=100, null=True)
    billing_address_postalcode = models.CharField(max_length=20, null=True)
    billing_address_country = models.CharField(max_length=100, null=True)
    shipping_address_street = models.CharField(max_length=255, null=True)
    shipping_address_city = models.CharField(max_length=100, null=True)
    shipping_address_state = models.CharField(max_length=100, null=True)
    shipping_address_postalcode = models.CharField(max_length=20, null=True)
    shipping_address_country = models.CharField(max_length=100, null=True)
    description = models.TextField(null=True, blank=True)
    #line_items = models.JSONField(null=True, blank=True)
    currency = models.CharField(max_length=50, choices=currency_choices)
    total = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    discount = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    sub_total = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    shipping = models.DecimalField(max_digits=15, decimal_places=2, null=True)  
    shipping_tax = models.DecimalField(max_digits=15, decimal_places=2, null=True) 
    tax = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    grand_total = models.DecimalField(max_digits=15, decimal_places=2, null=True) 
    created_at = models.DateTimeField(default=timezone_now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='created_quotes')
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='modified_quotes')
    
    
    def __str__(self):
        return self.quote_title