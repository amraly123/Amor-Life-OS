
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { UserState } from '../types';
import { Trophy, Star, ShieldCheck, Database, CloudSync, RefreshCw, CheckCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userStats: UserState;
  onSync: () => Promise<void>;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userStats, onSync }) => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    await onSync();
    setSyncing(false);
    setLastSync(new Date().toLocaleTimeString('ar-EG'));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col shadow-xl z-10">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-emerald-400">AMOR OS</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Personal Life System</p>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={activeTab === item.id ? 'text-emerald-400' : 'text-slate-500'}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-yellow-500" />
                <span className="text-xs font-bold">مستوى {userStats.level}</span>
              </div>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(userStats.xp % 100)}%` }} />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{NAV_ITEMS.find(i => i.id === activeTab)?.label}</h2>
            <div className="flex items-center gap-2 mt-1">
               <button 
                 onClick={handleSync}
                 disabled={syncing}
                 className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter transition-colors ${
                   syncing ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                 }`}
               >
                  {syncing ? <RefreshCw size={10} className="animate-spin" /> : lastSync ? <CheckCircle size={10} /> : <CloudSync size={10} />}
                  {syncing ? 'جاري المزامنة...' : lastSync ? `تم الحفظ ${lastSync}` : 'حفظ على هوستنجر'}
               </button>
               <p className="text-sm text-slate-500">منور يا عمرو..</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
               <Star size={16} className="text-yellow-400 fill-current" />
               <span className="text-sm font-bold text-slate-700">{userStats.xp}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-white shadow-md overflow-hidden">
                <img src="https://picsum.photos/100/100" alt="Amor" />
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
