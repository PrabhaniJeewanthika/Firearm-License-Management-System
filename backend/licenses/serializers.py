from rest_framework import serializers
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
