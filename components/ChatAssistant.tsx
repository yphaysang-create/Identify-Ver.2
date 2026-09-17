
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getSafetyAdvice } from '../services/geminiService';
import { Send, Bot, User, Loader2, BarChart3 } from 'lucide-react';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'สวัสดีครับ ผมคือผู้เชี่ยวชาญด้านการวิเคราะห์ข้อมูลและความปลอดภัย (Safety Data Analyst) ผมพร้อมวิเคราะห์ข้อมูลความเสี่ยงและให้คำปรึกษาตามมาตรฐาน SOP SP-BQP-002-205-03 เพื่อเป้าหมาย Zero Error ครับ' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.concat(userMsg).map(m => ({ role: m.role, content: m.content }));
      const response = await getSafetyAdvice(history);
      setMessages(prev => [...prev, { role: 'assistant', content: response || 'ขออภัยครับ ระบบวิเคราะห์ข้อมูลขัดข้อง' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-3xl shadow-xl shadow-indigo-100/40 border border-indigo-100/80 overflow-hidden">
      <header className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 text-white p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
        <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-xs">
          <BarChart3 size={22} />
        </div>
        <div>
          <h3 className="font-extrabold text-base sm:text-lg tracking-tight">Safety Data Analyst AI</h3>
          <p className="text-xs text-indigo-100 font-medium">ระบบวิเคราะห์ข้อมูลความปลอดภัยเชิงลึก • มาตรฐาน SP-BQP-002-205-03</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-indigo-50/20 via-sky-50/15 to-white">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-xs ${msg.role === 'user' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <BarChart3 size={16} />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-tr-none shadow-md shadow-indigo-200/50' : 'bg-white text-slate-800 rounded-tl-none border border-indigo-100 shadow-xs'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-indigo-100 flex items-center gap-2 shadow-xs">
              <Loader2 className="animate-spin text-indigo-500" size={16} />
              <span className="text-sm text-slate-500 font-medium">กำลังประมวลผลข้อมูลเชิงวิเคราะห์...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-indigo-100/80 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="ปรึกษาการวิเคราะห์ความเสี่ยง..."
            className="flex-1 bg-slate-50/80 border border-indigo-100 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300/40 focus:border-indigo-400 focus:bg-white transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-40 shadow-md shadow-indigo-200 cursor-pointer"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 text-center">ตัวอย่าง: "วิเคราะห์ความเสี่ยงการให้เลือด", "ผลทางสถิติของการสแกน QR code ช่วยลด Human Error อย่างไร"</p>
      </div>
    </div>
  );
};

export default ChatAssistant;
