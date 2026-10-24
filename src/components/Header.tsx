import React from 'react';
import { 
  Utensils, 
  Database, 
  PlusCircle, 
  Calculator, 
  Clock, 
  Settings as SettingsIcon,
  Languages
} from 'lucide-react';
import { RestaurantSettings } from '../types';
import { getTranslation, AppLanguage } from '../i18n/translations';

interface HeaderProps {
  settings: RestaurantSettings;
  activeEmployeesCount: number;
  totalRecordsCount: number;
  onOpenNewEmployee: () => void;
  onOpenQuickAttendance: () => void;
  onGeneratePayroll: () => void;
  onOpenSettings: () => void;
  onCurrencyChange: (currency: string, symbol: string) => void;
  onLanguageChange?: (lang: AppLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  totalRecordsCount,
  onOpenNewEmployee,
  onOpenQuickAttendance,
  onGeneratePayroll,
  onOpenSettings,
  onCurrencyChange,
  onLanguageChange,
}) => {
  const t = getTranslation(settings.language);

  const currencies = [
    { code: 'MAD', symbol: settings.language === 'ar' ? 'د.م' : 'MAD', label: settings.language === 'ar' ? 'درهم مغربي (MAD)' : 'Dirham Marocain (MAD)' },
    { code: 'SAR', symbol: 'ر.س', label: 'ريال سعودي (SAR)' },
    { code: 'AED', symbol: 'د.إ', label: 'درهم إماراتي (AED)' },
    { code: 'EUR', symbol: '€', label: 'Euro (€)' },
    { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30">
              <Utensils className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-wide text-white font-sans">
                  {t.appName}
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {t.moroccoRhTag}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {settings.restaurantName} • {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* DATABEST Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">DATABEST:</span>
            <span className="text-emerald-400 font-mono">{t.databestConnected} ({totalRecordsCount} {t.records})</span>
          </div>

          {/* Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Quick Switcher */}
            {onLanguageChange && (
              <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-slate-300 hover:border-amber-500/50">
                <Languages className="w-3.5 h-3.5 text-amber-400 mr-1 ml-1" />
                <select
                  aria-label={t.selectLanguage}
                  value={settings.language || 'ar'}
                  onChange={(e) => onLanguageChange(e.target.value as AppLanguage)}
                  className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                >
                  <option value="ar" className="bg-slate-900 text-slate-200">العربية 🇲🇦</option>
                  <option value="fr" className="bg-slate-900 text-slate-200">Français 🇫🇷</option>
                  <option value="en" className="bg-slate-900 text-slate-200">English 🇬🇧</option>
                </select>
              </div>
            )}

            {/* Currency Selector */}
            <div className="relative">
              <select
                aria-label={t.currencySelect}
                value={settings.currency}
                onChange={(e) => {
                  const sel = currencies.find(c => c.code === e.target.value);
                  if (sel) onCurrencyChange(sel.code, sel.symbol);
                }}
                className="bg-slate-800 text-xs font-semibold text-amber-300 border border-slate-700 rounded-xl px-2.5 py-2 hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                    {c.symbol} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Attendance */}
            <button
              onClick={onOpenQuickAttendance}
              title={t.quickAttendance}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 transition-colors shadow-sm cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">{t.quickAttendance}</span>
            </button>

            {/* Calculate Payroll Shortcut */}
            <button
              onClick={onGeneratePayroll}
              title={t.calculatePayroll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 transition-colors shadow-sm cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">{t.calculatePayroll}</span>
            </button>

            {/* Add Employee Button */}
            <button
              onClick={onOpenNewEmployee}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addEmployee}</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              title={t.settings}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
