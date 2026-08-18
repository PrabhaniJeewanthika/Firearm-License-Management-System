from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, ReminderViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet)
router.register(r'reminders', ReminderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
