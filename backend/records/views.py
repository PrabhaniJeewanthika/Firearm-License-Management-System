from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from django.db.models import Q
from .models import LicenseRecord
from .serializers import LicenseRecordSerializer

class LicenseRecordViewSet(viewsets.ModelViewSet):
    queryset = LicenseRecord.objects.all()
    serializer_class = LicenseRecordSerializer
    permission_classes = [IsAuthenticated]
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
            queryset = queryset.filter(current_status=current_status)
            
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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_archived = True
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        active_records = LicenseRecord.objects.filter(is_archived=False)
        
        total = active_records.count()
        active = active_records.filter(current_status='active').count()
        not_renewed = active_records.filter(renewal_status='not_renewed').count()
        transferred = active_records.filter(current_status='transferred').count()
        deceased = active_records.filter(current_status='deceased').count()

        return Response({
            "total": total,
            "active": active,
            "not_renewed": not_renewed,
            "transferred": transferred,
            "deceased": deceased
        })
