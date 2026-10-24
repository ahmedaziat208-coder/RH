import React, { useState } from 'react';
import { 
  HandCoins, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Award, 
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
  Edit3
} from 'lucide-react';
import { 
  Employee, 
  AdvanceRecord, 
  BonusPenaltyRecord, 
  BonusPenaltyType, 
  AdjustmentCategory,
  RestaurantSettings 
} from '../types';
import { formatCurrency } from '../utils/formatters';
import { getCurrentDateString, getCurrentMonth } from '../utils/formatters';

interface AdvancesAndBonusesViewProps {
  settings: RestaurantSettings;
  employees: Employee[];
  advances: AdvanceRecord[];
  adjustments: BonusPenaltyRecord[];
  onAddAdvance: (advance: Omit<AdvanceRecord, 'id'>) => void;
  onUpdateAdvance?: (id: string, updates: Partial<AdvanceRecord>) => void;
  onUpdateAdvanceStatus: (id: string, status: AdvanceRecord['status']) => void;
  onDeleteAdvance: (id: string) => void;
  onAddAdjustment: (record: Omit<BonusPenaltyRecord, 'id'>) => void;
  onUpdateAdjustment?: (id: string, updates: Partial<BonusPenaltyRecord>) => void;
  onDeleteAdjustment: (id: string) => void;
}

