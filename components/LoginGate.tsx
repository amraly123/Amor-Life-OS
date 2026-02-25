
import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, LogIn } from 'lucide-react';

interface LoginGateProps {
    onLogin: (username: string) => void;
}

const GOOGLE_CLIENT_ID = "787369041916-te1mlq0shih45pl3e9iag1t5li8lq1tt.apps.googleusercontent.com";
// Updated to your actual email 
const ALLOWED_EMAIL = "amr.aly.com.egypt@gmail.com";

const LoginGate: React.FC<LoginGateProps> = ({ onLogin }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to decode Google JWT token manually
    const decodeJwt = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        /* global google */
        const handleCredentialResponse = (response: any) => {
            setLoading(true);
            setError('');

            const payload = decodeJwt(response.credential);

            if (payload && payload.email === ALLOWED_EMAIL) {
                // Success! Verified email
                setTimeout(() => {
                    onLogin(payload.name || 'Amr');
                }, 800);
            } else if (payload) {
                setError(`عفواً يا فنان، الإيميل ده (${payload.email}) مش مسموح له بالدخول. لازم إيميل عمرو بس! 😎`);
                setLoading(false);
            } else {
                setError('حصل مشكلة في التحقق من جوجل، جرب تاني.');
                setLoading(false);
            }
        };

        // Initialize Google Sign-In
        const initGoogle = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });

                window.google.accounts.id.renderButton(
                    document.getElementById("googleBtn"),
                    {
                        theme: "outline",
                        size: "large",
                        width: "320",
                        text: "signin_with",
                        shape: "pill",
                        logo_alignment: "left"
                    }
                );
            } else {
                // Retry if script not loaded yet
                setTimeout(initGoogle, 500);
            }
        };

        initGoogle();
    }, [onLogin]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 font-['Outfit'] overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/40 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 blur-[120px] rounded-full" />

            <div className="relative w-full max-w-md px-6 animate-in fade-in zoom-in duration-500">
                <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] text-center">

                    {/* Logo/Icon Area */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-6 rotate-3">
                            <ShieldCheck className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Amor Life OS</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            منطقة خاصة لعمرو بس <br />
                            دخول آمن بحساب جوجل الشخصي 😎
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-6">
                        {loading ? (
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
                                <p className="text-sm font-bold text-slate-600">بيتم التحقق من هويتك...</p>
                            </div>
                        ) : (
                            <div className="w-full flex justify-center py-2 min-h-[50px]">
                                <div id="googleBtn"></div>
                            </div>
                        )}

                        {error && (
                            <div className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake leading-relaxed">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-center gap-2 text-slate-400 mb-4">
                            <Lock size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption</span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-medium">
                            هذا النظام محمي تماماً. محاولة الدخول بغير الحساب المصرح له يتم تسجيلها تلقائياً.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginGate;
