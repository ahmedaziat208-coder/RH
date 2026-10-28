import React, { useState, useEffect } from 'react';
import { databest, DatabaseState } from './services/database';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { PayrollView } from './components/PayrollView';
import { AttendanceView } from './components/AttendanceView';
import { AdvancesAndBonusesView } from './components/AdvancesAndBonusesView';
import { TipsPoolView } from './components/TipsPoolView';
import { DatabaseManagerView } from './components/DatabaseManagerView';
import { OfficialHolidaysView } from './components/OfficialHolidaysView';
import { PayslipModal } from './components/PayslipModal';
import { SettingsModal } from './components/SettingsModal';
import { PayrollSlip } from './types';
import { checkHealthCardStatus, getCurrentMonth } from './utils/formatters';
import { getTranslation } from './i18n/translations';
import { LoginGate } from './components/LoginGate';

export default function App() {
  const [dbState, setDbState] = useState<DatabaseState>(databest.getState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Modals state
  const [selectedSlipForPrint, setSelectedSlipForPrint] = useState<PayrollSlip | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [openAddEmployeeFlag, setOpenAddEmployeeFlag] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem('RH_UNLOCKED') === '1');

  // Sync HTML lang and dir with system language
  useEffect(() => {
    const lang = dbState.settings.language || 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [dbState.settings.language]);

  // Subscribe to reactive database changes
  useEffect(() => {
    const unsubscribe = databest.subscribe(() => {
      setDbState({ ...databest.getState() });
    });
    return () => unsubscribe();
  }, []);

  // Compute counts for navigation badges
  const pendingAdvancesCount = dbState.advances.filter(a => a.status === 'PENDING').length;
  const expiringHealthCardsCount = dbState.employees.filter(emp => {
    const status = checkHealthCardStatus(emp.healthCardExpiry);
    return status.isExpired || status.isExpiringSoon;
  }).length;

  const totalRecordsCount = 
    dbState.employees.length +
    dbState.attendance.length +
    dbState.advances.length +
    dbState.adjustments.length +
    dbState.tipsPools.length +
    dbState.payrollSlips.length +
    dbState.payrollRuns.length;

  const currentMonth = getCurrentMonth();
  const currentRun = dbState.payrollRuns.find(r => r.month === currentMonth) || dbState.payrollRuns[0];

  // Actions
  const handleOpenNewEmployee = () => {
    setActiveTab('employees');
    setOpenAddEmployeeFlag(true);
  };

  const handleOpenQuickAttendance = () => {
    setActiveTab('attendance');
  };

  const handleGeneratePayroll = () => {
    if (dbState.payrollRuns.some(run => run.month === currentMonth && run.status === 'PAID')) {
      window.alert('لا يمكن إعادة احتساب مسير تم صرفه. افتح قسم الرواتب لمراجعة المسير.');
      setActiveTab('payroll');
      return;
    }
    databest.generateOrRecalculatePayroll(currentMonth);
    setActiveTab('payroll');
  };

  const handleCurrencyChange = (currency: string, currencySymbol: string) => {
    databest.updateSettings({
      ...dbState.settings,
      currency,
      currencySymbol,
    });
  };

  const handleLanguageChange = (language: 'ar' | 'fr' | 'en') => {
    databest.updateSettings({
      ...dbState.settings,
      language,
      currencySymbol: language === 'ar' ? 'د.م' : 'MAD',
    });
  };

  const t = getTranslation(dbState.settings.language);

  if (!isUnlocked) {
    return (
      <LoginGate
        restaurantName={dbState.settings.restaurantName}
        recoveryEmail={dbState.settings.email}
        language={dbState.settings.language}
        onUnlocked={() => setIsUnlocked(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans" dir={t.dir}>
      
      {/* Top Application Header */}
      <Header
        settings={dbState.settings}
        activeEmployeesCount={dbState.employees.filter(e => e.status === 'ACTIVE').length}
        totalRecordsCount={totalRecordsCount}
        onOpenNewEmployee={handleOpenNewEmployee}
        onOpenQuickAttendance={handleOpenQuickAttendance}
        onGeneratePayroll={handleGeneratePayroll}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onCurrencyChange={handleCurrencyChange}
        onLanguageChange={handleLanguageChange}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setOpenAddEmployeeFlag(false);
        }}
        pendingAdvancesCount={pendingAdvancesCount}
        expiringHealthCardsCount={expiringHealthCardsCount}
        language={dbState.settings.language}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            settings={dbState.settings}
            employees={dbState.employees}
            currentRun={currentRun}
            advances={dbState.advances}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeesView
            employees={dbState.employees}
            currencySymbol={dbState.settings.currencySymbol}
            onAddEmployee={(emp) => databest.addEmployee(emp)}
            onUpdateEmployee={(id, updates) => databest.updateEmployee(id, updates)}
            onDeleteEmployee={(id) => databest.deleteEmployee(id)}
            initialOpenAddModal={openAddEmployeeFlag}
            language={dbState.settings.language}
          />
        )}

        {activeTab === 'payroll' && (
          <PayrollView
            settings={dbState.settings}
            employees={dbState.employees}
            payrollRuns={dbState.payrollRuns}
            payrollSlips={dbState.payrollSlips}
            onRecalculatePayroll={(month) => databest.generateOrRecalculatePayroll(month)}
            onUpdateRunStatus={(month, status) => databest.updatePayrollRunStatus(month, status)}
            onSelectSlipForPrint={(slip) => setSelectedSlipForPrint(slip)}
            onUpdateSlip={(id, updates) => databest.updatePayrollSlip(id, updates)}
            onDeleteSlip={(id) => databest.deletePayrollSlip(id)}
            onDeletePayrollRun={(month) => databest.deletePayrollRun(month)}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            employees={dbState.employees}
            attendance={dbState.attendance}
            onRecordAttendance={(record) => databest.recordAttendance(record)}
            onDeleteAttendance={(id) => databest.deleteAttendance(id)}
          />
        )}

        {activeTab === 'advances' && (
          <AdvancesAndBonusesView
            settings={dbState.settings}
            employees={dbState.employees}
            advances={dbState.advances}
            adjustments={dbState.adjustments}
            onAddAdvance={(adv) => databest.addAdvance(adv)}
            onUpdateAdvance={(id, updates) => databest.updateAdvance(id, updates)}
            onUpdateAdvanceStatus={(id, status) => databest.updateAdvanceStatus(id, status)}
            onDeleteAdvance={(id) => databest.deleteAdvance(id)}
            onAddAdjustment={(adj) => databest.addAdjustment(adj)}
            onUpdateAdjustment={(id, updates) => databest.updateAdjustment(id, updates)}
            onDeleteAdjustment={(id) => databest.deleteAdjustment(id)}
          />
        )}

        {activeTab === 'tips' && (
          <TipsPoolView
            settings={dbState.settings}
            employees={dbState.employees}
            tipsPools={dbState.tipsPools}
            onAddTipsPool={(pool) => databest.addTipsPool(pool)}
            onDeleteTipsPool={(id) => databest.deleteTipsPool(id)}
          />
        )}

        {activeTab === 'holidays' && (
          <OfficialHolidaysView
            holidays={dbState.officialHolidays}
            employees={dbState.employees}
            holidayWorkRecords={dbState.holidayWorkRecords}
            annualLeaveRecords={dbState.annualLeaveRecords}
            language={dbState.settings.language}
            onAddHoliday={(holiday) => databest.addOfficialHoliday(holiday)}
            onDeleteHoliday={(id) => databest.deleteOfficialHoliday(id)}
            onAddHolidayWorkRecord={(record) => databest.addHolidayWorkRecord(record)}
            onDeleteHolidayWorkRecord={(id) => databest.deleteHolidayWorkRecord(id)}
            onSaveAnnualLeaveRecord={(record) => databest.saveAnnualLeaveRecord(record)}
            onDeleteAnnualLeaveRecord={(id) => databest.deleteAnnualLeaveRecord(id)}
          />
        )}

        {activeTab === 'databest' && (
          <DatabaseManagerView
            dbState={dbState}
            onRefresh={() => setDbState({ ...databest.getState() })}
          />
        )}

      </main>

      {/* Official Printable Payslip Modal */}
      <PayslipModal
        slip={selectedSlipForPrint}
        settings={dbState.settings}
        onClose={() => setSelectedSlipForPrint(null)}
        onStatusChange={(id, status) => {
          databest.updatePayrollSlip(id, { status });
          if (selectedSlipForPrint && selectedSlipForPrint.id === id) {
            setSelectedSlipForPrint({ ...selectedSlipForPrint, status });
          }
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        settings={dbState.settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(updated) => databest.updateSettings(updated)}
      />

      {/* Simple Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 no-print">
        <p>{t.footerText}</p>
      </footer>

    </div>
  );
}
