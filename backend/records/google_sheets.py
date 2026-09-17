import os
import json
import logging
import gspread
from google.oauth2.service_account import Credentials

logger = logging.getLogger(__name__)

def get_gspread_client():
    creds_file = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    if not creds_file:
        return None
    
    # Handle relative paths from the backend dir
    if not os.path.isabs(creds_file):
        from django.conf import settings
        creds_file = os.path.join(settings.BASE_DIR, creds_file)

    if not os.path.exists(creds_file):
        logger.error(f"Google credentials file not found: {creds_file}")
        return None

    try:
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        credentials = Credentials.from_service_account_file(
            creds_file, scopes=scopes
        )
        return gspread.authorize(credentials)
    except Exception as e:
        logger.error(f"Failed to authenticate with Google Sheets: {e}")
        return None

def sync_record_to_sheet(record):
    sheet_id = os.getenv('GOOGLE_SHEET_ID')
    if not sheet_id:
        return

    client = get_gspread_client()
    if not client:
        return

    try:
        spreadsheet = client.open_by_key(sheet_id)
        worksheet = spreadsheet.sheet1
        
        # Format the date properly if it exists
        date_issue = str(record.first_licensed_year) if record.first_licensed_year else ''
        
        # Prepare the row data
        row_data = [
            str(record.id),
            record.firearm_number or '',
            record.full_name or '',
            record.nic or '',
            record.telephone or '',
            record.address or '',
            date_issue,
            record.firearm_type.name_en if record.firearm_type else '',
            record.renewal_status or '',
            json.dumps(record.dynamic_field_data, ensure_ascii=False) if getattr(record, 'dynamic_field_data', None) else ''
        ]

        # Get all IDs in the first column
        try:
            col_values = worksheet.col_values(1)
        except Exception:
            col_values = []
        
        # If headers are missing, we can add them
        if not col_values or col_values[0] != "ID":
            headers = ["ID", "License No", "Full Name", "NIC", "Contact No", "Address", "Date of Issue", "License Type", "Status", "Additional Data (JSON)"]
            if not col_values:
                worksheet.append_row(headers)
                col_values = ["ID"]
            else:
                worksheet.insert_row(headers, index=1)
                col_values.insert(0, "ID")
        
        str_id = str(record.id)
        if str_id in col_values:
            row_idx = col_values.index(str_id) + 1
            # Pass range_name to avoid warnings in newer gspread versions
            worksheet.update([row_data], range_name=f"A{row_idx}")
            logger.info(f"Updated record {record.id} in Google Sheets (Row {row_idx}).")
        else:
            worksheet.append_row(row_data)
            logger.info(f"Appended record {record.id} to Google Sheets.")
            
    except Exception as e:
        logger.error(f"Error syncing record to Google Sheets: {e}")
