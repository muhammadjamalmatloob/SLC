import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Edit2, 
  Trash2, 
  Printer, 
  Users
} from 'lucide-react';
import PdfViewerModal from '../common/PdfViewerModal';

export default function ExamsView({ onOpenAddExam, onOpenMarksModal, onEditExam }) {
  const { exams, courses, students, examMarks, deleteExam } = useApp();
  const [reportModalOpen, setReportModalOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-800">Examinations & Grading</h2>
          <p className="text-xs text-muted">Admin scheduling, assessment marks & official examination reports</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Print Exam Report button */}
          <button
            onClick={() => setReportModalOpen(true)}
            className="text-xs font-bold px-4 py-2.5 rounded-full bg-white text-navy-800 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-coral-500" />
            <span>Exam Schedule (PDF)</span>
          </button>

          <button
            onClick={onOpenAddExam}
            className="gradient-coral text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-glow flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Exam</span>
          </button>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-soft">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-navy-800">No exams scheduled yet</h4>
            <p className="text-xs text-muted mt-1">Click "Schedule Exam" to create an exam.</p>
          </div>
        ) : (
          exams.map((exam) => {
            const course = courses.find(c => c.id === exam.courseId);
            const enrolledStudents = students.filter(s => (s.enrolledCourseIds || []).includes(exam.courseId));
            const gradedCount = examMarks.filter(m => m.examId === exam.id).length;
            const isUpcoming = exam.status === 'Upcoming';

            return (
              <div
                key={exam.id}
                className="bg-white p-5 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between hover:border-coral-200 transition-all shadow-card-hover"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-black text-coral-600 bg-coral-50 border border-coral-200 px-2.5 py-1 rounded-lg">
                      {course?.code || 'CRS'}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isUpcoming
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}>
                      {exam.status || 'Scheduled'}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-navy-800 leading-snug mt-2 mb-1">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-muted mb-3">
                    {course?.title} {course?.className ? `• ${course.className}` : ''}
                  </p>

                  {/* Exam Details Badges */}
                  <div className="bg-canvas p-3 rounded-2xl border border-gray-100 space-y-1.5 text-xs text-navy-700 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-coral-500" /> Date:
                      </span>
                      <span className="font-bold">{exam.date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Timing:
                      </span>
                      <span className="font-bold font-mono">{exam.startTime} - {exam.endTime}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" /> Room / Hall:
                      </span>
                      <span className="font-semibold">{exam.room || 'TBD'}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-gray-200">
                      <span className="text-muted">Total / Pass Marks:</span>
                      <span className="font-black text-navy-900">{exam.totalMarks} Marks (Pass: {exam.passingMarks || 40})</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="text-[11px] text-muted flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-coral-500" />
                    <span>Graded: <strong>{gradedCount}/{enrolledStudents.length}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditExam(exam)}
                      className="p-2 text-navy-600 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                      title="Edit Exam"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete exam "${exam.title}"?`)) {
                          deleteExam(exam.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                      title="Delete Exam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenMarksModal(exam)}
                      className="text-xs font-bold px-3.5 py-1.5 rounded-full gradient-coral text-white shadow-glow hover:opacity-95 transition-all flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Marks</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* REAL PDF VIEWER MODAL FOR EXAM SCHEDULE */}
      <PdfViewerModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Official Examination Schedule Date Sheet"
        documentId="exam-pdf-schedule-root"
        filename="SLC_Exam_Schedule_Report.pdf"
        orientation="portrait"
      >
        <div className="text-navy-900 space-y-6">
          <div className="text-center pb-4 border-b-2 border-navy-900">
            <div className="w-10 h-10 rounded-2xl gradient-coral text-white font-black text-sm flex items-center justify-center mx-auto mb-2 shadow-glow">
              SLC
            </div>
            <h2 className="text-xl font-black tracking-tight text-navy-900">
              SKYLINE LEARNING CENTER (SLC ACADEMY)
            </h2>
            <p className="text-xs uppercase font-extrabold text-coral-600 tracking-wider">
              Examination & Testing Branch
            </p>
            <p className="text-[10px] text-muted mt-0.5">
              Official Examination Date Sheet • Session 2026-2027
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-navy-900 text-white font-bold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Exam Title</th>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">Timing</th>
                  <th className="py-2.5 px-3">Room / Hall</th>
                  <th className="py-2.5 px-3 text-center">Max Marks</th>
                  <th className="py-2.5 px-3 text-center">Pass Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exams.map((exam) => {
                  const crs = courses.find(c => c.id === exam.courseId);
                  return (
                    <tr key={exam.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 font-semibold text-coral-600">{exam.date}</td>
                      <td className="py-2.5 px-3 font-bold text-navy-900">{exam.title}</td>
                      <td className="py-2.5 px-3">[{crs?.code}] {crs?.title}</td>
                      <td className="py-2.5 px-3 font-mono">{exam.startTime} - {exam.endTime}</td>
                      <td className="py-2.5 px-3">{exam.room || 'Examination Hall'}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{exam.totalMarks}</td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{exam.passingMarks || 40}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border text-xs text-navy-700">
            <span className="font-bold">Notice to Candidates:</span> Candidates must bring their admit pass and student ID card to the examination room.
          </div>

          <div className="pt-12 flex items-end justify-between text-xs text-navy-800">
            <div className="text-center">
              <div className="w-36 border-b border-gray-400 mb-1"></div>
              <span className="font-semibold text-muted">Controller of Examinations</span>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-gray-400 mb-1"></div>
              <span className="font-semibold text-muted">Director SLC Academy</span>
            </div>
          </div>
        </div>
      </PdfViewerModal>
    </div>
  );
}
