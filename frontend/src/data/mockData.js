// Initial Hardcoded Data for Skyline Learning Center (SLC Academy)

export const initialClassrooms = [
  {
    id: "rm-101",
    name: "Room 101",
    capacity: 35,
    floor: "1st Floor",
    building: "Main Academic Block",
    type: "Lecture Hall"
  },
  {
    id: "rm-102",
    name: "Room 102",
    capacity: 30,
    floor: "1st Floor",
    building: "Academic Wing B",
    type: "Classroom"
  },
  {
    id: "rm-cs",
    name: "Computer Lab",
    capacity: 25,
    floor: "2nd Floor",
    building: "IT Wing",
    type: "Computer Lab"
  },
  {
    id: "rm-phy",
    name: "Physics Lab 1",
    capacity: 25,
    floor: "Ground Floor",
    building: "Science Block",
    type: "Science Lab"
  },
  {
    id: "rm-chm",
    name: "Chemistry Lab 2",
    capacity: 25,
    floor: "Ground Floor",
    building: "Science Block",
    type: "Science Lab"
  },
  {
    id: "rm-hall",
    name: "Main Examination Hall A",
    capacity: 80,
    floor: "3rd Floor",
    building: "Main Academic Block",
    type: "Auditorium"
  }
];

export const initialCourses = [
  {
    id: "crs-1",
    code: "MTH-101",
    title: "Advanced Mathematics",
    className: "O-Levels",
    sectionName: "Section A",
    description: "Calculus, Linear Algebra, and Trigonometric applications.",
    defaultFee: 6500,
    assignedTeacherId: "tch-1",
    enrolledCount: 12
  },
  {
    id: "crs-2",
    code: "PHY-201",
    title: "Applied Physics",
    className: "A-Levels",
    sectionName: "Section A",
    description: "Mechanics, Thermodynamics, and Electromagnetism with practicals.",
    defaultFee: 6000,
    assignedTeacherId: "tch-2",
    enrolledCount: 10
  },
  {
    id: "crs-3",
    code: "CS-101",
    title: "Computer Science & Python",
    className: "A-Levels",
    sectionName: "CS Wing",
    description: "Object-oriented programming, algorithms, and database essentials.",
    defaultFee: 7500,
    assignedTeacherId: "tch-3",
    enrolledCount: 15
  },
  {
    id: "crs-4",
    code: "CHM-101",
    title: "General Chemistry",
    className: "O-Levels",
    sectionName: "Section B",
    description: "Atomic structure, chemical bonding, and organic synthesis.",
    defaultFee: 5500,
    assignedTeacherId: "tch-2",
    enrolledCount: 8
  },
  {
    id: "crs-5",
    code: "ENG-102",
    title: "IELTS & Professional English",
    className: "Language Track",
    sectionName: "",
    description: "Academic writing, public speaking, and fluency training.",
    defaultFee: 5000,
    assignedTeacherId: "tch-4",
    enrolledCount: 14
  }
];

