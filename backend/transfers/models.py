from django.db import models
from licenses.models import LicenseHolder
from firearms.models import Firearm
import datetime

class Transfer(models.Model):
    transfer_date = models.DateField(default=datetime.date.today)
    previous_holder = models.ForeignKey(LicenseHolder, on_delete=models.SET_NULL, null=True, related_name='transfers_out')
    new_holder_reference = models.CharField(max_length=255, help_text="New Holder / Official Reference")
    firearm = models.ForeignKey(Firearm, on_delete=models.CASCADE, related_name='transfers')
    transfer_details = models.TextField()
    remarks = models.TextField(null=True, blank=True)
    supporting_document_reference = models.CharField(max_length=255, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transfer of {self.firearm.firearm_number} on {self.transfer_date}"
