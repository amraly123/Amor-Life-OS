
import React, { useState, useEffect } from 'react';
import { getStrategicAdvice } from '../geminiService';
import { Goal, Task, UserState } from '../types';
import { Sparkles, Send, BrainCircuit, RefreshCcw } from 'lucide-react';

interface AIAssistantProps {
  goals: Goal[];
  tasks: Task[];
  userStats: UserState;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ goals, tasks, userStats }) => {
  const [advice, setAdvice] = useState<{ title: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshAdvice = async () => {
    setLoading(true);
    const newAdvice = await getStrategicAdvice(goals, tasks, userStats);
    setAdvice(newAdvice);
    setLoading(false);
  };

  useEffect(() => {
    refreshAdvice();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4 items-center text-center md:text-right">
             <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-sm">
                <BrainCircuit size={40} className="text-emerald-50" />
             </div>
             <div>
                <h3 className="text-2xl font-black mb-1">شريكك الاستراتيجي الذكي</h3>
                <p className="text-emerald-50/80">بيفكر معاك بأسلوب Peter Drucker ونكهة مصرية</p>
             </div>
          </div>
          <button 
            onClick={refreshAdvice}
            disabled={loading}
            className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-black text-sm uppercase flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? <RefreshCcw className="animate-spin" /> : <Sparkles size={18} />}
            جدد الأفكار
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="p-10 text-center animate-pulse text-slate-400 font-bold">جاري تحليل الأهداف وعمل القهوة.. لحظات يا عمرو</div>
          ) : advice.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors">
              <h4 className="text-emerald-600 font-black text-lg mb-2">● {item.title}</h4>
              <p className="text-slate-600 leading-relaxed font-medium">{item.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-6 flex flex-col h-[600px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
           <div className="bg-slate-800 p-4 rounded-2xl rounded-tr-none text-slate-100 text-sm">
              أهلاً يا عمرو.. أنا هنا عشان أساعدك نطلع بـ "Creative Kids" للعالمية. تحب نناقش إيه النهاردة؟
           </div>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="اسأل شريكك.." 
            className="flex-1 bg-slate-800 border-none rounded-2xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <button className="bg-emerald-500 p-3 rounded-2xl text-white">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
