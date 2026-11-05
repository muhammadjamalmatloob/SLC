import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  CreditCard, 
  Calendar,
  GraduationCap,
  Users,
  Building2,
  Award
} from 'lucide-react';

export default function Navigation() {
  const { activeTab, setActiveTab } = useApp();

  // Desktop / Tablet Tabs (all major modules)
  const desktopTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'fees', label: 'Fees & Chalans', icon: CreditCard },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'classrooms', label: 'Classrooms', icon: Building2 },
    { id: 'exams', label: 'Exams & Marks', icon: Award },
  ];

  // Mobile Bottom Navigation Tabs: EXACTLY FOUR TABS as requested:
  // 1. Dashboard, 2. Courses, 3. Fee, 4. Timetable
  const mobileFourTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'fees', label: 'Fee', icon: CreditCard },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
  ];

  return (
    <>
      {/* 1. Desktop & iPad Horizontal Nav Bar (Hidden on mobile) */}
      <nav className="hidden md:flex bg-white border-b border-gray-100 px-6 py-2.5 items-center gap-1.5 overflow-x-auto shrink-0 z-20">
        <div className="max-w-6xl mx-auto w-full flex items-center gap-2">
          {desktopTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-coral-500 text-white shadow-glow'
                    : 'text-navy-700 bg-canvas hover:bg-gray-100 hover:text-navy-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. Mobile Floating Bottom Navigation Bar (ONLY 4 TABS: Dashboard, Courses, Fee, Timetable) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-3 py-2 flex items-center justify-around z-40 shadow-card">
        {mobileFourTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all duration-200 relative ${
                isActive ? 'text-coral-500 scale-105' : 'text-gray-400 hover:text-navy-700'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-coral-50' : ''}`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] ${isActive ? 'font-extrabold text-coral-600' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-coral-500 absolute -bottom-0.5"></span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
