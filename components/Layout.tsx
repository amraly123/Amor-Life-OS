
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { UserState } from '../types';
import { Trophy, Star, ShieldCheck, Database, CloudSync, RefreshCw, CheckCircle, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userStats: UserState;
  onSync: () => Promise<void>;
  onLogout: () => void;
  isSyncing: boolean;
  lastSyncTick: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userStats, onSync, onLogout, isSyncing, lastSyncTick }) => {
  const handleSync = async () => {
    await onSync();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col shadow-xl z-10">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-sky-500">AMOR OS</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Personal Life System</p>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition-all ${activeTab === item.id
                ? 'bg-sky-500/10 text-sky-600 border border-sky-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <span className={activeTab === item.id ? 'text-sky-600' : 'text-slate-500'}>
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
              <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${(userStats.xp % 100)}%` }} />
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
                disabled={isSyncing}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter transition-colors ${isSyncing ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
              >
                {isSyncing ? <RefreshCw size={10} className="animate-spin" /> : lastSyncTick ? <CheckCircle size={10} /> : <CloudSync size={10} />}
                {isSyncing ? 'جاري المزامنة...' : lastSyncTick ? `تم الحفظ ${lastSyncTick}` : 'حفظ على هوستنجر'}
              </button>
              <p className="text-sm text-slate-500">منور يا عمرو..</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-sm font-bold text-slate-700">{userStats.xp}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center border-2 border-white shadow-md overflow-hidden">
              <img src="https://picsum.photos/100/100" alt="Amor" />
            </div>
            <button
              onClick={onLogout}
              className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors shadow-sm border border-red-100"
              title="خروج وقفل النظام"
            >
              <LogOut size={20} />
            </button>
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
