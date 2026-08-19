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

class CustomFormSection(models.Model):
    id = models.BigAutoField(primary_key=True)
    title_si = models.CharField(max_length=255, verbose_name="Section Title (Sinhala)")
    title_en = models.CharField(max_length=255, verbose_name="Section Title (English)")
    title_ta = models.CharField(max_length=255, verbose_name="Section Title (Tamil)", blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title_si} ({self.title_en})"

class CustomFormField(models.Model):
    FIELD_TYPES = (
        ('text', 'Text'),
        ('textarea', 'Text Area'),
        ('number', 'Number'),
        ('phone', 'Phone Number'),
        ('nic', 'NIC Number'),
        ('date', 'Date'),
        ('select', 'Dropdown'),
        ('radio', 'Radio Buttons'),
        ('checkbox', 'Checkbox (Multiple)'),
        ('boolean', 'Yes/No (Boolean)'),
        ('image', 'Image Upload'),
        ('autocalc_65', 'Auto Calculate (65th Birthday)'),
        ('renewal_history_grid', 'Renewal History (Grid)'),
        ('current_status_checkboxes', 'Current Status (Checkboxes)')
    )
    
    id = models.BigAutoField(primary_key=True)
    section = models.ForeignKey(CustomFormSection, related_name='fields', on_delete=models.CASCADE)
    system_name = models.CharField(max_length=50, null=True, blank=True, unique=True, help_text="Used to map dynamic fields to hardcoded database columns")
    label_si = models.CharField(max_length=255, verbose_name="Label (Sinhala)")
    label_en = models.CharField(max_length=255, verbose_name="Label (English)")
    label_ta = models.CharField(max_length=255, verbose_name="Label (Tamil)", blank=True, null=True)
    field_type = models.CharField(max_length=50, choices=FIELD_TYPES)
    options = models.JSONField(blank=True, null=True, help_text="JSON list of options for select/radio/checkbox")
    is_required = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    depends_on = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='dependent_fields')
    depends_on_value = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.label_si} - {self.get_field_type_display()}"

class LicenseRenewalYear(models.Model):
    id = models.BigAutoField(primary_key=True)
    year = models.IntegerField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['year']

    def __str__(self):
        return str(self.year)
