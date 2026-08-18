import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      header: {
        republic: "Republic of Sri Lanka",
        secureSystem: "Secure Digital System",
        secretariat: "Panduwasnuwara Divisional Secretariat",
        title: "Firearm License Data Management System",
        description: "Secure data repository established for accurate management of official licensee information."
      },
      tabs: {
        newRecord: "New Record",
        editRecord: "Edit Record",
        savedRecords: "Saved Records",
        settings: "Settings",
        exportExcel: "Excel Export"
      },
      login: {
        title: "Sri Lanka Police",
        subtitle: "Firearm License Management System",
        username: "Username",
        usernamePlaceholder: "Enter username",
        password: "Password",
        passwordPlaceholder: "Enter password",
        loginBtn: "Login",
        errorEmpty: "Please enter username and password",
        errorInvalid: "Invalid username or password",
        success: "Login successful!"
      },
      summary: {
        totalLicenses: "Total Licenses",
        gnDivisions: "GN Divisions",
        active: "Active",
        notRenewed: "Not Renewed",
        transferred: "Transferred",
        deceased: "Deceased"
      },
      search: {
        placeholder: "Search by Name, NIC, or Firearm No...",
        allGN: "All GN Divisions",
        allTypes: "All Firearm Types",
        allStatus: "All Statuses",
        reset: "Reset Filters"
      },
      form: {
        mandatory: "* Mandatory fields",
        section1: "01 Personal Information",
        section2: "02 Birthdate & Age Info",
        section3: "03 Firearm & License Info",
        section4: "04 Current Status & Other Info",
        photoLabel: "Upload Photo (JPG / PNG)",
        changePhoto: "Change Photo",
        choosePhoto: "Choose Photo",
        removePhoto: "Remove Photo",
        fullName: "Full Name *",
        nic: "NIC Number *",
        telephone: "Telephone Number",
        whatsapp: "WhatsApp Number",
        address: "Address",
        gnDivision: "GN Division *",
        dob: "Date of Birth *",
        age65: "Date of 65th Birthday",
        ageHint: "This date is calculated automatically based on the DOB.",
        firearmType: "Firearm Type *",
        firearmNumber: "Firearm Number *",
        firstLicenseYear: "First Licensed Year",
        renewal: "License Renewal *",
        reasonPlaceholder: "Reason for not renewing",
        currentStatus: "Current Status",
        statusModificationDate: "Date of Modification",
        statusReason: "Description",
        statusRemarks: "Status Remarks & Details",
        transferDetails: "Firearm Transfer Details",
        specialInfo: "Other Special Information",
        outsideResident: "Is the licensee a resident outside Panduwasnuwara but owns land here?",
        yes: "Yes",
        no: "No",
        outsideAddress: "Current Residential Address",
        landDetails: "Land/Location Details in this Division",
        select: "Select"
      },
      status: {
        active: "Active",
        deceased: "Deceased",
        transferred: "Transferred",
        not_renewed: "Not Renewed",
        other: "Other"
      },
      actions: {
        save: "Save Record",
        saving: "Saving...",
        update: "Update Record",
        updating: "Updating...",
        cancel: "Cancel",
        clear: "Clear Form",
        edit: "Edit",
        delete: "Delete",
        view: "View"
      },
      errors: {
        fullName: "Full name is required.",
        nic: "NIC is required.",
        gnDivision: "GN Division is required.",
        firearmType: "Firearm Type is required.",
        firearmNumber: "Firearm Number is required.",
        phone: "Invalid phone number.",
        dobFuture: "DOB cannot be a future date.",
        dobReq: "Date of birth is required.",
        apiError: "Could not connect to data service.",
        retry: "Try Again",
        confirmClear: "Are you sure you want to clear unsaved changes?",
        duplicateNIC: "This NIC number is already in the system.",
        duplicateFirearm: "This Firearm Number is already in the system.",
        saveFailed: "Failed to save the record. Please try again.",
        saveSuccess: "Record saved successfully.",
        updateSuccess: "Record updated successfully."
      },
      table: {
        actions: "Actions",
        noRecords: "No records found.",
        deleteConfirmTitle: "Confirm Deletion",
        deleteConfirmText: "Are you sure you want to delete this record? This action cannot be undone.",
        deleteSuccess: "Record deleted successfully.",
        deleteFailed: "Failed to delete record.",
        exportSuccess: "Excel report downloaded successfully.",
        exportFailed: "Failed to export report.",
        exportEmpty: "No records available to export.",
        exporting: "Exporting records..."
      },
      view: {
        recordDetails: "Licensee Details",
        close: "Close"
      },
      admin: {
        manageGNDivisions: "Manage GN Divisions",
        newGNDivision: "Add New GN Division",
        gnPlaceholder: "Enter GN Division Name",
        addBtn: "Add Division",
        updateBtn: "Update Division",
        cancelBtn: "Cancel",
        existingGNDivisions: "Existing GN Divisions",
        noGnDivisions: "No GN Divisions available. Please add some.",
        addSuccess: "GN Division added successfully.",
        updateSuccess: "GN Division updated successfully.",
        addError: "Failed to add GN Division.",
        addErrorDuplicate: "This GN Division already exists.",
        deleteConfirmText: "Are you sure you want to delete this GN Division?",
        deleteSuccess: "GN Division deleted successfully.",
        deleteError: "Failed to delete. It might be used by existing records."
      }
    }
  },
  si: {
    translation: {
      header: {
        republic: "ශ්‍රී ලංකා ජනරජය | Republic of Sri Lanka",
        secureSystem: "ආරක්ෂිත ඩිජිටල් පද්ධතිය (Secure System)",
        secretariat: "පඬුවස්නුවර ප්‍රාදේශීය ලේකම් කාර්යාලය",
        title: "ගිනිඅවි බලපත්‍ර දත්ත කළමනාකරණ පද්ධතිය",
        description: "නිල බලපත්‍රලාභීන්ගේ තොරතුරු නිවැරදිව කළමනාකරණය කිරීම සඳහා ස්ථාපිත ආරක්ෂිත දත්ත ගොනුව."
      },
      tabs: {
        newRecord: "නව වාර්තාවක්",
        editRecord: "වාර්තාව සංස්කරණය",
        savedRecords: "සුරැකි වාර්තා",
        settings: "සැකසුම්",
        exportExcel: "Excel වාර්තා"
      },
      login: {
        title: "ශ්‍රී ලංකා පොලීසිය",
        subtitle: "ගිනිඅවි බලපත්‍ර කළමනාකරණ පද්ධතිය",
        username: "පරිශීලක නාමය",
        usernamePlaceholder: "පරිශීලක නාමය ඇතුලත් කරන්න",
        password: "මුරපදය",
        passwordPlaceholder: "මුරපදය ඇතුලත් කරන්න",
        loginBtn: "ඇතුළු වන්න",
        errorEmpty: "කරුණාකර පරිශීලක නාමය සහ මුරපදය ලබා දෙන්න",
        errorInvalid: "පරිශීලක නාමය හෝ මුරපදය වැරදියි",
        success: "සාර්ථකව ඇතුළු විය!"
      },
      summary: {
        totalLicenses: "මුළු බලපත්‍ර",
        gnDivisions: "ග්‍රාම නිලධාරී වසම්",
        active: "සක්‍රීය",
        notRenewed: "අලුත් නොකළ",
        transferred: "පවරන ලද",
        deceased: "මියගිය"
      },
      search: {
        placeholder: "නම, ජා.හැ.අ හෝ ගිනිඅවි අංකයෙන් සොයන්න...",
        allGN: "සියලුම ග්‍රාම නිලධාරී වසම්",
        allTypes: "සියලුම ගිනිඅවි වර්ග",
        allStatus: "සියලුම තත්ත්වයන්",
        reset: "Reset Filters"
      },
      form: {
        mandatory: "* ලකුණ සහිත තොරතුරු අනිවාර්යයි",
        section1: "01 පුද්ගලික තොරතුරු",
        section2: "02 උපන්දිනය සහ වයස් තොරතුරු",
        section3: "03 ගිනිඅවි සහ බලපත්‍ර තොරතුරු",
        section4: "04 වර්තමාන තත්ත්වය සහ වෙනත් තොරතුරු",
        photoLabel: "ඡායාරූපය ඇතුළත් කරන්න (JPG / PNG)",
        changePhoto: "ඡායාරූපය වෙනස් කරන්න",
        choosePhoto: "ඡායාරූපයක් තෝරන්න",
        removePhoto: "ඡායාරූපය ඉවත් කරන්න",
        fullName: "සම්පූර්ණ නම *",
        nic: "ජාතික හැඳුනුම්පත් අංකය *",
        telephone: "දුරකථන අංකය",
        whatsapp: "වට්ස්ඇප් අංකය (WhatsApp)",
        address: "ලිපිනය",
        gnDivision: "ග්‍රාම නිලධාරී කොට්ඨාසය *",
        dob: "උපන්දිනය *",
        age65: "අවුරුදු 65 සම්පූර්ණ වන දිනය",
        ageHint: "උපන්දිනය අනුව මෙම දිනය ස්වයංක්‍රීයව ගණනය වේ.",
        firearmType: "ගිනිඅවි වර්ගය *",
        firearmNumber: "ගිනිඅවි අංකය *",
        firstLicenseYear: "මුලින්ම බලපත්‍ර ලද වර්ෂය",
        renewal: "බලපත්‍ර අලුත් කිරීම *",
        reasonPlaceholder: "අලුත් නොකිරීමට හේතුව මෙහි ඇතුළත් කරන්න",
        currentStatus: "වර්තමාන තත්ත්වය",
        statusModificationDate: "සංශෝධනය වූ දිනය",
        statusReason: "විස්තරය",
        transferDetails: "ගිනිඅවිය පැවරීම පිළිබඳ විස්තර",
        specialInfo: "වෙනත් විශේෂ තොරතුරු",
        outsideResident: "පඬුවස්නුවරින් පිටත පදිංචි, මෙම බලප්‍රදේශය තුළ ඉඩම් හිමි අයෙක්ද?",
        yes: "ඔව්",
        no: "නැත",
        outsideAddress: "වර්තමාන පදිංචි ලිපිනය",
        landDetails: "මෙම බලප්‍රදේශය තුළ ඉඩම් / ස්ථාන විස්තර",
        select: "තෝරන්න"
      },
      status: {
        active: "සක්‍රීය",
        deceased: "මියගොස් ඇත",
        transferred: "පවරා ඇත",
        not_renewed: "බලපත්‍රය අලුත් කර නැත",
        other: "වෙනත්"
      },
      actions: {
        save: "වාර්තාව සුරකින්න",
        saving: "සුරැකෙමින් පවතී...",
        update: "වාර්තාව යාවත්කාලීන කරන්න",
        updating: "යාවත්කාලීන වෙමින් පවතී...",
        cancel: "අවලංගු කරන්න",
        clear: "මකන්න",
        edit: "සංස්කරණය",
        delete: "මකන්න",
        view: "බලන්න"
      },
      errors: {
        fullName: "සම්පූර්ණ නම ඇතුළත් කරන්න.",
        nic: "ජාතික හැඳුනුම්පත් අංකය ඇතුළත් කරන්න.",
        gnDivision: "ග්‍රාම නිලධාරී කොට්ඨාසය තෝරන්න.",
        firearmType: "ගිනිඅවි වර්ගය තෝරන්න.",
        firearmNumber: "ගිනිඅවි අංකය ඇතුළත් කරන්න.",
        phone: "වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න.",
        dobFuture: "උපන්දිනය අනාගත දිනයක් විය නොහැක.",
        dobReq: "උපන්දිනය ඇතුළත් කරන්න.",
        apiError: "දත්ත සේවාව සමඟ සම්බන්ධ වීමට නොහැකි විය.",
        retry: "නැවත උත්සාහ කරන්න",
        confirmClear: "සුරැකී නොමැති වෙනස්කම් ඉවත් කිරීමට ඔබට විශ්වාසද?",
        duplicateNIC: "මෙම NIC අංකය දැනටමත් පද්ධතියේ ඇත.",
        duplicateFirearm: "මෙම ගිනිඅවි අංකය දැනටමත් පද්ධතියේ ඇත.",
        saveFailed: "වාර්තාව සුරැකීමට නොහැකි විය. නැවත උත්සාහ කරන්න.",
        saveSuccess: "වාර්තාව සාර්ථකව සුරකින ලදී.",
        updateSuccess: "වාර්තාව සාර්ථකව යාවත්කාලීන කරන ලදී."
      },
      table: {
        actions: "ක්‍රියා",
        noRecords: "වාර්තා කිසිවක් හමු නොවීය.",
        deleteConfirmTitle: "මකා දැමීම තහවුරු කරන්න",
        deleteConfirmText: "මෙම වාර්තාව මකා දැමීමට ඔබට විශ්වාසද? මෙය නැවත ලබාගත නොහැක.",
        deleteSuccess: "වාර්තාව සාර්ථකව මකා දමන ලදී.",
        deleteFailed: "වාර්තාව මකා දැමීමට නොහැකි විය.",
        exportSuccess: "Excel වාර්තාව සාර්ථකව බාගත කරන ලදී.",
        exportFailed: "වාර්තා අපනයනය කිරීමට නොහැකි විය.",
        exportEmpty: "අපනයනය කිරීමට වාර්තා කිසිවක් නොමැත.",
        exporting: "වාර්තා අපනයනය කරමින් පවතී..."
      },
      view: {
        recordDetails: "බලපත්‍රලාභී විස්තර",
        close: "වහන්න"
      },
      admin: {
        manageGNDivisions: "ග්‍රාම නිලධාරී වසම් කළමනාකරණය",
        newGNDivision: "නව ග්‍රාම නිලධාරී වසමක් එකතු කරන්න",
        gnPlaceholder: "වසමේ නම ඇතුළත් කරන්න",
        addBtn: "එකතු කරන්න",
        updateBtn: "යාවත්කාලීන කරන්න",
        cancelBtn: "අවලංගු කරන්න",
        existingGNDivisions: "දැනට ඇති වසම්",
        noGnDivisions: "කිසිදු වසමක් නොමැත. කරුණාකර අලුතින් එකතු කරන්න.",
        addSuccess: "ග්‍රාම නිලධාරී වසම සාර්ථකව එකතු කරන ලදී.",
        updateSuccess: "ග්‍රාම නිලධාරී වසම සාර්ථකව යාවත්කාලීන කරන ලදී.",
        addError: "වසම එකතු කිරීමට නොහැකි විය.",
        addErrorDuplicate: "මෙම වසම දැනටමත් පද්ධතියේ ඇත.",
        deleteConfirmText: "මෙම වසම මකා දැමීමට ඔබට විශ්වාසද?",
        deleteSuccess: "වසම සාර්ථකව මකා දමන ලදී.",
        deleteError: "මකා දැමීමට නොහැකි විය. සමහරවිට මෙය වාර්තා සඳහා භාවිතා කර ඇත."
      }
    }
  },
  ta: {
    translation: {
      header: {
        republic: "இலங்கை குடியரசு | Republic of Sri Lanka",
        secureSystem: "பாதுகாப்பான டிஜிட்டல் அமைப்பு",
        secretariat: "பண்டுவஸ்நுவர பிரதேச செயலகம்",
        title: "துப்பாக்கி உரிம தரவு மேலாண்மை அமைப்பு",
        description: "உத்தியோகபூர்வ உரிமதாரர் தகவல்களை துல்லியமாக நிர்வகிக்க நிறுவப்பட்ட பாதுகாப்பான தரவுத்தளம்."
      },
      tabs: {
        newRecord: "புதிய பதிவு",
        editRecord: "பதிவை திருத்து",
        savedRecords: "சேமிக்கப்பட்ட பதிவுகள்",
        settings: "அமைப்புகள் (Settings)",
        exportExcel: "Excel ஏற்றுமதி"
      },
      summary: {
        totalLicenses: "மொத்த உரிமங்கள்",
        gnDivisions: "கிரா.உ பிரிவுகள்",
        active: "செயலில்",
        notRenewed: "புதுப்பிக்கப்படவில்லை",
        transferred: "மாற்றப்பட்டது",
        deceased: "இறந்தவர்"
      },
      search: {
        placeholder: "பெயர், அ.அ.எண் அல்லது துப்பாக்கி எண் மூலம் தேடவும்...",
        allGN: "அனைத்து கிரா.உ பிரிவுகள்",
        allTypes: "அனைத்து துப்பாக்கி வகைகள்",
        allStatus: "அனைத்து நிலைகள்",
        reset: "வடிகட்டிகளை மீட்டமை"
      },
      form: {
        mandatory: "* கட்டாய தகவல்கள்",
        section1: "01 தனிப்பட்ட தகவல்கள்",
        section2: "02 பிறந்த தேதி மற்றும் வயது விபரம்",
        section3: "03 துப்பாக்கி மற்றும் உரிம விபரம்",
        section4: "04 தற்போதைய நிலை மற்றும் பிற தகவல்",
        photoLabel: "புகைப்படத்தை பதிவேற்றவும் (JPG / PNG)",
        changePhoto: "புகைப்படத்தை மாற்று",
        choosePhoto: "புகைப்படத்தை தேர்வு செய்",
        removePhoto: "புகைப்படத்தை அகற்று",
        fullName: "முழு பெயர் *",
        nic: "தேசிய அடையாள அட்டை எண் *",
        telephone: "தொலைபேசி எண்",
        whatsapp: "வாட்ஸ்அப் எண் (WhatsApp)",
        address: "முகவரி",
        gnDivision: "கிராம உத்தியோகத்தர் பிரிவு *",
        dob: "பிறந்த தேதி *",
        age65: "65 வது பிறந்தநாள் தேதி",
        ageHint: "பிறந்த தேதியின் அடிப்படையில் இந்த தேதி தானாகவே கணக்கிடப்படுகிறது.",
        firearmType: "துப்பாக்கி வகை *",
        firearmNumber: "துப்பாக்கி எண் *",
        firstLicenseYear: "முதல் உரிமம் பெற்ற ஆண்டு",
        renewal: "உரிமம் புதுப்பித்தல் *",
        reasonPlaceholder: "புதுப்பிக்காததற்கான காரணத்தை இங்கே உள்ளிடவும்",
        currentStatus: "தற்போதைய நிலை",
        statusModificationDate: "மாற்றியமைக்கப்பட்ட தேதி",
        statusReason: "விளக்கம்",
        specialInfo: "பிற சிறப்பு தகவல்கள்",
        outsideResident: "பண்டுவஸ்நுவரவிற்கு வெளியே வசிப்பவர் ஆனால் இங்கு நிலம் வைத்திருக்கிறாரா?",
        yes: "ஆம்",
        no: "இல்லை",
        outsideAddress: "தற்போதைய குடியிருப்பு முகவரி",
        landDetails: "இந்த பிரிவில் உள்ள நிலம் / இருப்பிட விவரங்கள்",
        select: "தேர்வு செய்க"
      },
      status: {
        active: "செயலில்",
        deceased: "இறந்தவர்",
        transferred: "மாற்றப்பட்டது",
        not_renewed: "புதுப்பிக்கப்படவில்லை",
        other: "பிற"
      },
      actions: {
        save: "பதிவை சேமி",
        saving: "சேமிக்கிறது...",
        update: "பதிவை புதுப்பி",
        updating: "புதுப்பிக்கிறது...",
        cancel: "ரத்து செய்",
        clear: "அழி",
        edit: "திருத்து",
        delete: "நீக்கு",
        view: "பார்வை"
      },
      errors: {
        fullName: "முழு பெயர் தேவை.",
        nic: "தேசிய அடையாள அட்டை எண் தேவை.",
        gnDivision: "கிராம உத்தியோகத்தர் பிரிவு தேவை.",
        firearmType: "துப்பாக்கி வகை தேவை.",
        firearmNumber: "துப்பாக்கி எண் தேவை.",
        phone: "தவறான தொலைபேசி எண்.",
        dobFuture: "பிறந்த தேதி எதிர்கால தேதியாக இருக்கக்கூடாது.",
        dobReq: "பிறந்த தேதி தேவை.",
        apiError: "தரவு சேவையுடன் இணைக்க முடியவில்லை.",
        retry: "மீண்டும் முயற்சிக்கவும்",
        confirmClear: "சேமிக்கப்படாத மாற்றங்களை அழிக்க விரும்புகிறீர்களா?",
        duplicateNIC: "இந்த தேசிய அடையாள அட்டை எண் ஏற்கனவே அமைப்பில் உள்ளது.",
        duplicateFirearm: "இந்த துப்பாக்கி எண் ஏற்கனவே அமைப்பில் உள்ளது.",
        saveFailed: "பதிவைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        saveSuccess: "பதிவு வெற்றிகரமாக சேமிக்கப்பட்டது.",
        updateSuccess: "பதிவு வெற்றிகரமாக புதுப்பிக்கப்பட்டது."
      },
      table: {
        actions: "செயல்கள்",
        noRecords: "பதிவுகள் எதுவும் காணப்படவில்லை.",
        deleteConfirmTitle: "நீக்குதலை உறுதிப்படுத்தவும்",
        deleteConfirmText: "இந்த பதிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா? இதை மீட்டெடுக்க முடியாது.",
        deleteSuccess: "பதிவு வெற்றிகரமாக நீக்கப்பட்டது.",
        deleteFailed: "பதிவை நீக்க முடியவில்லை.",
        exportSuccess: "Excel அறிக்கை வெற்றிகரமாக பதிவிறக்கப்பட்டது.",
        exportFailed: "அறிக்கையை ஏற்றுமதி செய்ய முடியவில்லை.",
        exportEmpty: "ஏற்றுமதி செய்ய பதிவுகள் எதுவும் இல்லை.",
        exporting: "பதிவுகள் ஏற்றுமதி செய்யப்படுகின்றன..."
      },
      view: {
        recordDetails: "உரிமதாரர் விவரங்கள்",
        close: "மூடு"
      },
      admin: {
        manageGNDivisions: "கிராம உத்தியோகத்தர் பிரிவுகளை நிர்வகிக்கவும்",
        newGNDivision: "புதிய பிரிவைச் சேர்க்கவும்",
        gnPlaceholder: "பிரிவின் பெயரை உள்ளிடவும்",
        addBtn: "சேர்",
        updateBtn: "புதுப்பி",
        cancelBtn: "ரத்து செய்",
        existingGNDivisions: "தற்போதுள்ள பிரிவுகள்",
        noGnDivisions: "பிரிவுகள் எதுவும் இல்லை. தயவுசெய்து சேர்க்கவும்.",
        addSuccess: "பிரிவு வெற்றிகரமாக சேர்க்கப்பட்டது.",
        updateSuccess: "பிரிவு வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
        addError: "பிரிவைச் சேர்க்க முடியவில்லை.",
        addErrorDuplicate: "இந்த பிரிவு ஏற்கனவே உள்ளது.",
        deleteConfirmText: "இந்த பிரிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா?",
        deleteSuccess: "பிரிவு வெற்றிகரமாக நீக்கப்பட்டது.",
        deleteError: "நீக்க முடியவில்லை. இது பதிவுகளால் பயன்படுத்தப்படலாம்."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "si", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
