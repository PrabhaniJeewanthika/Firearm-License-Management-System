from django.db import models
from core.models import FirearmType
from licenses.models import LicenseHolder

class Firearm(models.Model):
    license_holder = models.ForeignKey(LicenseHolder, on_delete=models.CASCADE, related_name='firearms')
    firearm_type = models.ForeignKey(FirearmType, on_delete=models.PROTECT)
    firearm_number = models.CharField(max_length=100, unique=True)
    first_licensed_year = models.IntegerField()
    remarks = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.firearm_number} ({self.firearm_type})"
