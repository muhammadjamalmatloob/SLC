// Strict Validation Utilities for SLC Academy

export const MAX_PHOTO_BYTES = 100 * 1024; // 100 KB (102,400 bytes)

/**
 * Validates photo file size and format (strict 100 KB limit)
 */
export function validatePhotoUpload(file) {
  if (!file) {
    return { isValid: true };
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      errorTitle: "Unsupported File Format",
      errorMessage: `Selected file format (${file.type || 'unknown'}) is not supported. Please upload a JPEG, PNG, or WebP image.`,
      code: "ERR_INVALID_IMAGE_FORMAT"
    };
  }

  const actualSizeKb = (file.size / 1024).toFixed(1);
  if (file.size > MAX_PHOTO_BYTES) {
    return {
      isValid: false,
      errorTitle: "Profile Photo Exceeds 100 KB",
      errorMessage: `Image size is ${actualSizeKb} KB, which violates the strict 100 KB maximum file size limit. Please choose a smaller photo or compress it before uploading.`,
      code: "ERR_PHOTO_SIZE_LIMIT",
      actualKb: actualSizeKb,
      maxAllowedKb: 100
    };
  }

  return { isValid: true, sizeKb: actualSizeKb };
}

/**
 * Checks time overlap between two intervals [s1, e1] and [s2, e2]
 * Times are "HH:MM" 24hr strings.
 */
function isTimeOverlapping(start1, end1, start2, end2) {
  return start1 < end2 && end1 > start2;
}

/**
 * Validates Timetable slot constraints:
 * 1. Valid time range (end > start)
 * 2. Teacher schedule collision check (No overlapping slots for same teacher on same day)
 * 3. Room collision check (No overlapping slots in same room on same day)
 */
export function validateTimetableSlot({ slot, existingSlots, teachers, courses }) {
  const { id, day, startTime, endTime, teacherId, room, courseId } = slot;

  if (!day || !startTime || !endTime || !teacherId || !room || !courseId) {
    return {
      isValid: false,
      errorTitle: "Missing Timetable Fields",
      errorMessage: "Please fill in all required slot fields: Day, Start Time, End Time, Teacher, Course, and Room.",
      code: "ERR_MISSING_FIELDS"
    };
  }

  if (startTime >= endTime) {
    return {
      isValid: false,
      errorTitle: "Invalid Time Sequence",
      errorMessage: `Lecture start time (${startTime}) must be strictly earlier than end time (${endTime}).`,
      code: "ERR_INVALID_TIME_RANGE"
    };
  }

  const teacher = teachers.find(t => t.id === teacherId);
  const teacherName = teacher ? teacher.fullName : "Selected Teacher";

  // Check 1: Teacher Overlap Constraint
  for (const s of existingSlots) {
    if (s.id === id) continue; // Skip self when updating

    if (s.day === day && s.teacherId === teacherId) {
      if (isTimeOverlapping(startTime, endTime, s.startTime, s.endTime)) {
        const conflictCourse = courses.find(c => c.id === s.courseId)?.title || "another course";
        return {
          isValid: false,
          errorTitle: "Teacher Schedule Collision",
          errorMessage: `Constraint Violation: ${teacherName} is already assigned to teach "${conflictCourse}" in ${s.room} from ${s.startTime} to ${s.endTime} on ${day}. Course timings cannot overlap.`,
          code: "ERR_TEACHER_SCHEDULE_OVERLAP",
          details: {
            teacher: teacherName,
            day,
            attemptedTime: `${startTime} - ${endTime}`,
            existingConflict: `${s.startTime} - ${s.endTime} (${conflictCourse} in ${s.room})`
          }
        };
      }
    }
  }

  // Check 2: Room Collision Constraint
  for (const s of existingSlots) {
    if (s.id === id) continue; // Skip self when updating

    if (s.day === day && s.room.trim().toLowerCase() === room.trim().toLowerCase()) {
      if (isTimeOverlapping(startTime, endTime, s.startTime, s.endTime)) {
        const conflictCourse = courses.find(c => c.id === s.courseId)?.title || "another class";
        const conflictTeacher = teachers.find(t => t.id === s.teacherId)?.fullName || "another instructor";
        return {
          isValid: false,
          errorTitle: "Classroom Double-Booking Clash",
          errorMessage: `Room Collision: "${room}" is already booked on ${day} for "${conflictCourse}" with ${conflictTeacher} from ${s.startTime} to ${s.endTime}. Please select another room or time.`,
          code: "ERR_ROOM_COLLISION",
          details: {
            room,
            day,
            attemptedTime: `${startTime} - ${endTime}`,
            existingBooking: `${s.startTime} - ${s.endTime} (${conflictCourse})`
          }
        };
      }
    }
  }

  return { isValid: true };
}

/**
 * Validates Fee Collection
 */
