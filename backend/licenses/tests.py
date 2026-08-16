from django.test import TestCase
from .models import LicenseHolder
from core.models import GNDivision
import datetime

class LicenseHolderModelTest(TestCase):
    def setUp(self):
        self.gn = GNDivision.objects.create(name='GN-Test')

    def test_birthday_65_calculation(self):
        holder = LicenseHolder.objects.create(
            full_name='Test Person',
            address='123 Test St',
            gn_division=self.gn,
            nic='1234567890',
            date_of_birth=datetime.date(1980, 5, 20),
            telephone_number='0777777777'
        )
        self.assertEqual(holder.birthday_65, datetime.date(2045, 5, 20))
