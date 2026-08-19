from django.core.management.base import BaseCommand
from core.models import CustomFormSection, CustomFormField

class Command(BaseCommand):
    help = 'Seeds the database with the core dynamic form sections and fields'

    def handle(self, *args, **options):
        # Section 1: Personal Information
        sec1, _ = CustomFormSection.objects.get_or_create(
            title_si="පුද්ගලික තොරතුරු",
            title_en="Personal Information",
            defaults={"order": 1}
        )

        fields_sec1 = [
            {"system_name": "photo", "label_si": "ඡායාරූපය", "label_en": "Photo", "field_type": "image", "is_required": False},
            {"system_name": "full_name", "label_si": "සම්පූර්ණ නම", "label_en": "Full Name", "field_type": "text", "is_required": True},
            {"system_name": "nic", "label_si": "ජාතික හැඳුනුම්පත් අංකය", "label_en": "NIC", "field_type": "nic", "is_required": True},
            {"system_name": "telephone", "label_si": "දුරකථන අංකය", "label_en": "Telephone Number", "field_type": "phone", "is_required": True},
            {"system_name": "whatsapp_number", "label_si": "WhatsApp අංකය", "label_en": "WhatsApp Number", "field_type": "phone", "is_required": False},
            {"system_name": "address", "label_si": "ලිපිනය", "label_en": "Address", "field_type": "textarea", "is_required": True},
            {"system_name": "gn_division", "label_si": "ග්‍රාම නිලධාරී කොට්ඨාසය", "label_en": "GN Division", "field_type": "select", "is_required": True},
        ]

        # Section 2: Date of Birth and Age Info
        sec2, _ = CustomFormSection.objects.get_or_create(
            title_si="උපන්දිනය සහ වයස් තොරතුරු",
            title_en="Date of Birth and Age Information",
            defaults={"order": 2}
        )

        fields_sec2 = [
            {"system_name": "date_of_birth", "label_si": "උපන්දිනය", "label_en": "Date of Birth", "field_type": "date", "is_required": True},
            {"system_name": "sixty_fifth_birthday", "label_si": "අවුරුදු 65 සම්පූර්ණ වන දිනය", "label_en": "65th Birthday", "field_type": "autocalc_65", "is_required": False},
        ]

        # Section 3: Firearm and License Info
        sec3, _ = CustomFormSection.objects.get_or_create(
            title_si="ගිනිඅවි සහ බලපත්‍ර තොරතුරු",
            title_en="Firearm and License Information",
            defaults={"order": 3}
        )

        fields_sec3 = [
            {"system_name": "firearm_type", "label_si": "ගිනිඅවි වර්ගය", "label_en": "Firearm Type", "field_type": "select", "is_required": True},
            {"system_name": "firearm_number", "label_si": "ගිනිඅවි අංකය", "label_en": "Firearm Number", "field_type": "text", "is_required": True},
            {"system_name": "first_licensed_year", "label_si": "මුලින්ම බලපත්‍ර ලද වර්ෂය", "label_en": "First Licensed Year", "field_type": "number", "is_required": False},
            {"system_name": "renewal_history", "label_si": "බලපත්‍ර අලුත් කිරීම", "label_en": "Renewal History", "field_type": "renewal_history_grid", "is_required": True},
        ]

        # Section 4: Current Status and Other Info
        sec4, _ = CustomFormSection.objects.get_or_create(
            title_si="වර්තමාන තත්ත්වය සහ වෙනත් තොරතුරු",
            title_en="Current Status and Other Information",
            defaults={"order": 4}
        )

        fields_sec4 = [
            {"system_name": "current_status_info", "label_si": "වර්තමාන තත්ත්වය", "label_en": "Current Status", "field_type": "current_status_checkboxes", "is_required": False},
            {"system_name": "special_information", "label_si": "වෙනත් විශේෂ තොරතුරු", "label_en": "Special Information", "field_type": "textarea", "is_required": False},
            {"system_name": "outside_area_holder", "label_si": "පඬුවස්නුවරින් පිටත පදිංචි, මෙම බලප්‍රදේශය තුළ ඉඩම් හිමි අයෙක්ද?", "label_en": "Outside Area Holder?", "field_type": "boolean", "is_required": False},
            # Conditional fields based on outside_area_holder
            {"system_name": "outside_residential_address", "label_si": "පදිංචි ලිපිනය", "label_en": "Residential Address", "field_type": "textarea", "is_required": False, "depends_on_sys": "outside_area_holder", "depends_on_value": "true"},
            {"system_name": "land_location_details", "label_si": "පඬුවස්නුවර ඉඩමේ පිහිටීම", "label_en": "Land Location Details", "field_type": "textarea", "is_required": False, "depends_on_sys": "outside_area_holder", "depends_on_value": "true"},
        ]

        def process_fields(section, fields_data):
            for i, data in enumerate(fields_data):
                sys_name = data.pop('system_name')
                depends_on_sys = data.pop('depends_on_sys', None)
                depends_on_val = data.pop('depends_on_value', None)
                
                field, created = CustomFormField.objects.get_or_create(
                    system_name=sys_name,
                    defaults={
                        'section': section,
                        'label_si': data['label_si'],
                        'label_en': data['label_en'],
                        'field_type': data['field_type'],
                        'is_required': data['is_required'],
                        'order': i + 1
                    }
                )

                if depends_on_sys:
                    parent = CustomFormField.objects.filter(system_name=depends_on_sys).first()
                    if parent:
                        field.depends_on = parent
                        field.depends_on_value = depends_on_val
                        field.save()

                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created field: {sys_name}'))
                else:
                    self.stdout.write(f'Field already exists: {sys_name}')

        process_fields(sec1, fields_sec1)
        process_fields(sec2, fields_sec2)
        process_fields(sec3, fields_sec3)
        process_fields(sec4, fields_sec4)

        self.stdout.write(self.style.SUCCESS('Successfully seeded dynamic form fields!'))
