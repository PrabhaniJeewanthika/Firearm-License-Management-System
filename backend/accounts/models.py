from django.db import models
from django.contrib.auth.models import AbstractUser
from typing import TYPE_CHECKING

class User(AbstractUser):
    # The authorized officer role is standard for now, but we prepare for more roles
    ROLE_CHOICES = (
        ('ADMIN', 'Administrator / Authorized Officer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ADMIN')
    
    if TYPE_CHECKING:
        def get_role_display(self) -> str: ...
        
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
