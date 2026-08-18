from rest_framework import viewsets
from .models import Document
from .serializers import DocumentSerializer
from rest_framework.permissions import AllowAny

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['related_license_holder', 'document_type']
