import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Award } from 'lucide-react';

export default function ExamModal({ isOpen, onClose, examToEdit = null }) {
  const { courses, saveExam } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:30',
    endTime: '12:00',
    totalMarks: 100,
    passingMarks: 50,
    room: 'Main Examination Hall A',
    status: 'Upcoming'
  });

  useEffect(() => {
    if (examToEdit) {
      setFormData(examToEdit);
    } else {
      setFormData({
        title: '',
        courseId: courses[0]?.id || '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:30',
        endTime: '12:00',
        totalMarks: 100,
        passingMarks: 50,
        room: 'Main Examination Hall A',
        status: 'Upcoming'
      });
    }
  }, [examToEdit, isOpen, courses]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = saveExam(formData);
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
            <span className="text-[10px] font-bold tracking-wider uppercase text-coral-500">Admin Control</span>
            <h3 className="text-xl font-extrabold text-navy-800">
              {examToEdit ? 'Edit Examination' : 'Schedule New Examination / Test'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-navy-800 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Exam Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Mid-Term Assessment: Pure Calculus"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Target Course *</label>
            <select
              required
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>[{c.code}] {c.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Exam Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">End Time *</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Total Maximum Marks *</label>
              <input
                type="number"
                min="10"
                required
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Passing Marks</label>
              <input
                type="number"
                min="0"
                value={formData.passingMarks}
                onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Room / Hall Location</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              placeholder="e.g. Examination Hall A"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-white text-xs sm:text-sm gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
            >
              {examToEdit ? 'Save Changes' : 'Confirm & Publish Exam Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
