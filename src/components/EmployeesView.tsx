import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  Search, 
  Filter, 
  ChefHat, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  Edit3, 
  Trash2, 
  X,
  CreditCard,
  Building,
  UserCheck,
  Download,
  IdCard,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { Employee, RestaurantStation, ContractType, EmployeeStatus } from '../types';
import { formatCurrency, getStationMeta, getContractLabel, getStatusBadge, checkHealthCardStatus } from '../utils/formatters';
import { getTranslation, AppLanguage } from '../i18n/translations';

interface EmployeesViewProps {
  employees: Employee[];
  currencySymbol: string;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  onViewLatestSlip?: (employeeId: string) => void;
  initialOpenAddModal?: boolean;
  language?: AppLanguage;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  currencySymbol,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onViewLatestSlip,
  initialOpenAddModal = false,
  language = 'ar',
}) => {
  const t = getTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(initialOpenAddModal);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form state (Morocco)
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

  const openAddModal = () => {
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

  const openEditModal = (emp: Employee) => {
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName || !formRoleTitle) return;

    if (editingEmployee) {
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
    } else {
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

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.cin && emp.cin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      emp.phone.includes(searchQuery);

    const matchesStation = selectedStation === 'ALL' || emp.station === selectedStation;
    const matchesStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;

    return matchesSearch && matchesStation && matchesStatus;
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

  // Export Table to CSV
  const exportEmployeesCsv = () => {
    if (filteredEmployees.length === 0) return;
    const headers = [
      'رقم التسجيل',
      'اسم الموظف',
      'POSTE',
      'القسم',
      'الراتب الشهري (د.م)',
      'رقم الهاتف',
      'رقم البطاقة الوطنية (CIN)',
      'تاريخ الدخول',
      'نوع العقد',
      'رقم CNSS',
      'الحالة',
    ];

    const rows = filteredEmployees.map(emp => [
      emp.matricule,
      emp.fullName,
      emp.roleTitle,
      emp.station,
      emp.baseSalary,
      emp.phone,
      emp.cin,
      emp.hireDate,
      emp.contractType,
      emp.cnssNumber,
      emp.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OBAYOLI_Employees_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-white">
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

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportEmployeesCsv}
            title={t.exportExcel}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportExcel}</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-2 shrink-0 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addNewEmployee}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Station Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
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

          {/* Status Filter */}
          <select
            aria-label="تصفية حسب حالة الموظف"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="ACTIVE">{t.statusActive}</option>
            <option value="ON_LEAVE">{t.statusOnLeave}</option>
            <option value="SUSPENDED">{t.statusSuspended}</option>
          </select>
        </div>

      </div>

      {/* Primary Table of Employees (جدول أسماء الموظفين) */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-300 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 text-white">{t.colIndex}</th>
                <th className="p-4 text-white">{t.colEmpName}</th>
                <th className="p-4 text-amber-300">{t.colPost}</th>
                <th className="p-4 text-emerald-300">{t.colSalary}</th>
                <th className="p-4 text-cyan-300">{t.colPhone}</th>
                <th className="p-4 text-purple-300">{t.colCin}</th>
                <th className="p-4 text-blue-300">{t.colHireDate}</th>
                <th className="p-4 text-center">الشهادة الصحية</th>
                <th className="p-4 text-center">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredEmployees.map((emp, index) => {
                const stationMeta = getStationMeta(emp.station);
                const healthStatus = checkHealthCardStatus(emp.healthCardExpiry);

                return (
                  <tr key={emp.id} className="hover:bg-slate-800/50 transition-colors group">
                    
                    {/* Index */}
                    <td className="p-4 font-mono text-slate-400 font-semibold text-center w-12">
                      {index + 1}
                    </td>

                    {/* 1. اسم الموظف */}
                    <td className="p-4">
                      <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                        {emp.fullName}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {emp.matricule}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {emp.contractType === 'ANAPEC' ? 'عقد أنابيك' : emp.contractType}
                        </span>
                      </div>
                    </td>

                    {/* 2. POSTE */}
                    <td className="p-4">
                      <div className="font-bold text-slate-100 text-xs">
                        {emp.roleTitle}
                      </div>
                      <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md border font-semibold ${stationMeta.bgLight}`}>
                        {stationMeta.labelAr} ({stationMeta.labelFr})
                      </span>
                    </td>

                    {/* 3. الراتب الشهري */}
                    <td className="p-4">
                      <div className="font-black font-mono text-emerald-400 text-sm">
                        {formatCurrency(emp.baseSalary, currencySymbol)}
                      </div>
                      <span className="text-[10px] text-slate-500">صافي أساسي شهري</span>
                    </td>

                    {/* 4. رقم الهاتف */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-mono font-bold text-slate-200 text-xs tracking-wide" dir="ltr">
                          {emp.phone}
                        </span>
                      </div>
                    </td>

                    {/* 5. رقم البطاقة الوطنية (CIN) */}
                    <td className="p-4">
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
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="font-mono font-semibold text-slate-200 text-xs">
                          {emp.hireDate}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {Math.max(1, 2026 - parseInt(emp.hireDate.split('-')[0], 10))} سنوات خدمة
                      </span>
                    </td>

                    {/* Health Card / Carte Sanitaire Status */}
                    <td className="p-4 text-center">
                      <span
                        title={`تاريخ انتهاء الشهادة الصحية: ${emp.healthCardExpiry}`}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md border ${
                          healthStatus.isExpired
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                            : healthStatus.isExpiringSoon
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {healthStatus.isExpired ? (
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                        ) : (
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        )}
                        <span>{healthStatus.isExpired ? 'منتهية!' : healthStatus.isExpiringSoon ? 'تجديد عاجل' : 'صالحة'}</span>
                      </span>
                    </td>

                    {/* Actions (تعديل / حذف) */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(emp)}
                          title={t.btnEdit}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{t.btnEdit}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`${t.confirmDeleteEmp}\n(${emp.fullName})`)) {
                              onDeleteEmployee(emp.id);
                            }
                          }}
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
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 bg-slate-850 border border-slate-800 rounded-2xl p-6">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">لم يتم العثور على أي موظف</h4>
          <p className="text-xs text-slate-500 mt-1">جرب تغيير كلمات البحث أو تصفية الأقسام</p>
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-800/90 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <UserCheck className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-white">
                  {editingEmployee ? 'تعديل بيانات الموظف' : 'تسجيل موظف جديد في نظام RH'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. اسم الموظف */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">اسم الموظف الكامل *</label>
                  <input
                    type="text"
                    required
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="مثال: كريم العلمي"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* 2. POSTE */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">POSTE *</label>
                  <input
                    type="text"
                    required
                    value={formRoleTitle}
                    onChange={(e) => setFormRoleTitle(e.target.value)}
                    placeholder="مثال: شيف تنفيذي، جرسون، كاشير، باريستا..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* 3. الراتب الشهري بالدرهم */}
                <div>
                  <label className="block text-emerald-300 font-semibold mb-1">
                    الراتب الشهري الأساسي بالدرهم ({currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formBaseSalary}
                    onChange={(e) => setFormBaseSalary(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* 4. رقم الهاتف */}
                <div>
                  <label className="block text-cyan-300 font-semibold mb-1">رقم الهاتف *</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0661-23-45-67"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* 5. رقم البطاقة الوطنية (CIN) */}
                <div>
                  <label className="block text-purple-300 font-semibold mb-1">رقم البطاقة الوطنية (CIN) *</label>
                  <input
                    type="text"
                    required
                    value={formCin}
                    onChange={(e) => setFormCin(e.target.value)}
                    placeholder="e.g. BE849201, AA123456"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-purple-300 font-mono font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* 6. تاريخ الدخول */}
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">تاريخ الدخول والالتحاق بالمطعم *</label>
                  <input
                    type="date"
                    required
                    value={formHireDate}
                    onChange={(e) => setFormHireDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* قسم العمل */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">قسم ومحطة العمل بالمطعم *</label>
                  <select
                    value={formStation}
                    onChange={(e) => setFormStation(e.target.value as RestaurantStation)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="KITCHEN">المطبخ والطهي (Cuisine)</option>
                    <option value="HALL">الصالة والخدمة (Salle & Service)</option>
                    <option value="BAR">البار والمشروبات (Barista)</option>
                    <option value="CASHIER">الصندوق والمحاسبة (Caisse)</option>
                    <option value="CLEANING">النظافة وغسيل الأواني (Plonge)</option>
                    <option value="DELIVERY">التوصيل (Livraison)</option>
                    <option value="MANAGEMENT">الإدارة والإشراف (Direction)</option>
                  </select>
                </div>

                {/* نوع العقد */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نوع عقد العمل بالمغرب</label>
                  <select
                    value={formContractType}
                    onChange={(e) => setFormContractType(e.target.value as ContractType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="CDI">عقد دائم غير محدد المدة (CDI)</option>
                    <option value="CDD">عقد محدد المدة (CDD)</option>
                    <option value="ANAPEC">عقد إدماج مهني (ANAPEC أنابيك)</option>
                    <option value="JOURNALIER">عامل يومي (Journalier)</option>
                    <option value="STAGE">متدرب مهني (Stage)</option>
                    <option value="SAISONNIER">عقد موسمي (Saisonnier)</option>
                  </select>
                </div>

                {/* رقم التسجيل الداخلي */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">رقم التسجيل الداخلي (Matricule)</label>
                  <input
                    type="text"
                    required
                    value={formMatricule}
                    onChange={(e) => setFormMatricule(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* رقم CNSS */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">رقم التسجيل بالضمان الاجتماعي CNSS</label>
                  <input
                    type="text"
                    value={formCnssNumber}
                    onChange={(e) => setFormCnssNumber(e.target.value)}
                    placeholder="109849201"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* الشهادة الطبية */}
                <div>
                  <label className="block text-rose-300 font-semibold mb-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    تاريخ انتهاء الشهادة الصحية (Carte Sanitaire) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formHealthCardExpiry}
                    onChange={(e) => setFormHealthCardExpiry(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* الحالة */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الحالة الوظيفية</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as EmployeeStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ACTIVE">نشط على رأس العمل (Active)</option>
                    <option value="ON_LEAVE">في إجازة سنوية أو مرضية (En Congé)</option>
                    <option value="SUSPENDED">موقوف مؤقتاً (Suspendu)</option>
                    <option value="TERMINATED">منتهي العقد (Terminé)</option>
                  </select>
                </div>

              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  {editingEmployee ? 'حفظ التعديلات' : 'إضافة الموظف الآن'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
