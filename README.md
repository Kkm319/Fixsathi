# FixSaathi (फिक्स साथी)
### AI-Powered Household Appliance Repair History & Service Management Platform

FixSaathi is a modern, minimal, multilingual web application that helps households maintain a digital repair history of their appliances, automatically understand bills and warranty cards, report issues in regional Indian languages via voice, and eliminate repeated repair scams through AI recurring fault detection.

---

## 1. Core Capabilities

- **Digital Appliance Dossier**: Register appliances with warranty status (Active, Expired, Unknown), model numbers, and purchase dates.
- **Chronological Repair Timeline**: Record work performed, parts replaced, technician contact details, and costs.
- **Sarvam Saaras Multilingual Voice Assistant**: Record complaints naturally in Hindi, Marathi, English, Tamil, Telugu, and other Indian languages.
- **Recurring Issue Detection (Sarvam-105b-conversations)**: Compares incoming complaints with past repair history to detect repeat component failures and surfaces specific questions to ask technicians.
- **Document Intelligence**: Upload repair bills, warranty cards, and service receipts. Sarvam AI extracts structured data for review and editing before saving.
- **Spoken Repair Summaries (Sarvam Bulbul TTS)**: Converts appliance repair dossiers into spoken audio in Indian languages.
- **Multilingual Translation (Sarvam Mayura)**: Translates repair reports and service summaries between English and regional Indian languages.
- **Technician Field Portal**: Field interface for technicians to view assigned service requests, review previous repairs, update service status, and record replaced parts.

---

## 2. Design Philosophy

Inspired by **Linear** and **Notion**:
- Clean, minimal, professional aesthetic.
- Light warm-grey background (`#fbfbfb`) with dark charcoal typography (`#18181b`).
- Muted teal primary accent (`#0d9488`).
- Subtle borders and soft shadows with generous whitespace.
- Zero clutter: Only 3 key summary metrics on the main dashboard.
- Uncluttered cards and accessible forms.

---

## 3. Sarvam AI Integration Architecture

All AI features connect through the secure backend via environment variables (`SARVAM_API_KEY`). API keys are never exposed in client-side code.

| Capability | Model / Endpoint | Role in FixSaathi |
| :--- | :--- | :--- |
| **Speech-to-Text** | `saaras:v3` / `saaras:v4`<br>`POST https://api.sarvam.ai/speech-to-text` | Multilingual speech transcription from household voice complaints. |
| **LLM Reasoning & History Match** | `sarvam-105b-conversations`<br>`POST https://api.sarvam.ai/v1/chat/completions` | Identifies appliance component symptoms, cross-checks previous repair records, detects recurring failures, and formulates technician questions. |
| **Document Extraction** | Sarvam Doc AI / Structured LLM<br>`POST /api/sarvam/ocr-document` | Parses uploaded bills and warranty cards to extract brand, parts replaced, technician, amount, and warranty validity. |
| **Text-to-Speech** | `bulbul:v3`<br>`POST https://api.sarvam.ai/text-to-speech` | Synthesizes spoken repair reports in regional Indian languages with natural voice speakers (e.g. `ritu`). |
| **Translation** | `mayura:v1`<br>`POST https://api.sarvam.ai/translate` | Real-time translation of repair logs and summaries between English and Indian regional languages. |

---

## 4. Live Demonstration Scenario

FixSaathi comes pre-seeded with realistic demonstration data:

1. **Appliance**: Samsung Washing Machine (Model: `WW80T504DAX`)
2. **Purchase Date**: 10 January 2025 • **Warranty**: Active until 10 January 2027
3. **Previous Repair**:
   - **Date**: 15 September 2026
   - **Problem**: Water not draining from drum
   - **Work**: Drain pump replaced and outlet valve cleaned
   - **Parts**: Drain Pump Assembly (`DC31-00181A`)
   - **Amount**: ₹1,200
4. **Current Demo Complaint**:
   - Spoken in Hindi/English: *"My washing machine has stopped draining water. It was repaired last month, but the same issue has returned."*
   - FixSaathi immediately flags:
     - **Problem**: Water not draining
     - **Previous occurrence**: Yes (15 September 2026; Drain pump replaced)
     - **Questions for Technician**:
       * *"Is the replaced drain pump functioning correctly or covered under warranty?"*
       * *"Is there an internal blockage in the impeller or drainage pipe?"*

