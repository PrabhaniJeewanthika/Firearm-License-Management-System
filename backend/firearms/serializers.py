from rest_framework import serializers
from .models import Firearm

class FirearmSerializer(serializers.ModelSerializer):
    firearm_type_name = serializers.CharField(source='firearm_type.name', read_only=True)

    class Meta:
        model = Firearm
        fields = '__all__'
