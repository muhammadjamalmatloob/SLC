import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Plus, 
  Phone, 
  CreditCard, 
  Edit2, 
  Trash2, 
  BookOpen, 
  GraduationCap,
  Award,
  ZoomIn
} from 'lucide-react';

export default function StudentsView({ onOpenAddModal, onEditStudent, onCollectFee, onZoomPhoto, onViewMarkSheet }) {
  const { students, courses, deleteStudent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.phone && student.phone.includes(searchQuery));
    
    const matchesStatus = statusFilter === 'ALL' || student.feeStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto animate-fade-in">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-800">Student Directory</h2>
          <p className="text-xs text-muted">Admin records, enrolled courses, fee records & academic transcripts</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="gradient-coral text-white font-bold text-xs px-5 py-3 rounded-full shadow-glow flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Admission</span>
        </button>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white p-3.5 rounded-2xl shadow-soft border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll number, or phone..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-canvas border border-gray-200 focus:outline-none focus:border-coral-500"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PAID', 'PARTIAL', 'PENDING'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-navy-800 text-white shadow-sm'
                  : 'bg-canvas text-navy-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Students List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-soft">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-navy-800">No student records found</h4>
            <p className="text-xs text-muted mt-1">Try adjusting your search criteria or register a new student.</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isPaid = student.feeStatus === 'PAID';
            const isPartial = student.feeStatus === 'PARTIAL';

            const enrolledCourses = (student.enrolledCourseIds || []).map(id => 
              courses.find(c => c.id === id)
            ).filter(Boolean);

            return (
              <div
                key={student.id}
                className="bg-white p-5 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between hover:border-coral-200 transition-all shadow-card-hover"
              >
                <div>
                  {/* Card Header with SMALL ICON-SIZED Photo + Click to Zoom */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Photo displayed small like an icon (w-11 h-11) */}
                      <div 
                        onClick={() => onZoomPhoto({
                          imageSrc: student.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
                          title: student.fullName,
                          subtitle: `Roll No: ${student.rollNumber}`,
                          sizeKb: student.photoSizeKb || 45
                        })}
                        className="relative shrink-0 cursor-pointer group"
                        title="Click to view full photo"
                      >
                        <img
                          src={student.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                          alt={student.fullName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-coral-200 shadow-xs group-hover:ring-2 group-hover:ring-coral-400 transition-all"
                        />
                        <span className="absolute -bottom-1 -right-1 text-[7px] bg-navy-800 text-white font-mono px-1 rounded-full">
                          {student.photoSizeKb || '<100'}K
                        </span>
                        <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ZoomIn className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm sm:text-base text-navy-800 leading-tight truncate">
                          {student.fullName}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-md">
                            {student.rollNumber}
                          </span>
                          <span className="text-[11px] text-muted flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {student.phone || 'No phone'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fee Status Badge */}
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : isPartial
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-coral-50 text-coral-600 border border-coral-200'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </div>

                  {/* Guardian Info */}
                  {student.guardianName && (
                    <div className="text-[11px] text-muted bg-canvas px-3 py-1.5 rounded-xl mb-3 flex items-center justify-between">
                      <span>Guardian: <strong className="text-navy-700">{student.guardianName}</strong></span>
                      {student.guardianPhone && <span>{student.guardianPhone}</span>}
                    </div>
                  )}

                  {/* Enrolled Courses Badges */}
                  <div className="mb-4">
                    <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-coral-500" />
                      <span>Enrolled Courses ({enrolledCourses.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {enrolledCourses.map((crs) => (
                        <span
                          key={crs.id}
                          className="text-[10px] font-semibold bg-gray-50 border border-gray-200 text-navy-700 px-2 py-0.5 rounded-lg"
                        >
                          {crs.code} - {crs.title} {crs.className ? `(${crs.className})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown Card */}
                  <div className="bg-canvas p-3 rounded-2xl border border-gray-100 grid grid-cols-3 gap-2 text-center text-xs mb-4">
                    <div>
                      <div className="text-[10px] text-muted">Total Fee</div>
                      <div className="font-extrabold text-navy-800">
                        Rs. {student.totalFee?.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted">Paid</div>
                      <div className="font-extrabold text-emerald-600">
                        Rs. {student.paidFee?.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted">Balance</div>
                      <div className="font-extrabold text-coral-600">
                        Rs. {student.balance?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditStudent(student)}
                      className="p-2 text-navy-600 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                      title="Edit Student"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${student.fullName}?`)) {
                          deleteStudent(student.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Official Mark Sheet / DMC Button */}
                    <button
                      onClick={() => onViewMarkSheet(student)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-canvas hover:bg-coral-50 text-navy-700 hover:text-coral-600 border border-gray-200 transition-colors flex items-center gap-1"
                      title="Print Official Mark Sheet"
                    >
                      <Award className="w-3.5 h-3.5 text-coral-500" />
                      <span>Mark Sheet</span>
                    </button>
                  </div>

                  {/* Collect Fee Button if has balance */}
                  {student.balance > 0 ? (
                    <button
                      onClick={() => onCollectFee(student)}
                      className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Collect Fee</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      ✓ Dues Cleared
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
