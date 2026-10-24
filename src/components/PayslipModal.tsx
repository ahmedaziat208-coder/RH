import React from 'react';
import { 
  X, 
  Printer, 
  Utensils, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { PayrollSlip, RestaurantSettings } from '../types';
import { formatCurrency, getStationMeta, getContractLabel, amountToArabicWords, getCurrentDateString } from '../utils/formatters';

interface PayslipModalProps {
  slip: PayrollSlip | null;
  settings: RestaurantSettings;
  onClose: () => void;
  onStatusChange?: (id: string, status: PayrollSlip['status']) => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  slip,
  settings,
  onClose,
  onStatusChange,
}) => {
  if (!slip) return null;

  const stationMeta = getStationMeta(slip.station);
  const contractMeta = getContractLabel(slip.contractType);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                ورقة الأداء الرسمية • Bulletin de Paie (المغرب - MAD)
              </h3>
              <p className="text-xs text-slate-400">
                الموظف: {slip.employeeName} ({slip.employeeMatricule}) • بطاقة وطنية CIN: {slip.cin} • شهر {slip.month}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {slip.status === 'PAID' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تم الصرف والتحويل
              </span>
            ) : (
              <button
                onClick={() => onStatusChange && onStatusChange(slip.id, 'PAID')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                تأكيد الصرف
              </button>
            )}

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة ورقة الأداء (A4)</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-6 sm:p-10 bg-white text-slate-900 print-container" id="printable-payslip">
          
          {/* Header of the Moroccan Restaurant Slip */}
          <div className="border-b-2 border-slate-900 pb-5 mb-5">
            <div className="flex items-start justify-between">
              
              {/* Restaurant Brand & Moroccan Legal Info */}
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-950 font-sans">
                      OBAYOLI RESTAURANT MAROC
                    </h2>
                    <p className="text-xs font-bold text-slate-700">
                      {settings.restaurantName} • {settings.country}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  {settings.address} • {settings.city}
                </p>
                {/* Moroccan Legal numbers grid */}
                <div className="text-[11px] text-slate-600 font-mono mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                  <span><strong>ICE:</strong> {settings.iceNumber}</span>
                  <span>•</span>
                  <span><strong>RC:</strong> {settings.commercialRegister}</span>
                  <span>•</span>
                  <span><strong>IF:</strong> {settings.taxId}</span>
                  <span>•</span>
                  <span><strong>Patente:</strong> {settings.patenteNumber}</span>
                  <span>•</span>
                  <span><strong>N° CNSS:</strong> {settings.cnssAffiliation}</span>
                </div>
              </div>

              {/* Document Title & Period */}
              <div className="text-left shrink-0">
                <div className="inline-block bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-sm font-bold tracking-wide">
                  ورقة الأداء • BULLETIN DE PAIE
                </div>
                <div className="mt-2 text-xs font-semibold text-slate-800">
                  فترة الأداء: <span className="font-mono text-amber-700 font-bold">{slip.month}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  العملة: <span className="font-bold text-slate-900">الدرهم المغربي (MAD / د.م)</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  تاريخ الإصدار: {getCurrentDateString()}
                </div>
              </div>

            </div>
          </div>

          {/* Employee & Station Information Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-300 rounded-xl p-4 mb-5 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">اسم ولقب المأجور (Salarié):</span>
              <span className="font-bold text-slate-900 text-sm">{slip.employeeName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">بطاقة التعريف الوطنية (CIN):</span>
              <span className="font-mono font-bold text-slate-900">{slip.cin}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">رقم التسجيل CNSS (المأجور):</span>
              <span className="font-mono font-bold text-slate-800">{slip.cnssNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">رقم التسجيل الداخلي (Matricule):</span>
              <span className="font-mono font-bold text-slate-800">{slip.employeeMatricule}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">المهمة / الوظيفة (Poste):</span>
              <span className="font-semibold text-slate-800">{slip.roleTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">قسم المطعم (Département):</span>
              <span className="font-bold text-amber-700">{stationMeta.labelAr} ({stationMeta.labelFr})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">نوع العقد (Contrat):</span>
              <span className="font-semibold text-slate-800">{contractMeta.ar}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">المدة القانونية للشهر:</span>
              <span className="font-medium text-slate-800">{slip.daysWorked} يوم / {slip.workedHours} ساعة</span>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            
            {/* Earnings Table (المستحقات - Gains) */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800">عناصر الأجر الخام (Gains Brut)</span>
                <span className="text-[11px] text-slate-500">المبلغ ({settings.currencySymbol})</span>
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">الراتب الأساسي (Salaire de Base)</td>
                    <td className="p-2 font-bold font-mono text-left">{formatCurrency(slip.baseSalary, '')}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">
                      ساعات إضافية ({slip.overtimeHours} س @ {slip.overtimeRate} {settings.currencySymbol})
                    </td>
                    <td className="p-2 font-mono text-emerald-700 font-bold text-left">{formatCurrency(slip.overtimeAmount, '')}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">حصة البقشيش المشترك (Pourboires)</td>
                    <td className="p-2 font-mono text-amber-700 font-bold text-left">{formatCurrency(slip.tipsShare, '')}</td>
                  </tr>
                  {slip.seniorityBonus > 0 && (
                    <tr className="hover:bg-slate-50 bg-amber-50/40">
                      <td className="p-2 text-amber-900 font-semibold">علاوة الأقدمية (Prime d'ancienneté)</td>
                      <td className="p-2 font-mono text-amber-800 font-bold text-left">{formatCurrency(slip.seniorityBonus, '')}</td>
                    </tr>
                  )}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">منحة القفة والوجبة (Indemnité de Panier)</td>
                    <td className="p-2 font-mono text-slate-800 text-left">{formatCurrency(slip.mealAllowance, '')}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">تعويض النقل (Indemnité de Transport)</td>
                    <td className="p-2 font-mono text-slate-800 text-left">{formatCurrency(slip.transportAllowance, '')}</td>
                  </tr>
                  {slip.performanceBonus > 0 && (
                    <tr className="hover:bg-slate-50 bg-emerald-50/40">
                      <td className="p-2 text-emerald-900 font-semibold">مكافأة المردودية والخدمة (Prime)</td>
                      <td className="p-2 font-mono text-emerald-800 font-bold text-left">{formatCurrency(slip.performanceBonus, '')}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100/90 border-t-2 border-slate-300 font-bold">
                    <td className="p-2.5 text-slate-900">إجمالي الأجر الخام (Salaire Brut Global)</td>
                    <td className="p-2.5 font-mono text-left text-sm text-slate-950">
                      {formatCurrency(slip.totalGrossSalary, settings.currencySymbol)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Deductions Table (الاستقطاعات القانونية - Retenues Maroc) */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800">الاقتطاعات القانونية (Retenues)</span>
                <span className="text-[11px] text-slate-500">المبلغ ({settings.currencySymbol})</span>
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">
                      اشتراك الضمان الاجتماعي CNSS ({slip.cnssRate}% سقف 6000 د.م)
                    </td>
                    <td className="p-2 font-mono text-rose-700 text-left font-semibold">{formatCurrency(slip.cnssAmount, '')}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">
                      التأمين الإجباري عن المرض AMO ({slip.amoRate}%)
                    </td>
                    <td className="p-2 font-mono text-rose-700 text-left font-semibold">{formatCurrency(slip.amoAmount, '')}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">الضريبة على الدخل (IR - Impôt sur le Revenu)</td>
                    <td className="p-2 font-mono text-rose-700 text-left font-semibold">{formatCurrency(slip.irAmount, '')}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">تسبيق على الراتب (Acompte sur salaire)</td>
                    <td className="p-2 font-mono text-rose-700 text-left font-bold">{formatCurrency(slip.advancesDeducted, '')}</td>
                  </tr>
                  {slip.penaltiesDeducted > 0 && (
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 text-slate-700">خصم كسر أواني أو تأخير (Sanctions)</td>
                      <td className="p-2 font-mono text-rose-700 text-left font-bold">{formatCurrency(slip.penaltiesDeducted, '')}</td>
                    </tr>
                  )}
                  {/* Decorative placeholder */}
                  <tr>
                    <td className="p-2 text-slate-400 italic">لا توجد اقتطاعات أخرى</td>
                    <td className="p-2 font-mono text-slate-400 text-left">-</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100/90 border-t-2 border-slate-300 font-bold">
                    <td className="p-2.5 text-slate-900">مجموع الاقتطاعات (Total des Retenues)</td>
                    <td className="p-2.5 font-mono text-left text-sm text-rose-800">
                      {formatCurrency(slip.totalDeductions, settings.currencySymbol)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

          </div>

          {/* Net To Pay Banner (الصافي للدفع بالدرهم المغربي) */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
              <div>
                <span className="text-xs font-bold text-amber-900 tracking-wider uppercase block">
                  صافي الأجر المستحق للدفع • NET À PAYER (بالدرهم المغربي)
                </span>
                <p className="text-xs text-slate-700 mt-1">
                  المبلغ بالحروف: <span className="font-bold text-slate-950">{amountToArabicWords(slip.netSalary, 'درهم مغربي')}</span>
                </p>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-800 tracking-tight">
                {formatCurrency(slip.netSalary, settings.currencySymbol)}
              </div>
            </div>
          </div>

          {/* Signatures & Stamp Section */}
          <div className="grid grid-cols-2 gap-8 pt-3 border-t border-slate-300 text-xs">
            <div className="text-center p-3 border border-dashed border-slate-300 rounded-xl h-28 flex flex-col justify-between">
              <span className="font-bold text-slate-800">خاتم وتوقيع إدارة الموارد البشرية RH</span>
              <span className="text-[11px] text-slate-500 font-mono italic">
                {settings.rhManager} • {settings.restaurantName} (المغرب)
              </span>
            </div>

            <div className="text-center p-3 border border-dashed border-slate-300 rounded-xl h-28 flex flex-col justify-between">
              <span className="font-bold text-slate-800">توقيع وإمضاء المأجور (Émargement du salarié)</span>
              <span className="text-[11px] text-slate-500 italic">
                "قرأت ووافقت على البيانات واستلمت مستحقاتي كاملة بالدرهم"
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-5 text-center text-[10px] text-slate-400 border-t border-slate-200 pt-2.5">
            {settings.stampNote} • صادر عن نظام OBAYOLI RH Maroc & DATABEST • {new Date().toLocaleDateString('ar-MA')}
          </div>

        </div>

      </div>

    </div>
  );
};
