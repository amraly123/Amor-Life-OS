
import React, { useState } from 'react';
import { Goal } from '../types';
import { CheckCircle2, Circle, ArrowUpRight, Plus, X, Target, Sparkles } from 'lucide-react';

interface GoalTrackerProps {
  goals: Goal[];
  setGoals?: (goals: Goal[]) => void;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ goals, setGoals }) => {
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    objective: '',
    category: 'Work' as 'Personal' | 'Work' | 'Creative',
    deadline: '',
    kr1: '',
    kr2: '',
    kr3: '',
  });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.objective) return;

    const keyResults = [newGoal.kr1, newGoal.kr2, newGoal.kr3]
      .filter(kr => kr.trim() !== '')
      .map((kr, i) => ({
        id: `kr-${Date.now()}-${i}`,
        text: kr,
        completed: false,
      }));

    const goal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoal.title,
      objective: newGoal.objective,
      category: newGoal.category,
      deadline: newGoal.deadline || 'غير محدد',
      progress: 0,
      keyResults,
    };

    if (setGoals) {
      setGoals([...goals, goal]);
    }

    setNewGoal({ title: '', objective: '', category: 'Work', deadline: '', kr1: '', kr2: '', kr3: '' });
    setShowForm(false);
  };

  const handleToggleKR = (goalId: string, krId: string) => {
    if (!setGoals) return;
    const updated = goals.map(g => {
      if (g.id !== goalId) return g;
      const updatedKRs = g.keyResults.map(kr =>
        kr.id === krId ? { ...kr, completed: !kr.completed } : kr
      );
      const completedCount = updatedKRs.filter(kr => kr.completed).length;
      const progress = updatedKRs.length > 0 ? Math.round((completedCount / updatedKRs.length) * 100) : 0;
      return { ...g, keyResults: updatedKRs, progress };
    });
    setGoals(updated);
  };

  const activeGoals = goals.filter(g => g.progress < 100);
  const completedGoals = goals.filter(g => g.progress >= 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold">الكل ({goals.length})</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">نشط ({activeGoals.length})</span>
          {completedGoals.length > 0 && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold">مكتمل ({completedGoals.length})</span>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-95"
        >
          <Plus size={18} />
          هدف جديد (OKR)
        </button>
      </div>

      {/* New Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-100 animate-in fade-in zoom-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-xl">
                  <Target className="text-sky-600" size={22} />
                </div>
                <h3 className="text-xl font-black text-slate-800">هدف جبار جديد 🎯</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">عنوان الهدف</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="مثلاً: إطلاق أكاديمية القرآن"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">الهدف الرئيسي (Objective)</label>
                <input
                  type="text"
                  value={newGoal.objective}
                  onChange={(e) => setNewGoal({ ...newGoal, objective: e.target.value })}
                  placeholder="مثلاً: بناء منصة تعليمية تفاعلية"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">التصنيف</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option value="Work">عمل</option>
                    <option value="Personal">شخصي</option>
                    <option value="Creative">إبداع</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">الموعد النهائي</label>
                  <input
                    type="text"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    placeholder="مثلاً: يونيو ٢٠٢٦"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-sky-500" />
                  النتائج الرئيسية (Key Results)
                </label>
                <div className="space-y-2">
                  <input type="text" value={newGoal.kr1} onChange={(e) => setNewGoal({ ...newGoal, kr1: e.target.value })}
                    placeholder="النتيجة الأولى" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
                  <input type="text" value={newGoal.kr2} onChange={(e) => setNewGoal({ ...newGoal, kr2: e.target.value })}
                    placeholder="النتيجة الثانية (اختياري)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
                  <input type="text" value={newGoal.kr3} onChange={(e) => setNewGoal({ ...newGoal, kr3: e.target.value })}
                    placeholder="النتيجة الثالثة (اختياري)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
              </div>

              <button
                onClick={handleAddGoal}
                disabled={!newGoal.title || !newGoal.objective}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl mt-4 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                إضافة الهدف الجبار 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-2 inline-block ${goal.category === 'Work' ? 'bg-sky-100 text-sky-600' :
                    goal.category === 'Personal' ? 'bg-indigo-100 text-indigo-600' :
                      'bg-amber-100 text-amber-600'
                  }`}>
                  {goal.category === 'Work' ? 'عمل' : goal.category === 'Personal' ? 'شخصي' : 'إبداع'}
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
                <span className={`text-sm font-black ${goal.progress >= 100 ? 'text-emerald-500' : 'text-sky-500'}`}>{goal.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${goal.progress >= 100 ? 'bg-emerald-500' : 'bg-sky-500'}`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">النتائج الرئيسية (Key Results)</h4>
              {goal.keyResults.map((kr) => (
                <div
                  key={kr.id}
                  onClick={() => handleToggleKR(goal.id, kr.id)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group cursor-pointer hover:bg-white transition-colors"
                >
                  {kr.completed ? (
                    <CheckCircle2 size={18} className="text-sky-500" />
                  ) : (
                    <Circle size={18} className="text-slate-300 group-hover:text-sky-400" />
                  )}
                  <span className={`text-sm font-medium ${kr.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {kr.text}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border-t border-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-sky-500 transition-colors flex items-center justify-center gap-1">
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
