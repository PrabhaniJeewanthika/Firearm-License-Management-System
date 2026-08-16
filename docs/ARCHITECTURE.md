# FLMS System Architecture

The Firearm License Management System (FLMS) is built using a modern, decoupled monolithic architecture containing three primary application interfaces communicating with a central backend.

## 1. Backend (Django / Django REST Framework)
- **Role:** Central source of truth, business logic, authentication, and database access.
- **Database:** PostgreSQL for robust relational data integrity (License Holders, Firearms, Renewals).
- **Authentication:** JWT (JSON Web Tokens) to securely handle state across Desktop and Mobile clients without session overhead.
- **Key Apps:**
  - `accounts`: Custom User model and roles.
  - `core`: Shared lookups (GN Divisions, Firearm Types).
  - `licenses`: Core License Holder logic.
  - `firearms`: Registry of assigned firearms.
  - `renewals`: Historical tracking of license states.
  - `transfers`: Tracking firearm ownership transfers.

## 2. Desktop Application (React / Vite / Electron)
- **Role:** Main portal for administrative staff in the office.
- **Implementation:** React Single Page Application (SPA) built with Vite for speed, styled with raw CSS for maximum customizability.
- **Desktop Wrapper:** Electron is used to wrap the React build into a native `.exe` for Windows deployment, providing desktop-native feel and allowing potential future offline capabilities or hardware integration.
- **Key Modules:** Dashboard Analytics, Multi-step "Add License" Wizard, Data Tables.

## 3. Mobile Application (React Native / Expo)
- **Role:** Field application for officers to verify licenses on the go.
- **Implementation:** Expo framework for rapid React Native development.
- **Key Modules:** Fast Search by NIC/Name, QR/Barcode Scanner placeholder, simplified field dashboard.

## 4. Communication Flow
```mermaid
graph TD
    A[Desktop App (React/Electron)] -->|HTTPS / JWT| C[Django REST API]
    B[Mobile App (React Native/Expo)] -->|HTTPS / JWT| C
    C -->|SQL| D[(PostgreSQL)]
```
