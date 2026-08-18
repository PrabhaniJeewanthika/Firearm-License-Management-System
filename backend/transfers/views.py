from rest_framework import viewsets
from .models import Transfer
from .serializers import TransferSerializer
from rest_framework.permissions import IsAuthenticated

class TransferViewSet(viewsets.ModelViewSet):
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['previous_holder', 'firearm']
