import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Search, 
  Users, 
  Edit2, 
  Trash2, 
  GraduationCap,
  Layers,
  BookOpen
} from 'lucide-react';

export default function CoursesView({ onOpenAddModal, onEditCourse }) {
  const { courses, teachers, students, deleteCourse } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');

  // Extract unique class names for filtering
  const classList = ['ALL', ...Array.from(new Set(courses.map(c => c.className).filter(Boolean)))];

  const filteredCourses = courses.filter(crs => {
    const matchesSearch = 
      crs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crs.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (crs.className && crs.className.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (crs.sectionName && crs.sectionName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesClass = selectedClass === 'ALL' || crs.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-800">Academic Courses</h2>
          <p className="text-xs text-muted">Admin-managed curriculum, class, sections & assigned instructors</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="gradient-coral text-white font-bold text-xs px-5 py-3 rounded-full shadow-glow flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-2xl shadow-soft border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course name, code, or class..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-canvas border border-gray-200 focus:outline-none focus:border-coral-500"
          />
        </div>

        {classList.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {classList.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedClass === cls
                    ? 'bg-navy-800 text-white shadow-sm'
                    : 'bg-canvas text-navy-600 hover:bg-gray-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-soft">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-navy-800">No courses found</h4>
            <p className="text-xs text-muted mt-1">Add a new course or clear filters.</p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const teacher = teachers.find(t => t.id === course.assignedTeacherId);
            const enrolledStudents = students.filter(s => (s.enrolledCourseIds || []).includes(course.id));

            return (
              <div
                key={course.id}
                className="bg-white p-5 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between hover:border-coral-200 transition-all shadow-card-hover"
              >
                <div>
                  {/* Course Code, Class Name Badge (O-Levels, A-Levels, etc.) */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-black text-coral-600 bg-coral-50 border border-coral-200 px-2.5 py-1 rounded-lg">
                      {course.code}
                    </span>

                    <span className="text-xs font-bold text-navy-800 bg-canvas px-2.5 py-1 rounded-full border border-gray-200 flex items-center gap-1.5 shadow-xs">
                      <Layers className="w-3.5 h-3.5 text-coral-500" />
                      <span>Class: <strong className="text-coral-600">{course.className || 'General'}</strong></span>
                    </span>

                    {course.sectionName && (
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        {course.sectionName}
                      </span>
                    )}
                  </div>

                  {/* Course Name */}
                  <h3 className="font-extrabold text-base text-navy-800 leading-snug mt-2 mb-1">
                    {course.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-3">
                    {course.description || 'No description provided.'}
                  </p>

                  <div className="space-y-2 py-2 border-y border-gray-100 text-xs">
                    <div className="flex items-center justify-between text-navy-700">
                      <span className="text-muted flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        Assigned Instructor:
                      </span>
                      <span className="font-bold text-right">
                        {teacher ? teacher.fullName : <span className="text-coral-500 font-semibold">Unassigned</span>}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-navy-700">
                      <span className="text-muted flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-coral-500" />
                        Enrolled Students:
                      </span>
                      <span className="font-bold">{enrolledStudents.length} Students</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-50">
                  <div>
                    <span className="text-[10px] text-muted block">Base Tuition</span>
                    <span className="text-sm font-black text-navy-800">
                      Rs. {course.defaultFee?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditCourse(course)}
                      className="p-2 text-navy-600 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                      title="Edit Course"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete course "${course.title}"?`)) {
                          deleteCourse(course.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
