import React, { useState } from 'react';
import { 
  Users, 
  Banknote, 
  Clock, 
  HandCoins, 
  PiggyBank, 
  ChefHat, 
  UtensilsCrossed, 
  Coffee, 
  Receipt, 
  Phone,
  Calendar,
  IdCard,
  Edit3,
  Trash2,
  PlusCircle,
  Search,
  Download,
  X,
  Save,
  ChevronLeft
} from 'lucide-react';
import { 
  Employee, 
  PayrollRun, 
  AdvanceRecord, 
  TipsPoolRecord, 
  AttendanceRecord, 
  RestaurantSettings,
  RestaurantStation,
  ContractType,
  EmployeeStatus
} from '../types';
import { formatCurrency } from '../utils/formatters';
import { ActiveTab } from './Navigation';
import { getTranslation } from '../i18n/translations';

interface DashboardViewProps {
  settings: RestaurantSettings;
  employees: Employee[];
  currentRun?: PayrollRun;
  advances: AdvanceRecord[];
  tipsPools: TipsPoolRecord[];
  attendance: AttendanceRecord[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewEmployee: () => void;
  onGeneratePayroll: () => void;
  onOpenQuickAttendance: () => void;
  onAddEmployee?: (employee: Omit<Employee, 'id'>) => void;
  onUpdateEmployee?: (id: string, updates: Partial<Employee>) => void;
  onDeleteEmployee?: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  employees,
  currentRun,
  advances,
  attendance,
  onNavigateTab,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}) => {
  const t = getTranslation(settings.language);

  // Search & Filter state for the Employee Table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');

  // Modal State for Edit & Add Employee
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form Fields
  const [formFullName, setFormFullName] = useState('');
  const [formMatricule, setFormMatricule] = useState('');
  const [formRoleTitle, setFormRoleTitle] = useState('');
  const [formStation, setFormStation] = useState<RestaurantStation>('KITCHEN');
  const [formPhone, setFormPhone] = useState('');
  const [formCin, setFormCin] = useState('');
  const [formCnssNumber, setFormCnssNumber] = useState('');
  const [formBirthDate, setFormBirthDate] = useState('1995-01-01');
  const [formHireDate, setFormHireDate] = useState('2024-01-01');
  const [formContractType, setFormContractType] = useState<ContractType>('CDI');
  const [formBaseSalary, setFormBaseSalary] = useState<number>(5500);
  const [formHealthCardExpiry, setFormHealthCardExpiry] = useState('2027-12-31');
  const [formStatus, setFormStatus] = useState<EmployeeStatus>('ACTIVE');
  const [formRibAccount, setFormRibAccount] = useState('');
  const [formBankName, setFormBankName] = useState('Attijariwafa Bank');
  const [formNotes, setFormNotes] = useState('');

  // Department counts
  const kitchenStaff = employees.filter(e => e.station === 'KITCHEN');
  const hallStaff = employees.filter(e => e.station === 'HALL');
  const barStaff = employees.filter(e => e.station === 'BAR');
  const cashierStaff = employees.filter(e => e.station === 'CASHIER');
  const cleaningStaff = employees.filter(e => e.station === 'CLEANING');

  // Pending advances
  const pendingAdvances = advances.filter(a => a.status === 'PENDING');
  const totalPendingAdvances = pendingAdvances.reduce((sum, a) => sum + a.amount, 0);

  // Filtered employees for the table
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.cin && emp.cin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      emp.phone.includes(searchQuery);

    const matchesStation = selectedStation === 'ALL' || emp.station === selectedStation;
    return matchesSearch && matchesStation;
  });

  const stationsList = [
    { id: 'ALL', label: t.allStations },
    { id: 'KITCHEN', label: t.stationKitchen },
    { id: 'HALL', label: t.stationHall },
    { id: 'BAR', label: t.stationBar },
    { id: 'CASHIER', label: t.stationCashier },
    { id: 'CLEANING', label: t.stationCleaning },
    { id: 'DELIVERY', label: t.stationDelivery },
    { id: 'MANAGEMENT', label: t.stationManagement },
  ];

  const getStationLabel = (station: RestaurantStation): string => {
    switch (station) {
      case 'KITCHEN': return t.stationKitchen;
      case 'HALL': return t.stationHall;
      case 'BAR': return t.stationBar;
      case 'CASHIER': return t.stationCashier;
      case 'CLEANING': return t.stationCleaning;
      case 'DELIVERY': return t.stationDelivery;
      case 'MANAGEMENT': return t.stationManagement;
      default: return station;
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormMatricule(emp.matricule);
    setFormFullName(emp.fullName);
    setFormRoleTitle(emp.roleTitle);
    setFormStation(emp.station);
    setFormPhone(emp.phone);
    setFormCin(emp.cin || '');
    setFormCnssNumber(emp.cnssNumber || '');
    setFormBirthDate(emp.birthDate);
    setFormHireDate(emp.hireDate);
    setFormContractType(emp.contractType);
    setFormBaseSalary(emp.baseSalary);
    setFormHealthCardExpiry(emp.healthCardExpiry);
    setFormStatus(emp.status);
    setFormRibAccount(emp.ribAccount || '');
    setFormBankName(emp.bankName || 'Attijariwafa Bank');
    setFormNotes(emp.notes || '');
    setIsModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingEmployee(null);
    const nextNum = employees.length + 1;
    setFormMatricule(`OB-${String(nextNum).padStart(3, '0')}`);
    setFormFullName('');
    setFormRoleTitle('');
    setFormStation('KITCHEN');
    setFormPhone('0661-00-00-00');
    setFormCin('BE');
    setFormCnssNumber('10');
    setFormBirthDate('1996-01-01');
    setFormHireDate(new Date().toISOString().split('T')[0]);
    setFormContractType('CDI');
    setFormBaseSalary(5000);
    setFormHealthCardExpiry('2027-10-22');
    setFormStatus('ACTIVE');
    setFormRibAccount('');
    setFormBankName('Attijariwafa Bank');
    setFormNotes('');
    setIsModalOpen(true);
  };

  // Handle Save
  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName || !formRoleTitle) return;

    if (editingEmployee && onUpdateEmployee) {
      onUpdateEmployee(editingEmployee.id, {
        fullName: formFullName,
        matricule: formMatricule,
        roleTitle: formRoleTitle,
        station: formStation,
        phone: formPhone,
        cin: formCin,
        cnssNumber: formCnssNumber,
        birthDate: formBirthDate,
        hireDate: formHireDate,
        contractType: formContractType,
        baseSalary: Number(formBaseSalary),
        healthCardExpiry: formHealthCardExpiry,
        status: formStatus,
        ribAccount: formRibAccount,
        bankName: formBankName,
        notes: formNotes,
      });
    } else if (onAddEmployee) {
      onAddEmployee({
        matricule: formMatricule,
        fullName: formFullName,
        roleTitle: formRoleTitle,
        station: formStation,
        phone: formPhone,
        cin: formCin,
        cnssNumber: formCnssNumber,
        birthDate: formBirthDate,
        hireDate: formHireDate,
        contractType: formContractType,
        salaryType: 'MONTHLY',
        baseSalary: Number(formBaseSalary),
        healthCardExpiry: formHealthCardExpiry,
        status: formStatus,
        ribAccount: formRibAccount,
        bankName: formBankName,
        notes: formNotes,
      });
    }
    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDeleteEmployee = (emp: Employee) => {
    if (confirm(`${t.confirmDeleteEmp}\n(${emp.fullName})`)) {
      if (onDeleteEmployee) {
        onDeleteEmployee(emp.id);
      }
    }
  };

  // Export Table to CSV
  const exportEmployeesCsv = () => {
    if (filteredEmployees.length === 0) return;
    const headers = [
      'ID / Matricule',
      t.colEmpName,
      t.colPost,
      'Station',
      `${t.colSalary} (${settings.currencySymbol})`,
      t.colPhone,
      t.colCin,
      t.colHireDate,
      'Contract',
      'CNSS',
      'Status',
    ];

    const rows = filteredEmployees.map(emp => [
      emp.matricule,
      `"${emp.fullName}"`,
      `"${emp.roleTitle}"`,
      emp.station,
      emp.baseSalary,
      `"${emp.phone}"`,
      emp.cin,
      emp.hireDate,
      emp.contractType,
      emp.cnssNumber,
      emp.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OBAYOLI_Staff_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Target Element: جدول يخص معلومات الموظفين مع أزرار التعديل والحذف والبيانات الكاملة */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
        
        {/* Quick Highlights KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">{t.totalEmployees}</span>
              <span className="text-xl font-black text-white font-mono">{employees.length} {t.salariedCount}</span>
            </div>
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">{t.netPayroll}</span>
              <span className="text-xl font-black text-amber-300 font-mono">
                {currentRun ? formatCurrency(currentRun.totalNet, settings.currencySymbol) : `0 ${settings.currencySymbol}`}
              </span>
            </div>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Banknote className="w-4 h-4" />
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">{t.overtimeHoursAmt}</span>
              <span className="text-xl font-black text-cyan-300 font-mono">
                {currentRun ? formatCurrency(currentRun.totalOvertimeAmount, settings.currencySymbol) : `0 ${settings.currencySymbol}`}
              </span>
            </div>
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">{t.tipsPoolAmt}</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {currentRun ? formatCurrency(currentRun.totalTipsDistributed, settings.currencySymbol) : `0 ${settings.currencySymbol}`}
              </span>
            </div>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <PiggyBank className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Table Header with Search, Filter & Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {t.empTableTitle}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 font-mono">
                {filteredEmployees.length} {t.salariedCount}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.empTableDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={exportEmployeesCsv}
              title={t.exportExcel}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.exportExcel}</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addNewEmployee}</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Station Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute ltr:right-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pr-10 pl-4 rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            aria-label={t.filterByStation}
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {stationsList.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* The Employee Information Table */}
        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="w-full ltr:text-left rtl:text-right text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 text-center text-slate-400 w-12">{t.colIndex}</th>
                  <th className="p-3.5 text-white">{t.colEmpName}</th>
                  <th className="p-3.5 text-amber-300">{t.colPost}</th>
                  <th className="p-3.5 text-emerald-300">{t.colSalary}</th>
                  <th className="p-3.5 text-cyan-300">{t.colPhone}</th>
                  <th className="p-3.5 text-purple-300">{t.colCin}</th>
                  <th className="p-3.5 text-blue-300">{t.colHireDate}</th>
                  <th className="p-3.5 text-center">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      {t.noMatchingEmployees}
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, index) => {
                    const stationLabel = getStationLabel(emp.station);

                    return (
                      <tr key={emp.id} className="hover:bg-slate-800/60 transition-colors group">
                        
                        {/* Index */}
                        <td className="p-3.5 font-mono text-slate-400 text-center font-bold">
                          {index + 1}
                        </td>

                        {/* 1. اسم الموظف */}
                        <td className="p-3.5">
                          <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                            {emp.fullName}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                              {emp.matricule}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {emp.contractType === 'ANAPEC' ? t.contractAnapec : emp.contractType}
                            </span>
                          </div>
                        </td>

                        {/* 2. POSTE */}
                        <td className="p-3.5">
                          <div className="font-bold text-slate-100 text-xs">
                            {emp.roleTitle}
                          </div>
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md border font-semibold bg-slate-800/80 text-amber-300 border-amber-500/20">
                            {stationLabel}
                          </span>
                        </td>

                        {/* 3. الراتب الشهري */}
                        <td className="p-3.5">
                          <div className="font-black font-mono text-emerald-400 text-sm">
                            {formatCurrency(emp.baseSalary, settings.currencySymbol)}
                          </div>
                          <span className="text-[10px] text-slate-500">{t.monthlyBase}</span>
                        </td>

                        {/* 4. رقم الهاتف */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <a 
                              href={`tel:${emp.phone}`}
                              className="font-mono font-bold text-slate-200 text-xs hover:text-cyan-300 transition-colors"
                              dir="ltr"
                            >
                              {emp.phone}
                            </a>
                          </div>
                        </td>

                        {/* 5. رقم البطاقة الوطنية (CIN) */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <IdCard className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="font-mono font-black text-purple-300 text-xs px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">
                              {emp.cin}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            CNSS: {emp.cnssNumber}
                          </div>
                        </td>

                        {/* 6. تاريخ الدخول */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="font-mono font-semibold text-slate-200 text-xs">
                              {emp.hireDate}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {Math.max(1, 2026 - parseInt(emp.hireDate.split('-')[0], 10))} {t.yearsSeniority}
                          </span>
                        </td>

                        {/* 7. إجراءات: زر التعديل وزر الحذف */}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(emp)}
                              title={t.btnEdit}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{t.btnEdit}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteEmployee(emp)}
                              title={t.btnDelete}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t.btnDelete}</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Two Column Section: Department Breakdown & Quick Advances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Restaurant Stations Matrix */}
        <div className="lg:col-span-2 bg-slate-850 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-400" />
                {t.stationsOverviewTitle}
              </h3>
              <p className="text-xs text-slate-400">{t.stationsOverviewDesc}</p>
            </div>
            <button
              onClick={() => onNavigateTab('employees')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {t.viewAll} <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Kitchen */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <ChefHat className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.stationKitchen}</h4>
                    <span className="text-[11px] text-slate-400">Cuisine</span>
                  </div>
                </div>
                <span className="text-lg font-black font-mono text-amber-400">{kitchenStaff.length}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">
                {t.kitchenDesc}
              </p>
            </div>

            {/* Dining Hall */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <UtensilsCrossed className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.stationHall}</h4>
                    <span className="text-[11px] text-slate-400">Salle & Service</span>
                  </div>
                </div>
                <span className="text-lg font-black font-mono text-emerald-400">{hallStaff.length}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">
                {t.hallDesc}
              </p>
            </div>

            {/* Bar & Beverages */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Coffee className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.stationBar}</h4>
                    <span className="text-[11px] text-slate-400">Bar & Barista</span>
                  </div>
                </div>
                <span className="text-lg font-black font-mono text-cyan-400">{barStaff.length}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">
                {t.barDesc}
              </p>
            </div>

            {/* Cashier & Hygiene */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Receipt className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.stationCashier} / {t.stationCleaning}</h4>
                    <span className="text-[11px] text-slate-400">Caisse & Plonge</span>
                  </div>
                </div>
                <span className="text-lg font-black font-mono text-purple-400">
                  {cashierStaff.length + cleaningStaff.length}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">
                {t.cashierCleaningDesc}
              </p>
            </div>

          </div>
        </div>

        {/* Advances & Quick Financials */}
        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HandCoins className="w-5 h-5 text-amber-400" />
                {t.advancesTitle}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {pendingAdvances.length} {t.pendingRequests}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              {t.totalPendingAdv} <span className="font-bold text-amber-300 font-mono">{formatCurrency(totalPendingAdvances, settings.currencySymbol)}</span>
            </p>

            <div className="space-y-2.5">
              {advances.slice(0, 3).map(adv => {
                const emp = employees.find(e => e.id === adv.employeeId);
                return (
                  <div key={adv.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200 block">{emp?.fullName || 'Collaborateur'}</span>
                      <span className="text-[11px] text-slate-400">{adv.reason}</span>
                    </div>
                    <div className="ltr:text-right rtl:text-left">
                      <span className="font-bold font-mono text-rose-400 block">{formatCurrency(adv.amount, settings.currencySymbol)}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        adv.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                        adv.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {adv.status === 'APPROVED' ? t.statusApproved : adv.status === 'PENDING' ? t.statusPending : t.statusDeducted}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('advances')}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.manageAllAdvances}</span>
            <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>

      </div>

      {/* Edit / Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir={t.dir}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Edit3 className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-white">
                  {editingEmployee ? `${t.modalEditTitle}: ${editingEmployee.fullName}` : t.modalAddTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="mt-5 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.fieldFullName}</label>
                  <input
                    type="text"
                    required
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="e.g. Youssef El Idrissi"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.fieldPost}</label>
                  <input
                    type="text"
                    required
                    value={formRoleTitle}
                    onChange={(e) => setFormRoleTitle(e.target.value)}
                    placeholder="e.g. Chef Grilladin"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.fieldBaseSalary}</label>
                  <input
                    type="number"
                    required
                    min={3000}
                    step={100}
                    value={formBaseSalary}
                    onChange={(e) => setFormBaseSalary(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.fieldPhone}</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0661-00-00-00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.fieldCin}</label>
                  <input
                    type="text"
                    required
                    value={formCin}
                    onChange={(e) => setFormCin(e.target.value.toUpperCase())}
                    placeholder="e.g. BE892019"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-purple-300 font-mono font-bold focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.fieldHireDate}</label>
                  <input
                    type="date"
                    required
                    value={formHireDate}
                    onChange={(e) => setFormHireDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.fieldStation}</label>
                  <select
                    value={formStation}
                    onChange={(e) => setFormStation(e.target.value as RestaurantStation)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="KITCHEN">{t.stationKitchen}</option>
                    <option value="HALL">{t.stationHall}</option>
                    <option value="BAR">{t.stationBar}</option>
                    <option value="CASHIER">{t.stationCashier}</option>
                    <option value="CLEANING">{t.stationCleaning}</option>
                    <option value="DELIVERY">{t.stationDelivery}</option>
                    <option value="MANAGEMENT">{t.stationManagement}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.fieldContractType}</label>
                  <select
                    value={formContractType}
                    onChange={(e) => setFormContractType(e.target.value as ContractType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="CDI">{t.contractCdi}</option>
                    <option value="CDD">{t.contractCdd}</option>
                    <option value="ANAPEC">{t.contractAnapec}</option>
                    <option value="EXTRA_INTERIM">{t.contractExtra}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.fieldCnssNumber}</label>
                  <input
                    type="text"
                    value={formCnssNumber}
                    onChange={(e) => setFormCnssNumber(e.target.value)}
                    placeholder="109823412"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.fieldStatus}</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as EmployeeStatus)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="ACTIVE">{t.statusActive}</option>
                    <option value="ON_LEAVE">{t.statusOnLeave}</option>
                    <option value="SUSPENDED">{t.statusSuspended}</option>
                    <option value="TERMINATED">{t.statusTerminated}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-slate-950 bg-amber-400 hover:bg-amber-300 font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-400/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingEmployee ? t.btnUpdateEmployee : t.btnSaveEmployee}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
