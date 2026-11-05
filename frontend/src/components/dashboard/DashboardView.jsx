import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  Calendar, 
  Award, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  PlusCircle,
  ChevronRight
} from 'lucide-react';

export default function DashboardView({ onOpenStudentModal, onOpenFeeModal, onOpenSlotModal, onOpenExamModal }) {
  const { 
    students, 
    teachers, 
    courses, 
    feePayments, 
    timetableSlots, 
    exams, 
    setActiveTab 
  } = useApp();

  // Financial aggregates
  const totalAgreedFee = students.reduce((acc, s) => acc + (s.totalFee || 0), 0);
  const totalCollectedFee = students.reduce((acc, s) => acc + (s.paidFee || 0), 0);
  const totalPendingFee = students.reduce((acc, s) => acc + (s.balance || 0), 0);

  // Today's Timetable (simulating Monday / current day)
  const currentDay = "Monday";
  const todaySlots = timetableSlots.filter(s => s.day === currentDay);

  // Upcoming Exams
  const upcomingExams = exams.filter(e => e.status === 'Upcoming');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl gradient-coral p-6 text-white shadow-glow">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-white/20 tracking-wide uppercase text-[11px]">
            Administrator Control Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Skyline Learning Center
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-4">
            Manage student admissions, manual fee structures, teacher course assignments, conflict-free lecture timetables, and exam reports from one unified dashboard.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenStudentModal}
              className="bg-white text-coral-600 font-bold text-xs px-4 py-2.5 rounded-full shadow-md hover:bg-coral-50 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={onOpenFeeModal}
              className="bg-navy-900/60 backdrop-blur-md text-white font-bold text-xs px-4 py-2.5 rounded-full border border-white/20 hover:bg-navy-900 transition-all flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Collect Fee</span>
            </button>
            <button
              onClick={onOpenSlotModal}
              className="bg-navy-900/60 backdrop-blur-md text-white font-bold text-xs px-4 py-2.5 rounded-full border border-white/20 hover:bg-navy-900 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Slot</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Students */}
        <div 
          onClick={() => setActiveTab('students')}
          className="bg-white p-4 sm:p-5 rounded-3xl shadow-soft border border-gray-100 cursor-pointer shadow-card-hover"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-coral-50 flex items-center justify-center text-coral-500">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-navy-800">{students.length}</div>
          <div className="text-xs text-muted font-medium mt-0.5">Total Enrolled Students</div>
        </div>

        {/* Active Teachers */}
        <div 
          onClick={() => setActiveTab('teachers')}
          className="bg-white p-4 sm:p-5 rounded-3xl shadow-soft border border-gray-100 cursor-pointer shadow-card-hover"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Faculty</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-navy-800">{teachers.length}</div>
          <div className="text-xs text-muted font-medium mt-0.5">Faculty Members</div>
        </div>

        {/* Fee Collected */}
        <div 
          onClick={() => setActiveTab('fees')}
          className="bg-white p-4 sm:p-5 rounded-3xl shadow-soft border border-gray-100 cursor-pointer shadow-card-hover"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Received</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-navy-800">
            Rs. {totalCollectedFee.toLocaleString()}
          </div>
          <div className="text-xs text-muted font-medium mt-0.5">Total Fee Collected</div>
        </div>

        {/* Pending Fee */}
        <div 
          onClick={() => setActiveTab('fees')}
          className="bg-white p-4 sm:p-5 rounded-3xl shadow-soft border border-gray-100 cursor-pointer shadow-card-hover"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Due</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-coral-600">
            Rs. {totalPendingFee.toLocaleString()}
          </div>
          <div className="text-xs text-muted font-medium mt-0.5">Pending Receivables</div>
        </div>
      </div>

      {/* Two Column Layout: Today's Timetable & Recent Fee Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Lectures */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-soft border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-coral-50 flex items-center justify-center text-coral-500">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-navy-800">Today's Lectures ({currentDay})</h3>
            </div>
            <button
              onClick={() => setActiveTab('timetable')}
              className="text-xs font-bold text-coral-500 hover:text-coral-600 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todaySlots.length === 0 ? (
              <p className="text-xs text-muted py-6 text-center">No lecture sessions scheduled for today.</p>
            ) : (
              todaySlots.map((slot) => {
                const course = courses.find(c => c.id === slot.courseId);
                const teacher = teachers.find(t => t.id === slot.teacherId);
                return (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-2xl bg-canvas border border-gray-100 flex items-center justify-between gap-3 shadow-sm hover:border-coral-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-center shrink-0">
                        <div className="text-[10px] font-bold text-coral-500">{slot.startTime}</div>
                        <div className="text-[9px] text-muted">{slot.endTime}</div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-navy-800">{course?.title || 'Course'}</h4>
                        <p className="text-[11px] text-muted">{teacher?.fullName} • {slot.room}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-coral-50 text-coral-600 px-2 py-0.5 rounded-full shrink-0">
                      {course?.code}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Fee Payments */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-soft border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-navy-800">Recent Fee Collections</h3>
            </div>
            <button
              onClick={() => setActiveTab('fees')}
              className="text-xs font-bold text-coral-500 hover:text-coral-600 flex items-center gap-1"
            >
              <span>Cashier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {feePayments.slice(0, 3).map((pmt) => (
              <div
                key={pmt.id}
                className="p-3.5 rounded-2xl bg-canvas border border-gray-100 flex items-center justify-between gap-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-navy-800">{pmt.studentName}</h4>
                    <span className="text-[10px] text-muted font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">
                      {pmt.rollNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">
                    {pmt.receiptNumber} • {pmt.paymentMethod} • {pmt.paymentDate}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-emerald-600">
                    +Rs. {pmt.amountPaid.toLocaleString()}
                  </div>
                  <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
