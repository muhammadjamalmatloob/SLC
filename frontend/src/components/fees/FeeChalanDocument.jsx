import React from 'react';
import { useApp } from '../../context/AppContext';

export default function FeeChalanDocument({ student }) {
  const { courses } = useApp();

  if (!student) return null;

  const enrolledCourses = (student.enrolledCourseIds || []).map(id => courses.find(c => c.id === id)).filter(Boolean);
  const chalanNumber = `CHL-2026-${student.id.replace(/[^0-9]/g, '').slice(-4) || '1042'}`;
  const payableAmount = student.balance > 0 ? student.balance : student.totalFee;

  const columns = [
    { title: 'BANK COPY', subtitle: 'To be retained by receiving bank branch' },
    { title: 'ACADEMY COPY', subtitle: 'To be submitted to SLC Accounts Office' },
    { title: 'STUDENT COPY', subtitle: 'To be retained by student as proof of deposit' }
  ];

  return (
    <div className="bg-white text-navy-950">
      {/* 3 Distinct Column Grid */}
      <div className="grid grid-cols-3 gap-4">
        {columns.map((col, idx) => (
          <div 
            key={idx}
            className={`border border-navy-900 rounded-lg p-3.5 flex flex-col justify-between text-[11px] ${
              idx < 2 ? 'border-r-2 border-r-dashed border-r-gray-400' : ''
            }`}
            style={{ minHeight: '660px' }}
          >
            <div>
              {/* Header */}
              <div className="text-center pb-2 border-b border-navy-800 mb-2">
                <div className="font-black text-sm tracking-tight text-navy-900">
                  SKYLINE LEARNING CENTER
                </div>
                <div className="text-[9px] text-muted font-bold">SLC ACADEMY MAIN CAMPUS</div>
                <div className="inline-block bg-navy-900 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded mt-1 uppercase tracking-wider">
                  {col.title}
                </div>
                <p className="text-[8px] text-muted mt-0.5">{col.subtitle}</p>
              </div>

              {/* Bank Details */}
              <div className="bg-gray-100 p-1.5 rounded border border-gray-300 text-[9px] space-y-0.5 mb-2 font-mono">
                <div>Bank: <strong>Habib Bank Ltd / Meezan Bank</strong></div>
                <div>Account Title: <strong>Skyline Learning Center</strong></div>
                <div>A/C Number: <strong>0142-987654321001</strong></div>
              </div>

              {/* Chalan Metadata */}
              <div className="space-y-1 mb-2 text-[10px]">
                <div className="flex justify-between border-b border-gray-200 pb-0.5">
                  <span className="text-muted">Chalan No:</span>
                  <span className="font-mono font-bold text-coral-600">{chalanNumber}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-0.5">
                  <span className="text-muted">Issue Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-0.5">
                  <span className="text-muted">Due Date:</span>
                  <span className="font-bold text-navy-900">10th of Current Month</span>
                </div>
              </div>

              {/* Student Details */}
              <div className="bg-canvas p-2 rounded border border-gray-200 space-y-1 text-[10px] mb-2">
                <div className="flex justify-between">
                  <span className="text-muted">Student Name:</span>
                  <strong className="text-navy-900">{student.fullName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Roll Number:</span>
                  <strong className="font-mono text-navy-900">{student.rollNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Class / Track:</span>
                  <span>{enrolledCourses[0]?.className || 'General Track'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Guardian Name:</span>
                  <span>{student.guardianName || 'N/A'}</span>
                </div>
              </div>

              {/* Fee Particulars Table */}
              <table className="w-full text-left text-[10px] border border-gray-300 mb-2">
                <thead className="bg-navy-900 text-white font-bold">
                  <tr>
                    <th className="py-1 px-1.5">Description</th>
                    <th className="py-1 px-1.5 text-right">Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-1 px-1.5 font-medium">Agreed Tuition Fee</td>
                    <td className="py-1 px-1.5 text-right">Rs. {student.totalFee?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-1.5 text-muted">Less: Already Paid</td>
                    <td className="py-1 px-1.5 text-right text-emerald-600">-Rs. {student.paidFee?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-1.5 font-medium">Bank Processing Charges</td>
                    <td className="py-1 px-1.5 text-right">Rs. 0</td>
                  </tr>
                  <tr className="bg-gray-100 font-black text-[11px]">
                    <td className="py-1.5 px-1.5 border-t-2 border-navy-900">Total Payable Amount</td>
                    <td className="py-1.5 px-1.5 text-right text-coral-600 border-t-2 border-navy-900">
                      Rs. {payableAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-[8px] text-muted space-y-0.5">
                <div>• Late fee surcharge of Rs. 300 applicable after due date.</div>
                <div>• Payments accepted at all authorized bank branches across Pakistan.</div>
              </div>
            </div>

            {/* Bottom Signatures */}
            <div className="pt-8 border-t border-gray-300 flex justify-between items-end text-[9px] text-muted">
              <div className="text-center">
                <div className="w-20 border-b border-gray-400 mb-0.5"></div>
                <span>Bank Cashier Stamp</span>
              </div>
              <div className="text-center">
                <div className="w-20 border-b border-gray-400 mb-0.5"></div>
                <span>Authorized Officer</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
