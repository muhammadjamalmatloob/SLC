import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CreditCard, Banknote, Landmark, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { validateFeePayment } from '../../utils/validators';

export default function FeeCollectModal({ isOpen, onClose, preselectedStudent = null }) {
  const { students, collectStudentFee, triggerAlert } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentNotes, setPaymentNotes] = useState('');

  useEffect(() => {
    if (preselectedStudent) {
      setSelectedStudentId(preselectedStudent.id);
      setPaymentAmount(preselectedStudent.balance || '');
    } else {
      // Pick first student with pending balance
      const withDue = students.find(s => s.balance > 0);
      if (withDue) {
        setSelectedStudentId(withDue.id);
        setPaymentAmount(withDue.balance);
      } else if (students.length > 0) {
        setSelectedStudentId(students[0].id);
        setPaymentAmount('');
      }
    }
  }, [preselectedStudent, isOpen, students]);

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // When student selection changes, suggest remaining balance
  const handleStudentSelect = (id) => {
    setSelectedStudentId(id);
    const s = students.find(item => item.id === id);
    if (s) {
      setPaymentAmount(s.balance);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentStudent) return;

    // Validate payment
    const validation = validateFeePayment(paymentAmount, currentStudent);
    if (!validation.isValid) {
      triggerAlert({
        type: 'error',
        title: validation.errorTitle,
        message: validation.errorMessage,
        code: validation.code,
        details: validation.details,
        buttonText: 'Adjust Payment'
      });
      return;
    }

    const receipt = collectStudentFee({
      studentId: currentStudent.id,
      amountPaid: Number(paymentAmount),
      paymentMethod,
      notes: paymentNotes
    });

    if (receipt) {
      onClose();
    }
  };

  const paymentMethods = [
    { id: 'Cash', label: 'Cash at Counter', icon: Banknote },
    { id: 'Debit Card', label: 'Debit / Credit Card', icon: CreditCard },
    { id: 'Online Transfer', label: 'Bank / Online', icon: Landmark },
    { id: 'Mobile Wallet', label: 'Easypaisa / JazzCash', icon: Smartphone }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 my-auto text-navy-800 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header styled like Checkout screen mockup */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-coral-500">Admin Cashier</span>
            <h3 className="text-xl font-extrabold text-navy-800">Fee Collection & Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-navy-800 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Student */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Select Student *</label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 bg-white"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.rollNumber}) — Due: Rs. {s.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Student Balance Card (Styled like coral debit card in Screen 2) */}
          {currentStudent && (
            <div className="p-4 rounded-2xl gradient-coral text-white shadow-glow relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Account Status</span>
                <span className="font-mono text-xs bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-white font-bold">
                  {currentStudent.rollNumber}
                </span>
              </div>
              <div className="text-base font-extrabold mb-1">{currentStudent.fullName}</div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-center">
                <div>
                  <div className="text-[9px] text-white/70">Total Fee</div>
                  <div className="text-xs font-bold">Rs. {currentStudent.totalFee?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[9px] text-white/70">Already Paid</div>
                  <div className="text-xs font-bold">Rs. {currentStudent.paidFee?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[9px] text-white/70">Remaining Due</div>
                  <div className="text-sm font-black text-amber-300">
                    Rs. {currentStudent.balance?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Select Payment Method */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1.5">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-2.5 rounded-2xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-coral-500 bg-coral-50/50 text-coral-600 font-bold shadow-sm'
                        : 'border-gray-200 bg-canvas text-navy-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{pm.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Amount Input with Validation Helper */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-navy-700">Payment Amount (Rs.) *</label>
              {currentStudent && (
                <button
                  type="button"
                  onClick={() => setPaymentAmount(currentStudent.balance)}
                  className="text-[10px] text-coral-500 font-bold hover:underline"
                >
                  Pay Full Balance (Rs. {currentStudent.balance.toLocaleString()})
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                max={currentStudent?.balance || 999999}
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter collected amount"
                className="w-full text-sm font-black px-3.5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">PKR</span>
            </div>
            <p className="text-[10px] text-muted mt-1">
              Constraint enforced: Amount cannot be negative or exceed student's remaining due.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">Receipt Notes / Reference</label>
            <input
              type="text"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="e.g. 2nd installment / Paid via counter"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
            />
          </div>

          {/* Submit CTA (Styled like Continue button in Screen 2) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!currentStudent || currentStudent.balance <= 0}
              className="w-full py-3.5 rounded-full font-bold text-white text-base gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm & Issue Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
