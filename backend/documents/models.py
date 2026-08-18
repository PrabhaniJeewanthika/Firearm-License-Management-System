from django.db import models
from licenses.models import LicenseHolder

class Document(models.Model):
    DOCUMENT_TYPES = (
        ('License', 'License Document'),
        ('Renewal', 'Renewal Document'),
        ('Transfer', 'Transfer Document'),
        ('Other', 'Other Official Document'),
    )
    
    document_name = models.CharField(max_length=255)
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES, default='Other')
    description = models.TextField(null=True, blank=True)
    uploaded_date = models.DateTimeField(auto_now_add=True)
    related_license_holder = models.ForeignKey(LicenseHolder, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='official_documents/')
    
    def __str__(self):
        return f"{self.document_name} ({self.related_license_holder.nic})"
