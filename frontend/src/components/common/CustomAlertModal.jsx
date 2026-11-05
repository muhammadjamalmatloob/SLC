import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle2, Info, XCircle, X, ShieldAlert } from 'lucide-react';

export default function CustomAlertModal() {
  const { alertModal, closeAlert } = useApp();

  if (!alertModal.isOpen) return null;

  const isSuccess = alertModal.type === 'success';
  const isError = alertModal.type === 'error';
  const isWarning = alertModal.type === 'warning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss X button */}
        <button
          onClick={closeAlert}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-navy-800 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Graphic / Badge */}
        <div className="mx-auto mb-4 flex items-center justify-center">
          {isSuccess ? (
            <div className="relative w-20 h-20 bg-coral-50 rounded-2xl flex items-center justify-center shadow-inner">
              {/* Illustrated Stacked Cards resembling mockup screen 3 */}
              <div className="w-12 h-8 bg-coral-500 rounded-lg shadow-md transform -rotate-12 absolute -top-1 left-2 flex items-center justify-end px-2">
                <div className="w-2 h-2 rounded-full bg-white/40"></div>
              </div>
              <div className="w-14 h-9 bg-amber-400 rounded-lg shadow-md absolute z-10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
            </div>
          ) : isError ? (
            <div className="w-16 h-16 rounded-2xl bg-coral-50 border-2 border-coral-200 flex items-center justify-center text-coral-600 shadow-glow">
              <ShieldAlert className="w-9 h-9 text-coral-600" />
            </div>
          ) : isWarning ? (
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-500">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600">
              <Info className="w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>

        {/* Pre-title Tag */}
        <div className="mb-1">
          {isSuccess ? (
            <span className="text-xs font-bold tracking-wider uppercase text-coral-500">Notice</span>
          ) : isError ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-coral-600 bg-coral-50 px-2.5 py-0.5 rounded-full">
              Validation Error
            </span>
          ) : (
            <span className="text-xs font-bold tracking-wider uppercase text-amber-600">Attention Required</span>
          )}
        </div>

        {/* Modal Title */}
        <h3 className="text-xl font-extrabold text-navy-800 mb-2 leading-tight">
          {alertModal.title || (isSuccess ? 'Success' : 'Validation Error')}
        </h3>

        {/* Message Body */}
        <p className="text-sm text-navy-600/90 leading-relaxed mb-4 px-2">
          {alertModal.message}
        </p>

        {/* Collision / Detailed Breakdown Card if provided */}
        {alertModal.details && (
          <div className="mb-5 p-3.5 bg-canvas rounded-2xl border border-gray-200 text-left text-xs text-navy-700 space-y-1.5">
            <div className="font-semibold text-navy-800 flex items-center justify-between pb-1 border-b border-gray-200">
              <span>Constraint Diagnostics</span>
              {alertModal.code && <span className="font-mono text-[10px] text-coral-600">{alertModal.code}</span>}
            </div>
            {Object.entries(alertModal.details).map(([key, val]) => (
              <div key={key} className="flex justify-between items-start gap-2">
                <span className="text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-medium text-navy-900 text-right">{String(val)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button matching theme CTA */}
        <button
          onClick={closeAlert}
          className="w-full py-3.5 px-6 rounded-full font-bold text-white text-base gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all duration-200"
        >
          {alertModal.buttonText || (isSuccess ? 'Back to Home' : 'Understood')}
        </button>
      </div>
    </div>
  );
}
