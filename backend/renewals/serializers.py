from rest_framework import serializers
from .models import Renewal, NonRenewalRecord

class RenewalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Renewal
        fields = '__all__'

class NonRenewalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonRenewalRecord
        fields = '__all__'
