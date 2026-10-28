import React, { useEffect, useState } from 'react';
import { KeyRound, Mail, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { getAuthConfig, updatePin, verifyPin } from '../services/auth';

interface LoginGateProps {
  restaurantName: string;
  recoveryEmail: string;
  language?: 'ar' | 'fr' | 'en';
}

const RECOVERY_KEY = 'RH_PIN_RECOVERY_V1';

export const LoginGate: React.FC<LoginGateProps & { onUnlocked: () => void }> = ({
  restaurantName,
  recoveryEmail,
  language = 'ar',
  onUnlocked,
}) => {
  const isArabic = language === 'ar';
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryPin, setRecoveryPin] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  useEffect(() => {
    void getAuthConfig(recoveryEmail);
  }, [recoveryEmail]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    if (await verifyPin(pin, recoveryEmail)) {
      sessionStorage.setItem('RH_UNLOCKED', '1');
      onUnlocked();
    } else {
      setError(isArabic ? 'رمز الدخول غير صحيح.' : 'Incorrect access code.');
      setPin('');
    }
    setBusy(false);
  };

  const requestRecovery = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    localStorage.setItem(RECOVERY_KEY, JSON.stringify({ code, expiresAt, email: recoveryEmail.trim().toLowerCase() }));
    setRecoverySent(true);
    const subject = encodeURIComponent(isArabic ? 'استعادة رمز دخول نظام RH' : 'RH access code recovery');
    const body = encodeURIComponent(isArabic
      ? `رمز الاستعادة الخاص بك هو: ${code}\nصلاحية الرمز: 15 دقيقة.`
      : `Your recovery code is: ${code}\nIt expires in 15 minutes.`);
    window.location.href = `mailto:${encodeURIComponent(recoveryEmail)}?subject=${subject}&body=${body}`;
  };

  const resetPin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const saved = JSON.parse(localStorage.getItem(RECOVERY_KEY) || '{}') as { code?: string; expiresAt?: number; email?: string };
      if (!saved.code || !saved.expiresAt || Date.now() > saved.expiresAt || saved.email !== recoveryEmail.trim().toLowerCase()) {
        setError(isArabic ? 'انتهت صلاحية رمز الاستعادة. اطلب رمزاً جديداً.' : 'Recovery code expired. Request a new code.');
        return;
      }
      if (recoveryCode.trim() !== saved.code) {
        setError(isArabic ? 'رمز الاستعادة غير صحيح.' : 'Incorrect recovery code.');
        return;
      }
      if (!/^\d{4,8}$/.test(recoveryPin)) {
        setError(isArabic ? 'يجب أن يتكون رمز الدخول من 4 إلى 8 أرقام.' : 'Access code must contain 4 to 8 digits.');
        return;
      }
      await updatePin(recoveryPin, recoveryEmail);
      localStorage.removeItem(RECOVERY_KEY);
      setShowRecovery(false);
      setRecoveryCode('');
      setRecoveryPin('');
      setPin(recoveryPin);
      setError(isArabic ? 'تم تغيير رمز الدخول بنجاح. سجل الدخول الآن.' : 'Code changed successfully. Please sign in.');
    } catch {
      setError(isArabic ? 'تعذر استعادة رمز الدخول.' : 'Could not recover the access code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-amber-500/20 to-slate-900 px-7 py-8 text-center border-b border-slate-800">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white">{restaurantName}</h1>
          <p className="mt-2 text-sm text-slate-400">{isArabic ? 'ادخل رمز الدخول للدخول إلى النظام' : 'Enter your access code'}</p>
        </div>

        <form onSubmit={login} className="p-7 space-y-4">
          <label className="block text-sm font-semibold text-slate-300">{isArabic ? 'رمز الدخول' : 'Access code'}</label>
          <div className="relative">
            <KeyRound className="absolute top-3.5 right-3.5 w-5 h-5 text-slate-500" />
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-12 py-3 text-center text-xl tracking-[0.45em] text-white outline-none focus:border-amber-400"
              autoFocus
            />
          </div>
          {error && <p className={`rounded-xl px-3 py-2 text-sm ${error.includes('نجاح') || error.includes('successfully') ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>{error}</p>}
          <button disabled={busy || !pin} className="w-full rounded-xl bg-amber-400 py-3 font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50 flex items-center justify-center gap-2">
            {isArabic ? 'دخول' : 'Sign in'} <ArrowRight className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => { setShowRecovery(true); setError(''); }} className="w-full py-2 text-sm text-amber-300 hover:text-amber-200 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" /> {isArabic ? 'نسيت رمز الدخول؟ استرداده بالبريد' : 'Forgot code? Recover by email'}
          </button>
        </form>
      </div>

      {showRecovery && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white">{isArabic ? 'استعادة رمز الدخول' : 'Recover access code'}</h2>
              <button onClick={() => setShowRecovery(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <p className="mb-4 text-sm text-slate-400">{isArabic ? 'سيتم إرسال رمز مؤقت إلى' : 'A temporary code will be sent to'} <b className="text-slate-200" dir="ltr">{recoveryEmail}</b></p>
            {!recoverySent ? (
              <button type="button" onClick={requestRecovery} className="w-full rounded-xl bg-amber-400 py-3 font-bold text-slate-950">{isArabic ? 'إرسال رمز الاستعادة' : 'Send recovery code'}</button>
            ) : (
              <form onSubmit={resetPin} className="space-y-3">
                <input required inputMode="numeric" maxLength={6} placeholder="رمز الاستعادة" value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ''))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white text-center tracking-widest" />
                <input required inputMode="numeric" maxLength={8} placeholder={isArabic ? 'رمز الدخول الجديد' : 'New access code'} value={recoveryPin} onChange={(e) => setRecoveryPin(e.target.value.replace(/\D/g, ''))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white text-center tracking-widest" />
                <button className="w-full rounded-xl bg-amber-400 py-3 font-bold text-slate-950">{isArabic ? 'حفظ الرمز الجديد' : 'Save new code'}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
