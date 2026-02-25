
import React from 'react';
import { UserState, LifeRole } from '../types';
import { Target, Eye, User, Quote, ShieldCheck, Crown, Sparkles, ChevronLeft } from 'lucide-react';

interface DashboardProps {
  userStats: UserState;
}

const Dashboard: React.FC<DashboardProps> = ({ userStats }) => {
  const victory = userStats.weeklyVictory || {
    title: 'حدد انتصارك السيادي لهذا الأسبوع',
    description: 'ما هو الشيء الوحيد الذي سيجعل الأسبوع ناجحاً؟',
    reward: 'فرحة الإنجاز',
    progress: 0
  };

  return (
    <div className="space-y-8">
      {/* Weekly Victory Hero Section */}
      <div className="relative group overflow-hidden rounded-[3rem] bg-slate-900 p-1">
        {/* Animated Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-indigo-500/20 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full"></div>

        <div className="relative bg-slate-900 rounded-[2.8rem] p-8 md:p-10 border border-white/5 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-sky-500 to-blue-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-sky-500/40 rotate-3 group-hover:rotate-6 transition-transform">
                <Crown size={48} className="text-white drop-shadow-md" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white text-slate-900 p-2 rounded-xl shadow-lg animate-bounce">
                <Sparkles size={16} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-sky-400 text-xs font-black uppercase tracking-[0.2em]">انتصار الأسبوع الاستراتيجي</span>
                <div className="h-[1px] w-12 bg-sky-500/30"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight tracking-tight">
                {victory.title}
              </h2>
              <p className="text-slate-400 text-lg mb-6 max-w-2xl">
                {victory.description}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1">فخر الأسبوع المنتظر</span>
                  <span className="text-sky-400 font-bold">{victory.reward}</span>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">مستوى التقدم</span>
                    <span className="text-xs font-black text-white">{victory.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                      style={{ width: `${victory.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase flex items-center gap-2 hover:bg-sky-500 hover:text-white transition-all shadow-xl active:scale-95">
              تحديث التقدم
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission & Vision Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider">الرسالة الدستورية</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-lg italic">
            "{userStats.mission}"
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="text-sky-500" />
            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider">الرؤية البعيدة</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-lg">
            {userStats.vision}
          </p>
        </div>
      </div>

      {/* Life Roles Grid */}
      <div className="col-span-1 md:col-span-2">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <User className="text-sky-500" />
          أدواري في الحياة (قبعة النهاردة إيه؟)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.values(LifeRole).map((role, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-50 transition-colors">
                <Target size={20} className="text-slate-400 group-hover:text-sky-500" />
              </div>
              <span className="font-bold text-slate-700 block">{role}</span>
              <span className="text-[10px] text-sky-500 font-bold uppercase mt-1 block">إتقان: ٨٥٪</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
