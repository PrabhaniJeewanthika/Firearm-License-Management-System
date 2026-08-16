from django.core.management.base import BaseCommand
from core.models import GNDivision, FirearmType

class Command(BaseCommand):
    help = 'Seeds initial GN divisions and firearm types'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial data...')

        # Seed GN Divisions
        divisions = [
            'හෙට්ටිපොල (Hettipola)',
            'පඬුවස්නුවර උතුර (Panduwasnuwara North)',
            'පඬුවස්නුවර දකුණ (Panduwasnuwara South)',
            'කනත්තේවැව (Kanattewewa)',
            'බිංගිරිය (Bingiriya)',
            'කුලියාපිටිය (Kuliyapitiya)',
            'වාරියපොල (Wariyapola)',
            'රත්මල්ගොඩ (Ratmalgoda)',
            'කොටලිකදවල (Kotalikadawala)',
            'හෙට්ටිපොල නගරය (Hettipola Town)'
        ]
        
        for name in divisions:
            gn, created = GNDivision.objects.get_or_create(name=name, defaults={'is_active': True})
            if created:
                self.stdout.write(f'Created GN Division ID: {gn.id}')

        # Seed Firearm Types
        types = [
            ('බෝර් 12 - ද්විත්ව බැරල්', 'Bore 12 - Double Barrel'),
            ('බෝර් 12 - එක් බැරල්', 'Bore 12 - Single Barrel'),
            ('බෝර් 16', 'Bore 16'),
            ('බෝර් 10', 'Bore 10'),
        ]

        for name_si, name_en in types:
            ft, created = FirearmType.objects.get_or_create(
                name_si=name_si,
                defaults={'name_en': name_en, 'is_active': True}
            )
            if created:
                self.stdout.write(f'Created Firearm Type ID: {ft.id}')

        self.stdout.write(self.style.SUCCESS('Initial data seeded successfully!'))
