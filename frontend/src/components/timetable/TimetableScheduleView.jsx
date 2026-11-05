import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Plus, 
  Users, 
  Edit2, 
  Trash2, 
  Printer, 
  MapPin, 
  FileText
} from 'lucide-react';
import PdfViewerModal from '../common/PdfViewerModal';

export default function TimetableScheduleView({ onOpenAddSlot, onEditSlot }) {
  const { timetableSlots, courses, teachers, deleteTimetableSlot } = useApp();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Filter and sort by start time
  const daySlots = timetableSlots
    .filter(s => s.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-800">Lecture Timetable Scheduler</h2>
          <p className="text-xs text-muted">Conflict-free schedule engine with automated instructor linking</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Print Timetable Report button right from this page */}
          <button
            onClick={() => setReportModalOpen(true)}
            className="text-xs font-bold px-4 py-2.5 rounded-full bg-white text-navy-800 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-coral-500" />
            <span>Timetable Report (PDF)</span>
          </button>

          <button
            onClick={onOpenAddSlot}
            className="gradient-coral text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-glow flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lecture Slot</span>
          </button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="bg-white p-2 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-1.5 overflow-x-auto">
        {daysOfWeek.map((day) => {
          const count = timetableSlots.filter(s => s.day === day).length;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-0.5 transition-all ${
                isSelected
                  ? 'bg-coral-500 text-white shadow-glow'
                  : 'text-navy-700 hover:bg-gray-100'
              }`}
            >
              <span>{day}</span>
              <span className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-muted'}`}>
                {count} {count === 1 ? 'Class' : 'Classes'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slots List */}
      <div className="space-y-3">
        {daySlots.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-soft">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-navy-800">No lectures scheduled for {selectedDay}</h4>
            <p className="text-xs text-muted mt-1">Click "Add Lecture Slot" to schedule a class.</p>
          </div>
        ) : (
          daySlots.map((slot) => {
            const course = courses.find(c => c.id === slot.courseId);
            const teacher = teachers.find(t => t.id === slot.teacherId);

            return (
              <div
                key={slot.id}
                className="bg-white p-4 sm:p-5 rounded-3xl shadow-soft border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-coral-200 transition-all shadow-card-hover"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  {/* Time Badge */}
                  <div className="bg-coral-50 border border-coral-200 text-coral-600 rounded-2xl px-3.5 py-2.5 text-center shrink-0 min-w-[90px]">
                    <div className="text-xs font-black font-mono">{slot.startTime}</div>
                    <div className="text-[10px] text-muted font-mono">{slot.endTime}</div>
                  </div>

                  {/* Course & Faculty Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded">
                        {course?.code}
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-navy-800 truncate">
                        {course?.title || 'Unknown Course'}
                      </h3>
                      {course?.className && (
                        <span className="text-[10px] font-bold text-navy-700 bg-canvas px-2 py-0.5 rounded-full border border-gray-200">
                          {course.className}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-navy-600">
                      <span className="flex items-center gap-1.5 font-semibold text-navy-800">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        Instructor: {teacher?.fullName || 'Assigned Instructor'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-muted font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {slot.room}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
                  <button
                    onClick={() => onEditSlot(slot)}
                    className="p-2 text-navy-600 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                    title="Edit Slot"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove this lecture slot?`)) {
                        deleteTimetableSlot(slot.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                    title="Delete Slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CUSTOMIZED PDF VIEWER MODAL FOR TIMETABLE */}
      <PdfViewerModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Weekly Master Timetable Report"
        documentId="timetable-pdf-report-root"
        filename="SLC_Weekly_Timetable_Report.pdf"
        orientation="portrait"
      >
        <div className="text-navy-900 space-y-6">
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-navy-900">
            <div className="w-10 h-10 rounded-2xl gradient-coral text-white font-black text-sm flex items-center justify-center mx-auto mb-2 shadow-glow">
              SLC
            </div>
            <h2 className="text-xl font-black tracking-tight text-navy-900">
              SKYLINE LEARNING CENTER (SLC ACADEMY)
            </h2>
            <p className="text-xs uppercase font-extrabold text-coral-600 tracking-wider">
              Academic Affairs & Master Timetable Branch
            </p>
            <p className="text-[10px] text-muted mt-0.5">
              Weekly Master Lecture Schedule • Academic Year 2026-2027
            </p>
          </div>

          {/* Schedule Table Grouped by Days */}
          <div className="space-y-4">
            {daysOfWeek.map((day) => {
              const daySlots = timetableSlots
                .filter(s => s.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div key={day} className="space-y-1.5">
                  <div className="text-xs font-black uppercase text-coral-600 bg-coral-50 px-2.5 py-1 rounded inline-block">
                    {day}
                  </div>

                  {daySlots.length === 0 ? (
                    <p className="text-xs text-muted italic pl-3 py-0.5">No lectures scheduled.</p>
                  ) : (
                    <table className="w-full text-left text-xs border border-gray-300 rounded-lg overflow-hidden">
                      <thead className="bg-navy-900 text-white font-bold text-[11px]">
                        <tr>
                          <th className="py-2 px-3">Timing</th>
                          <th className="py-2 px-3">Course Code</th>
                          <th className="py-2 px-3">Course Name</th>
                          <th className="py-2 px-3">Class</th>
                          <th className="py-2 px-3">Instructor</th>
                          <th className="py-2 px-3">Room / Lab</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {daySlots.map((s) => {
                          const crs = courses.find(c => c.id === s.courseId);
                          const tch = teachers.find(t => t.id === s.teacherId);
                          return (
                            <tr key={s.id} className="hover:bg-gray-50/50">
                              <td className="py-2 px-3 font-mono font-bold text-coral-600">{s.startTime} - {s.endTime}</td>
                              <td className="py-2 px-3 font-mono font-semibold">{crs?.code}</td>
                              <td className="py-2 px-3 font-medium text-navy-900">{crs?.title}</td>
                              <td className="py-2 px-3">{crs?.className} {crs?.sectionName ? `(${crs.sectionName})` : ''}</td>
                              <td className="py-2 px-3 font-medium">{tch?.fullName}</td>
                              <td className="py-2 px-3 font-medium">{s.room}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>

          {/* Signatures */}
          <div className="pt-12 flex items-end justify-between text-xs text-navy-800">
            <div className="text-center">
              <div className="w-36 border-b border-gray-400 mb-1"></div>
              <span className="font-semibold text-muted">Timetable In-Charge</span>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-gray-400 mb-1"></div>
              <span className="font-semibold text-muted">Director Academics</span>
            </div>
          </div>
        </div>
      </PdfViewerModal>
    </div>
  );
}
