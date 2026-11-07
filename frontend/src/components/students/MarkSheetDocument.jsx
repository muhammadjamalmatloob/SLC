import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2 } from 'lucide-react';

export default function MarkSheetDocument({ student }) {
  const { courses, exams, examMarks } = useApp();

  if (!student) return null;

  // Enrolled courses
  const enrolledCourses = (student.enrolledCourseIds || []).map(id => courses.find(c => c.id === id)).filter(Boolean);
  const enrolledCourseIds = enrolledCourses.map(c => c.id);

  // Relevant exams for this student
  const studentExams = exams.filter(e => enrolledCourseIds.includes(e.courseId));

  // Build rows
  let totalMaxMarks = 0;
  let totalObtainedMarks = 0;

  const rows = studentExams.map(exam => {
    const course = courses.find(c => c.id === exam.courseId);
    const markEntry = examMarks.find(m => m.examId === exam.id && m.studentId === student.id);
    const max = exam.totalMarks || 100;
    const obtained = markEntry && !markEntry.isAbsent ? markEntry.marksObtained : 0;
    const isAbsent = markEntry?.isAbsent;
    const remarks = markEntry?.remarks || (obtained >= (exam.passingMarks || 40) ? 'Satisfactory' : 'Needs Improvement');

    totalMaxMarks += max;
    if (!isAbsent) {
      totalObtainedMarks += obtained;
    }

    const pct = isAbsent ? 0 : Math.round((obtained / max) * 100);
    let grade = 'F';
    if (pct >= 90) grade = 'A*';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B';
    else if (pct >= 60) grade = 'C';
    else if (pct >= 50) grade = 'D';

    const status = isAbsent ? 'ABSENT' : (obtained >= (exam.passingMarks || 40) ? 'PASSED' : 'FAILED');

    return {
      exam,
      course,
      max,
      obtained,
      pct,
      grade,
      status,
      remarks,
      isAbsent
    };
  });

  const overallPct = totalMaxMarks > 0 ? ((totalObtainedMarks / totalMaxMarks) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 text-navy-900 bg-white">
      {/* Official Header */}
      <div className="text-center border-b-2 border-navy-900 pb-5">
        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 p-1 flex items-center justify-center mx-auto mb-2 shadow-xs overflow-hidden">
          <img 
            src="/logo.jpeg" 
            alt="Skyline Learning Center" 
            className="w-full h-full object-contain rounded-xl" 
          />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-navy-900">
          SKYLINE LEARNING CENTER
        </h1>
        <p className="text-xs uppercase font-extrabold text-coral-600 tracking-wider">
          Office of Controller of Examinations & Academic Records
        </p>
        <div className="inline-block mt-2 px-4 py-1 bg-navy-900 text-white font-mono text-xs font-bold rounded-full uppercase tracking-widest">
          Detailed Marks Certificate (DMC) / Official Transcript
        </div>
        <p className="text-[10px] text-muted mt-1">
          Issue Date: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })} • Doc Serial: SLC-TR-{student.rollNumber.replace(/[^0-9]/g, '')}
        </p>
      </div>

      {/* Student Profile Particulars Box */}
      <div className="border border-gray-300 rounded-xl p-4 bg-gray-50/50 text-xs">
        <div className="grid grid-cols-2 gap-y-2 gap-x-6">
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="text-muted">Student Name:</span>
            <strong className="text-navy-900">{student.fullName}</strong>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="text-muted">Roll Number:</span>
            <strong className="font-mono text-coral-600">{student.rollNumber}</strong>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="text-muted">Guardian Name:</span>
            <strong className="text-navy-900">{student.guardianName || 'N/A'}</strong>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="text-muted">Academic Track:</span>
            <strong className="text-navy-900">{enrolledCourses[0]?.className || 'Standard Track'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Admission Date:</span>
            <span>{student.admissionDate || '2026-09-01'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Total Enrolled Courses:</span>
            <strong className="text-navy-900">{enrolledCourses.length} Courses</strong>
          </div>
        </div>
      </div>

      {/* Marks & Performance Table */}
      <div>
        <table className="w-full text-left text-xs border border-gray-300 rounded-xl overflow-hidden">
          <thead className="bg-navy-900 text-white font-bold text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Subject / Course</th>
              <th className="py-2.5 px-3">Assessment Title</th>
              <th className="py-2.5 px-3 text-center">Max Marks</th>
              <th className="py-2.5 px-3 text-center">Marks Obtained</th>
              <th className="py-2.5 px-3 text-center">Percentage</th>
              <th className="py-2.5 px-3 text-center">Grade</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3">Teacher Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-4 text-center text-muted">
                  No exam marks recorded for this student yet.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="py-2.5 px-3 font-semibold text-navy-900">
                    [{row.course?.code}] {row.course?.title}
                  </td>
                  <td className="py-2.5 px-3">{row.exam.title}</td>
                  <td className="py-2.5 px-3 text-center font-bold">{row.max}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-navy-900">
                    {row.isAbsent ? <span className="text-coral-600">ABS</span> : row.obtained}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">{row.isAbsent ? '0%' : `${row.pct}%`}</td>
                  <td className="py-2.5 px-3 text-center font-bold">{row.grade}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-coral-100 text-coral-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-muted italic text-[11px]">{row.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Aggregate Score Card */}
      <div className="border-2 border-navy-900 rounded-xl p-4 bg-gray-50 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-muted block text-[10px] uppercase font-bold tracking-wider">Overall Performance</span>
          <div className="text-base font-black text-navy-900">
            Total Obtained: {totalObtainedMarks} / {totalMaxMarks} Marks
          </div>
        </div>

        <div className="text-center">
          <span className="text-muted block text-[10px] uppercase font-bold tracking-wider">Cumulative Percentage</span>
          <div className="text-lg font-black text-coral-600 font-mono">
            {overallPct}%
          </div>
        </div>

        <div className="text-right">
          <span className="text-muted block text-[10px] uppercase font-bold tracking-wider">Final Standing</span>
          <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs">
            {overallPct >= 50 ? 'PASSED & PROMOTED' : 'CONDITIONAL'}
          </span>
        </div>
      </div>

      {/* Official Signatures & Seal */}
      <div className="pt-16 flex items-end justify-between text-xs text-navy-800">
        <div className="text-center">
          <div className="w-40 border-b border-gray-400 mb-1"></div>
          <span className="font-semibold text-muted">Controller of Examinations</span>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-[9px] text-gray-400 font-mono uppercase text-center mx-auto mb-1">
            Official Seal
          </div>
        </div>

        <div className="text-center">
          <div className="w-40 border-b border-gray-400 mb-1"></div>
          <span className="font-semibold text-muted">Principal / Director SLC</span>
        </div>
      </div>
    </div>
  );
}
