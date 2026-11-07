import React from 'react';
import { CheckCircle2, ShieldCheck, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FeeReceiptDocument({ student, payment = null }) {
  const { courses } = useApp();

  if (!student) return null;

  const receiptNumber = payment?.receiptNumber || `REC-2026-${student.id.replace(/[^0-9]/g, '').slice(-4) || '8012'}`;
  const amountPaid = payment ? payment.amountPaid : student.paidFee;
  const paymentDate = payment?.paymentDate || new Date().toISOString().split('T')[0];
  const paymentMethod = payment?.paymentMethod || 'Cash at Counter';

  // Enrolled courses details
  const enrolledCourses = (student.enrolledCourseIds || [])
    .map(id => courses.find(c => c.id === id))
    .filter(Boolean);

  const primaryClass = enrolledCourses[0]?.className || 'Standard Academic Track';

  return (
    <div className="bg-white text-navy-950 space-y-5 leading-normal">
      {/* Academy Header */}
      <div className="text-center border-b-2 border-navy-900 pb-4">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200 text-[10px] text-gray-500 font-mono">
          <span>NTN: 8291456-7</span>
          <span>ESTABLISHED 2012</span>
          <span>CAMPUS ID: SLC-ISB-01</span>
        </div>

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
          Accounts & Finance Department • Student Billing Division
        </p>
        <div className="inline-block mt-2 px-5 py-1 bg-emerald-600 text-white font-mono text-xs font-bold rounded-full uppercase tracking-widest shadow-xs">
          Official Fee Payment Receipt
        </div>
        <div className="flex items-center justify-center gap-4 text-[11px] text-muted mt-2">
          <span>Receipt Serial: <strong className="font-mono text-navy-900">{receiptNumber}</strong></span>
          <span>•</span>
          <span>Issue Date: <strong className="text-navy-900">{paymentDate}</strong></span>
          <span>•</span>
          <span>Status: <strong className="text-emerald-600 uppercase">Paid & Verified</strong></span>
        </div>
      </div>

      {/* Verification Badge */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-center gap-2 text-xs text-emerald-800 font-bold">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>PAYMENT VERIFIED & ELECTRONICALLY RECORDED IN ACADEMY LEDGER</span>
      </div>

      {/* Particulars Grid */}
      <div className="border border-gray-300 rounded-xl p-4 bg-gray-50/60 text-xs">
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-8">
          <div className="flex justify-between border-b border-gray-200 pb-1.5">
            <span className="text-muted">Student Full Name:</span>
            <strong className="text-navy-900 font-bold">{student.fullName}</strong>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1.5">
            <span className="text-muted">Roll Number:</span>
            <strong className="font-mono font-bold text-coral-600">{student.rollNumber}</strong>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1.5">
            <span className="text-muted">Academic Program / Class:</span>
            <strong className="text-navy-900">{primaryClass}</strong>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1.5">
            <span className="text-muted">Payment Date:</span>
            <span className="font-medium text-navy-900">{paymentDate}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1.5">
            <span className="text-muted">Guardian Name:</span>
            <span className="font-medium text-navy-900">{student.guardianName || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1.5">
            <span className="text-muted">Payment Method:</span>
            <strong className="text-navy-900 font-bold">{paymentMethod}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Student Contact:</span>
            <span className="font-mono">{student.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Cashier / Collector:</span>
            <span className="font-medium text-navy-900">Admin Accounts Desk</span>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Breakdown Table */}
      <div>
        <div className="text-[11px] font-black uppercase text-navy-800 tracking-wider mb-1.5 flex items-center justify-between">
          <span>Fee Particulars & Enrolled Academic Courses</span>
          <span className="text-[10px] text-muted font-normal lowercase">({enrolledCourses.length} active course enrollments)</span>
        </div>
        <table className="w-full text-left text-xs border border-gray-300 rounded-xl overflow-hidden">
          <thead className="bg-navy-900 text-white font-bold text-[11px]">
            <tr>
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Enrolled Cambridge Course / Subject</th>
              <th className="py-2.5 px-3">Class & Section</th>
              <th className="py-2.5 px-3 text-right">Enrollment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((c, idx) => (
                <tr key={c.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                  <td className="py-2.5 px-3 font-mono text-muted">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-navy-900">
                    <span className="font-mono text-coral-600 font-bold mr-1.5">[{c.code}]</span>
                    {c.title}
                  </td>
                  <td className="py-2.5 px-3 text-muted">
                    {c.className} {c.sectionName ? `(${c.sectionName})` : ''}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Confirmed Active
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-3 text-center text-muted">
                  General Academic Tuition & Facility Charges
                </td>
              </tr>
            )}
            <tr className="bg-gray-100/90 font-bold text-xs border-t-2 border-gray-300">
              <td colSpan="3" className="py-2.5 px-3 text-navy-900">
                Agreed Total Tuition Fee (Custom Student Package)
              </td>
              <td className="py-2.5 px-3 text-right text-navy-900 font-mono">
                Rs. {student.totalFee?.toLocaleString()}
              </td>
            </tr>
            <tr className="bg-emerald-50/90 font-black text-xs text-emerald-900">
              <td colSpan="3" className="py-2.5 px-3">
                Total Amount Received & Credited in this Session (PKR)
              </td>
              <td className="py-2.5 px-3 text-right text-emerald-700 font-mono text-sm">
                Rs. {amountPaid?.toLocaleString()}
              </td>
            </tr>
            <tr className="bg-gray-50 font-bold text-xs text-navy-900">
              <td colSpan="3" className="py-2.5 px-3">
                Remaining Outstanding Balance
              </td>
              <td className="py-2.5 px-3 text-right font-mono">
                Rs. {student.balance?.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Account Status Notice */}
      <div className="p-3 bg-canvas rounded-xl border border-gray-200 text-xs text-navy-800 flex justify-between items-center">
        <span className="font-semibold">Current Account Ledger Standing:</span>
        <span className={`px-3.5 py-1 rounded-full font-bold text-xs ${
          student.balance === 0 
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
            : 'bg-amber-100 text-amber-800 border border-amber-300'
        }`}>
          {student.balance === 0 ? '✓ ALL DUES FULLY CLEARED' : `PARTIAL PAYMENT (Rs. ${student.balance?.toLocaleString()} Pending)`}
        </span>
      </div>

      {/* Official Instructions / Rules */}
      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[10px] text-gray-600 space-y-1">
        <div className="font-bold text-navy-900 uppercase text-[9px] tracking-wider mb-1">
          Academy Rules & Payment Conditions:
        </div>
        <div>1. This receipt is an official computer-generated acknowledgment of payment received at SLC Accounts Desk.</div>
        <div>2. Fee once paid is non-refundable, non-adjustable, and non-transferable under any circumstances.</div>
        <div>3. Students are advised to retain this receipt until the completion of their academic session.</div>
        <div>4. For any discrepancy, please contact the Accounts Office within 3 working days with this receipt.</div>
      </div>

      {/* Official Signatures & Seal */}
      <div className="pt-8 pb-4 flex items-end justify-between text-xs text-navy-800">
        <div className="text-center">
          <div className="w-36 border-b border-gray-400 mb-1"></div>
          <span className="font-semibold text-muted text-[11px]">Depositor / Student</span>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 border-2 border-dashed border-gray-400 rounded-full flex flex-col items-center justify-center text-[8px] text-gray-500 font-mono uppercase text-center mx-auto mb-1 p-1">
            <span className="font-bold text-[9px] text-coral-600">SLC</span>
            <span>ACCOUNTS</span>
            <span>OFFICIAL STAMP</span>
          </div>
        </div>

        <div className="text-center">
          <div className="w-36 border-b border-gray-400 mb-1"></div>
          <span className="font-semibold text-muted text-[11px]">Accounts Officer SLC</span>
        </div>
      </div>

      {/* Campus Footer Info */}
      <div className="border-t border-gray-200 pt-2 text-center text-[9px] text-gray-400 space-y-0.5">
        <p>Skyline Learning Center (SLC Academy) • Main Academic Boulevard, Sector H-8/4, Islamabad</p>
        <p>Phone: +92 51 111-752-000 • Email: accounts@slc.edu.pk • Portal: slc.edu.pk</p>
      </div>
    </div>
  );
}
