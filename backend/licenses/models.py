from django.db import models
from core.models import GNDivision
from datetime import timedelta
import datetime

class LicenseHolder(models.Model):
    # Personal Information
    photograph = models.ImageField(upload_to='holder_photos/', null=True, blank=True)
    full_name = models.CharField(max_length=255)
    address = models.TextField()
    gn_division = models.ForeignKey(GNDivision, on_delete=models.PROTECT, related_name='license_holders')
    nic = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField()
    telephone_number = models.CharField(max_length=20)
    outside_area_holder = models.BooleanField(default=False)
    notes = models.TextField(null=True, blank=True)
    
    # Track current status (e.g., Active, Deceased, Transferred, Not Renewed, Other)
    current_status = models.CharField(max_length=50, default='Active')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def birthday_65(self):
        if self.date_of_birth:
            # Add 65 years accounting for leap years natively or roughly
            try:
                return self.date_of_birth.replace(year=self.date_of_birth.year + 65)
            except ValueError:
                # Handle Feb 29 for non-leap years
                return self.date_of_birth + timedelta(days=65*365 + 16)
        return None

    def __str__(self):
        return f"{self.full_name} ({self.nic})"

class StatusHistory(models.Model):
    license_holder = models.ForeignKey(LicenseHolder, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=50)
    status_date = models.DateField(default=datetime.date.today)
    details = models.TextField(null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
    changed_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.license_holder.nic} -> {self.status}"