You can reset to this scenario at any time using the **Reset Demo** button in the top navigation bar.

---

## 5. Project Structure

```text
buildathon/
├── .env                  # SARVAM_API_KEY (git-ignored)
├── .env.example          # Sample environment template
├── .gitignore            # Git exclusion rules
├── README.md             # Documentation
├── package.json          # Root scripts
├── main.py               # Verified Python Sarvam SDK test script
├── backend/
│   ├── server.js         # Express REST API (port 5000)
│   ├── sarvam.js         # Sarvam AI API client (STT, LLM, TTS, Translation)
│   ├── store.js          # In-memory/JSON data store with MongoDB Mongoose support
│   ├── data/             # Persistent JSON database (auto-seeded)
│   └── uploads/          # Document & audio uploads directory
└── frontend/
    ├── index.html
    ├── vite.config.js    # Vite configuration with API proxying
    ├── package.json
    └── src/
        ├── App.jsx       # Main application container & modal router
        ├── api.js        # Frontend API client
        ├── index.css     # Tailwind v4 design tokens
        ├── components/
        │   ├── Navbar.jsx              # Minimal top navigation & mode switch
        │   ├── Sidebar.jsx             # Clean navigation sidebar
        │   ├── AddApplianceModal.jsx   # Add/Edit appliance modal
        │   ├── DocumentUploadModal.jsx # Upload bill & editable OCR review
        │   ├── AddRepairModal.jsx      # Manual repair logger
        │   └── RepairReportModal.jsx   # Dossier report with PDF, TTS & Translation
        └── pages/
            ├── LandingView.jsx         # Hero ("Every repair. Remembered.")
            ├── DashboardView.jsx       # 3 KPI metrics, appliances, recent repairs
            ├── AppliancesView.jsx      # Appliance catalog with warranty badges
            ├── ApplianceDetailView.jsx # Timeline & subtle recurring issue alert
            ├── VoiceAssistantView.jsx  # "Tell us what's wrong" voice assistant
            ├── TechnicianView.jsx      # Field portal for service requests
            └── SettingsView.jsx        # Preferences & Sarvam AI diagnostics
```

---

## 6. Getting Started

### Prerequisites
- Node.js (v18+) and npm
- Python 3.10+ (for standalone Python SDK script)
- Sarvam AI API key

### 1. Setup Environment
Ensure `.env` in the project root contains your Sarvam API key:
```env
SARVAM_API_KEY=your_sarvam_api_key_here
PORT=5000
```

### 2. Start the Backend Server
```bash
cd backend
npm install
node server.js
```
The backend starts at `http://localhost:5000`.

### 3. Start the Frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
The application opens at `http://localhost:5173`.

---

## 7. API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | GET | System health & Sarvam AI connection status |
| `/api/metrics` | GET | Top-level summary metrics (Total, Repairs, Active Warranties) |
| `/api/appliances` | GET, POST | List registered appliances or create new |
| `/api/appliances/:id` | GET, PUT, DELETE | Retrieve, update or delete appliance details |
| `/api/appliances/:id/repairs` | GET, POST | Appliance repair timeline |
| `/api/appliances/:id/documents` | GET, POST | Upload and retrieve warranty/bill documents |
| `/api/service-requests` | GET, POST | Household service complaints & status tracking |
| `/api/service-requests/:id` | PUT | Technician status updates, work notes, and parts |
| `/api/sarvam/stt` | POST | Audio file to multilingual text via Sarvam Saaras |
| `/api/sarvam/analyze-complaint` | POST | Cross-checks complaint against repair history with Sarvam LLM |
| `/api/sarvam/ocr-document` | POST | Extracts structured metadata from bills/warranty cards |
| `/api/sarvam/tts` | POST | Converts repair reports to spoken audio via Sarvam Bulbul |
| `/api/sarvam/translate` | POST | Real-time Indian language translation via Sarvam Mayura |
| `/api/reports/:applianceId` | GET | Generates complete appliance repair dossier |
| `/api/demo/reset` | POST | Resets demo scenario to default state |
