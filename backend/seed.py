import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import FirearmType, GNDivision

def seed_data():
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

    # Add some sample GN Divisions (Users can add more later via admin panel)
    gn_divisions = [
        "අංක 01 - උතුර",
        "අංක 02 - දකුණ",
        "අංක 03 - නැගෙනහිර",
        "අංක 04 - බටහිර",
        "නගර මධ්‍යය",
    ]

    print("\nAdding GN Divisions...")
    for gn in gn_divisions:
        obj, created = GNDivision.objects.get_or_create(name=gn)
        if created:
            print(f"Added: {obj.name}")

    print("\nData seeding completed successfully!")

if __name__ == '__main__':
    seed_data()
