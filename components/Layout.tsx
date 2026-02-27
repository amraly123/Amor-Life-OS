
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { UserState } from '../types';
import { Trophy, Star, ShieldCheck, Database, CloudSync, RefreshCw, CheckCircle, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userStats: UserState;
  setUserStats: React.Dispatch<React.SetStateAction<UserState>>;
  onSync: () => Promise<void>;
  onLogout: () => void;
  isSyncing: boolean;
  lastSyncTick: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userStats, setUserStats, onSync, onLogout, isSyncing, lastSyncTick }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempName, setTempName] = useState(userStats.name || 'عمرو');
  const [tempAvatar, setTempAvatar] = useState(userStats.avatar || 'https://picsum.photos/100/100');

  const handleSync = async () => {
    await onSync();
  };

  const handleUpdateProfile = () => {
    setUserStats(prev => ({
      ...prev,
      name: tempName,
      avatar: tempAvatar
    }));
    setShowProfileModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Same as before */}
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
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter transition-colors ${isSyncing ? 'bg-blue-100 text-blue-700' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                  }`}
              >
                {isSyncing ? <RefreshCw size={10} className="animate-spin" /> : lastSyncTick ? <CheckCircle size={10} /> : <CloudSync size={10} />}
                {isSyncing ? 'جاري المزامنة...' : lastSyncTick ? `تم الحفظ ${lastSyncTick}` : 'حفظ على هوستنجر'}
              </button>
              <p className="text-sm text-slate-500">منور يا {userStats.name || 'عمرو'}..</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-sm font-bold text-slate-700">{userStats.xp}</span>
            </div>
            <div
              onClick={() => setShowProfileModal(true)}
              className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center border-2 border-white shadow-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-sky-500 transition-all"
            >
              <img src={userStats.avatar || "https://picsum.photos/100/100"} alt="Amor" className="w-full h-full object-cover" />
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

        {/* Profile Update Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
              <h3 className="text-2xl font-black text-slate-800 mb-6">تخصيص الهوية</h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-1">الاسم الكريم</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    placeholder="اسمك هنا.."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-1">هوية البروفايل</label>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                      <img src={tempAvatar} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={tempAvatar}
                        onChange={(e) => setTempAvatar(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                        placeholder="رابط الصورة من النت.."
                      />
                      <div className="relative">
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setTempAvatar(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="flex items-center justify-center gap-2 w-full py-2 bg-sky-50 text-sky-700 rounded-xl text-[10px] font-black cursor-pointer hover:bg-sky-100 transition-all border border-sky-100"
                        >
                          اختر من جهازك
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    className="flex-1 bg-sky-500 text-white py-4 rounded-2xl font-black text-sm uppercase shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all"
                  >
                    حفظ التعديلات
                  </button>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-sm uppercase hover:bg-slate-200 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