export const initialTeachers = [
  {
    id: "tch-1",
    fullName: "Sir Salman Ali",
    email: "salman.ali@slc.edu.pk",
    phone: "+92 300 1234567",
    qualification: "M.Phil Mathematics, QAU",
    specialization: "Pure & Applied Mathematics",
    assignedCourses: ["crs-1"],
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    photoSizeKb: 48,
    status: "Active"
  },
  {
    id: "tch-2",
    fullName: "Dr. Sarah Khan",
    email: "sarah.khan@slc.edu.pk",
    phone: "+92 321 9876543",
    qualification: "Ph.D. Physical Chemistry",
    specialization: "Applied Physics & Chemistry",
    assignedCourses: ["crs-2", "crs-4"],
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    photoSizeKb: 62,
    status: "Active"
  },
  {
    id: "tch-3",
    fullName: "Prof. Tariq Mahmood",
    email: "tariq.cs@slc.edu.pk",
    phone: "+92 333 4567890",
    qualification: "MS Software Engineering, FAST",
    specialization: "Python, AI & Data Structures",
    assignedCourses: ["crs-3"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    photoSizeKb: 55,
    status: "Active"
  },
  {
    id: "tch-4",
    fullName: "Ms. Ayesha Siddiqui",
    email: "ayesha.eng@slc.edu.pk",
    phone: "+92 345 6789012",
    qualification: "MA English Literature, PU",
    specialization: "Linguistics & IELTS Coaching",
    assignedCourses: ["crs-5"],
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    photoSizeKb: 42,
    status: "Active"
  }
];

export const initialStudents = [
  {
    id: "std-1",
    rollNumber: "SLC-2026-001",
    fullName: "Hamza Farooq",
    email: "hamza.001@student.slc.edu.pk",
    phone: "+92 312 3456789",
    guardianName: "Farooq Ahmed",
    guardianPhone: "+92 301 2345678",
    enrolledCourseIds: ["crs-1", "crs-3"],
    totalFee: 13500, // Manually entered by admin (standard: 6500+7500=14000, discount 500)
    paidFee: 13500,
    balance: 0,
    feeStatus: "PAID",
    admissionDate: "2026-09-01",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    photoSizeKb: 65
  },
  {
    id: "std-2",
    rollNumber: "SLC-2026-002",
    fullName: "Zainab Fatima",
    email: "zainab.002@student.slc.edu.pk",
    phone: "+92 313 4567890",
    guardianName: "Muhammad Qasim",
    guardianPhone: "+92 302 3456789",
    enrolledCourseIds: ["crs-2", "crs-4"],
    totalFee: 11000, // Manually entered
    paidFee: 6000,
    balance: 5000,
    feeStatus: "PARTIAL",
    admissionDate: "2026-09-05",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    photoSizeKb: 58
  },
  {
    id: "std-3",
    rollNumber: "SLC-2026-003",
    fullName: "Bilal Hassan",
    email: "bilal.003@student.slc.edu.pk",
    phone: "+92 314 5678901",
    guardianName: "Hassan Raza",
    guardianPhone: "+92 303 4567890",
    enrolledCourseIds: ["crs-3", "crs-5"],
    totalFee: 12000, // Manually entered
    paidFee: 0,
    balance: 12000,
    feeStatus: "PENDING",
    admissionDate: "2026-09-10",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    photoSizeKb: 72
  },
  {
    id: "std-4",
    rollNumber: "SLC-2026-004",
    fullName: "Maryam Noor",
    email: "maryam.004@student.slc.edu.pk",
    phone: "+92 315 6789012",
    guardianName: "Noor Alam",
    guardianPhone: "+92 304 5678901",
    enrolledCourseIds: ["crs-1", "crs-2", "crs-4"],
    totalFee: 17000, // Manually entered package
    paidFee: 10000,
    balance: 7000,
    feeStatus: "PARTIAL",
    admissionDate: "2026-09-12",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    photoSizeKb: 84
  }
];

export const initialFeePayments = [
  {
    id: "pmt-1",
    receiptNumber: "REC-2026-901",
    studentId: "std-1",
    studentName: "Hamza Farooq",
    rollNumber: "SLC-2026-001",
    amountPaid: 13500,
    paymentDate: "2026-09-02",
    paymentMethod: "Cash",
    receivedBy: "Admin",
    notes: "Full payment with concession"
  },
  {
    id: "pmt-2",
    receiptNumber: "REC-2026-902",
    studentId: "std-2",
    studentName: "Zainab Fatima",
    rollNumber: "SLC-2026-002",
    amountPaid: 6000,
    paymentDate: "2026-09-06",
    paymentMethod: "Online Transfer",
    receivedBy: "Admin",
    notes: "1st Installment paid"
  },
  {
    id: "pmt-3",
    receiptNumber: "REC-2026-903",
    studentId: "std-4",
    studentName: "Maryam Noor",
    rollNumber: "SLC-2026-004",
    amountPaid: 10000,
    paymentDate: "2026-09-14",
    paymentMethod: "Debit Card",
    receivedBy: "Admin",
    notes: "Advance 1st installment"
  }
];

export const initialTimetableSlots = [
  // Monday
  {
    id: "slot-1",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    courseId: "crs-1",
    teacherId: "tch-1", // Sir Salman Ali (assigned to MTH-101)
    room: "Room 101"
  },
  {
    id: "slot-2",
    day: "Monday",
    startTime: "10:45",
    endTime: "12:15",
    courseId: "crs-2",
    teacherId: "tch-2", // Dr. Sarah Khan (assigned to PHY-201)
    room: "Physics Lab 1"
  },
  {
    id: "slot-3",
    day: "Monday",
    startTime: "13:00",
    endTime: "14:30",
    courseId: "crs-3",
    teacherId: "tch-3", // Prof. Tariq Mahmood (assigned to CS-101)
    room: "Computer Lab"
  },
  // Tuesday
  {
    id: "slot-4",
    day: "Tuesday",
    startTime: "09:00",
    endTime: "10:30",
    courseId: "crs-4",
    teacherId: "tch-2",
    room: "Chemistry Lab 2"
  },
  {
    id: "slot-5",
    day: "Tuesday",
    startTime: "11:00",
    endTime: "12:30",
    courseId: "crs-5",
    teacherId: "tch-4",
    room: "Room 102"
  },
  // Wednesday
  {
    id: "slot-6",
    day: "Wednesday",
    startTime: "09:00",
    endTime: "10:30",
    courseId: "crs-1",
    teacherId: "tch-1",
    room: "Room 101"
  },
  {
    id: "slot-7",
    day: "Wednesday",
    startTime: "11:00",
    endTime: "12:30",
    courseId: "crs-3",
    teacherId: "tch-3",
    room: "Computer Lab"
  },
  // Thursday
  {
    id: "slot-8",
    day: "Thursday",
    startTime: "09:00",
    endTime: "10:30",
    courseId: "crs-2",
    teacherId: "tch-2",
    room: "Physics Lab 1"
  },
  {
    id: "slot-9",
    day: "Thursday",
    startTime: "11:00",
    endTime: "12:30",
    courseId: "crs-5",
    teacherId: "tch-4",
    room: "Room 102"
  },
  // Friday
  {
    id: "slot-10",
    day: "Friday",
    startTime: "09:00",
    endTime: "10:30",
    courseId: "crs-3",
    teacherId: "tch-3",
    room: "Computer Lab"
  },
  {
    id: "slot-11",
    day: "Friday",
    startTime: "10:45",
    endTime: "12:15",
    courseId: "crs-4",
    teacherId: "tch-2",
    room: "Chemistry Lab 2"
  }
];

export const initialExams = [
  {
    id: "exm-1",
    title: "Mid-Term Examination: Calculus & Algebra",
    courseId: "crs-1",
    date: "2026-11-15",
    startTime: "09:30",
    endTime: "12:00",
    totalMarks: 100,
    passingMarks: 50,
    room: "Main Examination Hall A",
    status: "Upcoming"
  },
  {
    id: "exm-2",
    title: "Monthly Physics Quiz & Practical",
    courseId: "crs-2",
    date: "2026-11-18",
    startTime: "10:00",
    endTime: "11:30",
    totalMarks: 50,
    passingMarks: 25,
    room: "Physics Lab 1",
    status: "Upcoming"
  },
  {
    id: "exm-3",
    title: "Python Programming Practical Assessment",
    courseId: "crs-3",
    date: "2026-10-25",
    startTime: "13:00",
    endTime: "15:00",
    totalMarks: 100,
    passingMarks: 60,
    room: "Computer Lab",
    status: "Completed"
  }
];

export const initialExamMarks = [
  {
    id: "mrk-1",
    examId: "exm-3",
    studentId: "std-1",
    marksObtained: 92,
    isAbsent: false,
    remarks: "Excellent problem-solving logic."
  },
  {
    id: "mrk-2",
    examId: "exm-3",
    studentId: "std-3",
    marksObtained: 78,
    isAbsent: false,
    remarks: "Good effort, refine syntax."
  }
];