export function validateFeePayment(amount, student) {
  const numericAmount = Number(amount);

  if (isNaN(numericAmount) || numericAmount <= 0) {
    return {
      isValid: false,
      errorTitle: "Invalid Payment Amount",
      errorMessage: "Payment amount must be a positive number greater than zero.",
      code: "ERR_INVALID_FEE_AMOUNT"
    };
  }

  if (numericAmount > student.balance) {
    return {
      isValid: false,
      errorTitle: "Excessive Payment Amount",
      errorMessage: `Payment amount (Rs. ${numericAmount.toLocaleString()}) cannot exceed the student's remaining due balance of Rs. ${student.balance.toLocaleString()}.`,
      code: "ERR_FEE_OVERPAYMENT",
      details: {
        enteredAmount: numericAmount,
        maxRemainingBalance: student.balance
      }
    };
  }

  return { isValid: true, cleanAmount: numericAmount };
}

/**
 * Validates Student Form
 */
export function validateStudentForm(studentData, existingStudents = []) {
  if (!studentData.fullName || studentData.fullName.trim().length < 3) {
    return {
      isValid: false,
      errorTitle: "Invalid Student Name",
      errorMessage: "Full name must be at least 3 characters long.",
      code: "ERR_INVALID_NAME"
    };
  }

  if (!studentData.rollNumber || studentData.rollNumber.trim().length < 2) {
    return {
      isValid: false,
      errorTitle: "Roll Number Required",
      errorMessage: "Please provide a valid unique Roll Number.",
      code: "ERR_ROLL_NUMBER_REQUIRED"
    };
  }

  // Check unique roll number
  const duplicate = existingStudents.find(
    s => s.id !== studentData.id && s.rollNumber.toLowerCase() === studentData.rollNumber.trim().toLowerCase()
  );
  if (duplicate) {
    return {
      isValid: false,
      errorTitle: "Duplicate Roll Number",
      errorMessage: `Roll number "${studentData.rollNumber}" is already assigned to student ${duplicate.fullName}.`,
      code: "ERR_DUPLICATE_ROLL"
    };
  }

  if (!studentData.enrolledCourseIds || studentData.enrolledCourseIds.length === 0) {
    return {
      isValid: false,
      errorTitle: "No Courses Selected",
      errorMessage: "Admin must manually select at least one course for the student.",
      code: "ERR_NO_COURSES_SELECTED"
    };
  }

  const fee = Number(studentData.totalFee);
  if (isNaN(fee) || fee < 0) {
    return {
      isValid: false,
      errorTitle: "Invalid Total Fee",
      errorMessage: "Admin must manually enter a valid total fee (cannot be negative).",
      code: "ERR_INVALID_TOTAL_FEE"
    };
  }

  return { isValid: true };
}

/**
 * Validates Teacher Form
 */
export function validateTeacherForm(teacherData, existingTeachers = []) {
  if (!teacherData.fullName || teacherData.fullName.trim().length < 3) {
    return {
      isValid: false,
      errorTitle: "Invalid Teacher Name",
      errorMessage: "Teacher full name must be at least 3 characters long.",
      code: "ERR_INVALID_TEACHER_NAME"
    };
  }

  if (!teacherData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherData.email)) {
    return {
      isValid: false,
      errorTitle: "Invalid Email Address",
      errorMessage: "Please enter a valid email address.",
      code: "ERR_INVALID_EMAIL"
    };
  }

  const dup = existingTeachers.find(
    t => t.id !== teacherData.id && t.email.toLowerCase() === teacherData.email.trim().toLowerCase()
  );
  if (dup) {
    return {
      isValid: false,
      errorTitle: "Email Already In Use",
      errorMessage: `The email address "${teacherData.email}" is already registered to ${dup.fullName}.`,
      code: "ERR_DUPLICATE_TEACHER_EMAIL"
    };
  }

  if (!teacherData.qualification || teacherData.qualification.trim().length < 2) {
    return {
      isValid: false,
      errorTitle: "Qualification Required",
      errorMessage: "Please enter teacher qualification and background.",
      code: "ERR_MISSING_QUALIFICATION"
    };
  }

  return { isValid: true };
}

/**
 * Validates Exam Marks
 */
export function validateExamMarks(marks, totalMarks) {
  const num = Number(marks);
  if (isNaN(num) || num < 0) {
    return {
      isValid: false,
      errorTitle: "Invalid Marks Entry",
      errorMessage: "Obtained marks cannot be negative or non-numeric.",
      code: "ERR_INVALID_MARKS"
    };
  }

  if (num > totalMarks) {
    return {
      isValid: false,
      errorTitle: "Marks Exceed Total Limit",
      errorMessage: `Obtained marks (${num}) cannot exceed the exam's total maximum marks of ${totalMarks}.`,
      code: "ERR_MARKS_EXCEED_TOTAL"
    };
  }

  return { isValid: true, cleanMarks: num };
}
