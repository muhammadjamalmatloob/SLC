import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building2 } from 'lucide-react';

export default function ClassroomModal({ isOpen, onClose, classroomToEdit = null }) {
  const { saveClassroom } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    capacity: 30,
    floor: '1st Floor',
    building: 'Main Academic Block',
    type: 'Classroom'
  });

  useEffect(() => {
    if (classroomToEdit) {
      setFormData(classroomToEdit);
    } else {
      setFormData({
        name: '',
        capacity: 30,
        floor: '1st Floor',
        building: 'Main Academic Block',
        type: 'Classroom'
      });
    }
  }, [classroomToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = saveClassroom({
      ...classroomToEdit,
      ...formData
    });
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 my-auto text-navy-800 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="text-lg font-black text-navy-800">
              {classroomToEdit ? 'Edit Classroom / Facility' : 'Add New Classroom / Facility'}
            </h3>
            <p className="text-xs text-muted">Manage physical rooms, labs & seating capacity</p>
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
            <label className="block text-xs font-bold text-navy-700 mb-1">Room Name / Number *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Room 101 or Computer Lab 1"
              className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Facility Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
              >
                <option value="Classroom">Standard Classroom</option>
                <option value="Lecture Hall">Lecture Hall</option>
                <option value="Computer Lab">Computer Lab</option>
                <option value="Science Lab">Science Lab</option>
                <option value="Auditorium">Auditorium / Hall</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Student Capacity *</label>
              <input
                type="number"
                min="5"
                max="300"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Floor</label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="e.g. 1st Floor"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">Building Wing</label>
              <input
                type="text"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                placeholder="e.g. Science Block"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-white text-xs sm:text-sm gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
            >
              {classroomToEdit ? 'Save Changes' : 'Confirm Classroom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
