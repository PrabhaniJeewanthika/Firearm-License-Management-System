from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import GNDivision, FirearmType
from .serializers import GNDivisionSerializer, FirearmTypeSerializer
from rest_framework.permissions import AllowAny

class GNDivisionViewSet(viewsets.ModelViewSet):
    queryset = GNDivision.objects.filter(is_active=True)
    serializer_class = GNDivisionSerializer
    permission_classes = [AllowAny]
    search_fields = ['name']

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class FirearmTypeViewSet(viewsets.ModelViewSet):
    queryset = FirearmType.objects.filter(is_active=True)
    serializer_class = FirearmTypeSerializer
    permission_classes = [AllowAny]
    search_fields = ['name_si', 'name_en']

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

