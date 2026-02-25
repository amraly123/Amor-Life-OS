
import React from 'react';
import { Task } from '../types';
import { AlertCircle, Star, Zap, Trash2, CheckCircle2 } from 'lucide-react';

interface PriorityMatrixProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const PriorityMatrix: React.FC<PriorityMatrixProps> = ({ tasks, setTasks }) => {
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const categories = [
    { 
      id: 'do', 
      title: 'افعل الآن (عاجل ومهم)', 
      color: 'bg-red-50 text-red-600 border-red-100',
      icon: <Zap size={18} />,
      filter: (t: Task) => t.urgent && t.important
    },
    { 
      id: 'schedule', 
      title: 'خطط له (مهم مش عاجل)', 
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      icon: <Star size={18} />,
      filter: (t: Task) => !t.urgent && t.important
    },
    { 
      id: 'delegate', 
      title: 'فوضه (عاجل مش مهم)', 
      color: 'bg-orange-50 text-orange-600 border-orange-100',
      icon: <AlertCircle size={18} />,
      filter: (t: Task) => t.urgent && !t.important
    },
    { 
      id: 'eliminate', 
      title: 'احذفه (فخاخ الوقت)', 
      color: 'bg-slate-50 text-slate-400 border-slate-200',
      icon: <Trash2 size={18} />,
      filter: (t: Task) => !t.urgent && !t.important
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Eisenhower Vault</h3>
              <p className="text-sm text-slate-500">مبدأ 80/20 بيقولك ركز على "الأحجار الكبيرة" يا عمرو</p>
          </div>
          <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform">
              إضافة مهام اليوم
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {categories.map((cat) => (
          <div key={cat.id} className={`p-6 rounded-[2.5rem] border ${cat.color} min-h-[300px] flex flex-col shadow-sm`}>
            <div className="flex items-center gap-2 mb-6">
              <span className="p-2 bg-white rounded-xl shadow-sm">{cat.icon}</span>
              <h4 className="font-black text-lg">{cat.title}</h4>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
              {tasks.filter(cat.filter).map((task) => (
                <div key={task.id} className="bg-white/80 p-4 rounded-2xl border border-white/50 flex justify-between items-center group">
                  <span className={`text-sm font-bold ${task.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                    {task.title}
                  </span>
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <CheckCircle2 size={18} className={task.completed ? 'text-emerald-500' : 'text-slate-300'} />
                  </button>
                </div>
              ))}
              {tasks.filter(cat.filter).length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-10">
                   <p className="text-sm font-bold">فاضي.. عاش يا بطل!</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityMatrix;
