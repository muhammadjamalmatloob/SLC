import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, UserCheck, ShieldAlert } from 'lucide-react';

export default function SlotModal({ isOpen, onClose, slotToEdit = null }) {
  const { courses, teachers, classrooms, saveTimetableSlot } = useApp();

  const [formData, setFormData] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    courseId: '',
    room: ''
  });

  useEffect(() => {
    if (slotToEdit) {
      setFormData({
        day: slotToEdit.day || 'Monday',
        startTime: slotToEdit.startTime || '09:00',
        endTime: slotToEdit.endTime || '10:30',
        courseId: slotToEdit.courseId || courses[0]?.id || '',
        room: slotToEdit.room || (classrooms[0]?.name || 'Room 101')
      });
    } else {
      const defaultCourse = courses[0];
      setFormData({
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        courseId: defaultCourse ? defaultCourse.id : '',
        room: classrooms[0]?.name || 'Room 101'
      });
    }
  }, [slotToEdit, isOpen, courses, classrooms]);

  if (!isOpen) return null;

  // Selected course and its automatically assigned instructor
  const selectedCourse = courses.find(c => c.id === formData.courseId);
  const autoInstructor = teachers.find(t => t.id === selectedCourse?.assignedTeacherId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = saveTimetableSlot({
      ...slotToEdit,
      ...formData,
      teacherId: selectedCourse?.assignedTeacherId
    });
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 my-auto text-navy-800 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-navy-800">
              {slotToEdit ? 'Edit Lecture Slot' : 'Schedule New Lecture'}
            </h3>
            <p className="text-xs text-muted">Set day, time, course, and classroom</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-navy-800 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Day of Week */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Day of Week *</label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Lecture Start Time *</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full text-xs font-mono font-bold px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Lecture End Time *</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full text-xs font-mono font-bold px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
              />
            </div>
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Select Course Offering *</label>
            <select
              required
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white font-medium"
            >
              <option value="">-- Choose Course --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  [{c.code}] {c.title} — {c.className} {c.sectionName ? `(${c.sectionName})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* AUTO-SELECTED INSTRUCTOR DISPLAY (Locked according to requirement) */}
          <div className="p-3 bg-canvas rounded-2xl border border-gray-200">
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">
              Course Instructor (Auto-Assigned)
            </span>
            {autoInstructor ? (
              <div className="flex items-center gap-2.5 text-xs text-navy-800 font-bold">
                <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{autoInstructor.fullName} ({autoInstructor.qualification})</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full ml-auto font-semibold">
                  Locked to Course
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-coral-600 font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>No instructor assigned to this course! Assign instructor in Courses page first.</span>
              </div>
            )}
          </div>

          {/* Classroom Selection (from Classrooms State) */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Classroom / Facility *</label>
            <select
              required
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white font-medium"
            >
              <option value="">-- Select Room --</option>
              {classrooms.map(rm => (
                <option key={rm.id} value={rm.name}>
                  {rm.name} ({rm.type} • {rm.capacity} seats)
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!autoInstructor}
              className="w-full py-3.5 rounded-full font-bold text-white text-xs sm:text-sm gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {slotToEdit ? 'Save Changes' : 'Confirm Slot Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