export const AdvancesAndBonusesView: React.FC<AdvancesAndBonusesViewProps> = ({
  settings,
  employees,
  advances,
  adjustments,
  onAddAdvance,
  onUpdateAdvance,
  onUpdateAdvanceStatus,
  onDeleteAdvance,
  onAddAdjustment,
  onUpdateAdjustment,
  onDeleteAdjustment,
}) => {
  const [subTab, setSubTab] = useState<'advances' | 'adjustments'>('advances');

  // New & Edit Advance Modal state
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [editingAdvance, setEditingAdvance] = useState<AdvanceRecord | null>(null);
  const [advEmployeeId, setAdvEmployeeId] = useState(employees[0]?.id || '');
  const [advAmount, setAdvAmount] = useState<number>(1000);
  const [advReason, setAdvReason] = useState('');
  const [advMonth, setAdvMonth] = useState(getCurrentMonth());

  // New & Edit Adjustment Modal state
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [editingAdjustment, setEditingAdjustment] = useState<BonusPenaltyRecord | null>(null);
  const [adjEmployeeId, setAdjEmployeeId] = useState(employees[0]?.id || '');
  const [adjType, setAdjType] = useState<BonusPenaltyType>('BONUS');
  const [adjCategory, setAdjCategory] = useState<AdjustmentCategory>('PERFORMANCE');
  const [adjAmount, setAdjAmount] = useState<number>(500);
  const [adjDescription, setAdjDescription] = useState('');
  const [adjMonth, setAdjMonth] = useState(getCurrentMonth());

  const openAddAdvance = () => {
    setEditingAdvance(null);
    setAdvEmployeeId(employees[0]?.id || '');
    setAdvAmount(1000);
    setAdvReason('');
    setAdvMonth(getCurrentMonth());
    setIsAdvanceModalOpen(true);
  };

  const openEditAdvance = (adv: AdvanceRecord) => {
    setEditingAdvance(adv);
    setAdvEmployeeId(adv.employeeId);
    setAdvAmount(adv.amount);
    setAdvReason(adv.reason);
    setAdvMonth(adv.deductionMonth);
    setIsAdvanceModalOpen(true);
  };

  const handleSaveAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advEmployeeId || advAmount <= 0) return;

    if (editingAdvance) {
      onUpdateAdvance && onUpdateAdvance(editingAdvance.id, {
        employeeId: advEmployeeId,
        amount: Number(advAmount),
        deductionMonth: advMonth,
        reason: advReason,
      });
    } else {
      onAddAdvance({
        employeeId: advEmployeeId,
        amount: Number(advAmount),
        requestDate: getCurrentDateString(),
        deductionMonth: advMonth,
        status: 'APPROVED',
        reason: advReason || 'تسبيق على الراتب',
        approvedBy: settings.restaurantManager,
      });
    }
    setIsAdvanceModalOpen(false);
  };

  const openAddAdjustment = () => {
    setEditingAdjustment(null);
    setAdjEmployeeId(employees[0]?.id || '');
    setAdjType('BONUS');
    setAdjCategory('PERFORMANCE');
    setAdjAmount(500);
    setAdjDescription('');
    setAdjMonth(getCurrentMonth());
    setIsAdjustmentModalOpen(true);
  };

  const openEditAdjustment = (adj: BonusPenaltyRecord) => {
    setEditingAdjustment(adj);
    setAdjEmployeeId(adj.employeeId);
    setAdjType(adj.type);
    setAdjCategory(adj.category);
    setAdjAmount(adj.amount);
    setAdjDescription(adj.description);
    setAdjMonth(adj.month);
    setIsAdjustmentModalOpen(true);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjEmployeeId || adjAmount <= 0) return;

    if (editingAdjustment) {
      onUpdateAdjustment && onUpdateAdjustment(editingAdjustment.id, {
        employeeId: adjEmployeeId,
        type: adjType,
        category: adjCategory,
        amount: Number(adjAmount),
        month: adjMonth,
        description: adjDescription,
      });
    } else {
      onAddAdjustment({
        employeeId: adjEmployeeId,
        type: adjType,
        category: adjCategory,
        amount: Number(adjAmount),
        month: adjMonth,
        date: getCurrentDateString(),
        description: adjDescription || 'تسجيل بند مالي',
      });
    }
    setIsAdjustmentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls & SubTabs */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('advances')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              subTab === 'advances'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HandCoins className="w-4 h-4" />
            <span>السلفيات والتسبيقات (Acomptes)</span>
          </button>

          <button
            onClick={() => setSubTab('adjustments')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              subTab === 'adjustments'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>المكافآت والبدلات والخصومات</span>
          </button>
        </div>

        <div>
          {subTab === 'advances' ? (
            <button
              onClick={openAddAdvance}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تسجيل طلب تسبيق جديد</span>
            </button>
          ) : (
            <button
              onClick={openAddAdjustment}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة مكافأة أو خصم</span>
            </button>
          )}
        </div>
      </div>

      {/* SubTab 1: Advances Table */}
      {subTab === 'advances' && (
        <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HandCoins className="w-4 h-4 text-amber-400" />
              سجل تسبيقات رواتب موظفي المطعم بالمغرب (Acomptes)
            </h3>
            <span className="text-xs text-slate-400">
              يتم خصم التسبيق المعتمد تلقائياً من قسيمة راتب الشهر المحدد
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="p-3.5">اسم الموظف</th>
                  <th className="p-3.5">مبلغ التسبيق (د.م)</th>
                  <th className="p-3.5">تاريخ الطلب</th>
                  <th className="p-3.5">شهر الخصم المستهدف</th>
                  <th className="p-3.5">السبب / الغرض</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {advances.map(adv => {
                  const emp = employees.find(e => e.id === adv.employeeId);
                  return (
                    <tr key={adv.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        {emp?.fullName || 'موظف'}
                        <span className="block text-[11px] font-mono text-slate-400">
                          {emp?.matricule} {emp?.cin && `• CIN: ${emp.cin}`}
                        </span>
                      </td>

                      <td className="p-3.5 font-bold font-mono text-rose-400 text-sm">
                        {formatCurrency(adv.amount, settings.currencySymbol)}
                      </td>

                      <td className="p-3.5 text-slate-400 font-mono">
                        {adv.requestDate}
                      </td>

                      <td className="p-3.5 font-mono text-amber-300 font-semibold">
                        شهر {adv.deductionMonth}
                      </td>

                      <td className="p-3.5 text-slate-300">
                        {adv.reason}
                      </td>

                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          adv.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          adv.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          adv.status === 'DEDUCTED' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}>
                          {adv.status === 'APPROVED' ? 'معتمدة للخصم' :
                           adv.status === 'PENDING' ? 'قيد المراجعة' :
                           adv.status === 'DEDUCTED' ? 'تم الخصم بالراتب' : 'مرفوضة'}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {adv.status === 'PENDING' && (
                            <button
                              onClick={() => onUpdateAdvanceStatus(adv.id, 'APPROVED')}
                              title="اعتماد السلفة"
                              className="px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>اعتماد</span>
                            </button>
                          )}

                          {/* زر التعديل */}
                          <button
                            onClick={() => openEditAdvance(adv)}
                            title="تعديل بيانات التسبيق والمبلغ"
                            className="px-2 py-1 rounded-md text-[11px] font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>

                          {/* زر الحذف */}
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف هذا التسبيق بمبلغ ${adv.amount} د.م للموظف "${emp?.fullName}"؟`)) {
                                onDeleteAdvance(adv.id);
                              }
                            }}
                            title="حذف السلفة"
                            className="px-2 py-1 rounded-md text-[11px] font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف</span>
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
      )}

      {/* SubTab 2: Adjustments Table */}
      {subTab === 'adjustments' && (
        <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              المكافآت، الخصومات والبدلات الخاصة
            </h3>
            <span className="text-xs text-slate-400">
              تشمل مكافآت التميز، كسر أواني الصالة، تأخيرات، وبدلات إضافية
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="p-3.5">الموظف</th>
                  <th className="p-3.5">النوع</th>
                  <th className="p-3.5">التصنيف</th>
                  <th className="p-3.5">المبلغ (د.م)</th>
                  <th className="p-3.5">الشهر المستهدف</th>
                  <th className="p-3.5">التاريخ والبيان</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {adjustments.map(adj => {
                  const emp = employees.find(e => e.id === adj.employeeId);
                  const isBonus = adj.type === 'BONUS';
                  return (
                    <tr key={adj.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        {emp?.fullName || 'موظف'}
                        <span className="block text-[11px] font-mono text-slate-400">
                          {emp?.matricule} {emp?.cin && `• CIN: ${emp.cin}`}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                          isBonus
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                          {isBonus ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isBonus ? 'مكافأة (+)' : 'خصم / غرامة (-)'}
                        </span>
                      </td>

                      <td className="p-3.5 font-medium text-slate-300">
                        {adj.category === 'PERFORMANCE' ? 'مكافأة أداء وتميز' :
                         adj.category === 'BREAKAGE' ? 'كسر صحون وأواني' :
                         adj.category === 'DELAY' ? 'تأخر عن الشفت' :
                         adj.category === 'MEAL_ALLOWANCE' ? 'بدل وجبة إضافية' :
                         adj.category === 'TRANSPORT_ALLOWANCE' ? 'بدل نقل إضافي' :
                         adj.category === 'HYGIENE_VIOLATION' ? 'مخالفة نظافة' : 'أخرى'}
                      </td>

                      <td className={`p-3.5 font-bold font-mono text-sm ${isBonus ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isBonus ? '+' : '-'}{formatCurrency(adj.amount, settings.currencySymbol)}
                      </td>

                      <td className="p-3.5 font-mono text-amber-300">
                        شهر {adj.month}
                      </td>

                      <td className="p-3.5 text-slate-300">
                        <div>{adj.description}</div>
                        <span className="text-[10px] text-slate-500 font-mono">{adj.date}</span>
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* زر التعديل */}
                          <button
                            onClick={() => openEditAdjustment(adj)}
                            title="تعديل هذا البند المالي"
                            className="px-2 py-1 rounded-md text-[11px] font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>

                          {/* زر الحذف */}
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف هذا البند المالي بقيمة ${adj.amount} د.م؟`)) {
                                onDeleteAdjustment(adj.id);
                              }
                            }}
                            title="حذف هذا البند"
                            className="px-2 py-1 rounded-md text-[11px] font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف</span>
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
      )}

      {/* Modal: Add/Edit Advance */}
      {isAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HandCoins className="w-5 h-5 text-amber-400" />
                {editingAdvance ? 'تعديل بيانات التسبيق المالي' : 'تسجيل تسبيق جديد على الراتب'}
              </h3>
              <button onClick={() => setIsAdvanceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdvance} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">الموظف الطالب للتسبيق *</label>
                <select
                  value={advEmployeeId}
                  onChange={(e) => setAdvEmployeeId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.matricule} - {emp.cin})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">مبلغ التسبيق ({settings.currencySymbol}) *</label>
                <input
                  type="number"
                  required
                  min="100"
                  step="50"
                  value={advAmount}
                  onChange={(e) => setAdvAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">شهر الخصم من الراتب *</label>
                <input
                  type="month"
                  required
                  value={advMonth}
                  onChange={(e) => setAdvMonth(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">سبب أو غرض التسبيق</label>
                <textarea
                  rows={2}
                  value={advReason}
                  onChange={(e) => setAdvReason(e.target.value)}
                  placeholder="مصاريف عائلية، علاج، طارئ..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdvanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 cursor-pointer"
                >
                  {editingAdvance ? 'حفظ تعديل التسبيق' : 'اعتماد التسبيق الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Adjustment */}
      {isAdjustmentModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                {editingAdjustment ? 'تعديل البند المالي' : 'إضافة مكافأة أو خصم أو بدل'}
              </h3>
              <button onClick={() => setIsAdjustmentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">نوع العملية *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjType('BONUS')}
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      adjType === 'BONUS'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    مكافأة (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjType('PENALTY')}
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      adjType === 'PENALTY'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    خصم / غرامة (-)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">الموظف المعني *</label>
                <select
                  value={adjEmployeeId}
                  onChange={(e) => setAdjEmployeeId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.matricule} - {emp.cin})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">تصنيف البند *</label>
                <select
                  value={adjCategory}
                  onChange={(e) => setAdjCategory(e.target.value as AdjustmentCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="PERFORMANCE">مكافأة أداء وتميز في الخدمة</option>
                  <option value="BREAKAGE">كسر صحون أو أواني بالمطعم</option>
                  <option value="DELAY">تأخر متكرر عن الشفت</option>
                  <option value="HYGIENE_VIOLATION">مخالفة معايير النظافة وسلامة الغذاء</option>
                  <option value="MEAL_ALLOWANCE">بدل وجبة إضافية</option>
                  <option value="TRANSPORT_ALLOWANCE">بدل نقل إضافي</option>
                  <option value="OTHER">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">المبلغ ({settings.currencySymbol}) *</label>
                <input
                  type="number"
                  required
                  min="50"
                  step="50"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">شهر التطبيق في المسير *</label>
                <input
                  type="month"
                  required
                  value={adjMonth}
                  onChange={(e) => setAdjMonth(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">البيان / الوصف</label>
                <input
                  type="text"
                  value={adjDescription}
                  onChange={(e) => setAdjDescription(e.target.value)}
                  placeholder="سبب البند..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 cursor-pointer"
                >
                  {editingAdjustment ? 'حفظ تعديل البند' : 'تسجيل البند'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
