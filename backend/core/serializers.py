from rest_framework import serializers
from .models import GNDivision, FirearmType, CustomFormSection, CustomFormField, LicenseRenewalYear

class LicenseRenewalYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = LicenseRenewalYear
        fields = '__all__'

class GNDivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GNDivision
        fields = '__all__'

class FirearmTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirearmType
        fields = '__all__'

class CustomFormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomFormField
        fields = '__all__'

class CustomFormSectionSerializer(serializers.ModelSerializer):
    fields = CustomFormFieldSerializer(many=True, read_only=True)

    class Meta:
        model = CustomFormSection
        fields = '__all__'
