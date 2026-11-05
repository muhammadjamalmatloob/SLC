import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-card border border-gray-100 transition-all duration-300 animate-slide-in"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-coral-500" />
              ) : isWarning ? (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              ) : (
                <Info className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-navy-800 uppercase tracking-wider">{toast.title}</h5>
              <p className="text-xs text-navy-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
