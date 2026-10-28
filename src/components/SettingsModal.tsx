import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  X, 
  Building, 
  Receipt, 
  Languages,
  CheckCircle2,
  Save,
  ShieldCheck
} from 'lucide-react';
import { RestaurantSettings } from '../types';
import { updatePin, setRecoveryEmail } from '../services/auth';
import { getTranslation, AppLanguage } from '../i18n/translations';

interface SettingsModalProps {
  settings: RestaurantSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: RestaurantSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<RestaurantSettings>({
    ...settings,
    language: settings.language || 'ar',
  });
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');

  const t = getTranslation(form.language);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage('');

    if (newPin || confirmPin) {
      if (!/^\d{4,8}$/.test(newPin) || newPin !== confirmPin) {
        setSecurityMessage(form.language === 'ar'
          ? 'أدخل رمزاً من 4 إلى 8 أرقام ثم أكد الرمز بشكل متطابق.'
          : 'Enter a matching numeric code of 4 to 8 digits.');
        return;
      }
      await updatePin(newPin, form.email);
    } else {
      await setRecoveryEmail(form.email);
    }

    onSave(form);
    onClose();
  };

  const handleLanguageSelect = (lang: AppLanguage) => {
    // If switching to French or English, also suggest matching currency symbol format if desired
    setForm(prev => ({
      ...prev,
      language: lang,
      currencySymbol: lang === 'ar' ? 'د.م' : 'MAD',
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" dir={t.dir}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <SettingsIcon className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.settingsTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.settingsSubtitle}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs sm:text-sm max-h-[80vh] overflow-y-auto">
          
          {/* 1. Language Selection Section (قسم لغة النظام) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-800/70 to-slate-900 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <Languages className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">
                {t.languageSectionTitle}
              </h4>
            </div>
            <p className="text-xs text-slate-400 mb-3.5">
              {t.languageSectionDesc}
            </p>

            {/* Language Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Arabic */}
              <button
                type="button"
                onClick={() => handleLanguageSelect('ar')}
                className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                  form.language === 'ar'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10 ring-1 ring-amber-400/50'
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-850'
                }`}
              >
                <div>
                  <span className="block text-sm font-bold">العربية 🇲🇦</span>
                  <span className="text-[11px] text-slate-400">نظام عربي بالكامل (RTL)</span>
                </div>
                {form.language === 'ar' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </button>

              {/* French */}
              <button
                type="button"
                onClick={() => handleLanguageSelect('fr')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  form.language === 'fr'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10 ring-1 ring-amber-400/50'
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-850'
                }`}
              >
                <div>
                  <span className="block text-sm font-bold">Français 🇫🇷</span>
                  <span className="text-[11px] text-slate-400">Système complet en Français</span>
                </div>
                {form.language === 'fr' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </button>

              {/* English */}
              <button
                type="button"
                onClick={() => handleLanguageSelect('en')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  form.language === 'en'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10 ring-1 ring-amber-400/50'
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-850'
                }`}
              >
                <div>
                  <span className="block text-sm font-bold">English 🇬🇧</span>
                  <span className="text-[11px] text-slate-400">Full English System</span>
                </div>
                {form.language === 'en' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </button>

            </div>
          </div>

          {/* 2. Restaurant Profile */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building className="w-4 h-4" />
              {t.restaurantLegalProfile}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.restaurantName}</label>
                <input
                  type="text"
                  required
                  value={form.restaurantName}
                  onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.city}</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.iceNumber}</label>
                <input
                  type="text"
                  required
                  value={form.iceNumber}
                  onChange={(e) => setForm({ ...form, iceNumber: e.target.value })}
                  placeholder="002849201000045"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.commercialRegister}</label>
                <input
                  type="text"
                  value={form.commercialRegister}
                  onChange={(e) => setForm({ ...form, commercialRegister: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.taxId}</label>
                <input
                  type="text"
                  value={form.taxId}
                  onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.patenteNumber}</label>
                <input
                  type="text"
                  value={form.patenteNumber}
                  onChange={(e) => setForm({ ...form, patenteNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.cnssAffiliation}</label>
                <input
                  type="text"
                  value={form.cnssAffiliation}
                  onChange={(e) => setForm({ ...form, cnssAffiliation: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.phone}</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.address}</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.rhManager}</label>
                <input
                  type="text"
                  value={form.rhManager}
                  onChange={(e) => setForm({ ...form, rhManager: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{form.language === 'ar' ? 'البريد الإلكتروني الرسمي' : 'Official email'}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* 3. Access Security */}
          <div className="pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {form.language === 'ar' ? 'أمان الدخول والاستعادة بالبريد' : 'Access and email recovery'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 rounded-xl border border-slate-700 bg-slate-950/40 p-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">{form.language === 'ar' ? 'رمز دخول جديد (4-8 أرقام)' : 'New access code (4-8 digits)'}</label>
                <input type="password" inputMode="numeric" maxLength={8} value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))} placeholder="••••" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-center tracking-widest" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">{form.language === 'ar' ? 'تأكيد رمز الدخول' : 'Confirm access code'}</label>
                <input type="password" inputMode="numeric" maxLength={8} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))} placeholder="••••" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-center tracking-widest" />
              </div>
              <p className="sm:col-span-2 text-xs text-slate-400">
                {form.language === 'ar'
                  ? 'اترك حقلي الرمز فارغين للاحتفاظ بالرمز الحالي. الاستعادة مرتبطة بالبريد الإلكتروني الرسمي أعلاه.'
                  : 'Leave both fields empty to keep the current code. Recovery is linked to the official email above.'}
              </p>
              {securityMessage && <p className="sm:col-span-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{securityMessage}</p>}
            </div>
          </div>

          {/* 4. Moroccan Payroll Rules */}
          <div className="pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Receipt className="w-4 h-4" />
              {t.payrollRulesTitle}
            </h4>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-sm text-slate-200">{t.payrollCalculationFormula}</p>
              <p className="mt-2 text-xs text-amber-300">{t.payrollCalculationWarning}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveChanges}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
