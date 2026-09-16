from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from django.db.models import Q
from .models import LicenseRecord, RecordAttachment
from .serializers import LicenseRecordSerializer, RecordAttachmentSerializer


def _handle_attachments(request, record):
    """
    Process attachment_file_N / attachment_name_N fields from multipart FormData.
    Also handles delete_attachment_ids (comma-separated IDs to remove).
    """
    # Delete removed attachments
    delete_ids_raw = request.data.get('delete_attachment_ids', '')
    if delete_ids_raw:
        ids_to_delete = [int(i) for i in delete_ids_raw.split(',') if i.strip().isdigit()]
        RecordAttachment.objects.filter(id__in=ids_to_delete, record=record).delete()

    # Save new attachments (attachment_file_0, attachment_name_0, ...)
    index = 0
    while True:
        file_key = f'attachment_file_{index}'
        name_key = f'attachment_name_{index}'
        f = request.FILES.get(file_key)
        name = request.data.get(name_key, '').strip()
        if f is None and not name:
            break
        if f is not None:
            RecordAttachment.objects.create(
                record=record,
                file_name=name or f.name,
                file=f
            )
        index += 1


class LicenseRecordViewSet(viewsets.ModelViewSet):
    queryset = LicenseRecord.objects.all()
    serializer_class = LicenseRecordSerializer
    permission_classes = [AllowAny]
    request: Request  # type: ignore[assignment]

    def get_queryset(self):  # type: ignore[override]
        queryset = LicenseRecord.objects.filter(is_archived=False).order_by('-created_at')

        # Filters
        gn_division = self.request.query_params.get('gn_division')
        if gn_division:
            queryset = queryset.filter(gn_division_id=gn_division)

        firearm_type = self.request.query_params.get('firearm_type')
        if firearm_type:
            queryset = queryset.filter(firearm_type_id=firearm_type)

        current_status = self.request.query_params.get('current_status')
        if current_status:
            if current_status == 'active':
                queryset = queryset.exclude(current_status_info__deceased__selected=True)
                queryset = queryset.exclude(current_status_info__transferred__selected=True)
            elif current_status == 'deceased':
                queryset = queryset.filter(current_status_info__deceased__selected=True)
            elif current_status == 'transferred':
                queryset = queryset.filter(current_status_info__transferred__selected=True)
            elif current_status == 'other':
                queryset = queryset.filter(current_status_info__other__selected=True)

        renewal_status = self.request.query_params.get('renewal_status')
        if renewal_status:
            queryset = queryset.filter(renewal_status=renewal_status)

        outside_area_holder = self.request.query_params.get('outside_area_holder')
        if outside_area_holder:
            if outside_area_holder.lower() == 'true':
                queryset = queryset.filter(outside_area_holder=True)
            elif outside_area_holder.lower() == 'false':
                queryset = queryset.filter(outside_area_holder=False)

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(nic__icontains=search) |
                Q(firearm_number__icontains=search) |
                Q(telephone__icontains=search) |
                Q(gn_division__name__icontains=search)
            )

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        record = serializer.save()
        _handle_attachments(request, record)
        out = self.get_serializer(record)
        return Response(out.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        record = serializer.save()
        _handle_attachments(request, record)
        out = self.get_serializer(record)
        return Response(out.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_archived = True
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RecordAttachmentDeleteView(APIView):
    """DELETE /api/attachments/<pk>/"""
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        try:
            att = RecordAttachment.objects.get(pk=pk)
            att.file.delete(save=False)
            att.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except RecordAttachment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class SummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        active_records = LicenseRecord.objects.filter(is_archived=False)

        total = active_records.count()
        not_renewed = active_records.filter(renewal_status='not_renewed').count()

        transferred = active_records.filter(current_status_info__transferred__selected=True).count()
        deceased = active_records.filter(current_status_info__deceased__selected=True).count()

        active = total - transferred - deceased
        if active < 0:
            active = 0

        return Response({
            "total": total,
            "active": active,
            "not_renewed": not_renewed,
            "transferred": transferred,
            "deceased": deceased
        })
