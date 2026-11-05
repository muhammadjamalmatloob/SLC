import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  BookOpen, 
  Edit2, 
  Trash2, 
  Users,
  ZoomIn
} from 'lucide-react';

export default function TeachersView({ onOpenAddModal, onEditTeacher, onZoomPhoto }) {
  const { teachers, courses, deleteTeacher, timetableSlots } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeachers = teachers.filter(teacher => {
    return (
      teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.qualification.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-800">Faculty Members</h2>
          <p className="text-xs text-muted">Manage instructors, qualifications & assigned courses</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="gradient-coral text-white font-bold text-xs px-5 py-3 rounded-full shadow-glow flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-soft border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty by name, qualification, or email..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-canvas border border-gray-200 focus:outline-none focus:border-coral-500"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeachers.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-soft">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-navy-800">No faculty members found</h4>
            <p className="text-xs text-muted mt-1">Try adjusting your search query or add a new faculty member.</p>
          </div>
        ) : (
          filteredTeachers.map((teacher) => {
            const assignedCourseObjs = (teacher.assignedCourses || []).map(id =>
              courses.find(c => c.id === id)
            ).filter(Boolean);

            const weeklySlotsCount = timetableSlots.filter(s => s.teacherId === teacher.id).length;

            return (
              <div
                key={teacher.id}
                className="bg-white p-5 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between hover:border-coral-200 transition-all shadow-card-hover"
              >
                <div>
                  {/* Card Header with SMALL ICON-SIZED Photo */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Photo displayed small like an icon (w-11 h-11) + Click to zoom */}
                      <div 
                        onClick={() => onZoomPhoto({
                          imageSrc: teacher.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
                          title: teacher.fullName,
                          subtitle: `${teacher.qualification} • Faculty Member`,
                          sizeKb: teacher.photoSizeKb || 40
                        })}
                        className="relative shrink-0 cursor-pointer group"
                        title="Click to view full photo"
                      >
                        <img
                          src={teacher.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                          alt={teacher.fullName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-coral-200 shadow-xs group-hover:ring-2 group-hover:ring-coral-400 transition-all"
                        />
                        <span className="absolute -bottom-1 -right-1 text-[7px] bg-navy-800 text-white font-mono px-1 rounded-full">
                          {teacher.photoSizeKb || '<100'}K
                        </span>
                        <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ZoomIn className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm sm:text-base text-navy-800 leading-tight truncate">
                          {teacher.fullName}
                        </h3>
                        <p className="text-xs text-coral-600 font-semibold mt-0.5 truncate">
                          {teacher.qualification}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                      {teacher.status || 'Active'}
                    </span>
                  </div>

                  {/* Specialization */}
                  {teacher.specialization && (
                    <div className="text-xs text-navy-700 bg-canvas p-2.5 rounded-xl mb-3">
                      <span className="text-muted font-medium text-[11px] block">Specialization:</span>
                      <span className="font-semibold">{teacher.specialization}</span>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-1 mb-3 text-xs text-navy-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted shrink-0" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-muted shrink-0" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Assigned Courses */}
                  <div className="mb-4">
                    <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-coral-500" />
                        Assigned Courses ({assignedCourseObjs.length})
                      </span>
                      <span className="text-navy-700 font-semibold">{weeklySlotsCount} Lectures / Wk</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {assignedCourseObjs.length === 0 ? (
                        <span className="text-[10px] text-muted italic">No courses currently assigned by Admin.</span>
                      ) : (
                        assignedCourseObjs.map(crs => (
                          <span
                            key={crs.id}
                            className="text-[10px] font-semibold bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-lg"
                          >
                            {crs.code} - {crs.title} {crs.className ? `(${crs.className})` : ''}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onEditTeacher(teacher)}
                    className="p-2 text-navy-600 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                    title="Edit Faculty Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${teacher.fullName} from faculty?`)) {
                        deleteTeacher(teacher.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                    title="Delete Faculty"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
