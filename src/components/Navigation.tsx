import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Banknote, 
  CalendarCheck, 
  HandCoins, 
  PiggyBank, 
  Database,
  CalendarDays,
} from 'lucide-react';
import { getTranslation, AppLanguage } from '../i18n/translations';

export type ActiveTab = 
  | 'dashboard'
  | 'employees'
  | 'payroll'
  | 'attendance'
  | 'advances'
  | 'tips'
  | 'holidays'
  | 'databest';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingAdvancesCount: number;
  expiringHealthCardsCount: number;
  language?: AppLanguage;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingAdvancesCount,
  expiringHealthCardsCount,
  language = 'ar',
}) => {
  const t = getTranslation(language);

  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: t.navDashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'employees' as ActiveTab,
      label: t.navEmployees,
      icon: Users,
      badge: expiringHealthCardsCount > 0 ? expiringHealthCardsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      badgeTitle: t.healthCardsExpiringSoon,
    },
    {
      id: 'payroll' as ActiveTab,
      label: t.navPayroll,
      icon: Banknote,
    },
    {
      id: 'attendance' as ActiveTab,
      label: t.navAttendance,
      icon: CalendarCheck,
    },
    {
      id: 'advances' as ActiveTab,
      label: t.navAdvances,
      icon: HandCoins,
      badge: pendingAdvancesCount > 0 ? pendingAdvancesCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
      badgeTitle: t.pendingAdvancesBadge,
    },
    {
      id: 'tips' as ActiveTab,
      label: t.navTips,
      icon: PiggyBank,
    },
    {
      id: 'holidays' as ActiveTab,
      label: t.navHolidays,
      icon: CalendarDays,
    },
    {
      id: 'databest' as ActiveTab,
      label: t.navDatabest,
      icon: Database,
    },
  ];

  return (
    <nav className="bg-slate-900/60 border-b border-slate-800/80 sticky top-20 z-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 rtl:space-x-reverse overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap relative cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>

                {tab.badge !== undefined && (
                  <span
                    title={tab.badgeTitle}
                    className={`ltr:ml-1 rtl:mr-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
