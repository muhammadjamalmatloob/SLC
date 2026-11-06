import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { validateExamMarks } from '../../utils/validators';
import { DEFAULT_AVATAR_PLACEHOLDER } from '../../data/mockData';

export default function MarksEntryModal({ isOpen, onClose, exam }) {
  const { students, courses, examMarks, saveExamMarks, triggerAlert } = useApp();

  const [marksState, setMarksState] = useState({});

  useEffect(() => {
    if (exam) {
      // Find students enrolled in this course
      const enrolled = students.filter(s => (s.enrolledCourseIds || []).includes(exam.courseId));
      const initialMap = {};

      enrolled.forEach(s => {
        const existing = examMarks.find(m => m.examId === exam.id && m.studentId === s.id);
        initialMap[s.id] = {
          marksObtained: existing ? existing.marksObtained : '',
          isAbsent: existing ? existing.isAbsent : false,
          remarks: existing ? existing.remarks : ''
        };
      });

      setMarksState(initialMap);
    }
  }, [exam, students, examMarks, isOpen]);

  if (!isOpen || !exam) return null;

  const course = courses.find(c => c.id === exam.courseId);
  const enrolledStudents = students.filter(s => (s.enrolledCourseIds || []).includes(exam.courseId));

  const handleMarksChange = (studentId, value) => {
    setMarksState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marksObtained: value
      }
    }));
  };

  const handleAbsentToggle = (studentId) => {
    setMarksState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        isAbsent: !prev[studentId]?.isAbsent
      }
    }));
  };

  const handleRemarksChange = (studentId, text) => {
    setMarksState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: text
      }
    }));
  };

  const handleSaveAll = (e) => {
    e.preventDefault();

    // Validate each entered mark
    for (const s of enrolledStudents) {
      const data = marksState[s.id];
      if (data && !data.isAbsent && data.marksObtained !== '') {
        const validation = validateExamMarks(data.marksObtained, exam.totalMarks);
        if (!validation.isValid) {
          triggerAlert({
            type: 'error',
            title: validation.errorTitle,
            message: `Validation failed for student ${s.fullName} (${s.rollNumber}): ${validation.errorMessage}`,
            code: validation.code,
            details: {
              student: s.fullName,
              roll: s.rollNumber,
              enteredMarks: data.marksObtained,
              maxAllowed: exam.totalMarks
            },
            buttonText: 'Fix Marks'
          });
          return;
        }
      }
    }

    // Save all
    enrolledStudents.forEach(s => {
      const data = marksState[s.id];
      if (data && (data.marksObtained !== '' || data.isAbsent)) {
        saveExamMarks({
          examId: exam.id,
          studentId: s.id,
          marksObtained: data.marksObtained,
          isAbsent: data.isAbsent,
          remarks: data.remarks
        });
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 my-auto text-navy-800 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-coral-500">
              Grading Register
            </span>
            <h3 className="text-xl font-extrabold text-navy-800 leading-tight">
              {exam.title}
            </h3>
            <p className="text-xs text-muted">
              Course: <strong className="text-navy-700">{course?.title}</strong> ({course?.code}) • Total Marks: <strong className="text-coral-600">{exam.totalMarks}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-navy-800 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-4">
          {enrolledStudents.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted bg-canvas rounded-2xl">
              No students are currently enrolled in this course.
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {enrolledStudents.map((student) => {
                const row = marksState[student.id] || {};
                const isAbsent = Boolean(row.isAbsent);

                return (
                  <div
                    key={student.id}
                    className="p-3.5 rounded-2xl bg-canvas border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.photoUrl || DEFAULT_AVATAR_PLACEHOLDER}
                        alt={student.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-navy-800">{student.fullName}</h4>
                        <span className="font-mono text-[11px] text-muted">{student.rollNumber}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Absent checkbox */}
                      <label className="flex items-center gap-1.5 text-xs text-navy-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isAbsent}
                          onChange={() => handleAbsentToggle(student.id)}
                          className="rounded text-coral-500 focus:ring-coral-500"
                        />
                        <span className={isAbsent ? 'font-bold text-coral-600' : ''}>Absent</span>
                      </label>

                      {/* Marks Input */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max={exam.totalMarks}
                          disabled={isAbsent}
                          value={isAbsent ? '0' : row.marksObtained}
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          placeholder="Marks"
                          className="w-20 text-xs font-bold font-mono px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:border-coral-500 bg-white disabled:bg-gray-200 disabled:text-gray-400 text-center"
                        />
                        <span className="text-xs text-muted font-mono">/ {exam.totalMarks}</span>
                      </div>

                      {/* Remarks */}
                      <input
                        type="text"
                        value={row.remarks || ''}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        placeholder="Teacher Remarks"
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:border-coral-500 bg-white flex-1 min-w-[120px]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-white text-xs sm:text-sm gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
            >
              Save & Publish Grades
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
