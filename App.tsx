
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import GoalTracker from './components/GoalTracker';
import PriorityMatrix from './components/PriorityMatrix';
import TaskManager from './components/TaskManager';
import AIAssistant from './components/AIAssistant';
import SmartPlanner from './components/SmartPlanner';
import Settings from './components/Settings';
import LoginGate from './components/LoginGate';
import { syncDataToHostinger, fetchDataFromHostinger, getBackendConfig } from './syncService';
import { INITIAL_GOALS, INITIAL_TASKS } from './constants';
import { UserState, Goal, Task } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('amor_authenticated') === 'true';
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);


  const [userStats, setUserStats] = useState<UserState>(() => {
    const saved = localStorage.getItem('amor_user_stats');
    return saved ? JSON.parse(saved) : {
      xp: 1250, level: 12, mission: 'تمكين الأجيال القادمة من خلال تعليم إبداعي هادف يربط التكنولوجيا بالقيم.', vision: 'أن أكون رائد التعليم الإبداعي في العالم العربي بحلول ٢٠٣٠.', lastReviewDate: '٢٢ مايو ٢٠٢٤',
      weeklyVictory: {
        title: 'إطلاق النسخة التجريبية من Creative Kids',
        description: 'إنهاء برمجة أول ٥ دروس تفاعلية واختبارها.',
        reward: 'فرحة الإنجاز وفخر الأسبوع',
        progress: 35
      }
    };
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('amor_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('amor_tasks');
    const rawTasks = saved ? JSON.parse(saved) : INITIAL_TASKS;
    // حماية: التأكد إن كل مهمة قديمة عندها مصفوفة مهام فرعية عشان الكود ما يضربش
    return rawTasks.map((t: any) => ({
      ...t,
      subtasks: t.subtasks || []
    }));
  });

  useEffect(() => {
    const loadFromCloud = async () => {
      const config = getBackendConfig();
      if (config.enabled && config.baseUrl) {
        const cloudData = await fetchDataFromHostinger();
        if (cloudData && cloudData.userStats) {
          setUserStats(cloudData.userStats);
          setGoals(cloudData.goals);
          // حماية البيانات بعد التحميل من الكلاود
          if (cloudData.tasks) {
            setTasks(cloudData.tasks.map((t: any) => ({
              ...t,
              subtasks: t.subtasks || []
            })));
          }
        }
      }
      setIsInitialLoad(false);
    };
    loadFromCloud();
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('amor_user_stats', JSON.stringify(userStats));
      localStorage.setItem('amor_goals', JSON.stringify(goals));
      localStorage.setItem('amor_tasks', JSON.stringify(tasks));
    }
  }, [userStats, goals, tasks, isInitialLoad]);

  // ===== AUTO-SYNC: يحفظ على الكلاود تلقائياً بعد أي تغيير (بعد ٢ ثانية) =====
  useEffect(() => {
    if (isInitialLoad) return;

    const timer = setTimeout(() => {
      setIsSyncing(true);
      syncDataToHostinger({ goals, tasks, userStats }).then(result => {
        setIsSyncing(false);
        if (result.status === 'success') {
          setLastSyncTime(new Date().toLocaleTimeString('ar-EG'));
          console.log('✅ Auto-sync done!');
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [userStats, goals, tasks, isInitialLoad]);
  // ============================================================================

  const handleManualSync = async () => {
    const result = await syncDataToHostinger({ goals, tasks, userStats });
    if (result.status === 'error') {
      alert(`عفواً يا عمرو: ${result.message}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard userStats={userStats} />;
      case 'goals': return <GoalTracker goals={goals} setGoals={setGoals} />;
      case 'tasks': return <TaskManager tasks={tasks} setTasks={setTasks} goals={goals} />;
      case 'matrix': return <PriorityMatrix tasks={tasks} setTasks={setTasks} />;
      case 'ai': return <AIAssistant goals={goals} tasks={tasks} userStats={userStats} />;
      case 'planner': return <SmartPlanner tasks={tasks} setTasks={setTasks} goals={goals} userStats={userStats} setUserStats={setUserStats} />;
      case 'settings': return <Settings />;
      default: return <Dashboard userStats={userStats} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginGate onLogin={() => {
      setIsAuthenticated(true);
      sessionStorage.setItem('amor_authenticated', 'true');
    }} />;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('amor_authenticated');
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userStats={userStats}
      setUserStats={setUserStats}
      onSync={handleManualSync}
      onLogout={handleLogout}
      isSyncing={isSyncing}
      lastSyncTick={lastSyncTime}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
