from django.db import models

class GNDivision(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True, verbose_name="GN Division Name")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class FirearmType(models.Model):
    id = models.BigAutoField(primary_key=True)
    name_si = models.CharField(max_length=255, unique=True, verbose_name="Firearm Type Name (Sinhala)")
    name_en = models.CharField(max_length=255, unique=True, verbose_name="Firearm Type Name (English)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name_si} ({self.name_en})"

