# Skyline Learning Center (SLC Academy)

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

A comprehensive, role-based academic management mobile and tablet web application designed for **Skyline Learning Center (SLC Academy)**. Built with a modern mobile-first interface optimized for **Android smartphones**, **iPads**, and **desktop** screens.

---

## 🎨 Theme & Design System

The application uses a custom design system inspired by educational academy dashboards:
* **Primary Coral / Red:** `#FA4338` (Brand accent, active states, buttons)
* **Coral Gradient:** `linear-gradient(135deg, #FF6B60 0%, #FA4338 100%)`
* **Deep Navy Text & Badges:** `#1E202B`
* **Soft Canvas Background:** `#F8F9FD`
* **Surface Cards:** Pure White (`#FFFFFF`) with smooth rounded corners (`rounded-3xl`) and soft elevation shadows
* **Success Emerald Green:** `#10B981` (Paid statuses, promotions, verified ledgers)
* **Pending Amber / Gold:** `#F59E0B`

---

## 📱 Core Features & User Journey

### 1. Dedicated Admin Portal
* **Clean Real-App Experience:** Free of simulation widgets, device toggles, or unnecessary labels.
* **Responsive Navigation:**
  * **Desktop / Tablet:** Top navigation bar with active indicators and quick access.
  * **Mobile Screen (< 768px):** Exactly **4 bottom navigation tabs** (**Dashboard**, **Courses**, **Fee**, **Timetable**).
  * **Top-Right 3-Bar Hamburger Drawer:** Quick-access slide-out menu containing all academy modules.
  * **Top-Right Profile Pill & Profile Modal:** Displays administrator avatar, username, and role. Admin can click to update their **Username**, **Full Name**, and **Profile Picture** (with strict &le; 100 KB validation).

### 2. Student & Teacher Management
* **O-Levels & A-Levels Academy:** Specially customized for Cambridge and Edexcel O-Levels and A-Levels streams.
* **Faculty Records with @gmail.com:** Teachers use personal `@gmail.com` accounts instead of academy webmail.
* **Compact Icon Profile Photos:** Displayed as small rounded badges (`w-11 h-11 rounded-full object-cover`).
* **Click-to-Zoom Lightbox:** Clicking any student or teacher photo opens a full-screen zoom modal with a close button (`✕`) and image metadata.
* **Strict 100 KB Photo Validation:** File size is strictly verified with custom alert dialogs if exceeded.
* **Student Admissions & Custom Fee Agreement:** Admin selects Cambridge/Edexcel courses and enters the custom tuition fee agreed student-to-student.

### 3. Cambridge Academic Courses & Classrooms
* **Course Structure:** Displays Course Title, Subject Code (e.g. `MTH-4024`, `PHY-9702`), Class Name (`O-Levels`, `A-Levels`), and optional Section / Batch Name.
* **No Fixed Course Fee:** Fee is not fixed by course and is removed from the course page; pricing is customized per student at admission.
* **Classroom Management (CRUD):** Manage lecture halls, classrooms, computer science labs, and physics/chemistry practical labs with capacity, floor, and building assignments.

### 4. Conflict-Free Lecture Timetable Scheduler
* **Automated Instructor Linkage:** Teachers are automatically assigned based on the course settings.
* **Real-Time Conflict Detection:** The scheduler prevents double-booking an instructor or classroom during the same time slot on any given day.
* **Weekly Master Timetable Report (PDF):** In-page generator for the complete weekly lecture timetable.

### 5. Fee Management, Cashier & Invoicing
* **Student-to-Student Custom Fee:** Agreed tuition package is entered by admin for each student's enrolled subjects.
* **3-Column Landscape Bank Fee Chalan (PDF):** Formatted with 3 separate columns on A4 Landscape:
  1. **Bank Copy**
  2. **Academy Copy**
  3. **Student Copy**
* **Official Fee Payment Receipt (A4 Portrait):** Issued when fees are cleared or collected (`balance === 0`), complete with:
  * Official academy header with NTN and serial number
  * Electronic ledger verification badge
  * Student particulars 2-column info card
  * Enrolled Cambridge courses breakdown table
  * Official payment conditions and rules
  * Triple signature block (Student/Depositor, Official SLC Stamp, Accounts Officer)

### 6. Examination Management & Student Mark Sheets
* **Exam Scheduler:** Admin creates examinations with total marks, passing marks, venue, and invigilator.
* **Exam Date Sheet Report (PDF):** In-page export of the complete academy exam schedule.
* **Detailed Marks Certificate (DMC) / Mark Sheet (PDF):** Direct button on the student directory to generate a transcript with course marks, percentages, letter grades (A*, A, B, C, D, F), cumulative average, and promotion status.

