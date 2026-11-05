import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, Check, Image as ImageIcon, BookOpen } from 'lucide-react';
import { validatePhotoUpload } from '../../utils/validators';

export default function TeacherModal({ isOpen, onClose, teacherToEdit = null }) {
  const { courses, saveTeacher, triggerAlert } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    specialization: '',
    assignedCourses: [],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    photoSizeKb: 40,
    status: 'Active'
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoSize, setPhotoSize] = useState(null);

  useEffect(() => {
    if (teacherToEdit) {
      setFormData(teacherToEdit);
      setPhotoPreview(teacherToEdit.photoUrl);
      setPhotoSize(teacherToEdit.photoSizeKb || 40);
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        qualification: '',
        specialization: '',
        assignedCourses: [],
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        photoSizeKb: 40,
        status: 'Active'
      });
      setPhotoPreview(null);
      setPhotoSize(null);
    }
  }, [teacherToEdit, isOpen]);

  if (!isOpen) return null;

  // Toggle assigned courses
  const handleCourseToggle = (courseId) => {
    const isAssigned = formData.assignedCourses.includes(courseId);
    let updated;
    if (isAssigned) {
      updated = formData.assignedCourses.filter(id => id !== courseId);
    } else {
      updated = [...formData.assignedCourses, courseId];
    }
    setFormData(prev => ({ ...prev, assignedCourses: updated }));
  };

  // Photo upload with STRICT 100 KB limit validation
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validatePhotoUpload(file);
    if (!validation.isValid) {
      triggerAlert({
        type: 'error',
        title: validation.errorTitle,
        message: validation.errorMessage,
        code: validation.code,
        details: {
          fileSelected: file.name,
          actualSize: `${validation.actualKb} KB`,
          maxAllowed: '100.0 KB (102,400 bytes)'
        },
        buttonText: 'Select <= 100 KB'
      });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      setPhotoPreview(dataUrl);
      setPhotoSize(validation.sizeKb);
      setFormData(prev => ({
        ...prev,
        photoUrl: dataUrl,
        photoSizeKb: validation.sizeKb
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = saveTeacher(formData);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 my-auto text-navy-800 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="text-lg font-black text-navy-800">
              {teacherToEdit ? 'Edit Faculty Record' : 'Register New Faculty Member'}
            </h3>
            <p className="text-xs text-muted">Admin-managed instructor profile & course assignments</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-navy-800 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Photo Upload with 100 KB limit banner */}
          <div className="p-3.5 bg-canvas rounded-2xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-coral-200 shrink-0 shadow-sm flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
                {photoSize && (
                  <div className="absolute bottom-0 inset-x-0 bg-navy-900/80 text-[8px] text-white font-mono text-center py-0.5">
                    {photoSize} KB
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <label className="block text-xs font-bold text-navy-800 mb-1">
                  Faculty Photo <span className="text-coral-500 font-extrabold">* (Strict 100 KB limit)</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="block w-full text-xs text-navy-700 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-coral-50 file:text-coral-600 hover:file:bg-coral-100 cursor-pointer"
                />
                <p className="text-[10px] text-muted mt-1">
                  Maximum file size: 100 KB. Photo is verified client and server-side.
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Prof. Tariq Mahmood"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tariq@slc.edu.pk"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 333 0000000"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Qualification *</label>
              <input
                type="text"
                required
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. MS Computer Science"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Area of Specialization</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Algorithms, Data Structures & Python"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
            />
          </div>

          {/* Course Assignment by Admin */}
          <div className="p-3.5 bg-canvas rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-navy-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-coral-500" />
                <span>Assign Courses to Instructor (Admin Controlled)</span>
              </label>
              <span className="text-[10px] text-muted">Select 1 or more</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {courses.map((course) => {
                const isChecked = formData.assignedCourses.includes(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseToggle(course.id)}
                    className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-blue-50/80 border-blue-400 text-blue-800 font-bold'
                        : 'bg-white border-gray-200 text-navy-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-mono text-[10px] text-muted mr-1">[{course.code}]</span>
                      <span>{course.title}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-1 ${
                      isChecked ? 'bg-blue-600 text-white' : 'border border-gray-300'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-white text-xs sm:text-sm gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
            >
              {teacherToEdit ? 'Save Changes' : 'Confirm Faculty Member Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
