import React, { useState } from 'react';
import { 
  Banknote, 
  Calculator, 
  CheckCircle2, 
  Printer, 
  Download, 
  Calendar, 
  Filter, 
  Check,
  Trash2
} from 'lucide-react';
import { Employee, PayrollSlip, PayrollRun, RestaurantSettings } from '../types';
import { formatCurrency, getCurrentMonth, getStationMeta } from '../utils/formatters';

interface PayrollViewProps {
  settings: RestaurantSettings;
  employees: Employee[];
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
  employees,
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
  const employeesWithoutSlips = employees.filter(employee =>
    employee.status !== 'TERMINATED' &&
    !currentSlips.some(slip => slip.employeeId === employee.id)
  );

  const filteredSlips = currentSlips.filter(slip => {
    if (stationFilter === 'ALL') return true;
    return slip.station === stationFilter;
  });
  const filteredEmployeesWithoutSlips = employeesWithoutSlips.filter(employee =>
    stationFilter === 'ALL' || employee.station === stationFilter
  );

  const exportCsv = () => {
    if (filteredSlips.length === 0) return;
    const headers = [
      'رقم التسجيل',
      'بطاقة CIN',
      'اسم الموظف',
      'POSTE',
      'الراتب الشهري (د.م)',
      'الراتب اليومي (الراتب الشهري ÷ 26)',
      'التسبيق (د.م)',
      'أيام المرض',
      'خصم المرض (د.م)',
      'أيام الغياب',
      'خصم الغياب (د.م)',
      'عدد Double Shift',
      'مبلغ Double Shift (د.م)',
      'أيام عمل الراحة',
      'مبلغ عمل الراحة (د.م)',
      'الراتب الصافي (د.م)',
      'حالة المعادلة',
    ];

    const rows = filteredSlips.map(slip => {
      const usesCurrentFormula = slip.payrollFormulaVersion === 1;
      const dailySalary = slip.baseSalary / 26;
      return [
        slip.employeeMatricule,
        slip.cin,
        slip.employeeName,
        slip.roleTitle,
        slip.baseSalary,
        usesCurrentFormula ? dailySalary : '',
        slip.advancesDeducted,
        usesCurrentFormula ? slip.sickDays ?? 0 : '',
        usesCurrentFormula ? Math.round(dailySalary * (slip.sickDays ?? 0)) : '',
        usesCurrentFormula ? slip.absentDays ?? 0 : '',
        usesCurrentFormula ? Math.round(dailySalary * (slip.absentDays ?? 0)) : '',
        usesCurrentFormula ? slip.doubleShiftCount ?? 0 : '',
        usesCurrentFormula ? Math.round(dailySalary * (slip.doubleShiftCount ?? 0)) : '',
        usesCurrentFormula ? slip.restDayWorkDays ?? 0 : '',
        usesCurrentFormula ? Math.round(dailySalary * (slip.restDayWorkDays ?? 0)) : '',
        slip.netSalary,
        usesCurrentFormula ? 'المعادلة الحالية' : 'أرشيف سابق',
      ];
    });

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
      <div>
        <h1 className="text-xl font-bold text-white">جدول الرواتب</h1>
        <p className="text-sm text-slate-400 mt-1">
          الراتب اليومي = الراتب الشهري ÷ 26. أدخل المرض والغياب والتسبيق والورديات يدويًا؛ يُحدّث الصافي تلقائيًا.
          لا تُخصم CNSS أو AMO أو IR في هذه المعادلة.
          السجلات المصروفة سابقًا محفوظة بحسابها الأصلي.
        </p>
      </div>

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
               currentRun.status === 'APPROVED' ? 'معتمد وجاهز للصرف' : 'مسودة قيد التدقيق'}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onRecalculatePayroll(selectedMonth)}
            disabled={currentRun?.status === 'PAID'}
            title="إعادة احتساب الرواتب وفق الراتب الشهري والأيام والتسبيقات"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>إعادة احتساب الرواتب</span>
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

      {/* Payroll summary */}
      {currentRun && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-gradient-to-r from-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">عدد الموظفين:</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">
              {currentRun.totalEmployees} موظف
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">إجمالي الرواتب الشهرية:</span>
            <span className="text-xl font-bold font-mono text-slate-200 mt-1 block">
              {formatCurrency(currentSlips.reduce((sum, slip) => sum + slip.baseSalary, 0), settings.currencySymbol)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Double Shift وعمل يوم الراحة:</span>
            <span className="text-xl font-bold font-mono text-cyan-300 mt-1 block">
              {formatCurrency(currentSlips.reduce((sum, slip) =>
                sum + Math.round((slip.baseSalary / 26) * ((slip.doubleShiftCount ?? 0) + (slip.restDayWorkDays ?? 0))), 0
              ), settings.currencySymbol)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">خصم المرض والغياب والتسبيق:</span>
            <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
              {formatCurrency(currentSlips.reduce((sum, slip) =>
                sum + Math.round((slip.baseSalary / 26) * ((slip.sickDays ?? 0) + (slip.absentDays ?? 0))) + slip.advancesDeducted, 0
              ), settings.currencySymbol)}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-r border-slate-800 pt-2 sm:pt-0 sm:pr-3">
            <span className="text-[11px] text-amber-300 block font-bold">إجمالي الراتب الصافي:</span>
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
        <div
          className="max-h-[70vh] overflow-auto overscroll-contain"
          tabIndex={0}
          aria-label="جدول الرواتب — استخدم أشرطة التمرير للتنقل بين الموظفين"
        >
          <table className="w-full min-w-[1100px] text-right text-xs">
            <thead className="text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 p-3.5">اسم الموظف وCIN</th>
                <th className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 p-3.5">POSTE</th>
                <th className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 p-3.5">الراتب الشهري</th>
                <th className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 p-3.5">التسبيق</th>
                <th className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 p-3.5">المرض</th>
                <th className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 p-3.5">الغياب</th>
                <th className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 p-3.5">Double Shift</th>
                <th className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 p-3.5">عمل يوم الراحة</th>
                <th className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 p-3.5 text-amber-300">الراتب الصافي</th>
                <th className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredSlips.map(slip => {
                const stationMeta = getStationMeta(slip.station);
                const usesCurrentFormula = slip.payrollFormulaVersion === 1;
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

                    {/* Monthly salary */}
                    <td className="p-3.5 font-mono font-medium">
                      {formatCurrency(slip.baseSalary, '')}
                      <span className="block text-[10px] text-slate-400">
                        {usesCurrentFormula
                          ? `اليومي: ${formatCurrency(slip.baseSalary / 26, '')}`
                          : 'أرشيف محفوظ'}
                      </span>
                    </td>

                    {/* Advance */}
                    <td className="p-3.5">
                      {usesCurrentFormula ? <input
                        aria-label={`التسبيق للموظف ${slip.employeeName}`}
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={slip.advancesDeducted}
                        disabled={slip.status === 'PAID' || currentRun?.status === 'PAID'}
                        onBlur={(event) => {
                          const amount = Number(event.currentTarget.value);
                          if (Number.isFinite(amount) && amount >= 0) {
                            onUpdateSlip(slip.id, { advancesDeducted: amount });
                          }
                        }}
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-rose-300 font-mono"
                      /> : formatCurrency(slip.advancesDeducted, '')}
                    </td>

                    {/* Sickness days */}
                    <td className="p-3.5">
                      {usesCurrentFormula ? <input
                        aria-label={`أيام المرض للموظف ${slip.employeeName}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={slip.sickDays ?? 0}
                        disabled={slip.status === 'PAID' || currentRun?.status === 'PAID'}
                        onBlur={(event) => {
                          const days = Number(event.currentTarget.value);
                          if (Number.isInteger(days) && days >= 0) onUpdateSlip(slip.id, { sickDays: days });
                        }}
                        className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-rose-300 font-mono"
                      /> : '—'}
                      {usesCurrentFormula && <span className="block text-[10px] text-slate-400">
                        -{formatCurrency(Math.round((slip.baseSalary / 26) * (slip.sickDays ?? 0)), '')}
                      </span>}
                    </td>

                    {/* Absence days */}
                    <td className="p-3.5">
                      {usesCurrentFormula ? <input
                        aria-label={`أيام الغياب للموظف ${slip.employeeName}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={slip.absentDays ?? 0}
                        disabled={slip.status === 'PAID' || currentRun?.status === 'PAID'}
                        onBlur={(event) => {
                          const days = Number(event.currentTarget.value);
                          if (Number.isInteger(days) && days >= 0) onUpdateSlip(slip.id, { absentDays: days });
                        }}
                        className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-rose-300 font-mono"
                      /> : '—'}
                      {usesCurrentFormula && <span className="block text-[10px] text-slate-400">
                        -{formatCurrency(Math.round((slip.baseSalary / 26) * (slip.absentDays ?? 0)), '')}
                      </span>}
                    </td>

                    {/* Double shifts */}
                    <td className="p-3.5">
                      {usesCurrentFormula ? <input
                        aria-label={`عدد Double Shift للموظف ${slip.employeeName}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={slip.doubleShiftCount ?? 0}
                        disabled={slip.status === 'PAID' || currentRun?.status === 'PAID'}
                        onBlur={(event) => {
                          const count = Number(event.currentTarget.value);
                          if (Number.isInteger(count) && count >= 0) onUpdateSlip(slip.id, { doubleShiftCount: count });
                        }}
                        className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-cyan-300 font-mono"
                      /> : '—'}
                      {usesCurrentFormula && <span className="block text-[10px] text-slate-400">
                        +{formatCurrency(Math.round((slip.baseSalary / 26) * (slip.doubleShiftCount ?? 0)), '')}
                      </span>}
                    </td>

                    {/* Rest day work */}
                    <td className="p-3.5">
                      {usesCurrentFormula ? <input
                        aria-label={`أيام عمل الراحة للموظف ${slip.employeeName}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={slip.restDayWorkDays ?? 0}
                        disabled={slip.status === 'PAID' || currentRun?.status === 'PAID'}
                        onBlur={(event) => {
                          const days = Number(event.currentTarget.value);
                          if (Number.isInteger(days) && days >= 0) onUpdateSlip(slip.id, { restDayWorkDays: days });
                        }}
                        className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-cyan-300 font-mono"
                      /> : '—'}
                      {usesCurrentFormula && <span className="block text-[10px] text-slate-400">
                        +{formatCurrency(Math.round((slip.baseSalary / 26) * (slip.restDayWorkDays ?? 0)), '')}
                      </span>}
                    </td>

                    {/* Net salary */}
                    <td className="p-3.5 font-mono font-black text-amber-300 text-sm">
                      {formatCurrency(slip.netSalary, settings.currencySymbol)}
                      <span className={`block text-[10px] font-bold ${
                        !usesCurrentFormula ? 'text-slate-400' :
                        slip.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {!usesCurrentFormula
                          ? 'أرشيف بالحساب السابق'
                          : slip.status === 'PAID' ? 'تم الصرف' : 'مسودة'}
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
              {filteredEmployeesWithoutSlips.map(employee => {
                const stationMeta = getStationMeta(employee.station);
                return (
                  <tr key={`employee-${employee.id}`} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{employee.fullName}</div>
                      <div className="font-mono text-[11px] text-amber-400">
                        CIN: {employee.cin} • <span className="text-slate-400">{employee.matricule}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-300">{employee.roleTitle}</div>
                      <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.2 rounded-md border ${stationMeta.bgLight}`}>
                        {stationMeta.labelAr}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-medium">
                      {formatCurrency(employee.baseSalary, '')}
                      <span className="block text-[10px] text-slate-400">
                        اليومي: {formatCurrency(employee.baseSalary / 26, '')}
                      </span>
                    </td>
                    <td colSpan={6} className="p-3.5 text-center text-slate-500">
                      احتسب رواتب الشهر لإدخال الحالات
                    </td>
                    <td className="p-3.5 text-center">
                      {currentRun?.status !== 'PAID' ? (
                        <button
                          onClick={() => onRecalculatePayroll(selectedMonth)}
                          className="px-2 py-1 rounded-md text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all"
                        >
                          احتساب الراتب
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500">الشهر مصروف</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
