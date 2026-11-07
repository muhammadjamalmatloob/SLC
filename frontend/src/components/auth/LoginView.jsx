import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginView() {
  const { login } = useApp();

  const [identifier, setIdentifier] = useState('admin@slc.edu.pk');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(identifier, password);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-white rounded-4xl p-6 sm:p-8 shadow-card border border-gray-100 animate-scale-up">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-white p-2 border border-gray-100 shadow-md mx-auto mb-3 flex items-center justify-center overflow-hidden">
            <img 
              src="/logo.jpeg" 
              alt="Skyline Learning Center Logo" 
              className="w-full h-full object-contain rounded-2xl" 
            />
          </div>
          <h1 className="text-2xl font-black text-navy-800 tracking-tight">Skyline Learning Center</h1>
          <p className="text-xs text-muted mt-1">Administrator Control Panel</p>
        </div>

        {/* Admin Badge */}
        <div className="bg-coral-50 border border-coral-200 text-coral-600 rounded-2xl p-2.5 flex items-center justify-center gap-2 mb-6 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-coral-500" />
          <span>Administrator Access Portal</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1.5">
              Admin Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@slc.edu.pk"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-canvas border border-gray-200 focus:outline-none focus:border-coral-500 font-medium text-navy-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-10 py-3 rounded-2xl bg-canvas border border-gray-200 focus:outline-none focus:border-coral-500 font-medium text-navy-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-700 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-muted cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="rounded text-coral-500 focus:ring-coral-500" />
              <span>Remember session</span>
            </label>
            <span className="text-coral-500 font-semibold cursor-pointer hover:underline text-[11px]">
              Recovery Help
            </span>
          </div>

          {/* Sign In CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-full font-extrabold text-white text-sm gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 p-3 bg-canvas rounded-2xl border border-gray-200 text-center">
          <p className="text-[11px] text-muted">
            Demo Credentials: <strong className="text-navy-800">admin@slc.edu.pk</strong> / <strong className="text-navy-800">admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
