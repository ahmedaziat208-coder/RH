import React from 'react';
import {
  Banknote,
  ChefHat,
  ChevronLeft,
  Clock,
  Coffee,
  HandCoins,
  PiggyBank,
  Receipt,
  UtensilsCrossed,
} from 'lucide-react';
import {
  AdvanceRecord,
  Employee,
  PayrollRun,
  RestaurantSettings,
} from '../types';
import { formatCurrency } from '../utils/formatters';
import { ActiveTab } from './Navigation';
import { getTranslation } from '../i18n/translations';

interface DashboardViewProps {
  settings: RestaurantSettings;
  employees: Employee[];
  currentRun?: PayrollRun;
  advances: AdvanceRecord[];
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  employees,
  currentRun,
  advances,
  onNavigateTab
}) => {
  const t = getTranslation(settings.language);
  const staffByStation = {
    kitchen: employees.filter(employee => employee.station === 'KITCHEN').length,
    hall: employees.filter(employee => employee.station === 'HALL').length,
    bar: employees.filter(employee => employee.station === 'BAR').length,
    cashierAndCleaning: employees.filter(
      employee => employee.station === 'CASHIER' || employee.station === 'CLEANING'
    ).length,
  };
  const pendingAdvances = advances.filter(advance => advance.status === 'PENDING');
  const totalPendingAdvances = pendingAdvances.reduce((sum, advance) => sum + advance.amount, 0);
  const recentAdvances = [...advances]
    .sort((a, b) => b.requestDate.localeCompare(a.requestDate))
    .slice(0, 3);

  const metrics = [
    {
      label: t.netPayroll,
      value: formatCurrency(currentRun?.totalNet ?? 0, settings.currencySymbol),
      icon: Banknote,
      color: 'amber',
    },
    {
      label: t.overtimeHoursAmt,
      value: formatCurrency(currentRun?.totalOvertimeAmount ?? 0, settings.currencySymbol),
      icon: Clock,
      color: 'cyan',
    },
    {
      label: t.tipsPoolAmt,
      value: formatCurrency(currentRun?.totalTipsDistributed ?? 0, settings.currencySymbol),
      icon: PiggyBank,
      color: 'emerald',
    },
    {
      label: t.pendingRequests,
      value: String(pendingAdvances.length),
      icon: HandCoins,
      color: 'blue',
    },
  ];

  const departments = [
    {
      title: t.stationKitchen,
      subtitle: t.kitchenDesc,
      count: staffByStation.kitchen,
      icon: ChefHat,
      color: 'amber',
    },
    {
      title: t.stationHall,
      subtitle: t.hallDesc,
      count: staffByStation.hall,
      icon: UtensilsCrossed,
      color: 'emerald',
    },
    {
      title: t.stationBar,
      subtitle: t.barDesc,
      count: staffByStation.bar,
      icon: Coffee,
      color: 'cyan',
    },
    {
      title: `${t.stationCashier} / ${t.stationCleaning}`,
      subtitle: t.cashierCleaningDesc,
      count: staffByStation.cashierAndCleaning,
      icon: Receipt,
      color: 'purple',
    },
  ];

  const colorClasses: Record<string, { icon: string; border: string; count: string }> = {
    amber: {
      icon: 'bg-amber-500/10 text-amber-400',
      border: 'hover:border-amber-500/30',
      count: 'text-amber-400',
    },
    emerald: {
      icon: 'bg-emerald-500/10 text-emerald-400',
      border: 'hover:border-emerald-500/30',
      count: 'text-emerald-400',
    },
    cyan: {
      icon: 'bg-cyan-500/10 text-cyan-400',
      border: 'hover:border-cyan-500/30',
      count: 'text-cyan-400',
    },
    purple: {
      icon: 'bg-purple-500/10 text-purple-400',
      border: 'hover:border-purple-500/30',
      count: 'text-purple-400',
    },
    blue: {
      icon: 'bg-blue-500/10 text-blue-400',
      border: '',
      count: 'text-blue-400',
    },
  };

  return (
    <div className="space-y-6">
      <section
        aria-label={t.stationsOverviewTitle}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map(metric => {
          const Icon = metric.icon;
          const colors = colorClasses[metric.color];
          return (
            <article
              key={metric.label}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-850 p-4"
            >
              <div>
                <span className="block text-xs font-medium text-slate-400">{metric.label}</span>
                <span className="mt-1 block font-mono text-lg font-black text-white">{metric.value}</span>
              </div>
              <span className={`rounded-xl p-2.5 ${colors.icon}`}>
                <Icon className="h-5 w-5" />
              </span>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-white">
                <ChefHat className="h-5 w-5 text-amber-400" />
                {t.stationsOverviewTitle}
              </h2>
              <p className="text-xs text-slate-400">{t.stationsOverviewDesc}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('employees')}
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              {t.viewAll}
              <ChevronLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {departments.map(department => {
              const Icon = department.icon;
              const colors = colorClasses[department.color];
              return (
                <article
                  key={department.title}
                  className={`rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors ${colors.border}`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-lg p-2 ${colors.icon}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="text-sm font-bold text-white">{department.title}</h3>
                    </div>
                    <span className={`font-mono text-lg font-black ${colors.count}`}>
                      {department.count}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-xs text-slate-400">{department.subtitle}</p>
                </article>
              );
            })}
          </div>
        </div>

        <section className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-850 p-6">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-base font-bold text-white">
                <HandCoins className="h-5 w-5 text-amber-400" />
                {t.advancesTitle}
              </h2>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-xs text-amber-300">
                {pendingAdvances.length} {t.pendingRequests}
              </span>
            </div>

            <p className="mb-4 text-xs text-slate-400">
              {t.totalPendingAdv}{' '}
              <span className="font-mono font-bold text-amber-300">
                {formatCurrency(totalPendingAdvances, settings.currencySymbol)}
              </span>
            </p>

            <div className="space-y-2.5">
              {recentAdvances.map(advance => (
                <article
                  key={advance.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      advance.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : advance.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-700 text-slate-300'
                    }`}>
                      {advance.status === 'APPROVED'
                        ? t.statusApproved
                        : advance.status === 'PENDING'
                          ? t.statusPending
                          : t.statusDeducted}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono font-bold text-rose-400">
                    {formatCurrency(advance.amount, settings.currencySymbol)}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('advances')}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-200 transition-colors hover:bg-slate-700"
          >
            <span>{t.manageAllAdvances}</span>
            <ChevronLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </section>
      </section>
    </div>
  );
};
