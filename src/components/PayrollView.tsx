import React, { useState } from 'react';
import { 
  Banknote, 
  Calculator, 
  CheckCircle2, 
  Printer, 
  Download, 
  Edit3, 
  Calendar, 
  Filter, 
  Check,
  Trash2
} from 'lucide-react';
import { PayrollSlip, PayrollRun, RestaurantSettings } from '../types';
import { formatCurrency, getCurrentMonth, getStationMeta } from '../utils/formatters';

interface PayrollViewProps {
  settings: RestaurantSettings;
  payrollRuns: PayrollRun[];
  payrollSlips: PayrollSlip[];
  onRecalculatePayroll: (month: string) => void;
  onUpdateRunStatus: (month: string, status: PayrollRun['status']) => void;
  onSelectSlipForPrint: (slip: PayrollSlip) => void;
  onUpdateSlip: (id: string, updates: Partial<PayrollSlip>) => void;
  onDeleteSlip?: (id: string) => void;
  onDeletePayrollRun?: (month: string) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  settings,
  payrollRuns,
  payrollSlips,
  onRecalculatePayroll,
  onUpdateRunStatus,
  onSelectSlipForPrint,
  onUpdateSlip,
  onDeleteSlip,
  onDeletePayrollRun,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [stationFilter, setStationFilter] = useState<string>('ALL');

  // Quick edit modal for slip adjustments
  const [editingSlip, setEditingSlip] = useState<PayrollSlip | null>(null);
  const [editOvertimeHours, setEditOvertimeHours] = useState<number>(0);
  const [editPerformanceBonus, setEditPerformanceBonus] = useState<number>(0);
  const [editPenalties, setEditPenalties] = useState<number>(0);

