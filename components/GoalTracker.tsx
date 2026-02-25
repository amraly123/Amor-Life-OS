
import React from 'react';
import { Goal } from '../types';
import { CheckCircle2, Circle, ArrowUpRight, Plus } from 'lucide-react';

interface GoalTrackerProps {
  goals: Goal[];
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ goals }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">الكل (٨)</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">الشخصي</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">العمل</span>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20">
          <Plus size={18} />
          هدف جديد (OKR)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-2 inline-block ${
                  goal.category === 'Work' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {goal.category === 'Work' ? 'عمل' : 'إبداع'}
                </span>
                <h3 className="text-xl font-bold text-slate-800">{goal.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{goal.objective}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block uppercase">الموعد</span>
                <span className="text-sm font-bold text-slate-700">{goal.deadline}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700">التقدم الإجمالي</span>
                <span className="text-sm font-black text-emerald-500">{goal.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">النتائج الرئيسية (Key Results)</h4>
              {goal.keyResults.map((kr) => (
                <div key={kr.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group cursor-pointer hover:bg-white transition-colors">
                  {kr.completed ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <Circle size={18} className="text-slate-300 group-hover:text-emerald-400" />
                  )}
                  <span className={`text-sm font-medium ${kr.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {kr.text}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border-t border-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-emerald-500 transition-colors flex items-center justify-center gap-1">
              التفاصيل الكاملة
              <ArrowUpRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalTracker;
