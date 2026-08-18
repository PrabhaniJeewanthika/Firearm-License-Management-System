from django.db import models
from licenses.models import LicenseHolder

class Notification(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50) # e.g., 'Renewal Reminder', 'Age 65 Reminder'
    related_record = models.ForeignKey(LicenseHolder, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    priority = models.CharField(max_length=20, default='Normal') # e.g., High, Normal, Low

    def __str__(self):
        return self.title

class Reminder(models.Model):
    title = models.CharField(max_length=255)
    due_date = models.DateField()
    related_holder = models.ForeignKey(LicenseHolder, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.CharField(max_length=50) # e.g., 'Renewal Review', 'Age 65 Review'
    notes = models.TextField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.due_date}"
