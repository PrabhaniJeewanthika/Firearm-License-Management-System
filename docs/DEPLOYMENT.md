# Deployment & Running Instructions

This document outlines how to run the three individual components of the Firearm License Management System (FLMS) locally for development.

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Docker (for PostgreSQL)

---

## 1. Backend (Django)

The backend handles the database and API.

1. Ensure Docker is running.
2. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```
3. Navigate to the backend directory:
   ```bash
   cd backend
   ```
4. Activate the virtual environment:
   ```bash
   # Windows
   .\venv\Scripts\activate
   ```
5. Run the server:
   ```bash
   python manage.py runserver
   ```
*(Server will start on http://localhost:8000)*

---

## 2. Desktop Web App (React / Vite)

The admin portal for desktop usage.

1. Navigate to the desktop directory:
   ```bash
   cd desktop
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
*(App will start on http://localhost:5173)*

### Building the Desktop Executable (Electron)
To compile the standalone Windows `.exe`:
```bash
cd desktop
npm run electron:build
```
*(The `.exe` will be located in `desktop/release/`)*

---

## 3. Mobile App (Expo)

The field app for mobile devices.

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Start the Expo Metro Bundler:
   ```bash
   npx expo start -c
   ```
3. **To view on your phone:** Download the "Expo Go" app from the App Store / Play Store and scan the QR code that appears in your terminal.
4. **To view on an emulator:** Press `a` in the terminal to open on an Android emulator, or `i` for an iOS simulator.

> **Note on Mobile API Connection:** 
> If you are using a physical device, you must ensure your phone and computer are on the same Wi-Fi network. You will also need to update `mobile/src/services/api.ts` to replace `10.0.2.2` with your computer's local IP address (e.g., `192.168.1.50`).
