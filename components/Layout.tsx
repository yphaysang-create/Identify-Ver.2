
import React from 'react';
import { AppView } from '../types';
import { Home, BookOpen, ClipboardCheck, MessageCircle, User, BarChart3, Trophy, UserCheck } from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const navItems = [
    { id: AppView.HOME, label: 'หน้าแรก', icon: Home },
    { id: AppView.EDUCATION, label: 'ความรู้ (SOP)', icon: BookOpen },
    { id: AppView.SELF_ASSESSMENT, label: 'ประเมินตนเอง', icon: UserCheck },
    { id: AppView.ASSESSMENT, label: 'ประเมินพฤติกรรม', icon: ClipboardCheck },
    { id: AppView.CHAT, label: 'วิเคราะห์ AI', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-50/40 via-sky-50/30 to-pink-50/30 text-slate-800">
      {/* Sidebar for desktop with bright pastel styling */}
      <aside className="hidden md:flex flex-col w-72 bg-white/90 backdrop-blur-xl text-slate-700 p-8 shadow-[4px_0_30px_rgba(99,102,241,0.06)] border-r border-indigo-100/70 relative z-20 overflow-hidden">
        {/* Decorative pastel background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-pink-200/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-10 left-0 w-32 h-32 bg-sky-100/50 rounded-full blur-2xl -ml-16 pointer-events-none"></div>
        
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-tr from-sky-400 via-indigo-500 to-pink-400 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-indigo-200/80">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-tight tracking-tight text-slate-800">Safety Data</h1>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">NUH Surgical Nursing</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2.5 relative z-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group cursor-pointer ${
                  isActive 
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-200/70 translate-x-1 font-bold' 
                  : 'hover:bg-indigo-50/80 text-slate-600 hover:text-indigo-700 font-medium'
                }`}
              >
                <Icon size={20} className={isActive ? 'animate-pulse text-white' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-100/80 relative z-10">
          <div className="flex items-center gap-3.5 p-2 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/50 border border-indigo-100/70 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center shadow-xs">
              <User size={20} className="text-indigo-500" />
            </div>
            <div className="text-sm">
              <p className="font-bold text-slate-800 text-xs">Medical Staff</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Online</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-24 md:pb-12 relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile with pastel touches */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-indigo-100/80 flex justify-around p-3 z-50 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(99,102,241,0.08)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-gradient-to-tr from-indigo-100 to-pink-100 text-indigo-600 shadow-xs' : ''}`}>
                <Icon size={19} />
              </div>
              <span className="text-[9px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
