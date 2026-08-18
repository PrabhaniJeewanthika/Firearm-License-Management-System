from django.core.management.base import BaseCommand
from accounts.models import User
from core.models import GNDivision, FirearmType
from licenses.models import LicenseHolder, StatusHistory
from firearms.models import Firearm
from renewals.models import Renewal
import datetime

class Command(BaseCommand):
    help = 'Seeds the database with demo data.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        # Create Admin
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin')
            self.stdout.write("Created superuser 'admin' with password 'admin'")

        # Create GN Divisions
        gn1, _ = GNDivision.objects.get_or_create(name='GN-001 Colombo')
        gn2, _ = GNDivision.objects.get_or_create(name='GN-002 Kandy')

        # Create Firearm Types
        ft1, _ = FirearmType.objects.get_or_create(name='Bore 12')
        ft2, _ = FirearmType.objects.get_or_create(name='Bore 16')
        
        # Create License Holders
        if not LicenseHolder.objects.filter(nic='199012345678').exists():
            holder1 = LicenseHolder.objects.create(
                full_name='Sample Person One',
                address='123 Main St, Colombo',
                gn_division=gn1,
                nic='199012345678',
                date_of_birth=datetime.date(1990, 5, 14),
                telephone_number='0771234567',
                current_status='Active'
            )
            StatusHistory.objects.create(
                license_holder=holder1,
                status='Active',
                remarks='Initial Registration'
            )
            
            f1 = Firearm.objects.create(
                license_holder=holder1,
                firearm_type=ft1,
                firearm_number='F-12345',
                first_licensed_year=2020
            )

            Renewal.objects.create(
                license_holder=holder1,
                firearm=f1,
                license_year=2024,
                renewal_status='Renewed'
            )
            Renewal.objects.create(
                license_holder=holder1,
                firearm=f1,
                license_year=2025,
                renewal_status='Pending'
            )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
