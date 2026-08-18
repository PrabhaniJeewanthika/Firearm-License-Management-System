from django.db import models
from core.models import GNDivision, FirearmType
from datetime import timedelta
import datetime

class LicenseRecord(models.Model):
    id = models.BigAutoField(primary_key=True)
    # Photo
    photo = models.ImageField(upload_to='photos/', null=True, blank=True)

    # Personal Information
    full_name = models.CharField(max_length=255)
    address = models.TextField()
    gn_division = models.ForeignKey(GNDivision, on_delete=models.PROTECT, related_name='records')
    nic = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField()
    sixty_fifth_birthday = models.DateField(null=True, blank=True)
    telephone = models.CharField(max_length=20)
    whatsapp_number = models.CharField(max_length=20, null=True, blank=True)

    # Firearm Information
    firearm_type = models.ForeignKey(FirearmType, on_delete=models.PROTECT, related_name='records')
    firearm_number = models.CharField(max_length=100, unique=True)
    first_licensed_year = models.IntegerField()

    # License Renewal
    renewal_year = models.IntegerField(null=True, blank=True)
    renewal_date = models.DateField(null=True, blank=True)
    renewal_status = models.CharField(max_length=50, null=True, blank=True)
    renewal_remarks = models.TextField(null=True, blank=True)
    renewal_history = models.JSONField(default=dict, blank=True, null=True)

    # Non-renewal details
    non_renewal_information = models.TextField(null=True, blank=True)

    # Current Status & Transfer Info
    current_status_info = models.JSONField(default=dict, blank=True, null=True)

    # Special Information
    special_information = models.TextField(null=True, blank=True)

    # Out of Area Residents
    outside_area_holder = models.BooleanField(default=False)
    outside_residential_address = models.TextField(null=True, blank=True)
    land_location_details = models.TextField(null=True, blank=True)

    # Dynamic Custom Data
    custom_data = models.JSONField(default=dict, blank=True, null=True)

    # Timestamps & Archiving
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_archived = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        dob = self.date_of_birth
        if dob:
            # Type narrowing for Pyright without django mypy plugin
            if isinstance(dob, datetime.date):
                try:
                    # Add 65 years to the date_of_birth
                    self.sixty_fifth_birthday = dob.replace(year=dob.year + 65)  # type: ignore
                except ValueError:
                    # Leap year edge case (Feb 29)
                    self.sixty_fifth_birthday = dob + timedelta(days=65*365 + 16)  # type: ignore
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.nic}) - {self.firearm_number}"
