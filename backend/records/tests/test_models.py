import pytest
from datetime import date
from records.models import LicenseRecord
from core.models import GNDivision, FirearmType

@pytest.mark.django_db
class TestLicenseRecordModel:
    
    @pytest.fixture
    def gn_division(self):
        return GNDivision.objects.create(name="Test GN 123")

    @pytest.fixture
    def firearm_type(self):
        return FirearmType.objects.create(name_si="ටෙස්ට්", name_en="Test Rifle")

    def test_create_license_record(self, gn_division, firearm_type):
        record = LicenseRecord.objects.create(
            full_name="John Doe",
            nic="199012345678",
            address="123 Test St",
            gn_division=gn_division,
            date_of_birth=date(1990, 1, 1),
            telephone="0771234567",
            firearm_type=firearm_type,
            firearm_number="TEST-999",
            first_licensed_year=2020
        )
        assert record.id is not None
        assert record.full_name == "John Doe"
        assert str(record) == f"John Doe (199012345678) - TEST-999"

    def test_sixty_fifth_birthday_auto_calculation(self, gn_division, firearm_type):
        record = LicenseRecord.objects.create(
            full_name="Jane Doe",
            nic="198012345678",
            address="123 Test St",
            gn_division=gn_division,
            date_of_birth=date(1980, 5, 10),
            telephone="0771234567",
            firearm_type=firearm_type,
            firearm_number="TEST-888",
            first_licensed_year=2020
        )
        
        # In the save method, sixty_fifth_birthday is calculated as dob + 70 years
        assert record.sixty_fifth_birthday is not None
        assert record.sixty_fifth_birthday.year == 1980 + 70
        assert record.sixty_fifth_birthday.month == 5
        assert record.sixty_fifth_birthday.day == 10
