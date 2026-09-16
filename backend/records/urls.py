from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LicenseRecordViewSet, SummaryView, RecordAttachmentDeleteView

router = DefaultRouter()
router.register(r'records', LicenseRecordViewSet, basename='record')

urlpatterns = [
    path('summary/', SummaryView.as_view(), name='summary'),
    path('attachments/<int:pk>/', RecordAttachmentDeleteView.as_view(), name='attachment-delete'),
    path('', include(router.urls)),
]
