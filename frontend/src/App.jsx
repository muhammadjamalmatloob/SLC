import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import CustomAlertModal from './components/common/CustomAlertModal';
import ToastContainer from './components/common/ToastContainer';
import LoginView from './components/auth/LoginView';
import ProfileModal from './components/profile/ProfileModal';
import ImageZoomModal from './components/common/ImageZoomModal';
import PdfViewerModal from './components/common/PdfViewerModal';
import MarkSheetDocument from './components/students/MarkSheetDocument';

// Views
import DashboardView from './components/dashboard/DashboardView';
import StudentsView from './components/students/StudentsView';
import TeachersView from './components/teachers/TeachersView';
import CoursesView from './components/courses/CoursesView';
import FeesView from './components/fees/FeesView';
import TimetableScheduleView from './components/timetable/TimetableScheduleView';
import ClassroomsView from './components/classrooms/ClassroomsView';
import ExamsView from './components/exams/ExamsView';

// Modals
import StudentModal from './components/students/StudentModal';
import TeacherModal from './components/teachers/TeacherModal';
import CourseModal from './components/courses/CourseModal';
import FeeCollectModal from './components/fees/FeeCollectModal';
import SlotModal from './components/timetable/SlotModal';
import ClassroomModal from './components/classrooms/ClassroomModal';
import ExamModal from './components/exams/ExamModal';
import MarksEntryModal from './components/exams/MarksEntryModal';

