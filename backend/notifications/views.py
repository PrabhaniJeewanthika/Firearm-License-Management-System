from rest_framework import viewsets
from .models import Notification, Reminder
from .serializers import NotificationSerializer, ReminderSerializer
from rest_framework.permissions import AllowAny

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['is_read', 'priority']

class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['is_completed', 'category']
