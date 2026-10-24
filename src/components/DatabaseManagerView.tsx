import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  HardDrive, 
  Table, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Layers,
  Sparkles,
  Server
} from 'lucide-react';
import { DatabaseState, databest } from '../services/database';

interface DatabaseManagerViewProps {
  dbState: DatabaseState;
  onRefresh: () => void;
}

export const DatabaseManagerView: React.FC<DatabaseManagerViewProps> = ({
  dbState,
  onRefresh,
}) => {
  const [selectedTable, setSelectedTable] = useState<string>('employees');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Table summary counts
  const tables = [
    { id: 'employees', name: 'موظفو المطعم والعقود (employees)', count: dbState.employees.length, data: dbState.employees },
    { id: 'attendance', name: 'سجل الحضور والشفتات (attendance)', count: dbState.attendance.length, data: dbState.attendance },
    { id: 'advances', name: 'سلفيات الرواتب (advances)', count: dbState.advances.length, data: dbState.advances },
    { id: 'adjustments', name: 'المكافآت والخصومات (adjustments)', count: dbState.adjustments.length, data: dbState.adjustments },
    { id: 'tipsPools', name: 'صندوق البقشيش (tipsPools)', count: dbState.tipsPools.length, data: dbState.tipsPools },
    { id: 'payrollSlips', name: 'قسائم الرواتب (payrollSlips)', count: dbState.payrollSlips.length, data: dbState.payrollSlips },
    { id: 'payrollRuns', name: 'مسيرات الرواتب الشهرية (payrollRuns)', count: dbState.payrollRuns.length, data: dbState.payrollRuns },
    { id: 'settings', name: 'إعدادات المطعم (settings)', count: 1, data: dbState.settings },
  ];

  const currentTableData = tables.find(t => t.id === selectedTable)?.data;

  // Handle Export Backup
  const handleExportBackup = () => {
    const jsonStr = databest.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OBAYOLI_DATABEST_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle File Import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = databest.importBackupJson(content);
      setImportStatus(res);
      if (res.success) {
        onRefresh();
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Reset to Default Seed
  const handleResetToSeed = () => {
    if (confirm('هل أنت متأكد من رغبتك في إعادة تعيين قاعدة بيانات DATABEST إلى البيانات النموذجية الأصلية؟ ستفقد أي تعديلات غير محفوظة خارج النسخ الاحتياطية.')) {
      databest.resetToDefaultSeed();
      onRefresh();
      setImportStatus({ success: true, message: 'تم إعادة تهيئة قاعدة البيانات بنجاح إلى النموذج الافتراضي' });
    }
  };

  // Calculate approximate storage size
  const jsonString = JSON.stringify(dbState);
  const sizeKb = (new Blob([jsonString]).size / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* DATABEST Engine Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
              <Server className="w-3.5 h-3.5" />
              قاعدة بيانات OBAYOLI • DATABEST ENGINE V1.0
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              محرك قاعدة البيانات المتكاملة (DATABEST)
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              تخزين محلي فوري ومستمر مع دعم النسخ الاحتياطي الكامل (Backup & Restore)، وعلاقات متكاملة بين الموظفين، ساعات العمل، البقشيش، ومسير الرواتب.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تصدير نسخة احتياطية (JSON)</span>
            </button>

            <label className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>استيراد نسخة احتياطية</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetToSeed}
              title="إعادة تعيين البيانات النموذجية للمطعم"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Import Status Alert */}
      {importStatus && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
          importStatus.success
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            : 'bg-rose-950/40 border-rose-800 text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {importStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
            <span className="font-bold">{importStatus.message}</span>
          </div>
          <button onClick={() => setImportStatus(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Database Vitals Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 block">حالة قاعدة البيانات:</span>
          <span className="text-lg font-bold text-emerald-400 flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            DATABEST نشطة ومحفوظة
          </span>
        </div>

        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 block">حجم التخزين التقديري:</span>
          <span className="text-lg font-mono font-bold text-white mt-1 block">
            {sizeKb} KB
          </span>
        </div>

        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 block">إجمالي الجداول النشطة:</span>
          <span className="text-lg font-mono font-bold text-amber-400 mt-1 block">
            8 جداول
          </span>
        </div>

        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 block">آخر تحديث ومزامنة:</span>
          <span className="text-xs font-mono text-slate-300 mt-1 block truncate" dir="ltr">
            {dbState.lastUpdated ? new Date(dbState.lastUpdated).toLocaleTimeString() : 'الآن'}
          </span>
        </div>
      </div>

      {/* Table Explorer & Raw Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Table Selector Sidebar */}
        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            جداول قاعدة البيانات (Tables)
          </h3>
          {tables.map(tbl => (
            <button
              key={tbl.id}
              onClick={() => setSelectedTable(tbl.id)}
              className={`w-full text-right p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                selectedTable === tbl.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-slate-400" />
                <span className="truncate">{tbl.name}</span>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                {tbl.count}
              </span>
            </button>
          ))}
        </div>

        {/* Data Inspector Preview */}
        <div className="lg:col-span-3 bg-slate-850 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white font-mono">
                  جدول: {selectedTable}
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {Array.isArray(currentTableData) ? `${currentTableData.length} سجلات` : 'سجل وحيد'}
              </span>
            </div>

            {/* Code / JSON Viewer */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 max-h-[460px] overflow-auto">
              <pre className="text-[11px] font-mono text-emerald-300/90 leading-relaxed text-left" dir="ltr">
                {JSON.stringify(currentTableData, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>محرك DATABEST يضمن حفظ التغييرات محلياً تلقائياً بدون فقدان للبيانات</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(currentTableData, null, 2));
                alert('تم نسخ بيانات الجدول بصيغة JSON إلى الحافظة');
              }}
              className="text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
            >
              نسخ بيانات الجدول JSON
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
