import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from records.models import LicenseRecord
from core.models import GNDivision, FirearmType
from datetime import date

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_user():
    return User.objects.create_user(username='testadmin', password='testpassword123')  # type: ignore

@pytest.fixture
def authenticated_client(api_client, test_user):
    # Depending on authentication class, DRF APIClient can force authenticate
    api_client.force_authenticate(user=test_user)
    return api_client

@pytest.fixture
def gn_division():
    return GNDivision.objects.create(name="View Test GN")

@pytest.fixture
def firearm_type():
    return FirearmType.objects.create(name_si="ටෙස්ට් 2", name_en="View Test Rifle")

@pytest.fixture
def license_record(gn_division, firearm_type):
    return LicenseRecord.objects.create(
        full_name="View Test User",
        nic="199512345678",
        address="View Test Address",
        gn_division=gn_division,
        date_of_birth=date(1995, 2, 2),
        telephone="0779998888",
        firearm_type=firearm_type,
        firearm_number="VIEW-123",
        first_licensed_year=2021
    )

@pytest.mark.django_db
class TestRecordViews:
    
    def test_list_records_unauthenticated(self, api_client):
        # The view currently allows unauthenticated access (AllowAny)
        response = api_client.get('/api/records/')
        assert response.status_code == 200
        
    def test_list_records_authenticated(self, authenticated_client, license_record):
        response = authenticated_client.get('/api/records/')
        assert response.status_code == 200
        
        # Check if pagination is returned
        data = response.json()
        assert 'results' in data
        assert data['count'] >= 1
        
        # Check if record is in results
        results = data['results']
        assert any(r['nic'] == '199512345678' for r in results)

    def test_create_record(self, authenticated_client, gn_division, firearm_type):
        payload = {
            "full_name": "New Record",
            "nic": "199999999999",
            "address": "New Addr",
            "gn_division": gn_division.id,
            "date_of_birth": "1999-01-01",
            "telephone": "0770000000",
            "firearm_type": firearm_type.id,
            "firearm_number": "NEW-777",
            "first_licensed_year": 2022
        }
        response = authenticated_client.post('/api/records/', data=payload, format='json')
        assert response.status_code == 201
        assert response.json()['firearm_number'] == "NEW-777"
        
        # Verify it's saved in DB
        assert LicenseRecord.objects.filter(nic="199999999999").exists()
