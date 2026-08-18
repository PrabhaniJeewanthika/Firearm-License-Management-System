from rest_framework import viewsets
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
