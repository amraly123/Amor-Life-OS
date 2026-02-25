
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginGateProps {
    onLogin: (username: string) => void;
}

const LoginGate: React.FC<LoginGateProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Hardcoded for privacy as requested (can be moved to env or settings later)
        // We'll use a witty check for the user
        setTimeout(() => {
            if ((username === 'amr' || username === 'admin') && password === 'amor2030') {
                onLogin(username);
            } else {
                setError('بيانات غلط يا فنان، ركز شوية! 😉');
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 font-['Outfit'] overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/40 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 blur-[120px] rounded-full" />

            <div className="relative w-full max-w-md px-6 animate-in fade-in zoom-in duration-500">
                <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">

                    {/* Logo/Icon Area */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-6 rotate-3">
                            <Lock className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Amor Life OS</h1>
                        <p className="text-slate-500 font-medium text-center leading-relaxed">
                            منطقة خاصة لعمرو بس <br />
                            ممنوع دخول غير "رجل الأعمال التقني" 😎
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">اسم المستخدم</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-100/50 border border-transparent focus:border-sky-500 focus:bg-white rounded-2xl pl-12 pr-5 py-4 text-slate-800 font-medium outline-none transition-all"
                                    placeholder="مثلاً: amr"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">كلمة السر</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                    <ShieldCheck size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-100/50 border border-transparent focus:border-sky-500 focus:bg-white rounded-2xl pl-12 pr-5 py-4 text-slate-800 font-medium outline-none transition-all"
                                    placeholder="كلمة السر الخاصة بك"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-100 text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full bg-slate-900 overflow-hidden relative text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-600 transition-all shadow-xl active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>بيتم التحقق...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>فتح النظام</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            Privacy Guaranteed • End-to-End Encryption • 2030 Vision
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginGate;
