from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FirearmViewSet

router = DefaultRouter()
router.register(r'firearms', FirearmViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
