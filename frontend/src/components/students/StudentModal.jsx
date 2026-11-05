import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { validatePhotoUpload, MAX_PHOTO_BYTES } from '../../utils/validators';

export default function StudentModal({ isOpen, onClose, studentToEdit = null }) {
  const { courses, saveStudent, triggerAlert } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    email: '',
    phone: '',
    guardianName: '',
    guardianPhone: '',
    enrolledCourseIds: [],
    totalFee: 0,
    paidFee: 0,
    admissionDate: new Date().toISOString().split('T')[0],
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    photoSizeKb: 35
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoSize, setPhotoSize] = useState(null);

  useEffect(() => {
    if (studentToEdit) {
      setFormData(studentToEdit);
      setPhotoPreview(studentToEdit.photoUrl);
      setPhotoSize(studentToEdit.photoSizeKb || 45);
    } else {
      // Default generated roll number
      const randomRoll = `SLC-2026-${Math.floor(100 + Math.random() * 900)}`;
      setFormData({
        fullName: '',
        rollNumber: randomRoll,
        email: '',
        phone: '',
        guardianName: '',
        guardianPhone: '',
        enrolledCourseIds: [],
        totalFee: 0,
        paidFee: 0,
        admissionDate: new Date().toISOString().split('T')[0],
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        photoSizeKb: 35
      });
      setPhotoPreview(null);
      setPhotoSize(null);
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  // Toggle course selection
  const handleCourseToggle = (courseId) => {
    const isEnrolled = formData.enrolledCourseIds.includes(courseId);
    let updatedCourses;
    if (isEnrolled) {
      updatedCourses = formData.enrolledCourseIds.filter(id => id !== courseId);
    } else {
      updatedCourses = [...formData.enrolledCourseIds, courseId];
    }

    // Auto calculate suggested default fee (Admin can still manually override)
    const suggestedFee = updatedCourses.reduce((sum, id) => {
      const crs = courses.find(c => c.id === id);
      return sum + (crs?.defaultFee || 0);
    }, 0);

    setFormData(prev => ({
      ...prev,
      enrolledCourseIds: updatedCourses,
      // If creating new student, suggest default fee as starting point
      totalFee: !studentToEdit && prev.totalFee === 0 ? suggestedFee : prev.totalFee
    }));
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
        buttonText: 'Upload <= 100 KB'
      });
      // Clear file input
      e.target.value = '';
      return;
    }

    // Convert to Data URL for preview
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
    const success = saveStudent(formData);
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
              {studentToEdit ? 'Update Student Record' : 'New Student Admission'}
            </h3>
            <p className="text-xs text-muted">Admin-managed enrollment, photo & manual fee assignment</p>
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
                  Profile Photo <span className="text-coral-500 font-extrabold">* (Strict 100 KB limit)</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="block w-full text-xs text-navy-700 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-coral-50 file:text-coral-600 hover:file:bg-coral-100 cursor-pointer"
                />
                <p className="text-[10px] text-muted mt-1">
                  JPG, PNG or WebP only. File size must NOT exceed 100 KB.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Hamza Farooq"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 focus:ring-1 focus:ring-coral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Roll Number *</label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. SLC-2026-001"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 focus:ring-1 focus:ring-coral-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Student Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 0000000"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Guardian Name</label>
              <input
                type="text"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                placeholder="Father / Guardian Name"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          {/* Manual Course Selection for this Student */}
          <div className="p-3.5 bg-canvas rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-navy-800">
                Course Selection <span className="text-coral-500">*</span>
              </label>
              <span className="text-[10px] text-muted">
                Admin selects courses manually
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {courses.map((course) => {
                const isChecked = formData.enrolledCourseIds.includes(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseToggle(course.id)}
                    className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-coral-50/80 border-coral-400 text-coral-700 font-bold'
                        : 'bg-white border-gray-200 text-navy-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-mono text-[10px] text-muted mr-1">[{course.code}]</span>
                      <span>{course.title}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <span className="text-[10px] text-muted">Rs. {course.defaultFee}</span>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        isChecked ? 'bg-coral-500 text-white' : 'border border-gray-300'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Manual Fee Entry by Admin */}
          <div className="p-3.5 bg-coral-50/50 rounded-2xl border border-coral-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-navy-800">
                Manual Fee Allocation (Admin Controlled)
              </label>
              <span className="text-[10px] text-coral-600 font-semibold">
                Manual Override Permitted
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-navy-700 mb-1">
                  Total Agreed Fee (Rs.) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.totalFee}
                  onChange={(e) => setFormData({ ...formData, totalFee: Number(e.target.value) })}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-coral-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-navy-700 mb-1">
                  Initial Payment Received (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.totalFee}
                  value={formData.paidFee}
                  onChange={(e) => setFormData({ ...formData, paidFee: Number(e.target.value) })}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-coral-500 bg-white text-emerald-600"
                />
              </div>
            </div>

            {/* Calculated Balance Preview */}
            <div className="mt-2.5 pt-2 border-t border-coral-100 flex items-center justify-between text-xs">
              <span className="text-muted font-medium">Calculated Remaining Balance:</span>
              <span className="font-extrabold text-navy-900">
                Rs. {Math.max(0, formData.totalFee - formData.paidFee).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-white text-xs sm:text-sm gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
            >
              {studentToEdit ? 'Save Changes' : 'Confirm Student Admission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
