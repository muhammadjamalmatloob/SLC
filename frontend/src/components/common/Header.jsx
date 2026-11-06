import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_AVATAR_PLACEHOLDER } from '../../data/mockData';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen, 
  CreditCard, 
  Calendar, 
  Building2, 
  Award, 
  KeyRound, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Header({ onOpenProfile }) {
  const { currentUser, logout, activeTab, setActiveTab } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: GraduationCap },
    { id: 'teachers', label: 'Faculty Members', icon: Users },
    { id: 'courses', label: 'Courses & Curriculum', icon: BookOpen },
    { id: 'fees', label: 'Fees & Chalans', icon: CreditCard },
    { id: 'timetable', label: 'Timetable Scheduler', icon: Calendar },
    { id: 'classrooms', label: 'Classrooms & Facilities', icon: Building2 },
    { id: 'exams', label: 'Examinations & Marks', icon: Award },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setDrawerOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-2xl gradient-coral flex items-center justify-center text-white font-black text-sm shadow-glow shrink-0">
            SLC
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-navy-800 leading-tight">
              Skyline Learning Center
            </h1>
            <p className="text-[10px] text-muted flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Admin Portal
            </p>
          </div>
        </div>

        {/* Top Right: Profile + Three Horizontal Bars Hamburger Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Avatar Pill */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-canvas border border-gray-200 hover:border-gray-300 cursor-pointer transition-all shadow-xs"
            title="Admin Profile & Settings"
          >
            <img
              src={currentUser?.photoUrl || DEFAULT_AVATAR_PLACEHOLDER}
              alt="Admin"
              className="w-7 h-7 rounded-full object-cover ring-2 ring-coral-400 shrink-0"
            />
            <span className="text-xs font-bold text-navy-800 hidden sm:inline truncate max-w-[120px]">
              {currentUser?.username || 'Admin'}
            </span>
          </div>

          {/* Three Horizontal Bars Menu Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 text-navy-800 hover:text-coral-600 bg-canvas hover:bg-coral-50 rounded-2xl border border-gray-200 transition-colors shadow-xs"
            aria-label="Open Navigation Menu"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Slide-Over Drawer for All Tabs & Profile Options */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          ></div>

          {/* Drawer Body */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left text-navy-800">
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl gradient-coral flex items-center justify-center text-white font-black text-xs shadow-glow">
                  SLC
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-navy-900">Academy Menu</h3>
                  <span className="text-[10px] text-muted">All Management Modules</span>
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 text-gray-400 hover:text-navy-900 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Profile Mini Card */}
            <div className="p-4 mx-4 mt-4 bg-canvas rounded-2xl border border-gray-200 flex items-center gap-3">
              <img
                src={currentUser?.photoUrl || DEFAULT_AVATAR_PLACEHOLDER}
                alt="Admin"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-coral-400 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-xs text-navy-800 truncate">{currentUser?.fullName}</div>
                <div className="text-[10px] text-muted truncate">{currentUser?.email}</div>
                <span className="inline-block text-[9px] font-bold bg-coral-50 text-coral-600 px-2 py-0.5 rounded-full mt-0.5">
                  Administrator
                </span>
              </div>
            </div>

            {/* Navigation Tabs List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted px-2 py-1">
                Academy Modules
              </div>

              {menuTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-coral-500 text-white shadow-glow'
                        : 'text-navy-700 hover:bg-canvas hover:text-navy-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white/80' : 'text-gray-300'}`} />
                  </button>
                );
              })}

              <div className="pt-3 border-t border-gray-100 my-2"></div>

              {/* Profile & Password options */}
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-navy-700 hover:bg-canvas transition-colors"
              >
                <KeyRound className="w-4 h-4 text-coral-500" />
                <span>Admin Profile & Password</span>
              </button>
            </div>

            {/* Drawer Footer / Sign Out */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                }}
                className="w-full py-2.5 rounded-full font-bold text-xs text-coral-600 bg-coral-50 hover:bg-coral-100 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
