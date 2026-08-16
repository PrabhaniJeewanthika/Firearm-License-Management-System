from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LicenseHolderViewSet, StatusHistoryViewSet

router = DefaultRouter()
router.register(r'license-holders', LicenseHolderViewSet)
router.register(r'status-history', StatusHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
