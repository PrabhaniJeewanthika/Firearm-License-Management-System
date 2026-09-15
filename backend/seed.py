import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import FirearmType, GNDivision

def seed_data():

    # Create Default Admin User
    print("Checking default admin user...")
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Created default admin user: admin / admin123")
    else:
        print("Admin user already exists.")

    # Add Firearm Types

    firearms = [
        {"name_si": "බෙහෙත් කොටන තුවක්කු", "name_en": "Muzzle-loading Gun"},
        {"name_si": "බෝර 12 තුවක්කු", "name_en": "12 Bore Shotgun"},
        {"name_si": "රයිෆල්", "name_en": "Rifle"},
        {"name_si": "පිස්තෝල", "name_en": "Pistol"},
        {"name_si": "රිවෝල්වර", "name_en": "Revolver"},
        {"name_si": "වායු රයිෆල්", "name_en": "Air Rifle"},
        {"name_si": "වෙනත්", "name_en": "Other"},
    ]
    
    print("Adding Firearm Types...")
    for f in firearms:
        obj, created = FirearmType.objects.get_or_create(
            name_si=f['name_si'],
            defaults={'name_en': f['name_en']}
        )
        if created:
            print(f"Added: {obj.name_si}")

    print("\nData seeding completed successfully!")

if __name__ == '__main__':
    seed_data()
