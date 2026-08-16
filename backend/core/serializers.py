from rest_framework import serializers
from .models import GNDivision, FirearmType

class GNDivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GNDivision
        fields = '__all__'

class FirearmTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirearmType
        fields = '__all__'
