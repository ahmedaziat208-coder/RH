import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Coffee, 
  Save, 
  Calendar,
  Sparkles,
  UserCheck,
  Trash2,
  Edit3
} from 'lucide-react';
import { Employee, AttendanceRecord, AttendanceStatus } from '../types';
import { getStationMeta } from '../utils/formatters';
import { getCurrentDateString } from '../utils/formatters';

interface AttendanceViewProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  onRecordAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  onDeleteAttendance?: (id: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  employees,
  attendance,
  onRecordAttendance,
  onDeleteAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDateString());
  const [activeStation, setActiveStation] = useState<string>('ALL');

  // Filter records for the selected date
  const dateRecords = attendance.filter(a => a.date === selectedDate);

  const getRecordForEmployee = (employeeId: string): AttendanceRecord | undefined => {
    return dateRecords.find(a => a.employeeId === employeeId);
  };

  const handleStatusChange = (
    emp: Employee,
    newStatus: AttendanceStatus,
    existingRecord?: AttendanceRecord
  ) => {
    const checkIn = existingRecord ? existingRecord.checkIn : '10:00';
    const checkOut = existingRecord ? existingRecord.checkOut : '20:00';
    const regHours = newStatus === 'ABSENT' ? 0 : 8;
    const overHours = existingRecord ? existingRecord.overtimeHours : 0;

    onRecordAttendance({
      employeeId: emp.id,
      date: selectedDate,
      checkIn,
      checkOut,
      regularHours: regHours,
      overtimeHours: overHours,
      status: newStatus,
      notes: existingRecord?.notes || '',
    });
  };

  const handleTimeChange = (
    emp: Employee,
    field: 'checkIn' | 'checkOut' | 'overtimeHours',
    val: string | number,
    existingRecord?: AttendanceRecord
  ) => {
    const checkIn = field === 'checkIn' ? (val as string) : existingRecord?.checkIn || '10:00';
    const checkOut = field === 'checkOut' ? (val as string) : existingRecord?.checkOut || '20:00';
    const overtimeHours = field === 'overtimeHours' ? Number(val) : existingRecord?.overtimeHours || 0;
    const status = existingRecord?.status || 'PRESENT';

    onRecordAttendance({
      employeeId: emp.id,
      date: selectedDate,
      checkIn,
      checkOut,
      regularHours: 8,
      overtimeHours,
      status,
      notes: existingRecord?.notes || '',
    });
  };

  const handleMarkAllPresent = () => {
    employees
      .filter(e => e.status === 'ACTIVE')
      .forEach(emp => {
        onRecordAttendance({
          employeeId: emp.id,
          date: selectedDate,
          checkIn: '10:00',
          checkOut: '20:00',
          regularHours: 8,
          overtimeHours: 0,
          status: 'PRESENT',
          notes: 'تسجيل تلقائي لشفت العمل الكامل',
        });
      });
  };

  const filteredEmployees = employees.filter(emp => {
    if (emp.status === 'TERMINATED') return false;
    if (activeStation === 'ALL') return true;
    return emp.station === activeStation;
  });

  const presentCount = dateRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
  const totalOvertimeForDate = dateRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">تاريخ اليوم:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span>الحضور المسجل:</span>
            <span className="font-bold text-emerald-400 font-mono">{presentCount} من {employees.length}</span>
            <span>• إضافي:</span>
            <span className="font-bold text-cyan-400 font-mono">{totalOvertimeForDate} س</span>
          </div>
        </div>

        {/* Quick Mark All */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllPresent}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>تسجيل حضور الجميع (حاضر)</span>
          </button>
        </div>

      </div>

      {/* Station Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['ALL', 'KITCHEN', 'HALL', 'BAR', 'CASHIER', 'CLEANING'].map(st => (
          <button
            key={st}
            onClick={() => setActiveStation(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeStation === st
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {st === 'ALL' ? 'جميع الموظفين' : getStationMeta(st as any).labelAr}
          </button>
        ))}
      </div>

      {/* Attendance Register List */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">موظف المطعم</th>
                <th className="p-3.5">القسم والمحطة</th>
                <th className="p-3.5">حالة الحضور اليوم</th>
                <th className="p-3.5">وقت الدخول</th>
                <th className="p-3.5">وقت الخروج</th>
                <th className="p-3.5">ساعات إضافية (Overtime)</th>
                <th className="p-3.5">ملاحظات الشفت</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredEmployees.map(emp => {
                const record = getRecordForEmployee(emp.id);
                const currentStatus = record?.status || 'PRESENT';
                const stationMeta = getStationMeta(emp.station);

                return (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Employee */}
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{emp.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{emp.matricule} • {emp.roleTitle}</div>
                    </td>

                    {/* Station */}
                    <td className="p-3.5">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-md border ${stationMeta.bgLight}`}>
                        {stationMeta.labelAr}
                      </span>
                    </td>

                    {/* Status Pill Toggle */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStatusChange(emp, 'PRESENT', record)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          حاضر
                        </button>

                        <button
                          onClick={() => handleStatusChange(emp, 'LATE', record)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            currentStatus === 'LATE'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          تأخر
                        </button>

                        <button
                          onClick={() => handleStatusChange(emp, 'ABSENT', record)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            currentStatus === 'ABSENT'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          غائب
                        </button>
                      </div>
                    </td>

                    {/* Check In */}
                    <td className="p-3.5">
                      <input
                        type="time"
                        value={record?.checkIn || '10:00'}
                        onChange={(e) => handleTimeChange(emp, 'checkIn', e.target.value, record)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono focus:border-amber-500"
                      />
                    </td>

                    {/* Check Out */}
                    <td className="p-3.5">
                      <input
                        type="time"
                        value={record?.checkOut || '20:00'}
                        onChange={(e) => handleTimeChange(emp, 'checkOut', e.target.value, record)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono focus:border-amber-500"
                      />
                    </td>

                    {/* Overtime */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          value={record?.overtimeHours ?? 0}
                          onChange={(e) => handleTimeChange(emp, 'overtimeHours', e.target.value, record)}
                          className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-cyan-300 font-bold text-xs font-mono focus:border-cyan-500"
                        />
                        <span className="text-[11px] text-slate-400">ساعة</span>
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="p-3.5">
                      <input
                        type="text"
                        placeholder="شفت صباحي / مسائي / ملاحظة..."
                        value={record?.notes || ''}
                        onChange={(e) => {
                          onRecordAttendance({
                            employeeId: emp.id,
                            date: selectedDate,
                            checkIn: record?.checkIn || '10:00',
                            checkOut: record?.checkOut || '20:00',
                            regularHours: 8,
                            overtimeHours: record?.overtimeHours || 0,
                            status: currentStatus,
                            notes: e.target.value,
                          });
                        }}
                        className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-2.5 py-1 text-slate-300 text-xs placeholder-slate-600 focus:border-amber-500"
                      />
                    </td>

                    {/* Actions: Edit / Delete */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            const newHours = prompt(`تعديل ساعات العمل الإضافية للموظف ${emp.fullName}:`, String(record?.overtimeHours ?? 0));
                            if (newHours !== null && !isNaN(Number(newHours))) {
                              handleTimeChange(emp, 'overtimeHours', Number(newHours), record);
                            }
                          }}
                          title="تعديل ساعات الشفت أو الساعات الإضافية"
                          className="px-2 py-1 rounded-md text-[11px] font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>تعديل</span>
                        </button>

                        {record && (
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف تسجيل حضور اليوم للموظف "${emp.fullName}"؟`)) {
                                onDeleteAttendance && onDeleteAttendance(record.id);
                              }
                            }}
                            title="حذف تسجيل حضور هذا اليوم"
                            className="px-2 py-1 rounded-md text-[11px] font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>حذف</span>
                          </button>
                        )}
                      </div>
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
