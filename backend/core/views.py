from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import GNDivision, FirearmType, CustomFormSection, CustomFormField, LicenseRenewalYear
from .serializers import GNDivisionSerializer, FirearmTypeSerializer, CustomFormSectionSerializer, CustomFormFieldSerializer, LicenseRenewalYearSerializer

class LicenseRenewalYearViewSet(viewsets.ModelViewSet):
    queryset = LicenseRenewalYear.objects.filter(is_active=True)
    serializer_class = LicenseRenewalYearSerializer
    permission_classes = [AllowAny]
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

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

from django.db.models import Prefetch

class CustomFormSectionViewSet(viewsets.ModelViewSet):
    queryset = CustomFormSection.objects.filter(is_active=True).prefetch_related(
        Prefetch('fields', queryset=CustomFormField.objects.filter(is_active=True))
    )
    serializer_class = CustomFormSectionSerializer
    permission_classes = [AllowAny]
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CustomFormFieldViewSet(viewsets.ModelViewSet):
    queryset = CustomFormField.objects.filter(is_active=True)
    serializer_class = CustomFormFieldSerializer
    permission_classes = [AllowAny]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
