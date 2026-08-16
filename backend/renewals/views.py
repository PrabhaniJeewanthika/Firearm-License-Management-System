from rest_framework import viewsets
from .models import Renewal, NonRenewalRecord
from .serializers import RenewalSerializer, NonRenewalRecordSerializer
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

class RenewalViewSet(viewsets.ModelViewSet):
    queryset = Renewal.objects.all()
    serializer_class = RenewalSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['license_holder', 'license_year', 'renewal_status']

class NonRenewalRecordViewSet(viewsets.ModelViewSet):
    queryset = NonRenewalRecord.objects.all()
    serializer_class = NonRenewalRecordSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['license_holder', 'year']
