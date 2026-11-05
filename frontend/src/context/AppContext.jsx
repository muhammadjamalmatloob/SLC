import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialClassrooms,
  initialCourses,
  initialTeachers,
  initialStudents,
  initialFeePayments,
  initialTimetableSlots,
  initialExams,
  initialExamMarks
} from '../data/mockData';
import {
  validateTimetableSlot,
  validateFeePayment,
  validateStudentForm,
  validateTeacherForm,
  validateExamMarks
} from '../utils/validators';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Classrooms State (CRUD)
  const [classrooms, setClassrooms] = useState(() => {
    const saved = localStorage.getItem('slc_classrooms');
    return saved ? JSON.parse(saved) : initialClassrooms;
  });

  // Courses State
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('slc_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  // Teachers State
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('slc_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  // Students State
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('slc_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // Fee Payments State
  const [feePayments, setFeePayments] = useState(() => {
    const saved = localStorage.getItem('slc_fee_payments');
    return saved ? JSON.parse(saved) : initialFeePayments;
  });

  // Timetable State
  const [timetableSlots, setTimetableSlots] = useState(() => {
    const saved = localStorage.getItem('slc_timetable');
    return saved ? JSON.parse(saved) : initialTimetableSlots;
  });

  // Exams State
  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('slc_exams');
    return saved ? JSON.parse(saved) : initialExams;
  });

  // Exam Marks State
  const [examMarks, setExamMarks] = useState(() => {
    const saved = localStorage.getItem('slc_exam_marks');
    return saved ? JSON.parse(saved) : initialExamMarks;
  });

  // Authentication State: ONLY ADMIN
  const [currentUser, setCurrentUser] = useState(() => {
    return {
      id: 'usr-admin-1',
      fullName: 'System Administrator',
      email: 'admin@slc.edu.pk',
      role: 'admin',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('slc_authenticated');
    return saved !== null ? saved === 'true' : true; // Default logged in for smooth preview
  });

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Custom Error & Alert Box State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'error', // 'error' | 'success' | 'warning' | 'info'
    title: '',
    message: '',
    code: '',
    details: null,
    buttonText: 'Got It',
    onAction: null
  });

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('slc_classrooms', JSON.stringify(classrooms));
    localStorage.setItem('slc_courses', JSON.stringify(courses));
    localStorage.setItem('slc_teachers', JSON.stringify(teachers));
    localStorage.setItem('slc_students', JSON.stringify(students));
    localStorage.setItem('slc_fee_payments', JSON.stringify(feePayments));
    localStorage.setItem('slc_timetable', JSON.stringify(timetableSlots));
    localStorage.setItem('slc_exams', JSON.stringify(exams));
    localStorage.setItem('slc_exam_marks', JSON.stringify(examMarks));
    localStorage.setItem('slc_authenticated', isAuthenticated ? 'true' : 'false');
  }, [classrooms, courses, teachers, students, feePayments, timetableSlots, exams, examMarks, isAuthenticated]);

  // Alert Dialog trigger
  const triggerAlert = ({ type = 'error', title, message, code = '', details = null, buttonText = 'Got It', onAction = null }) => {
    setAlertModal({
      isOpen: true,
      type,
      title,
      message,
      code,
      details,
      buttonText,
      onAction
    });
  };

  const closeAlert = () => {
    if (alertModal.onAction) alertModal.onAction();
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };

  // Toast trigger
  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Login: ONLY ADMIN ALLOWED
  const login = (emailOrUsername, password) => {
    const cleanId = (emailOrUsername || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      triggerAlert({
        type: 'error',
        title: 'Missing Credentials',
        message: 'Please provide administrator email/username and password.',
        code: 'ERR_AUTH_EMPTY'
      });
      return false;
    }

    if (cleanId === 'admin@slc.edu.pk' || cleanId === 'admin') {
      if (cleanPass === 'admin' || cleanPass === 'admin123') {
        setIsAuthenticated(true);
        setActiveTab('dashboard');
        addToast('Welcome Back', 'Signed in as System Administrator', 'success');
        return true;
      }
    }

    triggerAlert({
      type: 'error',
      title: 'Admin Access Only',
      message: 'Invalid credentials. Only Administrator access is active at this stage.',
      code: 'ERR_ADMIN_AUTH_FAILED',
      details: {
        adminEmail: 'admin@slc.edu.pk',
        defaultPass: 'admin123'
      },
      buttonText: 'Try Again'
    });
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('slc_authenticated', 'false');
    addToast('Signed Out', 'Administrator session ended', 'info');
  };

  // --- CLASSROOMS CRUD ---
  const saveClassroom = (classroomData) => {
    const isNew = !classroomData.id;
    const roomId = classroomData.id || `rm-${Date.now()}`;
    const payload = { ...classroomData, id: roomId };

    if (!payload.name || payload.name.trim().length === 0) {
      triggerAlert({
        type: 'error',
        title: 'Room Name Required',
        message: 'Please provide a room name or number.',
        code: 'ERR_CLASSROOM_NAME'
      });
      return false;
    }

    // Check duplicate room name
    const dup = classrooms.find(
      r => r.id !== roomId && r.name.trim().toLowerCase() === payload.name.trim().toLowerCase()
    );
    if (dup) {
      triggerAlert({
        type: 'error',
        title: 'Duplicate Classroom',
        message: `A classroom with the name "${payload.name}" already exists.`,
        code: 'ERR_DUPLICATE_ROOM'
      });
      return false;
    }

    if (isNew) {
      setClassrooms(prev => [...prev, payload]);
      addToast('Classroom Created', `${payload.name} added to facilities`, 'success');
    } else {
      setClassrooms(prev => prev.map(r => r.id === roomId ? payload : r));
      addToast('Classroom Updated', `${payload.name} details saved`, 'success');
    }
    return true;
  };

  const deleteClassroom = (classroomId) => {
    const target = classrooms.find(r => r.id === classroomId);
    // Check if room is used in timetable
    const inUse = timetableSlots.some(s => s.room === target?.name);
    if (inUse) {
      triggerAlert({
        type: 'error',
        title: 'Classroom Currently In Use',
        message: `Cannot delete "${target?.name}" because active lecture slots are scheduled in this room. Please reassign those slots first.`,
        code: 'ERR_ROOM_IN_USE'
      });
      return false;
    }

    setClassrooms(prev => prev.filter(r => r.id !== classroomId));
    addToast('Classroom Removed', `${target?.name || 'Classroom'} deleted`, 'info');
    return true;
  };

  // --- TIMETABLE: INSTRUCTOR IS AUTO-SELECTED FROM COURSE ---
  const saveTimetableSlot = (slotData) => {
    const isNew = !slotData.id;
    const slotId = slotData.id || `slot-${Date.now()}`;

    // Auto-resolve teacher from course!
    const targetCourse = courses.find(c => c.id === slotData.courseId);
    if (!targetCourse) {
      triggerAlert({
        type: 'error',
        title: 'Course Selection Required',
        message: 'Please select a valid course for this timetable slot.',
        code: 'ERR_NO_COURSE'
      });
      return false;
    }

    if (!targetCourse.assignedTeacherId) {
      triggerAlert({
        type: 'error',
        title: 'No Instructor Assigned to Course',
        message: `Course "${targetCourse.title}" does not have an assigned instructor yet. Please go to the Courses page and assign a teacher to this course first.`,
        code: 'ERR_COURSE_NO_TEACHER'
      });
      return false;
    }

    // Auto assign instructor
    const payload = {
      ...slotData,
      id: slotId,
      teacherId: targetCourse.assignedTeacherId
    };

    const validation = validateTimetableSlot({
      slot: payload,
      existingSlots: timetableSlots,
      teachers,
      courses
    });

    if (!validation.isValid) {
      triggerAlert({
        type: 'error',
        title: validation.errorTitle,
        message: validation.errorMessage,
        code: validation.code,
        details: validation.details,
        buttonText: 'Resolve Conflict'
      });
      return false;
    }

    if (isNew) {
      setTimetableSlots(prev => [...prev, payload]);
      addToast('Slot Scheduled', `Lecture successfully booked for ${payload.day}`, 'success');
    } else {
      setTimetableSlots(prev => prev.map(s => s.id === slotId ? payload : s));
      addToast('Slot Updated', `Timetable slot updated successfully`, 'success');
    }
    return true;
  };

  const deleteTimetableSlot = (slotId) => {
    setTimetableSlots(prev => prev.filter(s => s.id !== slotId));
    addToast('Slot Deleted', 'Timetable slot removed from schedule', 'info');
  };

  // --- FEE COLLECTION ---
  const collectStudentFee = ({ studentId, amountPaid, paymentMethod = 'Cash', notes = '' }) => {
    const student = students.find(s => s.id === studentId);
    if (!student) {
      triggerAlert({
        type: 'error',
        title: 'Student Not Found',
        message: 'Could not find the target student record.',
        code: 'ERR_NOT_FOUND'
      });
      return null;
    }

    const validation = validateFeePayment(amountPaid, student);
    if (!validation.isValid) {
      triggerAlert({
        type: 'error',
        title: validation.errorTitle,
        message: validation.errorMessage,
        code: validation.code,
        details: validation.details,
        buttonText: 'Adjust Amount'
      });
      return null;
    }

    const cleanAmount = validation.cleanAmount;
    const newPaidFee = student.paidFee + cleanAmount;
    const newBalance = Math.max(0, student.totalFee - newPaidFee);
    const newStatus = newBalance === 0 ? 'PAID' : 'PARTIAL';

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          paidFee: newPaidFee,
          balance: newBalance,
          feeStatus: newStatus
        };
      }
      return s;
    }));

    const receiptNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment = {
      id: `pmt-${Date.now()}`,
      receiptNumber: receiptNum,
      studentId: student.id,
      studentName: student.fullName,
      rollNumber: student.rollNumber,
      amountPaid: cleanAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      receivedBy: 'Admin',
      notes: notes || 'Fee installment payment'
    };

    setFeePayments(prev => [newPayment, ...prev]);

    triggerAlert({
      type: 'success',
      title: 'Payment Received Successfully',
      message: `Rs. ${cleanAmount.toLocaleString()} collected for ${student.fullName} (${student.rollNumber}). Digital Receipt #${receiptNum} generated.`,
      details: {
        receipt: receiptNum,
        amount: `Rs. ${cleanAmount.toLocaleString()}`,
        remainingDue: `Rs. ${newBalance.toLocaleString()}`,
        status: newStatus
      },
      buttonText: 'Done'
    });

    return newPayment;
  };

  // --- STUDENT CRUD ---
  const saveStudent = (studentData) => {
    const isNew = !studentData.id;
    const studentId = studentData.id || `std-${Date.now()}`;
    const totalFee = Number(studentData.totalFee) || 0;
    const paidFee = Number(studentData.paidFee) || 0;
    const balance = Math.max(0, totalFee - paidFee);
    const feeStatus = balance === 0 && totalFee > 0 ? 'PAID' : (paidFee > 0 ? 'PARTIAL' : 'PENDING');

    const payload = {
      ...studentData,
      id: studentId,
      totalFee,
      paidFee,
      balance,
      feeStatus
    };

    const validation = validateStudentForm(payload, students);
    if (!validation.isValid) {
      triggerAlert({
        type: 'error',
        title: validation.errorTitle,
        message: validation.errorMessage,
        code: validation.code,
        buttonText: 'Correct Input'
      });
      return false;
    }

    if (isNew) {
      setStudents(prev => [payload, ...prev]);
      addToast('Student Registered', `${payload.fullName} enrolled successfully`, 'success');
    } else {
      setStudents(prev => prev.map(s => s.id === studentId ? payload : s));
      addToast('Student Updated', `Record for ${payload.fullName} saved`, 'success');
    }
    return true;
  };

  const deleteStudent = (studentId) => {
    const target = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    addToast('Student Removed', `${target?.fullName || 'Student'} deleted`, 'info');
  };

  // --- TEACHER CRUD ---
  const saveTeacher = (teacherData) => {
    const isNew = !teacherData.id;
    const teacherId = teacherData.id || `tch-${Date.now()}`;
    const payload = { ...teacherData, id: teacherId };

    const validation = validateTeacherForm(payload, teachers);
    if (!validation.isValid) {
      triggerAlert({
        type: 'error',
        title: validation.errorTitle,
        message: validation.errorMessage,
        code: validation.code,
        buttonText: 'Fix Details'
      });
      return false;
    }

    if (isNew) {
      setTeachers(prev => [payload, ...prev]);
      addToast('Teacher Added', `${payload.fullName} created successfully`, 'success');
    } else {
      setTeachers(prev => prev.map(t => t.id === teacherId ? payload : t));
      addToast('Teacher Updated', `${payload.fullName} details updated`, 'success');
    }
    return true;
  };

  const deleteTeacher = (teacherId) => {
    const target = teachers.find(t => t.id === teacherId);
    const hasTimetable = timetableSlots.some(s => s.teacherId === teacherId);
    if (hasTimetable) {
      triggerAlert({
        type: 'error',
        title: 'Cannot Delete Active Instructor',
        message: `${target?.fullName || 'This teacher'} currently has active timetable lecture slots assigned. Please reassign their lecture timings before deletion.`,
        code: 'ERR_INTEGRITY_CONSTRAINT'
      });
      return false;
    }
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
    addToast('Teacher Removed', `${target?.fullName || 'Teacher'} deleted`, 'info');
    return true;
  };

  // --- COURSE CRUD (No duration, No category, with Class Name & Section Name) ---
  const saveCourse = (courseData) => {
    const isNew = !courseData.id;
    const courseId = courseData.id || `crs-${Date.now()}`;
    const payload = {
      ...courseData,
      id: courseId,
      className: (courseData.className || '').trim(),
      sectionName: (courseData.sectionName || '').trim()
    };

    if (!payload.title || !payload.code || !payload.className) {
      triggerAlert({
        type: 'error',
        title: 'Missing Course Information',
        message: 'Course Code, Course Name, and Class Name are required.',
        code: 'ERR_COURSE_MISSING_DATA'
      });
      return false;
    }

    if (isNew) {
      setCourses(prev => [payload, ...prev]);
      addToast('Course Created', `${payload.title} added`, 'success');
    } else {
      setCourses(prev => prev.map(c => c.id === courseId ? payload : c));
      addToast('Course Updated', `${payload.title} updated`, 'success');
    }
    return true;
  };

  const deleteCourse = (courseId) => {
    const target = courses.find(c => c.id === courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
    addToast('Course Removed', `${target?.title || 'Course'} deleted`, 'info');
  };

  // --- EXAMS CRUD ---
  const saveExam = (examData) => {
    const isNew = !examData.id;
    const examId = examData.id || `exm-${Date.now()}`;
    const payload = { ...examData, id: examId };

    if (!payload.title || !payload.courseId || !payload.date || !payload.startTime || !payload.endTime) {
      triggerAlert({
        type: 'error',
        title: 'Incomplete Exam Details',
        message: 'Please provide Title, Course, Exam Date, Start Time, and End Time.',
        code: 'ERR_EXAM_INCOMPLETE'
      });
      return false;
    }

    if (payload.startTime >= payload.endTime) {
      triggerAlert({
        type: 'error',
        title: 'Invalid Exam Hours',
        message: 'Exam start time must be earlier than the end time.',
        code: 'ERR_EXAM_TIME_ORDER'
      });
      return false;
    }

    if (isNew) {
      setExams(prev => [payload, ...prev]);
      addToast('Exam Scheduled', `${payload.title} scheduled for ${payload.date}`, 'success');
    } else {
      setExams(prev => prev.map(e => e.id === examId ? payload : e));
      addToast('Exam Updated', `${payload.title} details updated`, 'success');
    }
    return true;
  };

  const deleteExam = (examId) => {
    setExams(prev => prev.filter(e => e.id !== examId));
    addToast('Exam Deleted', 'Exam removed from schedule', 'info');
  };

  // --- EXAM MARKS ---
  const saveExamMarks = ({ examId, studentId, marksObtained, isAbsent, remarks }) => {
    const targetExam = exams.find(e => e.id === examId);
    const totalMarks = targetExam ? targetExam.totalMarks : 100;

    if (!isAbsent) {
      const validation = validateExamMarks(marksObtained, totalMarks);
      if (!validation.isValid) {
        triggerAlert({
          type: 'error',
          title: validation.errorTitle,
          message: validation.errorMessage,
          code: validation.code,
          buttonText: 'Correct Marks'
        });
        return false;
      }
    }

    setExamMarks(prev => {
      const existingIndex = prev.findIndex(m => m.examId === examId && m.studentId === studentId);
      const markRecord = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `mrk-${Date.now()}`,
        examId,
        studentId,
        marksObtained: isAbsent ? 0 : Number(marksObtained),
        isAbsent: Boolean(isAbsent),
        remarks: remarks || ''
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = markRecord;
        return updated;
      } else {
        return [...prev, markRecord];
      }
    });

    addToast('Marks Saved', 'Student assessment record updated', 'success');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        classrooms,
        saveClassroom,
        deleteClassroom,
        courses,
        saveCourse,
        deleteCourse,
        teachers,
        saveTeacher,
        deleteTeacher,
        students,
        saveStudent,
        deleteStudent,
        feePayments,
        collectStudentFee,
        timetableSlots,
        saveTimetableSlot,
        deleteTimetableSlot,
        exams,
        saveExam,
        deleteExam,
        examMarks,
        saveExamMarks,
        currentUser,
        currentRole: 'admin',
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
        alertModal,
        triggerAlert,
        closeAlert,
        toasts,
        addToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