  const monthOptions = Array.from(new Set([
    ...payrollRuns.map(r => r.month),
    ...[0, -1, -2].map(offset => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() + offset);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }),
  ])).sort().reverse();

  const currentRun = payrollRuns.find(r => r.month === selectedMonth);
  const currentSlips = payrollSlips.filter(s => s.month === selectedMonth);

  const filteredSlips = currentSlips.filter(slip => {
    if (stationFilter === 'ALL') return true;
    return slip.station === stationFilter;
  });

  const openEditSlip = (slip: PayrollSlip) => {
    setEditingSlip(slip);
    setEditOvertimeHours(slip.overtimeHours);
    setEditPerformanceBonus(slip.performanceBonus);
    setEditPenalties(slip.penaltiesDeducted);
  };

  const handleSaveSlipEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlip) return;

    const overtimeRate = editingSlip.overtimeRate;
    const overtimeAmount = Math.round(editOvertimeHours * overtimeRate);

    onUpdateSlip(editingSlip.id, {
      overtimeHours: editOvertimeHours,
      overtimeRate,
      overtimeAmount,
      performanceBonus: editPerformanceBonus,
      penaltiesDeducted: editPenalties,
    });
    setEditingSlip(null);
  };

  const exportCsv = () => {
    if (filteredSlips.length === 0) return;
    const headers = [
      'رقم التسجيل',
      'بطاقة CIN',
      'رقم CNSS',
      'اسم الموظف',
      'المسمى الوظيفي',
      'القسم',
      'الراتب الأساسي (د.م)',
      'ساعات إضافية',
      'مبلغ الساعات الإضافية',
      'حصة البقشيش',
      'علاوة الأقدمية',
      'منحة القفة',
      'تعويض النقل',
      'مكافأة أداء',
      'الأجر الخام (Brut)',
      'اقتطاع CNSS (4.48%)',
      'اقتطاع AMO (2.26%)',
      'الضريبة على الدخل IR',
      'خصم السلفيات',
      'صافي الأجر للدفع (Net)',
      'الحالة',
    ];

    const rows = filteredSlips.map(s => [
      s.employeeMatricule,
      s.cin,
      s.cnssNumber,
      s.employeeName,
      s.roleTitle,
      s.station,
      s.baseSalary,
      s.overtimeHours,
      s.overtimeAmount,
      s.tipsShare,
      s.seniorityBonus,
      s.mealAllowance,
      s.transportAllowance,
      s.performanceBonus,
      s.totalGrossSalary,
      s.cnssAmount,
      s.amoAmount,
      s.irAmount,
      s.advancesDeducted,
      s.netSalary,
      s.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OBAYOLI_Paie_Maroc_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls & Month Picker */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Month Selector & Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">فترة الأداء:</span>
            <select
              aria-label="تحديد شهر الرواتب"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
            >
              {monthOptions.map(m => (
                <option key={m} value={m} className="bg-slate-900 text-white">
                  شهر {m}
                </option>
              ))}
            </select>
          </div>

          {currentRun && (
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
              currentRun.status === 'PAID'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : currentRun.status === 'APPROVED'
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {currentRun.status === 'PAID' ? 'تم تسديد وتحويل الرواتب بالكامل' :
               currentRun.status === 'APPROVED' ? 'معتمد رسمياً وجاهز للتحويل البنكي' : 'مسودة قيد التدقيق'}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onRecalculatePayroll(selectedMonth)}
            disabled={currentRun?.status === 'PAID'}
            title="إعادة احتساب مسير الرواتب وفق نسب CNSS وAMO والضريبة IR"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>إعادة احتساب المسير (Maroc)</span>
          </button>

          {currentRun?.status !== 'PAID' && (
            <button
              onClick={() => onUpdateRunStatus(selectedMonth, 'PAID')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>صرف وتسديد الرواتب</span>
            </button>
          )}

          <button
            onClick={exportCsv}
            title="تصدير جدول المسير إلى Excel CSV"
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {currentRun && (
            <button
              onClick={() => {
                if (confirm(`هل أنت متأكد من حذف مسير رواتب شهر ${selectedMonth} بالكامل؟`)) {
                  onDeletePayrollRun && onDeletePayrollRun(selectedMonth);
                }
              }}
              title="حذف مسير هذا الشهر بالكامل"
              className="p-2 rounded-xl text-rose-400 hover:text-white bg-slate-800 hover:bg-rose-500/20 border border-slate-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Financial Summary KPI Bar (Morocco) */}
      {currentRun && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-gradient-to-r from-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">عدد المأجورين بالمسير:</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">
              {currentRun.totalEmployees} موظف
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">إجمالي الأجر الخام (Brut):</span>
            <span className="text-xl font-bold font-mono text-slate-200 mt-1 block">
              {formatCurrency(currentRun.totalGross, settings.currencySymbol)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">ساعات إضافية وبقشيش:</span>
            <span className="text-xl font-bold font-mono text-cyan-300 mt-1 block">
              {formatCurrency(currentRun.totalOvertimeAmount + currentRun.totalTipsDistributed, settings.currencySymbol)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">اقتطاعات CNSS وAMO وIR:</span>
            <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
              {formatCurrency(currentRun.totalDeductions, settings.currencySymbol)}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-r border-slate-800 pt-2 sm:pt-0 sm:pr-3">
            <span className="text-[11px] text-amber-300 block font-bold">صافي الأداء للدفع (Net):</span>
            <span className="text-2xl font-black font-mono text-amber-400 mt-0.5 block">
              {formatCurrency(currentRun.totalNet, settings.currencySymbol)}
            </span>
          </div>
        </div>
      )}

      {/* Filter by Station */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
          <Filter className="w-3.5 h-3.5" /> القسم:
        </span>
        {['ALL', 'KITCHEN', 'HALL', 'BAR', 'CASHIER', 'CLEANING'].map(st => (
          <button
            key={st}
            onClick={() => setStationFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              stationFilter === st
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {st === 'ALL' ? 'كافة الموظفين' : getStationMeta(st as any).labelAr}
          </button>
        ))}
      </div>

      {/* Payroll Table */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">المأجور وCIN</th>
                <th className="p-3.5">الوظيفة والقسم</th>
                <th className="p-3.5">الأساسي (د.م)</th>
                <th className="p-3.5">ساعات إضافية</th>
                <th className="p-3.5">البقشيش</th>
                <th className="p-3.5">البدلات والأقدمية</th>
                <th className="p-3.5">الخام (Brut)</th>
                <th className="p-3.5">CNSS / AMO / IR</th>
                <th className="p-3.5 text-amber-300">الصافي (Net)</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredSlips.map(slip => {
                const stationMeta = getStationMeta(slip.station);
                return (
                  <tr key={slip.id} className="hover:bg-slate-800/50 transition-colors">
                    
                    {/* Employee & CIN */}
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{slip.employeeName}</div>
                      <div className="font-mono text-[11px] text-amber-400">
                        CIN: {slip.cin} • <span className="text-slate-400">{slip.employeeMatricule}</span>
                      </div>
                    </td>

                    {/* Role & Station */}
                    <td className="p-3.5">
                      <div className="font-medium text-slate-300">{slip.roleTitle}</div>
                      <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.2 rounded-md border ${stationMeta.bgLight}`}>
                        {stationMeta.labelAr}
                      </span>
                    </td>

                    {/* Base Salary */}
                    <td className="p-3.5 font-mono font-medium">
                      {formatCurrency(slip.baseSalary, '')}
                    </td>

                    {/* Overtime */}
                    <td className="p-3.5 font-mono text-cyan-300">
                      <div>{formatCurrency(slip.overtimeAmount, '')}</div>
                      <span className="text-[10px] text-slate-400">({slip.overtimeHours} ساعة)</span>
                    </td>

                    {/* Tips */}
                    <td className="p-3.5 font-mono text-emerald-400 font-semibold">
                      {slip.tipsShare > 0 ? formatCurrency(slip.tipsShare, '') : '-'}
                    </td>

                    {/* Allowances & Seniority */}
                    <td className="p-3.5 font-mono text-slate-300">
                      {formatCurrency(slip.mealAllowance + slip.transportAllowance + slip.seniorityBonus + slip.performanceBonus, '')}
                    </td>

                    {/* Gross Salary */}
                    <td className="p-3.5 font-mono font-bold text-slate-100">
                      {formatCurrency(slip.totalGrossSalary, '')}
                    </td>

                    {/* Total Deductions (CNSS, AMO, IR, Acomptes) */}
                    <td className="p-3.5 font-mono text-rose-400">
                      <div>-{formatCurrency(slip.totalDeductions, '')}</div>
                      <span className="text-[10px] text-slate-400">
                        (CNSS: {slip.cnssAmount} | AMO: {slip.amoAmount})
                      </span>
                    </td>

                    {/* Net To Pay */}
                    <td className="p-3.5 font-mono font-black text-amber-300 text-sm">
                      {formatCurrency(slip.netSalary, settings.currencySymbol)}
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        slip.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {slip.status === 'PAID' ? 'تم الصرف' : 'مسودة'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectSlipForPrint(slip)}
                          title="معاينة وطباعة ورقة الأداء (Bulletin de Paie)"
                          className="px-2 py-1 rounded-md text-xs font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>ورقة الأداء</span>
                        </button>

                        <button
                          onClick={() => openEditSlip(slip)}
                          title="تعديل الساعات الإضافية أو المكافأة لهذا الشهر"
                          className="px-2 py-1 rounded-md text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف قسيمة الموظف "${slip.employeeName}" من مسير هذا الشهر؟`)) {
                              onDeleteSlip && onDeleteSlip(slip.id);
                            }
                          }}
                          title="حذف القسيمة من مسير هذا الشهر"
                          className="px-2 py-1 rounded-md text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
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

      {/* Slip Adjustment Modal */}
      {editingSlip && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-1">
              تعديل مخصص لمسير: {editingSlip.employeeName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              تعديل مباشر لساعات العمل الإضافية أو المكافأة لشهر {selectedMonth} (بالدرهم)
            </p>

            <form onSubmit={handleSaveSlipEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">الساعات الإضافية (ساعة)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={editOvertimeHours}
                  onChange={(e) => setEditOvertimeHours(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">مكافأة أداء وتميز إضافية ({settings.currencySymbol})</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={editPerformanceBonus}
                  onChange={(e) => setEditPerformanceBonus(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">خصومات أو جزاءات أو كسر صحون ({settings.currencySymbol})</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={editPenalties}
                  onChange={(e) => setEditPenalties(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSlip(null)}
                  className="px-4 py-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md"
                >
                  حفظ وتحديث المسير
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
