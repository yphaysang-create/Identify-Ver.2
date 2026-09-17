
import React, { useState } from 'react';
import Layout from './components/Layout';
import Education from './components/Education';
import Assessment from './components/Assessment';
import ChatAssistant from './components/ChatAssistant';
import { AppView } from './types';
import { ArrowRight, Star, AlertTriangle, ShieldCheck, CheckSquare, BarChart3, Trophy } from 'lucide-react';

const HomeView: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero Banner with bright pastel gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-purple-200/60 border border-white/20">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block bg-white/25 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold mb-6 text-white border border-white/30 shadow-xs tracking-wide">
            SOP: SP-BQP-002-205-03
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight tracking-tight drop-shadow-xs">
            Identify ดี <br className="hidden md:block" /> ไม่มีผิดพลาด
          </h1>
          <p className="text-indigo-50 text-base md:text-lg mb-8 leading-relaxed font-normal opacity-95">
            แพลตฟอร์มวิเคราะห์และพัฒนาทักษะการระบุตัวตนผู้ป่วย <br />
            งานการพยาบาลศัลยกรรม โรงพยาบาลมหาวิทยาลัยนเรศวร
          </p>
          <div className="flex flex-wrap gap-3.5">
            <button 
              onClick={() => setView(AppView.EDUCATION)}
              className="px-7 py-3.5 bg-white text-indigo-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg shadow-indigo-950/15 active:scale-95 cursor-pointer"
            >
              เรียนรู้มาตรฐาน <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => setView(AppView.SELF_ASSESSMENT)}
              className="px-7 py-3.5 bg-emerald-400/30 text-white border border-emerald-200/50 backdrop-blur-md rounded-2xl font-bold hover:bg-emerald-400/40 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              แบบประเมินตนเอง <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => setView(AppView.ASSESSMENT)}
              className="px-7 py-3.5 bg-white/20 text-white border border-white/40 backdrop-blur-md rounded-2xl font-bold hover:bg-white/30 transition-all active:scale-95 cursor-pointer"
            >
              ประเมินพฤติกรรม (Compliance)
            </button>
          </div>
        </div>
        {/* Soft pastel luminous shapes */}
        <div className="absolute top-[-15%] right-[-10%] w-80 h-80 bg-pink-300/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[15%] w-96 h-96 bg-sky-300/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-[30%] right-[5%] w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </section>

      {/* Feature cards with bright pastel accents */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white via-white to-sky-50/70 p-7 rounded-3xl border border-sky-100 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100/60 transition-all group shadow-sm">
          <div className="w-12 h-12 bg-sky-100/80 text-sky-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Data-Driven Safety</h3>
          <p className="text-slate-500 text-sm leading-relaxed">วิเคราะห์ความเสี่ยงและพฤติกรรมผ่านเกณฑ์ Compliance Checklist ที่เป็นมาตรฐานสากล</p>
        </div>
        <div className="bg-gradient-to-br from-white via-white to-emerald-50/70 p-7 rounded-3xl border border-emerald-100 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/60 transition-all group shadow-sm">
          <div className="w-12 h-12 bg-emerald-100/80 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Zero Identify Error</h3>
          <p className="text-slate-500 text-sm leading-relaxed">มุ่งเน้นการป้องกัน Human Error ในขั้นตอนการให้ยา เจาะเลือด และการให้เลือด</p>
        </div>
        <div className="bg-gradient-to-br from-white via-white to-purple-50/70 p-7 rounded-3xl border border-purple-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/60 transition-all group shadow-sm">
          <div className="w-12 h-12 bg-purple-100/80 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
            <Star size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">100% Accuracy</h3>
          <p className="text-slate-500 text-sm leading-relaxed">ประเมินและทบทวนอย่างต่อเนื่องเพื่อให้มั่นใจว่าบุคลากรทุกคนปฏิบัติได้ถูกต้อง 100%</p>
        </div>
      </section>

      {/* Case Study Banner with bright pastel gradient */}
      <div className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-indigo-200/50 relative overflow-hidden border border-white/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300/20 blur-[80px] pointer-events-none"></div>
        <div className="flex-1 space-y-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">ต้องการวิเคราะห์กรณีศึกษา?</h2>
          <p className="text-indigo-50 text-base md:text-lg leading-relaxed opacity-95">
            ปรึกษา Safety Data Analyst AI ของเราเพื่อวิเคราะห์ความเสี่ยงในสถานการณ์ที่ซับซ้อน หรือทบทวนขั้นตอน SOP ที่ไม่ชัดเจน
          </p>
          <button 
            onClick={() => setView(AppView.CHAT)}
            className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/15 active:scale-95 cursor-pointer"
          >
            เริ่มการวิเคราะห์เชิงลึก <ArrowRight size={20} />
          </button>
        </div>
        <div className="hidden md:block w-44 h-44 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center relative shadow-inner border border-white/30">
           <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
           <BarChart3 size={56} className="text-white relative z-10 drop-shadow-xs" />
        </div>
      </div>

      <footer className="text-center text-slate-400 text-sm py-8 border-t border-indigo-100/80">
        <p className="font-medium text-slate-500">© 2024-2026 งานการพยาบาลศัลยกรรม โรงพยาบาลมหาวิทยาลัยนเรศวร</p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-indigo-400">Identify ดี ไม่มีผิดพลาด • Safety First</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <HomeView setView={setCurrentView} />;
      case AppView.EDUCATION:
        return <Education />;
      case AppView.ASSESSMENT:
        return <Assessment isSelfAssessment={false} />;
      case AppView.SELF_ASSESSMENT:
        return <Assessment isSelfAssessment={true} />;
      case AppView.CHAT:
        return <ChatAssistant />;
      default:
        return <HomeView setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
      {renderView()}
    </Layout>
  );
};

export default App;
