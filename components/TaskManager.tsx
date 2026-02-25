
import React, { useState } from 'react';
import { Task, Goal } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Star, 
  Clock, 
  Filter,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  goals: Goal[];
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks, goals }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'date'>('priority');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      urgent: false,
      important: false,
      completed: false,
      duration: 30,
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updatePriority = (id: string, field: 'urgent' | 'important') => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: !t[field] } : t));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const scoreA = (a.important ? 2 : 0) + (a.urgent ? 1 : 0);
      const scoreB = (b.important ? 2 : 0) + (b.urgent ? 1 : 0);
      return scoreB - scoreA;
    }
    return parseInt(b.id) - parseInt(a.id);
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">إجمالي المهام</p>
          <h3 className="text-3xl font-black text-slate-800">{tasks.length}</h3>
        </div>
        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">المهام المنجزة</p>
          <h3 className="text-3xl font-black text-emerald-700">{tasks.filter(t => t.completed).length}</h3>
        </div>
        <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 shadow-sm">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">مهام عاجلة</p>
          <h3 className="text-3xl font-black text-orange-700">{tasks.filter(t => t.urgent && !t.completed).length}</h3>
        </div>
      </div>

      {/* Add Task Form */}
      <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl">
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="ما هي المهمة القادمة يا عمرو؟" 
            className="flex-1 bg-slate-800 border-none rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tight shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            <Plus size={20} />
            إضافة المهمة
          </button>
        </form>
      </div>

      {/* Filters & List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-slate-50 p-1 rounded-xl">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {f === 'all' ? 'الكل' : f === 'active' ? 'قيد التنفيذ' : 'المنجزة'}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Filter size={14} />
              ترتيب حسب:
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-800 outline-none cursor-pointer"
              >
                <option value="priority">الأولوية</option>
                <option value="date">التاريخ</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <div key={task.id} className="p-4 md:p-6 hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0 transition-transform active:scale-90"
                  >
                    {task.completed ? (
                      <CheckCircle2 size={24} className="text-emerald-500" />
                    ) : (
                      <Circle size={24} className="text-slate-200 hover:text-emerald-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-base md:text-lg truncate ${task.completed ? 'text-slate-300 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      {task.goalId && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                          <Star size={10} />
                          {goals.find(g => g.id === task.goalId)?.title}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Clock size={10} />
                        {task.duration} دقيقة
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updatePriority(task.id, 'important')}
                      className={`p-2 rounded-lg transition-all ${
                        task.important ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                      title="مهم"
                    >
                      <Star size={16} fill={task.important ? 'currentColor' : 'none'} />
                    </button>
                    <button 
                      onClick={() => updatePriority(task.id, 'urgent')}
                      className={`p-2 rounded-lg transition-all ${
                        task.urgent ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                      title="عاجل"
                    >
                      <AlertCircle size={16} />
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-slate-200" />
              </div>
              <h4 className="font-bold text-slate-800">لا توجد مهام حالياً</h4>
              <p className="text-sm text-slate-400 mt-1">ابدأ بإضافة مهام جديدة لليوم!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
