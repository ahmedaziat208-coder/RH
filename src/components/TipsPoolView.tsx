import React, { useState } from 'react';
import { 
  PiggyBank, 
  PlusCircle, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Sparkles, 
  Trash2, 
  X,
  Coins,
  Edit3
} from 'lucide-react';
import { databest } from '../services/database';
import { Employee, TipsPoolRecord, RestaurantSettings } from '../types';
import { formatCurrency, getCurrentMonth, getMonthDateRange, getStationMeta } from '../utils/formatters';

interface TipsPoolViewProps {
  settings: RestaurantSettings;
  employees: Employee[];
  tipsPools: TipsPoolRecord[];
  paidPayrollMonths: string[];
  onAddTipsPool: (pool: Omit<TipsPoolRecord, 'id'>) => void;
  onDeleteTipsPool: (id: string) => void;
  onRefreshPayroll: (month: string) => void;
}

export const TipsPoolView: React.FC<TipsPoolViewProps> = ({
  settings,
  employees,
  tipsPools,
  paidPayrollMonths,
  onAddTipsPool,
  onDeleteTipsPool,
  onRefreshPayroll,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('صندوق البقشيش');
  const [month, setMonth] = useState(getCurrentMonth());
  const [startDate, setStartDate] = useState(getMonthDateRange(getCurrentMonth()).startDate);
  const [endDate, setEndDate] = useState(getMonthDateRange(getCurrentMonth()).endDate);
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [distributionMethod, setDistributionMethod] = useState<'EQUAL' | 'ROLE_WEIGHTED'>('ROLE_WEIGHTED');

  const activeEmployees = employees.filter(e => e.status === 'ACTIVE');

  // Compute shares preview
  const calculateShares = () => {
    if (activeEmployees.length === 0 || totalCollected <= 0) return [];

    if (distributionMethod === 'EQUAL') {
      const shareAmount = Math.floor(totalCollected / activeEmployees.length);
      const remainder = totalCollected - shareAmount * activeEmployees.length;
      return activeEmployees.map((emp, index) => ({
        employeeId: emp.id,
        employeeName: emp.fullName,
        role: emp.roleTitle,
        amount: shareAmount + (index < remainder ? 1 : 0),
      }));
    } else {
      // Role Weighted: Waiters & Captains get higher tip weight in restaurant culture,
      // kitchen & bar get kitchen share, cleaning gets support share
      const getWeight = (emp: Employee) => {
        if (emp.station === 'HALL') return 1.5;
        if (emp.station === 'BAR') return 1.3;
        if (emp.station === 'KITCHEN') return 1.1;
        if (emp.station === 'CASHIER') return 0.9;
        return 0.8;
      };

      const totalWeight = activeEmployees.reduce((sum, emp) => sum + getWeight(emp), 0);
      const shares = activeEmployees.map(emp => {
        const weight = getWeight(emp);
        const exactAmount = (weight / totalWeight) * totalCollected;
        return {
          employeeId: emp.id,
          employeeName: emp.fullName,
          role: emp.roleTitle,
          amount: Math.floor(exactAmount),
          remainder: exactAmount % 1,
        };
      });
      let remaining = totalCollected - shares.reduce((sum, share) => sum + share.amount, 0);
      const remainderOrder = [...shares].sort((a, b) => b.remainder - a.remainder);
      for (const share of remainderOrder) {
        if (remaining <= 0) break;
        share.amount += 1;
        remaining -= 1;
      }
      const amountByEmployee = new Map(shares.map(share => [share.employeeId, share.amount]));
      return shares.map(({ remainder: _remainder, ...share }) => ({
        ...share,
        amount: amountByEmployee.get(share.employeeId) || 0,
      }));
    }
  };

  const previewShares = calculateShares();

  const handleCreateTipsPool = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalCollected <= 0 || previewShares.length === 0) return;
    if (paidPayrollMonths.includes(month)) {
      window.alert('لا يمكن ترحيل البقشيش إلى مسير تم صرفه. اختر شهرًا غير مسدد.');
      return;
    }

    onAddTipsPool({
      title,
      month,
      startDate,
      endDate,
      totalCollected: Number(totalCollected),
      distributionMethod,
      shares: previewShares,
      isAppliedToPayroll: true,
      notes: `تم توزيع إجمالي ${totalCollected} ${settings.currencySymbol} على ${previewShares.length} موظف`,
    });

    setIsModalOpen(false);
    onRefreshPayroll(month);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-850 to-slate-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
            <PiggyBank className="w-3.5 h-3.5" />
            نظام إدارة وتوزيع البقشيش المشترك (Pourboires Pool)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            صندوق بقشيش زبائن المطعم
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            ميزة خاصة بالمطاعم: تجميع إكراميات الزبائن الأسبوعية أو الشهرية وتوزيعها بعدالة على طاقم الخدمة والمطبخ والبار، مع ترحيل الحصص تلقائياً إلى قسيمة الراتب.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>توزيع بقشيش جديد</span>
        </button>
      </div>

      {/* Existing Tips Records */}
      <div className="space-y-4">
        {tipsPools.map(pool => (
          <div key={pool.id} className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  {pool.title}
                </h3>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  الفترة: {pool.startDate} إلى {pool.endDate} • شهر المسير: <span className="font-mono text-amber-300 font-bold">{pool.month}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-left">
                  <span className="text-[11px] text-slate-400 block">إجمالي المبلغ الموزع:</span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    {formatCurrency(pool.totalCollected, settings.currencySymbol)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newTitle = prompt('تعديل عنوان توزيع البقشيش:', pool.title);
                      if (newTitle && newTitle.trim()) {
                        databest.updateTipsPool(pool.id, { title: newTitle.trim() });
                      }
                    }}
                    title="تعديل عنوان التوزيع"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف هذا التوزيع "${pool.title}"؟`)) {
                        onDeleteTipsPool(pool.id);
                      }
                    }}
                    title="حذف هذا التوزيع"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Individual Employee Shares Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {pool.shares.map(share => (
                <div key={share.employeeId} className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 text-xs">
                  <span className="font-bold text-slate-200 block truncate">{share.employeeName}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{share.role}</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs mt-1 block">
                    +{formatCurrency(share.amount, settings.currencySymbol)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
              <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تم ترحيل مبالغ البقشيش تلقائياً إلى قسيمة راتب شهر {pool.month}
              </span>
              <span>طريقة التوزيع: {pool.distributionMethod === 'ROLE_WEIGHTED' ? 'حسب نقاط الأقسام' : 'بالتساوي'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Tips Pool Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-emerald-400" />
                توزيع بقشيش جديد على الموظفين
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTipsPool} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">عنوان التوزيع</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المبلغ الإجمالي المحصل ({settings.currencySymbol}) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={totalCollected}
                    onChange={(e) => setTotalCollected(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">شهر الترحيل للمسير *</label>
                  <input
                    type="month"
                    required
                    value={month}
                    onChange={(e) => {
                      const value = e.target.value;
                      setMonth(value);
                      if (value) {
                        const range = getMonthDateRange(value);
                        setStartDate(range.startDate);
                        setEndDate(range.endDate);
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">من تاريخ</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">إلى تاريخ</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">طريقة التوزيع</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDistributionMethod('ROLE_WEIGHTED')}
                    className={`p-2.5 rounded-xl border text-right transition-colors ${
                      distributionMethod === 'ROLE_WEIGHTED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span className="font-bold block">حسب نقاط الأقسام (موصى به)</span>
                    <span className="text-[10px] text-slate-400">وزن أعلى للصالة والبار ثم المطبخ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDistributionMethod('EQUAL')}
                    className={`p-2.5 rounded-xl border text-right transition-colors ${
                      distributionMethod === 'EQUAL'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span className="font-bold block">بالتساوي الكامل</span>
                    <span className="text-[10px] text-slate-400">تقسيم المبلغ بالتساوي على الجميع</span>
                  </button>
                </div>
              </div>

              {/* Shares Preview */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">معاينة حصة كل موظف ({previewShares.length} موظف):</label>
                <div className="max-h-40 overflow-y-auto bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  {previewShares.map(s => (
                    <div key={s.employeeId} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-900">
                      <span className="text-slate-300">{s.employeeName} ({s.role})</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {formatCurrency(s.amount, settings.currencySymbol)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md"
                >
                  تأكيد وترحيل إلى المسير
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
