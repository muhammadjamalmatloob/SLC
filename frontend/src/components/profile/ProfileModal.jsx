import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  KeyRound, 
  LogOut, 
  User, 
  Upload, 
  CheckCircle2, 
  Camera, 
  ShieldCheck, 
  AtSign 
} from 'lucide-react';
import { validatePhotoUpload } from '../../utils/validators';
import { DEFAULT_AVATAR_PLACEHOLDER } from '../../data/mockData';

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser, currentRole, logout, updateAdminProfile, triggerAlert } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile' | 'password'

  // Admin Profile Form Data
  const [profileData, setProfileData] = useState({
    username: 'admin',
    fullName: 'System Administrator',
    email: 'admin@slc.edu.pk',
    photoUrl: '',
    photoSizeKb: 45
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoSize, setPhotoSize] = useState(null);

  // Password Form Data
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        username: currentUser.username || 'admin',
        fullName: currentUser.fullName || 'System Administrator',
        email: currentUser.email || 'admin@slc.edu.pk',
        photoUrl: currentUser.photoUrl || '',
        photoSizeKb: currentUser.photoSizeKb || 45
      });
      setPhotoPreview(currentUser.photoUrl);
      setPhotoSize(currentUser.photoSizeKb || 45);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  // Handle Photo Upload with Strict <= 100 KB check
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validatePhotoUpload(file);
    if (!validation.isValid) {
      triggerAlert({
        type: 'error',
        title: validation.errorTitle,
        message: validation.errorMessage,
        code: validation.code,
        details: {
          fileSelected: file.name,
          actualSize: `${validation.actualKb} KB`,
          maxAllowed: '100.0 KB (102,400 bytes)'
        },
        buttonText: 'Upload <= 100 KB'
      });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      setPhotoPreview(dataUrl);
      setPhotoSize(validation.sizeKb);
      setProfileData(prev => ({
        ...prev,
        photoUrl: dataUrl,
        photoSizeKb: validation.sizeKb
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (!profileData.username || profileData.username.trim().length < 3) {
      triggerAlert({
        type: 'error',
        title: 'Invalid Username',
        message: 'Username must be at least 3 characters long.',
        code: 'ERR_INVALID_USERNAME'
      });
      return;
    }

    if (!profileData.fullName || profileData.fullName.trim().length < 3) {
      triggerAlert({
        type: 'error',
        title: 'Invalid Name',
        message: 'Full name must be at least 3 characters long.',
        code: 'ERR_INVALID_NAME'
      });
      return;
    }

    updateAdminProfile({
      username: profileData.username,
      fullName: profileData.fullName,
      photoUrl: profileData.photoUrl,
      photoSizeKb: profileData.photoSizeKb
    });

    onClose();
  };

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
      message: 'Your administrator password has been updated. Use it for your future logins.',
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
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="text-lg font-black text-navy-800">Admin Account Settings</h3>
            <p className="text-xs text-muted">Update profile picture, username & security</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-navy-800 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-canvas rounded-2xl border border-gray-200 mb-5">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'profile'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-muted hover:text-navy-800'
            }`}
          >
            <User className="w-3.5 h-3.5 text-coral-500" />
            <span>Profile & Picture</span>
          </button>
          <button
            onClick={() => setActiveSubTab('password')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'password'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-muted hover:text-navy-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-coral-500" />
            <span>Password</span>
          </button>
        </div>

        {/* TAB 1: EDIT PROFILE & PROFILE PIC */}
        {activeSubTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Profile Photo Avatar & Upload */}
            <div className="flex flex-col items-center justify-center p-4 bg-canvas rounded-2xl border border-gray-200 text-center">
              <div className="relative mb-3">
                <img
                  src={photoPreview || currentUser.photoUrl || DEFAULT_AVATAR_PLACEHOLDER}
                  alt={profileData.fullName}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-coral-400 shadow-md"
                />
                <label 
                  htmlFor="admin-photo-input"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full gradient-coral text-white shadow-glow cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                  title="Upload New Photo (Max 100 KB)"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="admin-photo-input"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <div className="text-xs font-bold text-navy-900">
                Administrator Profile Picture
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Strict limit: <strong className="text-coral-600 font-semibold">&le; 100 KB</strong> (PNG, JPG, WebP)
              </p>

              {photoSize && (
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  Size: {photoSize} KB (Verified)
                </span>
              )}
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1 flex items-center justify-between">
                <span>Admin Username *</span>
                <span className="text-[10px] text-muted font-normal">Used for login</span>
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  placeholder="e.g. admin"
                  className="w-full text-xs font-bold pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500 focus:ring-1 focus:ring-coral-500 font-mono"
                />
              </div>
            </div>

            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                Full Name / Designation *
              </label>
              <input
                type="text"
                required
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                placeholder="e.g. System Administrator"
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>

            {/* Email (Readonly Display) */}
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                Registered Admin Email
              </label>
              <input
                type="email"
                disabled
                value={profileData.email}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100/80 text-muted cursor-not-allowed"
              />
            </div>

            {/* Save Profile Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full font-bold text-white text-xs sm:text-sm gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: UPDATE PASSWORD */}
        {activeSubTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-navy-700 mb-1">Current Password</label>
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
              <label className="block text-[11px] font-semibold text-navy-700 mb-1">New Password (Min 6 chars)</label>
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
              <label className="block text-[11px] font-semibold text-navy-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-coral-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full font-bold text-white text-xs sm:text-sm gradient-coral shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
              >
                Update Password
              </button>
            </div>
          </form>
        )}

        {/* Sign Out Action */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full py-2.5 rounded-full font-bold text-coral-600 bg-coral-50 hover:bg-coral-100 transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Administrator Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
