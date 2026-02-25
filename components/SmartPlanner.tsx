
import React, { useState } from 'react';
import { Task, Goal, WeeklyVictory } from '../types';
import { Clock, Sun, Moon, Plus, CheckCircle2, Circle, Zap, Target, Link as LinkIcon, Crown, Edit3 } from 'lucide-react';

interface SmartPlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  goals: Goal[];
  userStats: any;
  setUserStats: any;
}

const SmartPlanner: React.FC<SmartPlannerProps> = ({ tasks, setTasks, goals, userStats, setUserStats }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [isEditingVictory, setIsEditingVictory] = useState(false);
  
  const [tempVictory, setTempVictory] = useState<WeeklyVictory>(userStats.weeklyVictory || {
    title: '', description: '', reward: '', progress: 0
  });

  const today = new Date().toLocaleDateString('ar-EG', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleUpdateVictory = () => {
    setUserStats({ ...userStats, weeklyVictory: tempVictory });
    setIsEditingVictory(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      urgent: false,
      important: true,
      completed: false,
      duration: 30,
      goalId: selectedGoalId || undefined
    };
    
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setSelectedGoalId('');
  };

  const getGoalTitle = (goalId?: string) => {
    if (!goalId) return null;
    return goals.find(g => g.id === goalId)?.title;
  };

  const timeBlocks = [
    { time: '07:00', label: 'الفجر والهدوء الذهني', icon: <Sun size={14} /> },
    { time: '09:00', label: 'وقت "الانتصار" (Deep Work)', icon: <Crown size={14} className="text-emerald-500" /> },
    { time: '11:00', label: 'إدارة العمليات', icon: <Clock size={14} /> },
    { time: '14:00', label: 'المهمة الثانوية', icon: <Zap size={14} className="text-orange-500" /> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Weekly Victory Focus in Planner */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
           <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                    <Crown size={20} />
                 </div>
                 <h3 className="font-black uppercase tracking-widest text-sm">انتصار الأسبوع الاستراتيجي</h3>
              </div>
              <button 
                onClick={() => setIsEditingVictory(!isEditingVictory)}
                className="text-slate-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg"
              >
                <Edit3 size={16} />
              </button>
           </div>

           {isEditingVictory ? (
             <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                <input 
                  type="text" 
                  value={tempVictory.title}
                  onChange={e => setTempVictory({...tempVictory, title: e.target.value})}
                  placeholder="ما هو الانتصار؟ (مثلاً: إنهاء مسودة الرواية)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <textarea 
                  value={tempVictory.description}
                  onChange={e => setTempVictory({...tempVictory, description: e.target.value})}
                  placeholder="وصف بسيط.."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500 h-20"
                />
                <input 
                  type="text" 
                  value={tempVictory.reward}
                  onChange={e => setTempVictory({...tempVictory, reward: e.target.value})}
                  placeholder="فخر الأسبوع: إيه الشعور اللي هتوصلي؟"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button 
                  onClick={handleUpdateVictory}
                  className="w-full bg-emerald-500 py-3 rounded-xl font-bold text-sm uppercase"
                >
                  تثبيت البوصلة الأسبوعية
                </button>
             </div>
           ) : (
             <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                   <h2 className="text-2xl font-black mb-2">{userStats.weeklyVictory?.title || 'لم يتم تحديد انتصار'}</h2>
                   <p className="text-slate-400 text-sm leading-relaxed">{userStats.weeklyVictory?.description}</p>
                   <div className="mt-4 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">فرحة الأسبوع:</span>
                      <span className="text-sm font-bold text-emerald-400">{userStats.weeklyVictory?.reward}</span>
                   </div>
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                    <svg className="w-full h-full -rotate-90">
                      <circle 
                        cx="44" cy="44" r="40" 
                        className="stroke-emerald-500 fill-none" 
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * (userStats.weeklyVictory?.progress || 0)) / 100}
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                      />
                    </svg>
                    <span className="absolute text-lg font-black">{userStats.weeklyVictory?.progress || 0}%</span>
                </div>
             </div>
           )}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-3xl font-black text-slate-800 mb-2">{today}</h2>
          <p className="text-slate-500 italic">"الإدارة هي فعل الأشياء بشكل صحيح؛ القيادة هي فعل الأشياء الصحيحة."</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="text-emerald-500" />
            هيكل اليوم (Time Blocking)
          </h4>
          <div className="space-y-4">
            {timeBlocks.map((block, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="w-16 text-right">
                  <span className="text-sm font-bold text-slate-400 group-hover:text-emerald-500 transition-colors">{block.time}</span>
                </div>
                <div className="relative flex-1 pb-6 border-r-2 border-slate-100 pr-8">
                  <div className="absolute -right-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-500 transition-all"></div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between group-hover:bg-white group-hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-white rounded-lg shadow-sm">{block.icon}</span>
                      <span className="font-bold text-slate-700">{block.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
          <h4 className="font-bold text-lg mb-6 flex items-center gap-2"><Plus className="text-emerald-400" /> إضافة سريعة</h4>
          <form onSubmit={addTask} className="space-y-4">
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="عايز تنجز إيه دلوقتي؟" 
              className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-500"
            />
            <button className="w-full bg-emerald-500 py-4 rounded-2xl font-black text-sm uppercase shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all">
              تثبيت المهمة
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-800">قائمة المهام</h4>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
              {tasks.filter(t => !t.completed).length} متبقية
            </span>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  task.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 hover:shadow-md hover:border-emerald-100'
                }`}
              >
                {task.completed ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Circle className="text-slate-300" size={20} />}
                <span className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPlanner;