function MainApp() {
  const { isAuthenticated, activeTab } = useApp();

  // Modal States
  const [studentModal, setStudentModal] = useState({ isOpen: false, student: null });
  const [teacherModal, setTeacherModal] = useState({ isOpen: false, teacher: null });
  const [courseModal, setCourseModal] = useState({ isOpen: false, course: null });
  const [feeModal, setFeeModal] = useState({ isOpen: false, student: null });
  const [slotModal, setSlotModal] = useState({ isOpen: false, slot: null });
  const [classroomModal, setClassroomModal] = useState({ isOpen: false, classroom: null });
  const [examModal, setExamModal] = useState({ isOpen: false, exam: null });
  const [marksModal, setMarksModal] = useState({ isOpen: false, exam: null });
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Zoomed Photo Modal State (for both Students and Teachers)
  const [zoomModal, setZoomModal] = useState({
    isOpen: false,
    imageSrc: '',
    title: '',
    subtitle: '',
    sizeKb: null
  });

  // Student Mark Sheet / Transcript PDF Viewer Modal State
  const [markSheetModal, setMarkSheetModal] = useState({
    isOpen: false,
    student: null
  });

  // If user is not logged in, render the login page
  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <CustomAlertModal />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-navy-800 flex flex-col font-sans select-none">
      {/* Top Header with Profile and 3 Horizontal Bars Hamburger Menu */}
      <Header onOpenProfile={() => setProfileModalOpen(true)} />

      {/* Navigation (Top bar on iPad/Desktop, 4-Tab Bottom Nav on Mobile) */}
      <Navigation />

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenStudentModal={() => setStudentModal({ isOpen: true, student: null })}
            onOpenFeeModal={() => setFeeModal({ isOpen: true, student: null })}
            onOpenSlotModal={() => setSlotModal({ isOpen: true, slot: null })}
            onOpenExamModal={() => setExamModal({ isOpen: true, exam: null })}
          />
        )}

        {activeTab === 'students' && (
          <StudentsView
            onOpenAddModal={() => setStudentModal({ isOpen: true, student: null })}
            onEditStudent={(student) => setStudentModal({ isOpen: true, student })}
            onCollectFee={(student) => setFeeModal({ isOpen: true, student })}
            onZoomPhoto={(data) => setZoomModal({ isOpen: true, ...data })}
            onViewMarkSheet={(student) => setMarkSheetModal({ isOpen: true, student })}
          />
        )}

        {activeTab === 'teachers' && (
          <TeachersView
            onOpenAddModal={() => setTeacherModal({ isOpen: true, teacher: null })}
            onEditTeacher={(teacher) => setTeacherModal({ isOpen: true, teacher })}
            onZoomPhoto={(data) => setZoomModal({ isOpen: true, ...data })}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesView
            onOpenAddModal={() => setCourseModal({ isOpen: true, course: null })}
            onEditCourse={(course) => setCourseModal({ isOpen: true, course })}
          />
        )}

        {activeTab === 'fees' && (
          <FeesView
            onOpenCollectModal={(student = null) => setFeeModal({ isOpen: true, student })}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableScheduleView
            onOpenAddSlot={() => setSlotModal({ isOpen: true, slot: null })}
            onEditSlot={(slot) => setSlotModal({ isOpen: true, slot })}
          />
        )}

        {activeTab === 'classrooms' && (
          <ClassroomsView
            onOpenAddModal={() => setClassroomModal({ isOpen: true, classroom: null })}
            onEditClassroom={(classroom) => setClassroomModal({ isOpen: true, classroom })}
          />
        )}

        {activeTab === 'exams' && (
          <ExamsView
            onOpenAddExam={() => setExamModal({ isOpen: true, exam: null })}
            onEditExam={(exam) => setExamModal({ isOpen: true, exam })}
            onOpenMarksModal={(exam) => setMarksModal({ isOpen: true, exam })}
          />
        )}
      </main>

      {/* Global Administrative Modals */}
      <StudentModal
        isOpen={studentModal.isOpen}
        studentToEdit={studentModal.student}
        onClose={() => setStudentModal({ isOpen: false, student: null })}
      />

      <TeacherModal
        isOpen={teacherModal.isOpen}
        teacherToEdit={teacherModal.teacher}
        onClose={() => setTeacherModal({ isOpen: false, teacher: null })}
      />

      <CourseModal
        isOpen={courseModal.isOpen}
        courseToEdit={courseModal.course}
        onClose={() => setCourseModal({ isOpen: false, course: null })}
      />

      <FeeCollectModal
        isOpen={feeModal.isOpen}
        preselectedStudent={feeModal.student}
        onClose={() => setFeeModal({ isOpen: false, student: null })}
      />

      <SlotModal
        isOpen={slotModal.isOpen}
        slotToEdit={slotModal.slot}
        onClose={() => setSlotModal({ isOpen: false, slot: null })}
      />

      <ClassroomModal
        isOpen={classroomModal.isOpen}
        classroomToEdit={classroomModal.classroom}
        onClose={() => setClassroomModal({ isOpen: false, classroom: null })}
      />

      <ExamModal
        isOpen={examModal.isOpen}
        examToEdit={examModal.exam}
        onClose={() => setExamModal({ isOpen: false, exam: null })}
      />

      <MarksEntryModal
        isOpen={marksModal.isOpen}
        exam={marksModal.exam}
        onClose={() => setMarksModal({ isOpen: false, exam: null })}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Profile Zoom Modal with Cross Button (for Teacher and Student photos) */}
      <ImageZoomModal
        isOpen={zoomModal.isOpen}
        onClose={() => setZoomModal(prev => ({ ...prev, isOpen: false }))}
        imageSrc={zoomModal.imageSrc}
        title={zoomModal.title}
        subtitle={zoomModal.subtitle}
        sizeKb={zoomModal.sizeKb}
      />

      {/* Student Transcript / Detailed Marks Certificate (DMC) PDF Viewer */}
      {markSheetModal.student && (
        <PdfViewerModal
          isOpen={markSheetModal.isOpen}
          onClose={() => setMarkSheetModal({ isOpen: false, student: null })}
          title={`Official Mark Sheet: ${markSheetModal.student.fullName} (${markSheetModal.student.rollNumber})`}
          documentId="student-marksheet-pdf-root"
          filename={`SLC_MarkSheet_${markSheetModal.student.rollNumber}.pdf`}
          orientation="portrait"
        >
          <MarkSheetDocument student={markSheetModal.student} />
        </PdfViewerModal>
      )}

      {/* Custom Error & Alert Dialog */}
      <CustomAlertModal />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
