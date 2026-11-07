# Skyline Learning Center (SLC Academy)
## Current Progress & Status Report

> **Last Updated:** November 06, 2026 (O/A-Levels Stream Update)  
> **Current Phase:** Phase 1 (Frontend Admin Application & PDF Generation Engine) — **Complete & Verified**  
> **Development Server:** Running on `http://localhost:5174/` (Vite v6.4.5)  
> **Build Status:** Passing with 0 errors (`✓ built in 23.91s`)

---

## 1. Summary of Completed Deliverables

All user requests and core architectural requirements for Phase 1 have been implemented, tested, and verified.

```mermaid
pie title Phase 1 Deliverables Status
    "Admin Auth & UI Navigation" : 15
    "Student & Teacher Management" : 15
    "Courses & Classroom CRUD" : 15
    "Timetable Conflict Engine" : 15
    "Fee Register, Chalan & Receipt" : 15
    "Exams & Student DMC Mark Sheet" : 15
    "Mobile PDF Engine & Zoom Modal" : 10
```

---

## 2. Detailed Feature Breakdown

### 2.1 Authentication & Navigation System
* **Admin-Only Scope:** Single Admin authentication (`admin@slc.edu.pk` / `admin123`) with persistent session management.
* **Mobile-First Navigation:**
  * **Mobile Screen (< 768px):** Exactly **4 bottom navigation tabs**:
    1. **Dashboard**
    2. **Courses**
    3. **Fee**
    4. **Timetable**
  * **Top-Right 3-Bar Hamburger Drawer:** Toggles a slide-out drawer containing all modules: Dashboard, Students, Teachers, Courses, Classrooms, Fee, Timetable, Exams, and Admin Profile.
  * **Top-Right Profile Pill:** Displays administrator avatar, username, and role.
  * **Desktop / iPad Navigation:** Full top bar with active status indicators.

### 2.2 Profile Photos, Click-to-Zoom & Validation
* **Small Icon Profile Photos:** Rendered as compact rounded badges (`w-11 h-11 rounded-full object-cover border-2 border-coral-200`) across both Student and Teacher directories.
* **Click-to-Zoom Modal (`ImageZoomModal.jsx`):** Clicking on any student or teacher photo triggers a high-resolution lightbox popup featuring a close button (`✕`) and file size badge.
* **Strict 100 KB Photo Validation:** Both Student Admission and Teacher Registration forms enforce a strict 100 KB limit, displaying a custom error dialog if violated.
* **Custom Alert & Error Box (`CustomAlertModal.jsx`):** Replaced native browser alerts with custom animated modals for alerts, confirmations, and validation errors.

### 2.3 O-Levels & A-Levels Cambridge Curriculum & Classrooms
* **Course Structure (`CoursesView.jsx`):**
  * Dedicated Cambridge and Edexcel O-Levels (`MTH-4024`, `PHY-5054`, `CHM-5070`, `CS-2210`, `ENG-1123`) and A-Levels (`MTH-9709`, `PHY-9702`, `CS-9618`, `ECN-9708`).
  * Removed fixed "Base Tuition / Fee" from course cards and course modals (fee is customized student-to-student).
  * Auto-links assigned faculty members.
* **Classrooms CRUD (`ClassroomsView.jsx`):**
  * Full create, read, update, delete functionality for classrooms, lecture halls, and laboratories.
  * Tracks room capacity, building, floor, and room type.

### 2.4 Faculty Members with @gmail.com
* Faculty records updated with personal `@gmail.com` addresses (e.g. `salman.ali.cambridge@gmail.com`, `sarah.khan.physics@gmail.com`).
* Teacher registration form updated with `@gmail.com` input helper.

### 2.5 Admin Profile Management
* Admin can click their profile avatar (or open it from the top-right hamburger menu) to update:
  * Admin Username (persisted to localStorage and usable for login).
  * Admin Full Name / Designation.
  * Admin Profile Picture with strict `<= 100 KB` file validation, live avatar preview, and verified size badge.

### 2.6 Conflict-Free Timetable Scheduler
* **Automated Instructor Assignment:** Instructors are automatically selected based on the assigned course instructor (preventing manual mismatch).
* **Collision-Detection Engine:** Prevents assigning the same instructor or same classroom to overlapping lecture slots on any day.
* **Weekly Master Timetable Report (PDF):** In-page generator exporting the complete weekly lecture schedule.

### 2.7 Customized Student Fee Allocation, 3-Column Chalan & Official Receipt
* **Student-to-Student Agreed Pricing:** Fee is not fixed by course. While adding a student, the admin selects their enrolled subjects and enters the overall customized tuition fee and advance payment.
* **3-Column Landscape Bank Fee Chalan (PDF):**
  * Formatted in 3 distinct columns on A4 Landscape: **Bank Copy**, **Academy Copy**, and **Student Copy**.
  * Contains bank account numbers, chalan numbers, student metadata, fee breakdown, and cashier signature boxes.
* **Official Fee Payment Receipt (A4 Portrait):**
  * Automatically issued when dues are cleared (`balance === 0`) or upon cashier payment collection.
  * Formatted with academy header & NTN, verification badge, student particulars 2-column card, enrolled Cambridge courses table, payment summary, academy conditions, and official triple-signatures (Student, Accounts Stamp, Accounts Officer).

### 2.6 Examination & Detailed Marks Certificate (DMC)
* **Exam Management:** Admin schedules exams with total marks, passing marks, venue, and invigilator.
* **Exam Schedule Date Sheet (PDF):** Direct in-page export of the academy date sheet.
* **Detailed Marks Certificate (DMC) / Mark Sheet (PDF):**
  * Direct action on each student card in the Student Directory.
  * Computes course marks, percentages, letter grades (A*, A, B, C, D, F), overall cumulative score, and promotion status.

