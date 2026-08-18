from django.db import models
from licenses.models import LicenseHolder
from firearms.models import Firearm

class Renewal(models.Model):
    license_holder = models.ForeignKey(LicenseHolder, on_delete=models.CASCADE, related_name='renewals')
    firearm = models.ForeignKey(Firearm, on_delete=models.CASCADE, related_name='renewals', null=True, blank=True)
    license_year = models.IntegerField()
    renewal_date = models.DateField(null=True, blank=True)
    
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Renewed', 'Renewed'),
        ('Pending', 'Pending'),
        ('Not Renewed', 'Not Renewed'),
        ('Transferred', 'Transferred'),
        ('Other', 'Other'),
    )
    renewal_status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    remarks = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.license_holder.nic} - {self.license_year} ({self.renewal_status})"

class NonRenewalRecord(models.Model):
    license_holder = models.ForeignKey(LicenseHolder, on_delete=models.CASCADE, related_name='non_renewals')
    year = models.IntegerField()
    date_recorded = models.DateField(auto_now_add=True)
    reason_details = models.TextField()
    remarks = models.TextField(null=True, blank=True)
    updated_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Non-Renewal {self.year} - {self.license_holder.nic}"
