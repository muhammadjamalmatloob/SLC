import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  Search, 
  Printer, 
  FileText, 
  Receipt,
  Download
} from 'lucide-react';
import PdfViewerModal from '../common/PdfViewerModal';
import FeeChalanDocument from './FeeChalanDocument';
import FeeReceiptDocument from './FeeReceiptDocument';
import { DEFAULT_AVATAR_PLACEHOLDER } from '../../data/mockData';

export default function FeesView({ onOpenCollectModal }) {
  const { students, feePayments, courses } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // PDF Viewer States
  const [pdfModal, setPdfModal] = useState({
    isOpen: false,
    title: '',
    documentId: '',
    filename: '',
    orientation: 'portrait',
    type: null, // 'chalan' | 'receipt'
    data: null
  });

  // Financial Aggregates
  const totalAgreed = students.reduce((acc, s) => acc + (s.totalFee || 0), 0);
  const totalCollected = students.reduce((acc, s) => acc + (s.paidFee || 0), 0);
  const totalDue = students.reduce((acc, s) => acc + (s.balance || 0), 0);

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.feeStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = feePayments.filter(p => {
    return (
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Open 3-Column Fee Chalan (Landscape A4)
  const handleOpenChalan = (student) => {
    setPdfModal({
      isOpen: true,
      title: `3-Column Fee Chalan: ${student.fullName} (${student.rollNumber})`,
      documentId: 'fee-chalan-print-root',
      filename: `SLC_Fee_Chalan_${student.rollNumber}.pdf`,
      orientation: 'landscape',
      type: 'chalan',
      data: student
    });
  };

  // Open Official Fee Receipt (Portrait A4)
  const handleOpenReceipt = (student, payment = null) => {
    setPdfModal({
      isOpen: true,
      title: `Official Fee Receipt: ${student.fullName} (${student.rollNumber})`,
      documentId: 'fee-receipt-print-root',
      filename: `SLC_Fee_Receipt_${student.rollNumber}.pdf`,
      orientation: 'portrait',
      type: 'receipt',
      data: { student, payment }
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-800">Fee Management & Cashier</h2>
          <p className="text-xs text-muted">Generate 3-column bank chalans, collect tuition & issue PDF receipts</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Chalan button for first student with balance */}
          <button
            onClick={() => {
              const pendingStudent = students.find(s => s.balance > 0) || students[0];
              if (pendingStudent) handleOpenChalan(pendingStudent);
            }}
            className="text-xs font-bold px-4 py-2.5 rounded-full bg-white text-navy-800 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-coral-500" />
            <span>Generate Chalan (PDF)</span>
          </button>

          <button
            onClick={() => onOpenCollectModal()}
            className="gradient-coral text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-glow flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>Collect Fee</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-soft border border-gray-100">
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-1">Total Agreed Tuition</div>
          <div className="text-2xl font-black text-navy-800">Rs. {totalAgreed.toLocaleString()}</div>
          <p className="text-[11px] text-muted mt-1">Total tuition across enrolled students</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-soft border border-gray-100">
          <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Total Received</div>
          <div className="text-2xl font-black text-emerald-600">Rs. {totalCollected.toLocaleString()}</div>
          <p className="text-[11px] text-muted mt-1">Verified cashier collections</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-soft border border-gray-100">
          <div className="text-xs text-coral-600 font-bold uppercase tracking-wider mb-1">Pending Receivables</div>
          <div className="text-2xl font-black text-coral-600">Rs. {totalDue.toLocaleString()}</div>
          <p className="text-[11px] text-muted mt-1">Outstanding dues</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveSubTab('students')}
          className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
            activeSubTab === 'students'
              ? 'bg-navy-800 text-white'
              : 'text-navy-600 hover:bg-gray-100'
          }`}
        >
          Student Fee Register ({students.length})
        </button>
        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
            activeSubTab === 'transactions'
              ? 'bg-navy-800 text-white'
              : 'text-navy-600 hover:bg-gray-100'
          }`}
        >
          Payment Receipts ({feePayments.length})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3.5 rounded-2xl shadow-soft border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or receipt..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-canvas border border-gray-200 focus:outline-none focus:border-coral-500"
          />
        </div>

        {activeSubTab === 'students' && (
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
        )}
      </div>

      {/* Sub-tab 1: Student Fee Register */}
      {activeSubTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => {
            const isPaid = student.feeStatus === 'PAID';
            const isPartial = student.feeStatus === 'PARTIAL';
            const enrolledCourses = (student.enrolledCourseIds || []).map(id => courses.find(c => c.id === id)).filter(Boolean);

            return (
              <div
                key={student.id}
                className="bg-white p-5 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between hover:border-coral-200 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.photoUrl || DEFAULT_AVATAR_PLACEHOLDER}
                        alt={student.fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-coral-200 shadow-xs shrink-0"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-navy-800">{student.fullName}</h4>
                        <span className="font-mono text-xs text-muted">{student.rollNumber}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : isPartial
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-coral-50 text-coral-600 border border-coral-200'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </div>

                  <div className="text-[11px] text-muted mb-3">
                    <span>Enrolled in: </span>
                    <strong className="text-navy-700">
                      {enrolledCourses.map(c => c.code).join(', ') || 'No courses'}
                    </strong>
                  </div>

                  {/* Financial Bar */}
                  <div className="bg-canvas p-3 rounded-2xl border border-gray-100 grid grid-cols-3 gap-2 text-center text-xs mb-3">
                    <div>
                      <div className="text-[10px] text-muted">Total Fee</div>
                      <div className="font-black text-navy-800">Rs. {student.totalFee?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted">Paid</div>
                      <div className="font-black text-emerald-600">Rs. {student.paidFee?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted">Due Balance</div>
                      <div className="font-black text-coral-600">Rs. {student.balance?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  {/* CRITICAL USER REQUIREMENT: 
                      "If fee is paid, there should be fee receipt instead of fee chalan." */}
                  {isPaid ? (
                    <button
                      onClick={() => handleOpenReceipt(student)}
                      className="text-xs font-bold px-3 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center gap-1.5"
                      title="View Official Fee Receipt PDF"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Fee Receipt (PDF)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenChalan(student)}
                      className="text-xs font-bold px-3 py-2 rounded-full bg-canvas hover:bg-gray-100 text-navy-700 border border-gray-200 transition-colors flex items-center gap-1.5"
                      title="Generate 3-Column Bank Chalan PDF"
                    >
                      <FileText className="w-3.5 h-3.5 text-coral-500" />
                      <span>Fee Chalan (PDF)</span>
                    </button>
                  )}

                  {student.balance > 0 ? (
                    <button
                      onClick={() => onOpenCollectModal(student)}
                      className="text-xs font-bold py-2 px-4 rounded-full gradient-coral text-white shadow-glow hover:opacity-95 transition-all flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Collect Fee</span>
                    </button>
                  ) : (
                    <div className="text-center py-1.5 px-3 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full border border-emerald-200">
                      ✓ Cleared
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-tab 2: Transactions / Payment Receipts */}
      {activeSubTab === 'transactions' && (
        <div className="space-y-3">
          {filteredPayments.map((pmt) => {
            const student = students.find(s => s.id === pmt.studentId) || {
              fullName: pmt.studentName,
              rollNumber: pmt.rollNumber,
              totalFee: pmt.amountPaid,
              paidFee: pmt.amountPaid,
              balance: 0
            };

            return (
              <div
                key={pmt.id}
                className="bg-white p-4 sm:p-5 rounded-2xl shadow-soft border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-coral-600 bg-coral-50 border border-coral-200 px-2 py-0.5 rounded">
                      {pmt.receiptNumber}
                    </span>
                    <h4 className="font-extrabold text-sm text-navy-800">{pmt.studentName}</h4>
                    <span className="text-xs text-muted font-mono">({pmt.rollNumber})</span>
                  </div>
                  <div className="text-xs text-muted mt-1 flex flex-wrap items-center gap-2">
                    <span>Method: <strong>{pmt.paymentMethod}</strong></span>
                    <span>•</span>
                    <span>Date: <strong>{pmt.paymentDate}</strong></span>
                    {pmt.notes && (
                      <>
                        <span>•</span>
                        <span className="italic text-gray-500">"{pmt.notes}"</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <div className="text-sm font-black text-emerald-600">+Rs. {pmt.amountPaid.toLocaleString()}</div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Paid
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenReceipt(student, pmt)}
                    className="p-2 text-navy-600 hover:text-coral-600 hover:bg-coral-50 rounded-xl border border-gray-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="View & Download PDF Receipt"
                  >
                    <Receipt className="w-3.5 h-3.5 text-coral-500" />
                    <span>Receipt PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REAL PDF VIEWER MODAL FOR CHALAN & RECEIPT */}
      <PdfViewerModal
        isOpen={pdfModal.isOpen}
        onClose={() => setPdfModal(prev => ({ ...prev, isOpen: false }))}
        title={pdfModal.title}
        documentId={pdfModal.documentId}
        filename={pdfModal.filename}
        orientation={pdfModal.orientation}
      >
        {pdfModal.type === 'chalan' && pdfModal.data && (
          <FeeChalanDocument student={pdfModal.data} />
        )}

        {pdfModal.type === 'receipt' && pdfModal.data && (
          <FeeReceiptDocument 
            student={pdfModal.data.student} 
            payment={pdfModal.data.payment} 
          />
        )}
      </PdfViewerModal>
    </div>
  );
}