### 2.7 Responsive Mobile PDF Viewer & Offscreen Sandbox Export
* **Mobile Screen Fit:** `PdfViewerModal.jsx` automatically calculates the screen width and applies responsive scaling (**Fit Screen** mode). On mobile phones, the entire A4 document is 100% visible without horizontal overflow.
* **Interactive Zoom Toolbar:** Users can toggle between **Fit Screen**, **100% Actual Size** (with smooth horizontal and vertical touch scrolling), and **+ / -** zoom buttons.
* **Undistorted High-Resolution PDF Export (`pdfGenerator.js`):** Clones the document into an isolated offscreen staging sandbox at standard A4 pixel dimensions (`794px × 1123px` portrait, `1123px × 794px` landscape), completely eliminating scroll clipping and distortion in downloaded PDFs.

### 2.8 Clean Dashboard UI
* Removed the sparkle emoji (`✨`) from the **Administrator Control Panel** label for a cleaner, professional presentation.

---

## 3. Technology Stack & Packages

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` | 18.3.1 | Core UI library |
| `react-dom` | 18.3.1 | DOM renderer |
| `vite` | 6.4.5 | Fast development server & production bundler |
| `tailwindcss` | 3.4.17 | Utility-first styling with custom theme tokens |
| `lucide-react` | 0.469.0 | Icon library |
| `jspdf` | 2.5.2 | Vector PDF document generation |
| `html2canvas` | 1.4.1 | High-resolution DOM-to-canvas rasterizer |

---

## 4. Key Files & Components

| Component / Utility | File Path | Description |
| :--- | :--- | :--- |
| **PDF Export Engine** | `frontend/src/utils/pdfGenerator.js` | Offscreen sandbox renderer & A4 PDF downloader |
| **Responsive PDF Modal** | `frontend/src/components/common/PdfViewerModal.jsx` | Mobile-responsive viewer with auto-scale & zoom |
| **Fee Receipt Document** | `frontend/src/components/fees/FeeReceiptDocument.jsx` | A4 Portrait fee receipt with courses & signatures |
| **Fee Chalan Document** | `frontend/src/components/fees/FeeChalanDocument.jsx` | 3-Column A4 Landscape bank fee chalan |
| **DMC Mark Sheet** | `frontend/src/components/students/MarkSheetDocument.jsx` | Student transcript with grades & official seal |
| **Timetable Scheduler** | `frontend/src/components/timetable/TimetableScheduleView.jsx` | Conflict-free scheduler & timetable report |
| **Exam Date Sheet** | `frontend/src/components/exams/ExamsView.jsx` | Exam schedule & date sheet report |
| **Classroom CRUD** | `frontend/src/components/classrooms/ClassroomsView.jsx` | Classroom & laboratory management |
| **Official Academy Logo** | `frontend/public/logo.jpeg` | High-res academy logo used in header, login, reports & favicon |
| **Global State & Conflict** | `frontend/src/context/AppContext.jsx` | State, validation, migration & collision engine |
| **Mock Database** | `frontend/src/data/mockData.js` | Initial mock datasets & avatar placeholder for SLC Academy |

---

## 5. Recent Enhancements & Brand Customizations

1. **Official Academy Logo Integration (`/logo.jpeg`):**
   - **Favicon & Web App Icon:** Configured `<link rel="icon" type="image/jpeg" href="/logo.jpeg" />` in `index.html`.
   - **Login View:** Displayed high-resolution academy logo on the Administrator Access Portal card.
   - **Top Navigation Header:** Branded academy logo with smooth hover scale on the top-left navigation.
   - **Navigation Slide-Over Drawer:** Displayed official logo in the slide-out menu header.
   - **Dashboard Banner:** Integrated academy logo into the main welcome card.
   - **Fee Chalan Document (3-Column):** Placed academy logo header on Bank Copy, Academy Copy, and Student Copy.
   - **Official Fee Receipt:** Integrated academy logo in the header and receipt banner.
   - **DMC Student Mark Sheet:** Replaced text icon with official logo on academic transcripts.
   - **Exam Date Sheet & Timetable Reports:** Academy logo rendered at the top of printable PDF date sheets and schedules.

2. **Default Profile Picture (Gray & White Placeholder):**
   - Replaced all demo external photos with a crisp, neutral gray and white vector silhouette avatar (`DEFAULT_AVATAR_PLACEHOLDER`).
   - Defaulted for Administrator, all faculty members, and enrolled students.
   - Enforced automatic LocalStorage state migration so users immediately see the new placeholder without manual cache clearing.
   - Retained strict `<= 100 KB` validation for custom photo uploads and click-to-zoom modal preview.

---

## 6. Next Steps (Phase 2: Backend & Multi-Role)

1. **FastAPI REST API:** Create endpoints for Auth, Students, Teachers, Courses, Classrooms, Fees, Timetables, and Exams.
2. **PostgreSQL Relational DB:** Set up SQLAlchemy 2.0 ORM schemas and Alembic database migrations.
3. **MongoDB Atlas:** Configure audit trails and generated report snapshot storage.
4. **SQLite Local Cache:** High-speed lookup cache for timetable conflict checking.
5. **Multi-Role Accounts (Teacher & Student):**
   - Provide student/teacher login with restricted permissions (password updates only; contact admin for all other changes).
6. **Mobile APK / iOS Build:** Wrap the frontend using Capacitor for native Android and iPad distribution.
