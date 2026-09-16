from rest_framework import serializers
from .models import LicenseRecord, RecordAttachment
from core.models import GNDivision, FirearmType


class RecordAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = RecordAttachment
        fields = ['id', 'file_name', 'file', 'file_url', 'uploaded_at']
        read_only_fields = ['uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url if obj.file else None


class LicenseRecordSerializer(serializers.ModelSerializer):
    gn_division = serializers.PrimaryKeyRelatedField(queryset=GNDivision.objects.all())
    firearm_type = serializers.PrimaryKeyRelatedField(queryset=FirearmType.objects.all())
    attachments = RecordAttachmentSerializer(many=True, read_only=True)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.gn_division:
            rep['gn_division_detail'] = {
                'id': instance.gn_division.id,
                'name': instance.gn_division.name
            }
        if instance.firearm_type:
            rep['firearm_type_detail'] = {
                'id': instance.firearm_type.id,
                'name_si': instance.firearm_type.name_si,
                'name_en': instance.firearm_type.name_en
            }
        return rep

    class Meta:
        model = LicenseRecord
        fields = '__all__'
