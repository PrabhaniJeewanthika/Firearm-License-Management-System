from rest_framework import viewsets
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
