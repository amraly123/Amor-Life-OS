
import React, { useState, useEffect } from 'react';
import { getBackendConfig, saveBackendConfig, BackendConfig } from '../syncService';
import { Server, Shield, Globe, Save, Info, User } from 'lucide-react';

const Settings: React.FC = () => {
  const [config, setConfig] = useState<BackendConfig>(getBackendConfig());
  const [savedNote, setSavedNote] = useState(false);

  const handleSave = () => {
    saveBackendConfig(config);
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <Server size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">إعدادات الباك إيند (احترافي)</h2>
            <p className="text-sm text-slate-500">اربط الـ OS بتاعك بسيرفرك الخاص عشان بياناتك تبقى معاك في كل مكان.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mr-1">
              <Globe size={16} className="text-slate-400" />
              رابط الـ API (سيرفر الأكاديمية)
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              placeholder="https://quranmindmap.com/api/amor/sync"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mr-1">
              <User size={16} className="text-slate-400" />
              رقم المستخدم (User ID)
            </label>
            <input
              type="text"
              value={config.userId}
              onChange={(e) => setConfig({ ...config, userId: e.target.value })}
              placeholder="مثلاً: amr_admin"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mr-1">
              <Shield size={16} className="text-slate-400" />
              مفتاح الأمان (Secret Token)
            </label>
            <input
              type="password"
              value={config.token}
              onChange={(e) => setConfig({ ...config, token: e.target.value })}
              placeholder="اكتب كلمة سر للربط"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <Info className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              تأكد من إدخال البيانات الصحيحة للربط مع قاعدة بيانات الأكاديمية.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.enabled ? 'bg-sky-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.enabled ? '-translate-x-6' : '-translate-x-1'}`} />
            </button>
            <span className="text-sm font-bold text-slate-700">تفعيل المزامنة التلقائية</span>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-2 hover:bg-sky-600 transition-all shadow-lg"
          >
            <Save size={18} />
            {savedNote ? 'تم حفظ الإعدادات بنجاح!' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
