
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
  Layout,
  List as ListIcon,
  GripVertical,
  ArrowRight
} from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  goals: Goal[];
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks, goals }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [view, setView] = useState<'list' | 'kanban'>('kanban');

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
      status: 'todo'
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newCompleted = !t.completed;
        return {
          ...t,
          completed: newCompleted,
          status: newCompleted ? 'done' : (t.status === 'done' ? 'todo' : t.status)
        };
      }
      return t;
    }));
  };

  const updateTaskStatus = (id: string, status: 'todo' | 'in-progress' | 'done') => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status, completed: status === 'done' } : t
    ));
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

  // Native Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, status: 'todo' | 'in-progress' | 'done') => {
    const taskId = e.dataTransfer.getData("taskId");
    updateTaskStatus(taskId, status);
  };

  const KanbanColumn = ({ title, status, colorClass, icon: Icon }: { title: string, status: 'todo' | 'in-progress' | 'done', colorClass: string, icon: any }) => {
    const columnTasks = tasks.filter(t => (t.status || (t.completed ? 'done' : 'todo')) === status);

    return (
      <div
        className="flex-1 min-w-[300px] bg-slate-100/50 rounded-[2rem] p-4 flex flex-col h-[600px] border border-slate-200/50"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
      >
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${colorClass} bg-white shadow-sm ring-1 ring-slate-200/50`}>
              <Icon size={18} />
            </div>
            <h3 className="font-black text-slate-800 tracking-tight">{title}</h3>
          </div>
          <span className="bg-white text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200/50 shadow-sm">
            {columnTasks.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {columnTasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-100 transition-all cursor-grab active:cursor-grabbing group"
            >
              <div className="flex items-start gap-3">
                <GripVertical size={16} className="text-slate-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex-1">
                  <h4 className={`font-bold text-sm leading-tight ${task.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {task.important && <span className="p-1.5 bg-amber-50 text-amber-500 rounded-lg"><Star size={12} fill="currentColor" /></span>}
                    {task.urgent && <span className="p-1.5 bg-red-50 text-red-500 rounded-lg"><AlertCircle size={12} /></span>}
                    {task.goalId && (
                      <span className="text-[9px] font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg border border-sky-100">
                        {goals.find(g => g.id === task.goalId)?.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {columnTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
              <p className="text-[10px] font-bold uppercase tracking-widest">مساحة فاضية</p>
            </div>
          )}
        </div>
      </div>
    );
  };

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

      {/* View Switcher & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button
            onClick={() => setView('kanban')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${view === 'kanban' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Layout size={16} />
            Kanban Board
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <ListIcon size={16} />
            قائمة عادية
          </button>
        </div>

        {view === 'list' && (
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {f === 'all' ? 'الكل' : f === 'active' ? 'قيد التنفيذ' : 'المنجزة'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {view === 'list' ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-50">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
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
                        className={`p-2 rounded-lg transition-all ${task.important ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        title="مهم"
                      >
                        <Star size={16} fill={task.important ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => updatePriority(task.id, 'urgent')}
                        className={`p-2 rounded-lg transition-all ${task.urgent ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
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
                <CheckCircle2 size={32} className="text-slate-200 mx-auto mb-4" />
                <h4 className="font-bold text-slate-800">لا توجد مهام حالياً</h4>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4 custom-scrollbar">
          <KanbanColumn
            title="المهام المطلوبة"
            status="todo"
            colorClass="text-sky-500"
            icon={ArrowRight}
          />
          <KanbanColumn
            title="جاري التنفيذ"
            status="in-progress"
            colorClass="text-amber-500"
            icon={Clock}
          />
          <KanbanColumn
            title="تم التنفيذ"
            status="done"
            colorClass="text-emerald-500"
            icon={CheckCircle2}
          />
        </div>
      )}
    </div>
  );
};

export default TaskManager;
