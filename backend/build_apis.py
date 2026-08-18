import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

serializers = {
    'accounts': '''from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')
''',
    'core': '''from rest_framework import serializers
from .models import GNDivision, FirearmType

class GNDivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GNDivision
        fields = '__all__'

class FirearmTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirearmType
        fields = '__all__'
''',
    'licenses': '''from rest_framework import serializers
from .models import LicenseHolder, StatusHistory
from core.models import GNDivision

class LicenseHolderSerializer(serializers.ModelSerializer):
    gn_division_name = serializers.CharField(source='gn_division.name', read_only=True)
    birthday_65 = serializers.DateField(read_only=True)

    class Meta:
        model = LicenseHolder
        fields = '__all__'

class StatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusHistory
        fields = '__all__'
''',
    'firearms': '''from rest_framework import serializers
from .models import Firearm

class FirearmSerializer(serializers.ModelSerializer):
    firearm_type_name = serializers.CharField(source='firearm_type.name', read_only=True)

    class Meta:
        model = Firearm
        fields = '__all__'
''',
    'renewals': '''from rest_framework import serializers
from .models import Renewal, NonRenewalRecord

class RenewalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Renewal
        fields = '__all__'

class NonRenewalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonRenewalRecord
        fields = '__all__'
''',
    'transfers': '''from rest_framework import serializers
from .models import Transfer

class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transfer
        fields = '__all__'
''',
    'documents': '''from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
''',
    'notifications': '''from rest_framework import serializers
from .models import Notification, Reminder

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'
''',
    'logs': '''from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = AuditLog
        fields = '__all__'
'''
}

views = {
    'accounts': '''from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
''',
    'core': '''from rest_framework import viewsets
from .models import GNDivision, FirearmType
from .serializers import GNDivisionSerializer, FirearmTypeSerializer
from rest_framework.permissions import AllowAny

class GNDivisionViewSet(viewsets.ModelViewSet):
    queryset = GNDivision.objects.all()
    serializer_class = GNDivisionSerializer
    permission_classes = [AllowAny]
    search_fields = ['name']

class FirearmTypeViewSet(viewsets.ModelViewSet):
    queryset = FirearmType.objects.all()
    serializer_class = FirearmTypeSerializer
    permission_classes = [AllowAny]
    search_fields = ['name']
''',
    'licenses': '''from rest_framework import viewsets
from .models import LicenseHolder, StatusHistory
from .serializers import LicenseHolderSerializer, StatusHistorySerializer
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class LicenseHolderViewSet(viewsets.ModelViewSet):
    queryset = LicenseHolder.objects.all()
    serializer_class = LicenseHolderSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['current_status', 'outside_area_holder', 'gn_division']
    search_fields = ['full_name', 'nic', 'telephone_number']
    ordering_fields = ['created_at', 'full_name']

class StatusHistoryViewSet(viewsets.ModelViewSet):
    queryset = StatusHistory.objects.all()
    serializer_class = StatusHistorySerializer
    permission_classes = [AllowAny]
    filterset_fields = ['license_holder']
''',
    'firearms': '''from rest_framework import viewsets
from .models import Firearm
from .serializers import FirearmSerializer
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend

class FirearmViewSet(viewsets.ModelViewSet):
    queryset = Firearm.objects.all()
    serializer_class = FirearmSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['license_holder', 'firearm_type', 'is_active']
''',
    'renewals': '''from rest_framework import viewsets
from .models import Renewal, NonRenewalRecord
from .serializers import RenewalSerializer, NonRenewalRecordSerializer
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend

class RenewalViewSet(viewsets.ModelViewSet):
    queryset = Renewal.objects.all()
    serializer_class = RenewalSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['license_holder', 'license_year', 'renewal_status']

class NonRenewalRecordViewSet(viewsets.ModelViewSet):
    queryset = NonRenewalRecord.objects.all()
    serializer_class = NonRenewalRecordSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['license_holder', 'year']
''',
    'transfers': '''from rest_framework import viewsets
from .models import Transfer
from .serializers import TransferSerializer
from rest_framework.permissions import AllowAny

class TransferViewSet(viewsets.ModelViewSet):
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['previous_holder', 'firearm']
''',
    'documents': '''from rest_framework import viewsets
from .models import Document
from .serializers import DocumentSerializer
from rest_framework.permissions import AllowAny

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['related_license_holder', 'document_type']
''',
    'notifications': '''from rest_framework import viewsets
from .models import Notification, Reminder
from .serializers import NotificationSerializer, ReminderSerializer
from rest_framework.permissions import AllowAny

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['is_read', 'priority']

class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['is_completed', 'category']
''',
    'logs': '''from rest_framework import viewsets
from .models import AuditLog
from .serializers import AuditLogSerializer
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user', 'action', 'entity']
    search_fields = ['old_value', 'new_value', 'record_id']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
'''
}

urls = {
    'accounts': '''from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
''',
    'core': '''from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GNDivisionViewSet, FirearmTypeViewSet

router = DefaultRouter()
router.register(r'gn-divisions', GNDivisionViewSet)
router.register(r'firearm-types', FirearmTypeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
''',
    'licenses': '''from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LicenseHolderViewSet, StatusHistoryViewSet

router = DefaultRouter()
router.register(r'license-holders', LicenseHolderViewSet)
router.register(r'status-history', StatusHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
''',
    'firearms': '''from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FirearmViewSet

router = DefaultRouter()
router.register(r'firearms', FirearmViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
''',
    'renewals': '''from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RenewalViewSet, NonRenewalRecordViewSet

router = DefaultRouter()
router.register(r'renewals', RenewalViewSet)
router.register(r'non-renewals', NonRenewalRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
''',
    'transfers': '''from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransferViewSet

router = DefaultRouter()
router.register(r'transfers', TransferViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
''',
    'documents': '''from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet

router = DefaultRouter()
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
''',
    'notifications': '''from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, ReminderViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet)
router.register(r'reminders', ReminderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
''',
    'logs': '''from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuditLogViewSet

router = DefaultRouter()
router.register(r'audit-logs', AuditLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
'''
}

def create_files(data_dict, filename):
    for app, content in data_dict.items():
        filepath = os.path.join(BASE_DIR, app, filename)
        if os.path.exists(os.path.join(BASE_DIR, app)):
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

if __name__ == '__main__':
    create_files(serializers, 'serializers.py')
    create_files(views, 'views.py')
    create_files(urls, 'urls.py')
    print("Successfully generated API files.")
