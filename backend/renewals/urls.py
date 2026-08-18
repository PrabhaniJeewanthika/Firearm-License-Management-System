from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RenewalViewSet, NonRenewalRecordViewSet

router = DefaultRouter()
router.register(r'renewals', RenewalViewSet)
router.register(r'non-renewals', NonRenewalRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
