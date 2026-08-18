from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GNDivisionViewSet, FirearmTypeViewSet, CustomFormSectionViewSet, CustomFormFieldViewSet

router = DefaultRouter()
router.register(r'gn-divisions', GNDivisionViewSet)
router.register(r'firearm-types', FirearmTypeViewSet)
router.register(r'custom-sections', CustomFormSectionViewSet)
router.register(r'custom-fields', CustomFormFieldViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