### 7. Responsive Mobile PDF Viewer & High-Res Generator
* **Automatic Screen Fit:** On mobile devices, the PDF modal activates **Fit Screen** mode, scaling down the A4 sheet so that 100% of the document is visible without horizontal cutoff.
* **Interactive Zoom Toolbar:** Toggle between **Fit Screen**, **100% Actual Size** (with smooth touch-scrolling), and **+ / -** zoom buttons.
* **Offscreen Sandbox Render:** `pdfGenerator.js` renders cloned elements in an isolated sandbox at standard A4 pixel dimensions, preventing scroll clipping and distortion in downloaded PDFs.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js 18 (Vite) | Single-page reactive application |
| **Styling Engine** | Tailwind CSS 3 | Utility-first responsive CSS |
| **Icons** | Lucide React | Modern vector icons |
| **PDF Rendering** | jsPDF + html2canvas | High-resolution print-ready A4 PDF export |
| **State Management** | React Context API | Central state for students, teachers, courses, fees, exams, and timetable |
| **Backend (Phase 2)** | FastAPI (Python) | High-performance asynchronous REST API |
| **Databases (Phase 2)** | PostgreSQL + MongoDB + SQLite | Relational records, audit logs, and local cache |

---

## 📁 Project Structure

```text
SLC/
├── PROJECT_EXECUTION_PLAN.md      # Detailed architectural blueprint & roadmap
├── README.md                      # Project documentation & overview
├── current_progress.md            # Comprehensive status of completed milestones
└── frontend/                      # React SPA application
    ├── public/                    # Static assets
    ├── src/
    │   ├── components/
    │   │   ├── auth/              # Admin Login View
    │   │   ├── classrooms/        # Classroom CRUD & Modal
    │   │   ├── common/            # Header, Navigation, Custom Alert, PDF Viewer, Image Zoom
    │   │   ├── courses/           # Course List & Add/Edit Modal
    │   │   ├── dashboard/         # Dashboard Metrics, Schedules, Quick Actions
    │   │   ├── exams/             # Exam Schedule & PDF Date Sheet
    │   │   ├── fees/              # Fee Register, Collect Modal, 3-Col Chalan, Fee Receipt
    │   │   ├── students/          # Student Directory, Admission Modal, DMC Mark Sheet
    │   │   ├── teachers/          # Teacher Directory & Profile Modal
    │   │   └── timetable/         # Conflict-free Scheduler & Timetable Report PDF
    │   ├── context/
    │   │   └── AppContext.jsx     # Master application state, CRUD, & conflict engine
    │   ├── data/
    │   │   └── mockData.js        # Hardcoded sample data for SLC Academy
    │   ├── utils/
    │   │   └── pdfGenerator.js    # Offscreen staging & high-res A4 PDF generator
    │   ├── App.jsx                # Root router & layout
    │   ├── index.css              # Custom utility classes & scrollbar styling
    │   └── main.jsx               # React DOM entrypoint
    ├── package.json               # Project dependencies and scripts
    └── vite.config.js             # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0 or higher)
* **npm** (v9.0 or higher)

### Installation & Running Locally

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5174/   (or http://localhost:5173/)
   ```

---

## 🔐 Default Admin Credentials

* **Email:** `admin@slc.edu.pk`
* **Password:** `admin123`

---

## 🛣️ Roadmap

- [x] **Phase 1: Complete UI & Business Logic (Admin Scope)**
  - [x] Responsive layout for Mobile, iPad, and Desktop
  - [x] Small profile photo icons with click-to-zoom modal
  - [x] Strict 100 KB image size validation & custom alert modals
  - [x] Course class names (`O-Levels`, `A-Levels`) and classroom CRUD
  - [x] Automated teacher assignment in timetable with conflict detection
  - [x] 3-Column Landscape Bank Fee Chalan
  - [x] Verified A4 Fee Receipt with itemized courses and signatures
  - [x] Student Detailed Marks Certificate (DMC) Mark Sheet
  - [x] Responsive mobile PDF viewer with zoom controls & offscreen sandbox export
- [ ] **Phase 2: Backend Integration & Multi-Role Support**
  - [ ] FastAPI backend with PostgreSQL relational schema
  - [ ] MongoDB Atlas audit logs and SQLite cache
  - [ ] Teacher & Student login (password update only; contact admin for other changes)
  - [ ] Capacitor packaging for native Android APK and iPad builds
