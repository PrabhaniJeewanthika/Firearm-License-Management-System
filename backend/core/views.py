from rest_framework import viewsets
from .models import GNDivision, FirearmType
from .serializers import GNDivisionSerializer, FirearmTypeSerializer
from rest_framework.permissions import IsAuthenticated

class GNDivisionViewSet(viewsets.ModelViewSet):
    queryset = GNDivision.objects.filter(is_active=True)
    serializer_class = GNDivisionSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['name']

class FirearmTypeViewSet(viewsets.ModelViewSet):
    queryset = FirearmType.objects.filter(is_active=True)
    serializer_class = FirearmTypeSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['name_si', 'name_en']

