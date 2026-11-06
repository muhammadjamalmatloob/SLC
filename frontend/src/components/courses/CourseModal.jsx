import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, BookOpen, Layers, Users } from 'lucide-react';

export default function CourseModal({ isOpen, onClose, courseToEdit = null }) {
  const { teachers, saveCourse } = useApp();

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    className: 'O-Levels',
    sectionName: '',
    description: '',
    assignedTeacherId: ''
  });

  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        code: courseToEdit.code || '',
        title: courseToEdit.title || '',
        className: courseToEdit.className || 'O-Levels',
        sectionName: courseToEdit.sectionName || '',
        description: courseToEdit.description || '',
        assignedTeacherId: courseToEdit.assignedTeacherId || (teachers[0]?.id || '')
      });
    } else {
      setFormData({
        code: '',
        title: '',
        className: 'O-Levels',
        sectionName: '',
        description: '',
        assignedTeacherId: teachers[0]?.id || ''
      });
    }
  }, [courseToEdit, isOpen, teachers]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = saveCourse({
      ...courseToEdit,
      ...formData
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
            <h3 className="text-lg font-black text-navy-800">
              {courseToEdit ? 'Update Course' : 'Add New Course'}
            </h3>
            <p className="text-xs text-muted">Course name, Cambridge/Edexcel syllabus, class, section & assigned instructor</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-navy-800 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Code & Course Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Subject Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. MTH-4024"
                className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-700 mb-1">Course / Subject Name *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. O-Level Mathematics (Syllabus D)"
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          {/* Class Name & Section Name (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Academic Class *</label>
              <select
                required
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
              >
                <option value="O-Levels">O-Levels (Cambridge / Edexcel)</option>
                <option value="A-Levels">A-Levels (AS / A2)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                Section / Batch <span className="text-muted font-normal text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.sectionName}
                onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
                placeholder="e.g. Morning Batch, Evening Batch"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          {/* Lead Instructor */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Assigned Teacher *</label>
            <select
              required
              value={formData.assignedTeacherId}
              onChange={(e) => setFormData({ ...formData, assignedTeacherId: e.target.value })}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
            >
              <option value="">-- Select Assigned Faculty Member --</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.fullName} ({t.specialization})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Syllabus Overview & Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Cambridge syllabus code, key paper components, practical labs..."
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-white text-xs sm:text-sm gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
            >
              {courseToEdit ? 'Save Changes' : 'Confirm Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
