from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GNDivisionViewSet, FirearmTypeViewSet

router = DefaultRouter()
router.register(r'gn-divisions', GNDivisionViewSet)
router.register(r'firearm-types', FirearmTypeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
