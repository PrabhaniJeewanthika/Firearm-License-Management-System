import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import LicenseRecord
from .google_sheets import sync_record_to_sheet
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=LicenseRecord)
def sync_license_record(sender, instance, created, **kwargs):
    """
    Triggered every time a LicenseRecord is saved.
    We run the Google Sheets sync in a separate thread so it doesn't block the HTTP response.
    """
    def run_sync():
        try:
            sync_record_to_sheet(instance)
        except Exception as e:
            logger.error(f"Failed to sync record {instance.id} in background thread: {e}")

    thread = threading.Thread(target=run_sync)
    thread.start()
