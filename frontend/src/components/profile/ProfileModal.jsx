import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, KeyRound, LogOut, Lock, Shield, User, CheckCircle2 } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser, currentRole, logout, triggerAlert } = useApp();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen || !currentUser) return null;

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      triggerAlert({
        type: 'error',
        title: 'Password Too Short',
        message: 'Your new password must be at least 6 characters long.',
        code: 'ERR_PASSWORD_LENGTH'
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerAlert({
        type: 'error',
        title: 'Password Mismatch',
        message: 'The new password and confirmation password do not match.',
        code: 'ERR_PASSWORD_MISMATCH'
      });
      return;
    }

    triggerAlert({
      type: 'success',
      title: 'Password Changed Successfully',
      message: 'Your password has been updated. Use your new password for future logins.',
      buttonText: 'Done'
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 my-auto text-navy-800 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <h3 className="text-lg font-black text-navy-800">My Account</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-navy-800 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3.5 p-3.5 bg-canvas rounded-2xl border border-gray-200 mb-4">
          <img
            src={currentUser.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
            alt={currentUser.fullName}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-coral-400 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold text-sm sm:text-base text-navy-800 truncate">
              {currentUser.fullName}
            </h4>
            <p className="text-xs text-muted truncate">{currentUser.email}</p>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase ${
              currentRole === 'admin' 
                ? 'bg-coral-50 text-coral-600 border border-coral-200' 
                : currentRole === 'teacher'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              {currentRole}
            </span>
          </div>
        </div>

        {/* Profile Policy Alert */}
        {currentRole !== 'admin' && (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 mb-4 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Account Policy:</strong> You can only update your password. For any changes to your profile details, enrolled courses, or fees, please contact the academy administration.
            </p>
          </div>
        )}

        {/* Change Password Form */}
        <form onSubmit={handlePasswordSubmit} className="space-y-3 mb-5">
          <h5 className="text-xs font-bold text-navy-700 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-coral-500" />
            <span>Update Account Password</span>
          </h5>

          <div>
            <label className="block text-[11px] font-semibold text-navy-600 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-navy-600 mb-1">New Password (Min 6 chars)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-navy-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full font-bold text-white text-xs gradient-coral shadow-glow hover:opacity-95 transition-all"
          >
            Save Password
          </button>
        </form>

        {/* Sign Out Button */}
        <div className="pt-3 border-t border-gray-100">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full py-2.5 rounded-full font-bold text-coral-600 bg-coral-50 hover:bg-coral-100 transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
