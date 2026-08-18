from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LicenseRecordViewSet, SummaryView

router = DefaultRouter()
router.register(r'records', LicenseRecordViewSet, basename='record')

urlpatterns = [
    path('summary/', SummaryView.as_view(), name='summary'),
    path('', include(router.urls)),
]
