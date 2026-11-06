// Initial Hardcoded Data for Skyline Learning Center (SLC Academy)
// Dedicated Cambridge & Edexcel O-Levels and A-Levels Academic Stream

// Default neutral gray & white avatar placeholder SVG data URI
export const DEFAULT_AVATAR_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' fill='%23F1F5F9'/%3E%3Ccircle cx='64' cy='46' r='22' fill='%2394A3B8'/%3E%3Cpath d='M26 114c0-20.987 17.013-38 38-38s38 17.013 38 38z' fill='%2394A3B8'/%3E%3C/svg%3E";

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
    name: "Computer Science Lab",
    capacity: 25,
    floor: "2nd Floor",
    building: "IT Wing",
    type: "Computer Lab"
  },
  {
    id: "rm-phy",
    name: "Physics Practical Lab",
    capacity: 25,
    floor: "Ground Floor",
    building: "Science Block",
    type: "Science Lab"
  },
  {
    id: "rm-chm",
    name: "Chemistry Practical Lab",
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

// O-Levels & A-Levels Cambridge/Edexcel Curriculum
export const initialCourses = [
  {
    id: "crs-1",
    code: "MTH-4024",
    title: "O-Level Mathematics (Syllabus D)",
    className: "O-Levels",
    sectionName: "Morning Batch",
    description: "Numbers, Algebra, Trigonometry, Coordinate Geometry, Probability & Vectors.",
    assignedTeacherId: "tch-1",
    enrolledCount: 16
  },
  {
    id: "crs-2",
    code: "PHY-5054",
    title: "O-Level Physics",
    className: "O-Levels",
    sectionName: "Morning Batch",
    description: "Mechanics, Thermal Physics, Waves, Sound, Light, Electricity & Magnetism.",
    assignedTeacherId: "tch-2",
    enrolledCount: 14
  },
  {
    id: "crs-3",
    code: "CHM-5070",
    title: "O-Level Chemistry",
    className: "O-Levels",
    sectionName: "Evening Batch",
    description: "Atomic structure, Stoichiometry, Chemical Reactions, Organic Chemistry & Lab Practicals.",
    assignedTeacherId: "tch-2",
    enrolledCount: 11
  },
  {
    id: "crs-4",
    code: "CS-2210",
    title: "O-Level Computer Science",
    className: "O-Levels",
    sectionName: "CS Wing",
    description: "Computer systems, Data representation, Logic gates, Algorithm design & Python programming.",
    assignedTeacherId: "tch-3",
    enrolledCount: 15
  },
  {
    id: "crs-5",
    code: "ENG-1123",
    title: "O-Level English Language",
    className: "O-Levels",
    sectionName: "Section A",
    description: "Directed writing, Composition, Comprehension analysis & Language mechanics.",
    assignedTeacherId: "tch-4",
    enrolledCount: 18
  },
  {
    id: "crs-6",
    code: "MTH-9709",
    title: "A-Level Pure Mathematics (P1 & P3) & Mechanics",
    className: "A-Levels",
    sectionName: "AS & A2 Batch",
    description: "Quadratics, Functions, Differentiation, Integration, Vectors & Mechanics (M1).",
    assignedTeacherId: "tch-1",
    enrolledCount: 12
  },
  {
    id: "crs-7",
    code: "PHY-9702",
    title: "A-Level Physics (Theory & Advanced Practicals)",
    className: "A-Levels",
    sectionName: "Senior Batch",
    description: "Kinematics, Dynamics, Electric fields, Nuclear physics & Advanced practical skills (Paper 3).",
    assignedTeacherId: "tch-2",
    enrolledCount: 10
  },
  {
    id: "crs-8",
    code: "CS-9618",
    title: "A-Level Computer Science (Theory & Python)",
    className: "A-Levels",
    sectionName: "Advanced Coding Wing",
    description: "OOP, Abstract Data Types, Recursion, System software, Security & Paper 4 Python Practical.",
    assignedTeacherId: "tch-3",
    enrolledCount: 13
  },
  {
    id: "crs-9",
    code: "ECN-9708",
    title: "A-Level Economics",
    className: "A-Levels",
    sectionName: "Business & Humanities",
    description: "Microeconomics (Price system, market failure) & Macroeconomics (Fiscal/monetary policy).",
    assignedTeacherId: "tch-4",
    enrolledCount: 9
  }
];

// Faculty with @gmail.com addresses
export const initialTeachers = [
  {
    id: "tch-1",
    fullName: "Sir Salman Ali",
    email: "salman.ali.cambridge@gmail.com",
    phone: "+92 300 1234567",
    qualification: "M.Phil Mathematics, QAU",
    specialization: "O/A-Level Pure Mathematics, Mechanics & Statistics",
    assignedCourses: ["crs-1", "crs-6"],
    photoUrl: DEFAULT_AVATAR_PLACEHOLDER,
    photoSizeKb: 12,
    status: "Active"
  },
  {
    id: "tch-2",
    fullName: "Dr. Sarah Khan",
    email: "sarah.khan.physics@gmail.com",
    phone: "+92 321 9876543",
    qualification: "Ph.D. Applied Physics",
    specialization: "O/A-Level Physics & Chemistry Practicals Specialist",
    assignedCourses: ["crs-2", "crs-3", "crs-7"],
    photoUrl: DEFAULT_AVATAR_PLACEHOLDER,
    photoSizeKb: 12,
    status: "Active"
  },
  {
    id: "tch-3",
    fullName: "Prof. Tariq Mahmood",
    email: "tariq.mahmood.cs@gmail.com",
    phone: "+92 333 4567890",
    qualification: "MS Software Engineering, FAST",
    specialization: "O/A-Level Computer Science (Paper 2 & 4 Python Coding)",
    assignedCourses: ["crs-4", "crs-8"],
    photoUrl: DEFAULT_AVATAR_PLACEHOLDER,
    photoSizeKb: 12,
    status: "Active"
  },
  {
    id: "tch-4",
    fullName: "Ms. Ayesha Siddiqui",
    email: "ayesha.siddiqui.edu@gmail.com",
    phone: "+92 345 6789012",
    qualification: "MA English Literature, PU & Cambridge Certified",
    specialization: "O-Level English Language (1123) & A-Level Economics (9708)",
    assignedCourses: ["crs-5", "crs-9"],
    photoUrl: DEFAULT_AVATAR_PLACEHOLDER,
    photoSizeKb: 12,
    status: "Active"
  }
];

// O/A-Levels Students with customized, manually agreed fees
export const initialStudents = [
  {
    id: "std-1",
    rollNumber: "SLC-2026-001",
    fullName: "Hamza Farooq",
    email: "hamza.farooq@gmail.com",
    phone: "+92 312 3456789",
    guardianName: "Farooq Ahmed",
    guardianPhone: "+92 301 2345678",
    enrolledCourseIds: ["crs-1", "crs-4"], // O-Level Math + O-Level CS
    totalFee: 14000, // Agreed total fee set manually by admin
    paidFee: 14000,
    balance: 0,
    feeStatus: "PAID",
    admissionDate: "2026-09-01",
    photoUrl: DEFAULT_AVATAR_PLACEHOLDER,
    photoSizeKb: 12
  },
  {
    id: "std-2",
    rollNumber: "SLC-2026-002",
    fullName: "Zainab Fatima",
    email: "zainab.fatima@gmail.com",
    phone: "+92 313 4567890",
    guardianName: "Muhammad Qasim",
    guardianPhone: "+92 302 3456789",
    enrolledCourseIds: ["crs-2", "crs-3"], // O-Level Physics + O-Level Chemistry
    totalFee: 12500, // Custom package agreed by admin
    paidFee: 7500,
    balance: 5000,
    feeStatus: "PARTIAL",
    admissionDate: "2026-09-05",
    photoUrl: DEFAULT_AVATAR_PLACEHOLDER,
    photoSizeKb: 12
  },
  {
    id: "std-3",
    rollNumber: "SLC-2026-003",
    fullName: "Bilal Hassan",
    email: "bilal.hassan@gmail.com",
    phone: "+92 314 5678901",
    guardianName: "Hassan Raza",
    guardianPhone: "+92 303 4567890",
    enrolledCourseIds: ["crs-6", "crs-8"], // A-Level Pure Math + A-Level CS
    totalFee: 16000, // Custom A-Level package set by admin
    paidFee: 0,
    balance: 16000,
    feeStatus: "PENDING",
    admissionDate: "2026-09-10",
    photoUrl: DEFAULT_AVATAR_PLACEHOLDER,
    photoSizeKb: 12
  },
  {
    id: "std-4",
    rollNumber: "SLC-2026-004",
    fullName: "Maryam Noor",
    email: "maryam.noor@gmail.com",
    phone: "+92 315 6789012",
    guardianName: "Noor Alam",
    guardianPhone: "+92 304 5678901",
    enrolledCourseIds: ["crs-6", "crs-7", "crs-8"], // A-Level Math, Physics & CS
    totalFee: 22000, // Custom 3-subject A-Level package agreed by admin
    paidFee: 15000,
    balance: 7000,
    feeStatus: "PARTIAL",
    admissionDate: "2026-09-12",
    photoUrl: DEFAULT_AVATAR_PLACEHOLDER,
    photoSizeKb: 12
  }
];

export const initialFeePayments = [
  {
    id: "pmt-1",
    receiptNumber: "REC-2026-901",
    studentId: "std-1",
    studentName: "Hamza Farooq",
    rollNumber: "SLC-2026-001",
    amountPaid: 14000,
    paymentDate: "2026-09-02",
    paymentMethod: "Cash",
    receivedBy: "Admin",
    notes: "Full session tuition cleared"
  },
  {
    id: "pmt-2",
    receiptNumber: "REC-2026-902",
    studentId: "std-2",
    studentName: "Zainab Fatima",
    rollNumber: "SLC-2026-002",
    amountPaid: 7500,
    paymentDate: "2026-09-06",
    paymentMethod: "Online Bank Transfer",
    receivedBy: "Admin",
    notes: "1st Installment paid"
  },
  {
    id: "pmt-3",
    receiptNumber: "REC-2026-903",
    studentId: "std-4",
    studentName: "Maryam Noor",
    rollNumber: "SLC-2026-004",
    amountPaid: 15000,
    paymentDate: "2026-09-14",
    paymentMethod: "Cash at Desk",
    receivedBy: "Admin",
    notes: "Major installment received"
  }
];

// O/A-Levels Lecture Schedule
export const initialTimetableSlots = [
  // Monday
  {
    id: "slot-1",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    courseId: "crs-1", // O-Level Math (4024)
    teacherId: "tch-1",
    room: "Room 101"
  },
  {
    id: "slot-2",
    day: "Monday",
    startTime: "10:45",
    endTime: "12:15",
    courseId: "crs-2", // O-Level Physics (5054)
    teacherId: "tch-2",
    room: "Physics Practical Lab"
  },
  {
    id: "slot-3",
    day: "Monday",
    startTime: "13:00",
    endTime: "14:30",
    courseId: "crs-6", // A-Level Pure Math (9709)
    teacherId: "tch-1",
    room: "Room 102"
  },
  // Tuesday
  {
    id: "slot-4",
    day: "Tuesday",
    startTime: "09:00",
    endTime: "10:30",
    courseId: "crs-3", // O-Level Chemistry (5070)
    teacherId: "tch-2",
    room: "Chemistry Practical Lab"
  },
  {
    id: "slot-5",
    day: "Tuesday",
    startTime: "11:00",
    endTime: "12:30",
    courseId: "crs-4", // O-Level CS (2210)
    teacherId: "tch-3",
    room: "Computer Science Lab"
  },
  {
    id: "slot-6",
    day: "Tuesday",
    startTime: "13:00",
    endTime: "14:30",
    courseId: "crs-7", // A-Level Physics (9702)
    teacherId: "tch-2",
    room: "Physics Practical Lab"
  },
  // Wednesday
  {
    id: "slot-7",
    day: "Wednesday",
    startTime: "09:00",
    endTime: "10:30",
    courseId: "crs-1", // O-Level Math
    teacherId: "tch-1",
    room: "Room 101"
  },
  {
    id: "slot-8",
    day: "Wednesday",
    startTime: "11:00",
    endTime: "12:30",
    courseId: "crs-8", // A-Level CS (9618)
    teacherId: "tch-3",
    room: "Computer Science Lab"
  },
  {
    id: "slot-9",
    day: "Wednesday",
    startTime: "13:00",
    endTime: "14:30",
    courseId: "crs-5", // O-Level English (1123)
    teacherId: "tch-4",
    room: "Room 102"
  },
  // Thursday
  {
    id: "slot-10",
    day: "Thursday",
    startTime: "09:00",
    endTime: "10:30",
    courseId: "crs-6", // A-Level Pure Math
    teacherId: "tch-1",
    room: "Room 101"
  },
  {
    id: "slot-11",
    day: "Thursday",
    startTime: "11:00",
    endTime: "12:30",
    courseId: "crs-7", // A-Level Physics
    teacherId: "tch-2",
    room: "Physics Practical Lab"
  },
  {
    id: "slot-12",
    day: "Thursday",
    startTime: "13:00",
    endTime: "14:30",
    courseId: "crs-9", // A-Level Economics (9708)
    teacherId: "tch-4",
    room: "Room 102"
  },
  // Friday
  {
    id: "slot-13",
    day: "Friday",
    startTime: "09:00",
    endTime: "10:30",
    courseId: "crs-4", // O-Level CS
    teacherId: "tch-3",
    room: "Computer Science Lab"
  },
  {
    id: "slot-14",
    day: "Friday",
    startTime: "10:45",
    endTime: "12:15",
    courseId: "crs-8", // A-Level CS
    teacherId: "tch-3",
    room: "Computer Science Lab"
  }
];

export const initialExams = [
  {
    id: "exm-1",
    title: "Cambridge Mock Exam: O-Level Mathematics (4024/12)",
    courseId: "crs-1",
    date: "2026-11-20",
    startTime: "09:30",
    endTime: "12:00",
    totalMarks: 100,
    passingMarks: 50,
    room: "Main Examination Hall A",
    status: "Upcoming"
  },
  {
    id: "exm-2",
    title: "Monthly Topical Assessment: A-Level Physics Mechanics (9702/11)",
    courseId: "crs-7",
    date: "2026-11-24",
    startTime: "10:00",
    endTime: "11:30",
    totalMarks: 50,
    passingMarks: 25,
    room: "Physics Practical Lab",
    status: "Upcoming"
  },
  {
    id: "exm-3",
    title: "Cambridge Practical Assessment: A-Level Computer Science (9618/02)",
    courseId: "crs-8",
    date: "2026-10-28",
    startTime: "13:00",
    endTime: "15:00",
    totalMarks: 75,
    passingMarks: 40,
    room: "Computer Science Lab",
    status: "Completed"
  }
];

export const initialExamMarks = [
  {
    id: "mrk-1",
    examId: "exm-3",
    studentId: "std-3", // Bilal Hassan
    marksObtained: 68,
    isAbsent: false,
    remarks: "Exceptional code structuring and algorithm design."
  },
  {
    id: "mrk-2",
    examId: "exm-3",
    studentId: "std-4", // Maryam Noor
    marksObtained: 71,
    isAbsent: false,
    remarks: "Outstanding performance in Paper 2 & 4 syntax."
  }
];
