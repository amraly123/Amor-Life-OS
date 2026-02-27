
import React, { useState } from 'react';
import { Task, Goal, SubTask } from '../types';
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
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle,
  Edit2,
  Check
} from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  goals: Goal[];
}

// Moving sub-components OUTSIDE to prevent re-creation on every render (Fixes Focus Issue)

const TaskProgress = ({ task }: { task: Task }) => {
  if (!task.subtasks || task.subtasks.length === 0) return null;
  const completed = task.subtasks.filter(s => s.completed).length;
  const percent = Math.round((completed / task.subtasks.length) * 100);

  return (
    <div className="mt-2 space-y-1">
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
        <span>{completed}/{task.subtasks.length} مراحل</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

interface KanbanColumnProps {
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  colorClass: string;
  icon: any;
  tasks: Task[];
  expandedTasks: string[];
  toggleExpand: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: 'todo' | 'in-progress' | 'done') => void;
  toggleSubTask: (taskId: string, subId: string) => void;
  removeSubTask: (taskId: string, subId: string) => void;
  addSubTask: (taskId: string) => void;
  newSubTaskTitles: Record<string, string>;
  setNewSubTaskTitles: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  editingSubTask: { taskId: string, subId: string } | null;
  setEditingSubTask: React.Dispatch<React.SetStateAction<{ taskId: string, subId: string } | null>>;
  updateSubTaskTitle: (taskId: string, subId: string, title: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title, status, colorClass, icon: Icon, tasks, expandedTasks, toggleExpand,
  onDragStart, onDragOver, onDrop, toggleSubTask, removeSubTask, addSubTask,
  newSubTaskTitles, setNewSubTaskTitles, editingSubTask, setEditingSubTask, updateSubTaskTitle
}) => {
  const columnTasks = tasks.filter(t => (t.status || (t.completed ? 'done' : 'todo')) === status);

  return (
    <div
      className="flex-1 min-w-[320px] bg-slate-100/40 rounded-[2.5rem] p-5 flex flex-col h-[650px] border border-slate-200/40"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex justify-between items-center mb-5 px-2">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${colorClass} bg-white shadow-sm ring-1 ring-slate-200/50`}>
            <Icon size={20} />
          </div>
          <h3 className="font-black text-slate-800 text-lg tracking-tight">{title}</h3>
        </div>
        <span className="bg-white text-slate-500 text-[11px] font-black px-3 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
          {columnTasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {columnTasks.map(task => {
          const isExpanded = expandedTasks.includes(task.id);
          return (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-2px] hover:border-sky-200 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={16} className="text-slate-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-black text-sm leading-tight break-words ${task.completed ? 'text-slate-300 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h4>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }}
                      className={`p-1 rounded-md transition-colors ${isExpanded ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-50 text-slate-300'}`}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  <TaskProgress task={task} />

                  {isExpanded && (
                    <div className="mt-5 space-y-3 pt-4 border-t border-slate-50 animate-in fade-in zoom-in duration-200">
                      {task.subtasks && task.subtasks.map(sub => (
                        <div key={sub.id} className="flex items-center gap-3 group/sub">
                          <button onClick={() => toggleSubTask(task.id, sub.id)}>
                            {sub.completed ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-200 hover:text-sky-400" />}
                          </button>

                          {editingSubTask?.subId === sub.id ? (
                            <input
                              autoFocus
                              type="text"
                              value={sub.title}
                              onChange={(e) => updateSubTaskTitle(task.id, sub.id, e.target.value)}
                              onBlur={() => setEditingSubTask(null)}
                              onKeyDown={(e) => e.key === 'Enter' && setEditingSubTask(null)}
                              className="flex-1 bg-slate-50 border-none rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-sky-500"
                            />
                          ) : (
                            <span
                              className={`text-xs font-bold flex-1 cursor-text ${sub.completed ? 'text-slate-300 line-through' : 'text-slate-600'}`}
                              onClick={() => setEditingSubTask({ taskId: task.id, subId: sub.id })}
                            >
                              {sub.title}
                            </span>
                          )}

                          <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                            <button onClick={() => setEditingSubTask({ taskId: task.id, subId: sub.id })}><Edit2 size={12} className="text-slate-300 hover:text-sky-500" /></button>
                            <button onClick={() => removeSubTask(task.id, sub.id)}><Trash2 size={12} className="text-slate-200 hover:text-red-400" /></button>
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-2 mt-3">
                        <input
                          type="text"
                          value={newSubTaskTitles[task.id] || ''}
                          onChange={(e) => setNewSubTaskTitles({ ...newSubTaskTitles, [task.id]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && addSubTask(task.id)}
                          placeholder="مرحلة جديدة.."
                          className="flex-1 bg-slate-50 border-none rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-sky-500"
                        />
                        <button onClick={() => addSubTask(task.id)} className="bg-sky-500 text-white p-2 rounded-xl hover:bg-sky-600"><Plus size={14} /></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              );
          })}
            </div>
      </div>
      );
  };
};

      const TaskManager: React.FC<TaskManagerProps> = ({tasks, setTasks, goals}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
        const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
        const [view, setView] = useState<'kanban' | 'list'>('kanban');
        const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
        const [newSubTaskTitles, setNewSubTaskTitles] = useState<Record<string, string>>({ });
          const [editingSubTask, setEditingSubTask] = useState<{ taskId: string, subId: string } | null>(null);

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
          status: 'todo',
          subtasks: []
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

  const addSubTask = (taskId: string) => {
    const title = newSubTaskTitles[taskId];
          if (!title || !title.trim()) return;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newSub: SubTask = {id: Date.now().toString(), title, completed: false };
          return {...t, subtasks: [...(t.subtasks || []), newSub], completed: false };
      }
          return t;
    }));
    setNewSubTaskTitles(prev => ({...prev, [taskId]: '' }));
  };

  const updateSubTaskTitle = (taskId: string, subId: string, newTitle: string) => {
            setTasks(prev => prev.map(t => {
              if (t.id === taskId) {
                return {
                  ...t,
                  subtasks: t.subtasks.map(s => s.id === subId ? { ...s, title: newTitle } : s)
                };
              }
              return t;
            }));
  };

  const toggleSubTask = (taskId: string, subId: string) => {
            setTasks(prev => prev.map(t => {
              if (t.id === taskId) {
                const updatedSubs = t.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
                return { ...t, subtasks: updatedSubs };
              }
              return t;
            }));
  };

  const removeSubTask = (taskId: string, subId: string) => {
            setTasks(prev => prev.map(t =>
              t.id === taskId ? { ...t, subtasks: t.subtasks.filter(s => s.id !== subId) } : t
            ));
  };

  const updateTaskStatus = (id: string, status: 'todo' | 'in-progress' | 'done') => {
            setTasks(prev => prev.map(t =>
              t.id === id ? { ...t, status, completed: status === 'done' } : t
            ));
  };

  const deleteTask = (id: string) => {
            setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleExpand = (id: string) => {
            setExpandedTasks(prev => prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]);
  };

  const updatePriority = (id: string, field: 'urgent' | 'important') => {
            setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: !t[field] } : t));
  };

  const onDragStart = (e: React.DragEvent, taskId: string) => {
            e.dataTransfer.setData("taskId", taskId);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = (e: React.DragEvent, status: 'todo' | 'in-progress' | 'done') => {
    const taskId = e.dataTransfer.getData("taskId");
          updateTaskStatus(taskId, status);
  };

          return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rotate-45 translate-x-12 -translate-y-12"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">إجمالي المهام</p>
                <h3 className="text-4xl font-black text-slate-900">{tasks.length}</h3>
              </div>
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm relative overflow-hidden">
                <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">المنجزة</p>
                <h3 className="text-4xl font-black text-emerald-700">{tasks.filter(t => t.completed).length}</h3>
              </div>
              <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 shadow-sm relative overflow-hidden">
                <p className="text-xs font-black text-orange-600 uppercase tracking-[0.2em] mb-2">عاجلة</p>
                <h3 className="text-4xl font-black text-orange-700">{tasks.filter(t => t.urgent && !t.completed).length}</h3>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
              <form onSubmit={addTask} className="relative z-10 flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="ما هي المهمة الكبرى القادمة يا عمرو؟"
                  className="flex-1 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-[1.5rem] px-8 py-5 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                />
                <button className="bg-emerald-500 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Plus size={22} />
                  إضافة المهمة
                </button>
              </form>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm ring-1 ring-slate-200/50">
                <button
                  onClick={() => setView('kanban')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all ${view === 'kanban' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  <Layout size={18} />
                  KABAN BOARD
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  <ListIcon size={18} />
                  LIST VIEW
                </button>
              </div>

              <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm ring-1 ring-slate-200/50">
                {(['all', 'active', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-6 py-3 rounded-2xl text-xs font-black transition-all ${filter === f ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    {f === 'all' ? 'الكل' : f === 'active' ? 'نشطة' : 'مكتملة'}
                  </button>
                ))}
              </div>
            </div>

            {view === 'list' ? (
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-50">
                  {tasks.filter(t => {
                    if (filter === 'active') return !t.completed;
                    if (filter === 'completed') return t.completed;
                    return true;
                  }).map((task) => (
                    <div key={task.id} className="p-6 md:p-8 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-start gap-6">
                        <button onClick={() => toggleTask(task.id)} className="mt-1 transition-transform active:scale-90">
                          {task.completed ? <CheckCircle size={28} className="text-emerald-500" /> : <Circle size={28} className="text-slate-200 hover:text-sky-400" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className={`font-black text-xl mb-1 ${task.completed ? 'text-slate-300 line-through' : 'text-slate-800'}`}>{task.title}</h4>
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><Clock size={14} /> {task.duration} دقيقة</span>
                                {task.subtasks && task.subtasks.length > 0 && <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500"><Layers size={14} /> {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} مراحل</span>}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => toggleExpand(task.id)} className={`p-2 rounded-xl ${expandedTasks.includes(task.id) ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-400'}`}><Layers size={18} /></button>
                              <button onClick={() => updatePriority(task.id, 'important')} className={`p-2 rounded-xl ${task.important ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-300'}`}><Star size={18} fill={task.important ? 'currentColor' : 'none'} /></button>
                              <button onClick={() => deleteTask(task.id)} className="p-2 bg-red-50 text-red-300 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                            </div>
                          </div>

                          {expandedTasks.includes(task.id) && (
                            <div className="mt-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
                              <div className="space-y-4">
                                {task.subtasks && task.subtasks.map(sub => (
                                  <div key={sub.id} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 group/sub">
                                    <button onClick={() => toggleSubTask(task.id, sub.id)}>
                                      {sub.completed ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-200 hover:text-sky-400" />}
                                    </button>

                                    {editingSubTask?.subId === sub.id ? (
                                      <input
                                        autoFocus
                                        type="text"
                                        value={sub.title}
                                        onChange={(e) => updateSubTaskTitle(task.id, sub.id, e.target.value)}
                                        onBlur={() => setEditingSubTask(null)}
                                        onKeyDown={(e) => e.key === 'Enter' && setEditingSubTask(null)}
                                        className="flex-1 bg-white border-2 border-sky-500 rounded-xl px-3 py-1 text-sm outline-none"
                                      />
                                    ) : (
                                      <span
                                        className={`text-sm font-bold flex-1 cursor-text ${sub.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}
                                        onClick={() => setEditingSubTask({ taskId: task.id, subId: sub.id })}
                                      >
                                        {sub.title}
                                      </span>
                                    )}

                                    <div className="flex gap-2 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                      <button onClick={() => setEditingSubTask({ taskId: task.id, subId: sub.id })}><Edit2 size={14} className="text-slate-300 hover:text-sky-500" /></button>
                                      <button onClick={() => removeSubTask(task.id, sub.id)}><Trash2 size={14} className="text-slate-200 hover:text-red-400" /></button>
                                    </div>
                                  </div>
                                ))}
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    value={newSubTaskTitles[task.id] || ''}
                                    onChange={(e) => setNewSubTaskTitles({ ...newSubTaskTitles, [task.id]: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && addSubTask(task.id)}
                                    placeholder="أضف مرحلة تنفيذ جديدة.."
                                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
                                  />
                                  <button onClick={() => addSubTask(task.id)} className="bg-slate-900 text-white px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-600 transition-colors shadow-lg shadow-slate-900/10">إضافة</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
                <KanbanColumn
                  title="المطلوب" status="todo" colorClass="text-sky-500" icon={ArrowRight}
                  tasks={tasks} expandedTasks={expandedTasks} toggleExpand={toggleExpand}
                  onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
                  toggleSubTask={toggleSubTask} removeSubTask={removeSubTask} addSubTask={addSubTask}
                  newSubTaskTitles={newSubTaskTitles} setNewSubTaskTitles={setNewSubTaskTitles}
                  editingSubTask={editingSubTask} setEditingSubTask={setEditingSubTask} updateSubTaskTitle={updateSubTaskTitle}
                />
                <KanbanColumn
                  title="قيد التنفيذ" status="in-progress" colorClass="text-amber-500" icon={Clock}
                  tasks={tasks} expandedTasks={expandedTasks} toggleExpand={toggleExpand}
                  onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
                  toggleSubTask={toggleSubTask} removeSubTask={removeSubTask} addSubTask={addSubTask}
                  newSubTaskTitles={newSubTaskTitles} setNewSubTaskTitles={setNewSubTaskTitles}
                  editingSubTask={editingSubTask} setEditingSubTask={setEditingSubTask} updateSubTaskTitle={updateSubTaskTitle}
                />
                <KanbanColumn
                  title="تم الإنجاز" status="done" colorClass="text-emerald-500" icon={CheckCircle2}
                  tasks={tasks} expandedTasks={expandedTasks} toggleExpand={toggleExpand}
                  onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
                  toggleSubTask={toggleSubTask} removeSubTask={removeSubTask} addSubTask={addSubTask}
                  newSubTaskTitles={newSubTaskTitles} setNewSubTaskTitles={setNewSubTaskTitles}
                  editingSubTask={editingSubTask} setEditingSubTask={setEditingSubTask} updateSubTaskTitle={updateSubTaskTitle}
                />
              </div>
            )}
          </div>
          );
};

          export default TaskManager;
