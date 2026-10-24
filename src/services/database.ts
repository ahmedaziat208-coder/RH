import {
  Employee,
  AttendanceRecord,
  OfficialHoliday,
  AdvanceRecord,
  BonusPenaltyRecord,
  TipsPoolRecord,
  PayrollSlip,
  PayrollRun,
  RestaurantSettings,
} from '../types';
import { getCurrentDateString } from '../utils/formatters';

export interface DatabaseState {
  version: number;
  lastUpdated: string;
  settings: RestaurantSettings;
  employees: Employee[];
  attendance: AttendanceRecord[];
  officialHolidays: OfficialHoliday[];
  advances: AdvanceRecord[];
  adjustments: BonusPenaltyRecord[];
  tipsPools: TipsPoolRecord[];
  payrollRuns: PayrollRun[];
  payrollSlips: PayrollSlip[];
}

const STORAGE_KEY = 'OBAYOLI_DATABEST_MOROCCO_V1';

const DEFAULT_SETTINGS_MOROCCO: RestaurantSettings = {
  restaurantName: 'مطعم أوبايولي فاين داينينغ (OBAYOLI)',
  restaurantSubtitle: 'OBAYOLI Restaurant & Lounge - RH & Paie Maroc',
  country: 'المملكة المغربية',
  city: 'الدار البيضاء (Casablanca)',
  iceNumber: '002849201000045', // المعرف الموحد للمقاولة ICE
  commercialRegister: 'RC Casablanca N° 489201',
  taxId: 'IF-39482012',
  patenteNumber: '2849102',
  cnssAffiliation: 'CNSS N° 8492014',
  address: 'شارع كورنيش عين الذئاب، أنفا، الدار البيضاء',
  phone: '+212 522 36 40 80',
  email: 'rh@obayoli-maroc.ma',
  currency: 'MAD',
  currencySymbol: 'د.م',
  defaultOvertimeRate: 1.25, // 25% إضافية نهاراً / 50% ليلاً وفق مدونة الشغل المغربية
  defaultCnssRate: 4.48,     // نسبة CNSS للموظف (سقف 6000 درهم)
  defaultAmoRate: 2.26,      // التأمين الإجباري عن المرض AMO
  defaultMealAllowance: 500, // منحة القفة والوجبة (Indemnité de Panier)
  defaultTransportAllowance: 400, // تعويض النقل (Indemnité de Transport)
  restaurantManager: 'هشام بنسودة (المدير العام)',
  rhManager: 'سارة التازي (مسؤولة RH)',
  stampNote: 'احتساب إداري مبسط ولا يمثل قسيمة راتب قانونية',
  language: 'ar',
};

const SEED_EMPLOYEES_MOROCCO: Employee[] = [
  {
    id: 'emp-1',
    matricule: 'OB-001',
    fullName: 'كريم العلمي',
    roleTitle: 'شيف تنفيذي (Chef Exécutif)',
    station: 'KITCHEN',
    phone: '0661-23-45-67',
    cin: 'BE849201',
    cnssNumber: '109849201',
    birthDate: '1986-04-12',
    hireDate: '2023-01-15',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 16000,
    healthCardExpiry: '2027-06-30',
    status: 'ACTIVE',
    ribAccount: '007 780 0001234567890123 44',
    bankName: 'Attijariwafa Bank',
    notes: 'مسؤول المطبخ الرئيسي وقائمة الأطعمة ومراقبة الجودة والسلامة الصحية',
  },
  {
    id: 'emp-2',
    matricule: 'OB-002',
    fullName: 'سمير بنجلون',
    roleTitle: 'شيف دي بارتي - مشاوي وساشيمي (Chef de Partie)',
    station: 'KITCHEN',
    phone: '0662-88-12-34',
    cin: 'BK910283',
    cnssNumber: '109124950',
    birthDate: '1990-08-20',
    hireDate: '2023-03-01',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 9000,
    healthCardExpiry: '2026-11-15', // Expiring in ~3 weeks! Alert
    status: 'ACTIVE',
    ribAccount: '190 780 0009876543210987 55',
    bankName: 'Banque Populaire',
    notes: 'شفت مسائي - المطبخ الساخن وقسم الشواء',
  },
  {
    id: 'emp-3',
    matricule: 'OB-003',
    fullName: 'يوسف التازي',
    roleTitle: 'مساعد طباخ (Commis de Cuisine)',
    station: 'KITCHEN',
    phone: '0672-44-55-66',
    cin: 'AA729104',
    cnssNumber: '109782910',
    birthDate: '1998-02-14',
    hireDate: '2024-05-10',
    contractType: 'CDD',
    salaryType: 'MONTHLY',
    baseSalary: 4800,
    healthCardExpiry: '2027-03-10',
    status: 'ACTIVE',
    ribAccount: '230 780 0005556667778889 12',
    bankName: 'CIH Bank',
    notes: 'تحضير الخضار والصلصات والتجهيز المسبق (Mise en place)',
  },
  {
    id: 'emp-4',
    matricule: 'OB-004',
    fullName: 'نادية بناني',
    roleTitle: 'شيف حلويات وخبز فرنسي ومغربي (Pâtissière)',
    station: 'KITCHEN',
    phone: '0663-11-22-33',
    cin: 'CD819203',
    cnssNumber: '209384910',
    birthDate: '1992-11-05',
    hireDate: '2023-06-01',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 8200,
    healthCardExpiry: '2027-04-18',
    status: 'ACTIVE',
    ribAccount: '011 780 0004443332221110 09',
    bankName: 'BMCE Bank of Africa',
    notes: 'قسم الحلويات الراقية والمخبوزات الصباحية',
  },
  {
    id: 'emp-5',
    matricule: 'OB-005',
    fullName: 'أمين الفاسي',
    roleTitle: 'كابتن صالة (Maître d’Hôtel / Chef de Rang)',
    station: 'HALL',
    phone: '0664-77-88-99',
    cin: 'EE492019',
    cnssNumber: '108920194',
    birthDate: '1988-09-17',
    hireDate: '2023-02-01',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 7500,
    healthCardExpiry: '2027-01-20',
    status: 'ACTIVE',
    ribAccount: '022 780 0003332221110009 55',
    bankName: 'Attijariwafa Bank',
    notes: 'إشراف على طاقم الخدمة بالصالة واستقبال الضيوف وكبار الشخصيات VIP',
  },
  {
    id: 'emp-6',
    matricule: 'OB-006',
    fullName: 'إلياس العمراني',
    roleTitle: 'نادل صالة (Serveur de Salle)',
    station: 'HALL',
    phone: '0665-99-00-11',
    cin: 'BL992837',
    cnssNumber: '109928374',
    birthDate: '1999-06-25',
    hireDate: '2024-01-10',
    contractType: 'CDD',
    salaryType: 'MONTHLY',
    baseSalary: 4200,
    healthCardExpiry: '2026-10-15', // Expired recently! Alert
    status: 'ACTIVE',
    ribAccount: '007 780 0002221110009998 77',
    bankName: 'Banque Populaire',
    notes: 'خدمة الطاولات في منطقة التراس المطلة على الكورنيش',
  },
  {
    id: 'emp-7',
    matricule: 'OB-007',
    fullName: 'مريم الشرايبي',
    roleTitle: 'نادلة صالة واستقبال (Serveuse & Accueil)',
    station: 'HALL',
    phone: '0666-33-44-55',
    cin: 'FB847291',
    cnssNumber: '209847291',
    birthDate: '2001-03-30',
    hireDate: '2024-06-01',
    contractType: 'ANAPEC', // عقد أنابيك
    salaryType: 'MONTHLY',
    baseSalary: 4200,
    healthCardExpiry: '2027-05-12',
    status: 'ACTIVE',
    ribAccount: '230 780 0001112223334445 88',
    bankName: 'CIH Bank',
    notes: 'خدمة الصالة الرئيسية وقسم العائلات وعلاقات الزبائن',
  },
  {
    id: 'emp-8',
    matricule: 'OB-008',
    fullName: 'زكريا الصقلي',
    roleTitle: 'باريستا وخبير مشروبات (Barista & Mixologue)',
    station: 'BAR',
    phone: '0667-66-77-88',
    cin: 'BH673829',
    cnssNumber: '109673829',
    birthDate: '1997-12-10',
    hireDate: '2023-09-15',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 5500,
    healthCardExpiry: '2027-07-22',
    status: 'ACTIVE',
    ribAccount: '190 780 0007778889990001 33',
    bankName: 'Attijariwafa Bank',
    notes: 'إعداد القهوة المختصة والشاي المغربي الأصيل والعصائر والموكتيلات',
  },
  {
    id: 'emp-9',
    matricule: 'OB-009',
    fullName: 'سارة بلمقدم',
    roleTitle: 'مسؤولة الصندوق (Caissière)',
    station: 'CASHIER',
    phone: '0668-88-99-00',
    cin: 'BW954829',
    cnssNumber: '209548291',
    birthDate: '1996-04-03',
    hireDate: '2023-04-10',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 5200,
    healthCardExpiry: '2027-08-14',
    status: 'ACTIVE',
    ribAccount: '011 780 0006665554443332 99',
    bankName: 'Banque Populaire',
    notes: 'إقفال حسابات الصندوق اليومي والمبيعات ونقاط البيع الإلكترونية TPE',
  },
  {
    id: 'emp-10',
    matricule: 'OB-010',
    fullName: 'عبد القادر السوسي',
    roleTitle: 'مسؤول غسيل أواني ونظافة (Plongeur & Hygiène)',
    station: 'CLEANING',
    phone: '0669-12-34-56',
    cin: 'JA847291',
    cnssNumber: '108472910',
    birthDate: '1984-07-19',
    hireDate: '2023-01-20',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 3800,
    healthCardExpiry: '2027-02-28',
    status: 'ACTIVE',
    ribAccount: '230 780 0009998887776665 11',
    bankName: 'CIH Bank',
    notes: 'تعقيم وتنظيف الأواني، معدات المطبخ، والتخلص من النفايات وفق المعايير',
  },
];

const SEED_ATTENDANCE_MOROCCO: AttendanceRecord[] = [
  { id: 'att-1', employeeId: 'emp-1', date: '2026-10-22', checkIn: '10:00', checkOut: '22:00', regularHours: 8, overtimeHours: 2, status: 'PRESENT', notes: 'شفت كامل مع تحضير قائمة العشاء' },
  { id: 'att-2', employeeId: 'emp-2', date: '2026-10-22', checkIn: '14:00', checkOut: '23:30', regularHours: 8, overtimeHours: 1.5, status: 'PRESENT', notes: 'ساعة ونصف إضافية ذروة المساء' },
  { id: 'att-3', employeeId: 'emp-3', date: '2026-10-22', checkIn: '09:00', checkOut: '17:00', regularHours: 8, overtimeHours: 0, status: 'PRESENT' },
  { id: 'att-4', employeeId: 'emp-4', date: '2026-10-22', checkIn: '07:30', checkOut: '15:30', regularHours: 8, overtimeHours: 0, status: 'PRESENT' },
  { id: 'att-5', employeeId: 'emp-5', date: '2026-10-22', checkIn: '11:00', checkOut: '23:00', regularHours: 8, overtimeHours: 2, status: 'PRESENT', notes: 'خدمة طاولة كبار الضيوف VIP' },
  { id: 'att-6', employeeId: 'emp-6', date: '2026-10-22', checkIn: '12:15', checkOut: '22:00', regularHours: 7.75, overtimeHours: 0, status: 'LATE', notes: 'تأخر 15 دقيقة ازدحام الكورنيش' },
  { id: 'att-7', employeeId: 'emp-7', date: '2026-10-22', checkIn: '12:00', checkOut: '21:00', regularHours: 8, overtimeHours: 0, status: 'PRESENT' },
  { id: 'att-8', employeeId: 'emp-8', date: '2026-10-22', checkIn: '08:00', checkOut: '17:00', regularHours: 8, overtimeHours: 1, status: 'PRESENT' },
  { id: 'att-9', employeeId: 'emp-9', date: '2026-10-22', checkIn: '10:30', checkOut: '22:30', regularHours: 8, overtimeHours: 2, status: 'PRESENT' },
  { id: 'att-10', employeeId: 'emp-10', date: '2026-10-22', checkIn: '13:00', checkOut: '22:00', regularHours: 8, overtimeHours: 0, status: 'PRESENT' },
];

const SEED_ADVANCES_MOROCCO: AdvanceRecord[] = [
  {
    id: 'adv-1',
    employeeId: 'emp-3', // يوسف التازي
    amount: 1000,
    requestDate: '2026-10-05',
    deductionMonth: '2026-10',
    status: 'APPROVED',
    reason: 'تسبيق على الراتب (Acompte) لمصاريف عائلية طارئة',
    approvedBy: 'هشام بنسودة',
  },
  {
    id: 'adv-2',
    employeeId: 'emp-6', // إلياس العمراني
    amount: 800,
    requestDate: '2026-10-12',
    deductionMonth: '2026-10',
    status: 'APPROVED',
    reason: 'تسبيق على الراتب لمصاريف التنقل',
    approvedBy: 'هشام بنسودة',
  },
  {
    id: 'adv-3',
    employeeId: 'emp-8', // زكريا الصقلي
    amount: 700,
    requestDate: '2026-10-18',
    deductionMonth: '2026-11',
    status: 'PENDING',
    reason: 'طلب تسبيق يخص شهر نونبر القادم',
  },
];

const SEED_ADJUSTMENTS_MOROCCO: BonusPenaltyRecord[] = [
  {
    id: 'adj-1',
    employeeId: 'emp-1',
    type: 'BONUS',
    category: 'PERFORMANCE',
    amount: 1500,
    month: '2026-10',
    date: '2026-10-15',
    description: 'مكافأة نجاح قائمة المأكولات الخريفية الجديدة وزيادة التقييمات',
  },
  {
    id: 'adj-2',
    employeeId: 'emp-5',
    type: 'BONUS',
    category: 'PERFORMANCE',
    amount: 800,
    month: '2026-10',
    date: '2026-10-16',
    description: 'إشادة من زبائن الصالة بحسن الاستقبال والخدمة الراقية',
  },
  {
    id: 'adj-3',
    employeeId: 'emp-6',
    type: 'PENALTY',
    category: 'BREAKAGE',
    amount: 150,
    month: '2026-10',
    date: '2026-10-08',
    description: 'كسر صينية كؤوس كريستال أثناء تقديم المشروبات',
  },
  {
    id: 'adj-4',
    employeeId: 'emp-2',
    type: 'BONUS',
    category: 'MEAL_ALLOWANCE',
    amount: 300,
    month: '2026-10',
    date: '2026-10-01',
    description: 'بدل وجبة إضافية لشفتات الإغلاق المتأخرة',
  },
];

const SEED_TIPS_POOLS_MOROCCO: TipsPoolRecord[] = [
  {
    id: 'tips-1',
    title: 'صندوق بقشيش زبائن المطعم - منتصف شهر أكتوبر 2026',
    month: '2026-10',
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    totalCollected: 7600, // بالدرهم المغربي
    distributionMethod: 'ROLE_WEIGHTED',
    isAppliedToPayroll: true,
    notes: 'توزيع حصص البقشيش المشترك (Pourboires) على طاقم الصالة والمطبخ والبار',
    shares: [
      { employeeId: 'emp-1', employeeName: 'كريم العلمي', role: 'شيف تنفيذي', amount: 850 },
      { employeeId: 'emp-2', employeeName: 'سمير بنجلون', role: 'شيف دي بارتي', amount: 750 },
      { employeeId: 'emp-3', employeeName: 'يوسف التازي', role: 'مساعد طباخ', amount: 550 },
      { employeeId: 'emp-4', employeeName: 'نادية بناني', role: 'شيف حلويات', amount: 650 },
      { employeeId: 'emp-5', employeeName: 'أمين الفاسي', role: 'كابتن صالة', amount: 1100 },
      { employeeId: 'emp-6', employeeName: 'إلياس العمراني', role: 'نادل صالة', amount: 950 },
      { employeeId: 'emp-7', employeeName: 'مريم الشرايبي', role: 'نادلة صالة', amount: 950 },
      { employeeId: 'emp-8', employeeName: 'زكريا الصقلي', role: 'باريستا', amount: 800 },
      { employeeId: 'emp-9', employeeName: 'سارة بلمقدم', role: 'كاشير', amount: 550 },
      { employeeId: 'emp-10', employeeName: 'عبد القادر السوسي', role: 'مسؤول نظافة', amount: 450 },
    ],
  },
];

const DEMO_EMPLOYEE_IDS = new Set([
  'emp-1', 'emp-2', 'emp-3', 'emp-4', 'emp-5', 'emp-6', 'emp-7', 'emp-8', 'emp-9', 'emp-10',
]);
const DEMO_ATTENDANCE_IDS = new Set([
  'att-1', 'att-2', 'att-3', 'att-4', 'att-5', 'att-6', 'att-7', 'att-8', 'att-9', 'att-10',
]);
const DEMO_ADVANCE_IDS = new Set(['adv-1', 'adv-2', 'adv-3']);
const DEMO_ADJUSTMENT_IDS = new Set(['adj-1', 'adj-2', 'adj-3', 'adj-4']);
const DEMO_TIPS_POOL_IDS = new Set(['tips-1']);

// Helper to compute Moroccan payroll slip
export function computeMoroccanSlipForEmployee(
  employee: Employee,
  month: string,
  _settings: RestaurantSettings,
  advances: AdvanceRecord[],
  _adjustments: BonusPenaltyRecord[],
  _tipsPools: TipsPoolRecord[],
  _overtimeHoursCount: number = 0,
  attendanceRecords: AttendanceRecord[] = []
): PayrollSlip {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new RangeError(`Invalid payroll month: ${month}`);
  }

  const employeeAttendance = attendanceRecords.filter(
    record => record.employeeId === employee.id && record.date.startsWith(month)
  );
  const absentDays = employeeAttendance.filter(record => record.status === 'ABSENT').length;
  const sickDays = 0;
  const restDayWorkDays = employeeAttendance.filter(
    record => record.overtimePeriod === 'REST_DAY'
  ).length;
  const dailyAttendanceHours = employeeAttendance
    .filter(record => record.status === 'PRESENT' || record.status === 'LATE')
    .reduce((sum, record) => sum + Math.max(0, record.regularHours || 0), 0);
  const advancesDeducted = advances
    .filter(adv => adv.employeeId === employee.id && adv.deductionMonth === month && adv.status === 'APPROVED')
    .reduce((sum, adv) => sum + adv.amount, 0);

  const slip: PayrollSlip = {
    id: `slip-${month}-${employee.id}`,
    payrollRunId: `run-${month}`,
    employeeId: employee.id,
    employeeName: employee.fullName,
    employeeMatricule: employee.matricule,
    cin: employee.cin,
    cnssNumber: employee.cnssNumber,
    roleTitle: employee.roleTitle,
    station: employee.station,
    contractType: employee.contractType,
    salaryType: employee.salaryType,
    month,
    payrollFormulaVersion: 1,
    baseSalary: employee.baseSalary,
    sickDays,
    absentDays,
    doubleShiftCount: 0,
    restDayWorkDays,
    daysWorked: Math.max(0, 26 - absentDays - sickDays),
    workedHours: dailyAttendanceHours,
    overtimeHours: 0,
    overtimeRate: 0,
    overtimeAmount: 0,
    tipsShare: 0,
    seniorityBonus: 0,
    mealAllowance: 0,
    transportAllowance: 0,
    performanceBonus: 0,
    totalGrossSalary: employee.baseSalary,
    cnssRate: 0,
    cnssAmount: 0,
    amoRate: 0,
    amoAmount: 0,
    irAmount: 0,
    advancesDeducted,
    penaltiesDeducted: 0,
    totalDeductions: 0,
    netSalary: 0,
    status: 'DRAFT',
    paymentMethod: 'BANK_TRANSFER',
  };
  return recalculateSlipAmounts(slip, _settings);
}

function recalculateSlipAmounts(
  slip: PayrollSlip,
  _settings: RestaurantSettings
): PayrollSlip {
  const dailySalary = slip.baseSalary / 26;
  const sickDays = Math.max(0, slip.sickDays ?? 0);
  const absentDays = Math.max(0, slip.absentDays ?? 0);
  const doubleShiftCount = Math.max(0, slip.doubleShiftCount ?? 0);
  const restDayWorkDays = Math.max(0, slip.restDayWorkDays ?? 0);
  const sicknessDeduction = Math.round(dailySalary * sickDays);
  const absenceDeduction = Math.round(dailySalary * absentDays);
  const doubleShiftAmount = Math.round(dailySalary * doubleShiftCount);
  const restDayWorkAmount = Math.round(dailySalary * restDayWorkDays);
  const totalGrossSalary =
    slip.baseSalary +
    doubleShiftAmount +
    restDayWorkAmount;
  const cnssAmount = 0;
  const amoAmount = 0;
  const irAmount = 0;
  const totalDeductions = sicknessDeduction + absenceDeduction + slip.advancesDeducted;

  return {
    ...slip,
    sickDays,
    absentDays,
    doubleShiftCount,
    restDayWorkDays,
    overtimeAmount: 0,
    tipsShare: 0,
    seniorityBonus: 0,
    mealAllowance: 0,
    transportAllowance: 0,
    performanceBonus: 0,
    penaltiesDeducted: 0,
    totalGrossSalary,
    cnssAmount,
    amoAmount,
    irAmount,
    totalDeductions,
    netSalary: Math.max(0, totalGrossSalary - totalDeductions),
  };
}

function createInitialMoroccanDatabaseState(): DatabaseState {
  return {
    version: 7,
    lastUpdated: new Date().toISOString(),
    settings: DEFAULT_SETTINGS_MOROCCO,
    employees: [],
    attendance: [],
    officialHolidays: [],
    advances: [],
    adjustments: [],
    tipsPools: [],
    payrollRuns: [],
    payrollSlips: [],
  };
}

function migratePayrollCalculations(state: DatabaseState): DatabaseState {
  for (const run of state.payrollRuns) {
    if (run.status === 'PAID') continue;

    const previousSlips = new Map(
      state.payrollSlips
        .filter(slip => slip.month === run.month)
        .map(slip => [slip.employeeId, slip])
    );
    const slips = state.employees
      .filter(employee => employee.status !== 'TERMINATED')
      .map(employee => {
        const attendance = state.attendance.filter(
          record => record.employeeId === employee.id && record.date.startsWith(run.month)
        );
        const overtimeHours = attendance.reduce(
          (sum, record) => sum + Math.max(0, record.overtimeHours || 0),
          0
        );
        const generatedSlip = computeMoroccanSlipForEmployee(
          employee,
          run.month,
          state.settings,
          state.advances,
          state.adjustments,
          state.tipsPools,
          overtimeHours,
          attendance
        );
        const previousSlip = previousSlips.get(employee.id);
        return previousSlip
          ? recalculateSlipAmounts({
              ...generatedSlip,
              sickDays: previousSlip.sickDays ?? generatedSlip.sickDays,
              absentDays: previousSlip.absentDays ?? generatedSlip.absentDays,
              doubleShiftCount: previousSlip.doubleShiftCount ?? generatedSlip.doubleShiftCount,
              restDayWorkDays: previousSlip.restDayWorkDays ?? generatedSlip.restDayWorkDays,
              advancesDeducted: previousSlip.payrollFormulaVersion === 1
                ? previousSlip.advancesDeducted
                : generatedSlip.advancesDeducted,
            }, state.settings)
          : generatedSlip;
      });

    state.payrollSlips = [
      ...state.payrollSlips.filter(slip => slip.month !== run.month),
      ...slips,
    ];
    run.totalEmployees = slips.length;
    run.totalGross = slips.reduce((sum, slip) => sum + slip.totalGrossSalary, 0);
    run.totalNet = slips.reduce((sum, slip) => sum + slip.netSalary, 0);
    run.totalOvertimeAmount = slips.reduce((sum, slip) => sum + slip.overtimeAmount, 0);
    run.totalTipsDistributed = slips.reduce((sum, slip) => sum + slip.tipsShare, 0);
    run.totalDeductions = slips.reduce((sum, slip) => sum + slip.totalDeductions, 0);
    run.status = 'DRAFT';
  }
  state.version = 5;
  return state;
}

function removeDemoData(state: DatabaseState): DatabaseState {
  const removedDemoSlips = state.payrollSlips.filter(slip => DEMO_EMPLOYEE_IDS.has(slip.employeeId));
  const removedRunIds = new Set(removedDemoSlips.map(slip => slip.payrollRunId));

  state.employees = state.employees.filter(employee => !DEMO_EMPLOYEE_IDS.has(employee.id));
  state.attendance = state.attendance.filter(
    record => !DEMO_EMPLOYEE_IDS.has(record.employeeId) && !DEMO_ATTENDANCE_IDS.has(record.id)
  );
  state.advances = state.advances.filter(
    record => !DEMO_EMPLOYEE_IDS.has(record.employeeId) && !DEMO_ADVANCE_IDS.has(record.id)
  );
  state.adjustments = state.adjustments.filter(
    record => !DEMO_EMPLOYEE_IDS.has(record.employeeId) && !DEMO_ADJUSTMENT_IDS.has(record.id)
  );
  state.tipsPools = state.tipsPools
    .filter(pool => !DEMO_TIPS_POOL_IDS.has(pool.id))
    .map(pool => ({
      ...pool,
      shares: pool.shares.filter(share => !DEMO_EMPLOYEE_IDS.has(share.employeeId)),
    }));
  state.payrollSlips = state.payrollSlips.filter(slip => !DEMO_EMPLOYEE_IDS.has(slip.employeeId));

  state.payrollRuns = state.payrollRuns
    .filter(run => {
      const isEmptyDemoRun =
        (run.id === 'run-2026-09' && run.generatedDate === '2026-09-30') ||
        (run.id === 'run-2026-10' && run.generatedDate === '2026-10-22');
      return !isEmptyDemoRun || state.payrollSlips.some(slip => slip.payrollRunId === run.id);
    })
    .map(run => {
      if (!removedRunIds.has(run.id)) return run;
      const slips = state.payrollSlips.filter(slip => slip.payrollRunId === run.id);
      return {
        ...run,
        totalEmployees: slips.length,
        totalGross: slips.reduce((sum, slip) => sum + slip.totalGrossSalary, 0),
        totalNet: slips.reduce((sum, slip) => sum + slip.netSalary, 0),
        totalOvertimeAmount: slips.reduce((sum, slip) => sum + slip.overtimeAmount, 0),
        totalTipsDistributed: slips.reduce((sum, slip) => sum + slip.tipsShare, 0),
        totalDeductions: slips.reduce((sum, slip) => sum + slip.totalDeductions, 0),
      };
    });

  state.version = 7;
  return state;
}

class DatabaseManager {
  private state: DatabaseState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): DatabaseState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed === 'object' &&
          'version' in parsed &&
          (parsed.version === 2 || parsed.version === 3 || parsed.version === 4 || parsed.version === 5 || parsed.version === 6 || parsed.version === 7) &&
          'employees' in parsed &&
          Array.isArray(parsed.employees) &&
          'settings' in parsed &&
          'attendance' in parsed &&
          Array.isArray(parsed.attendance) &&
          'advances' in parsed &&
          Array.isArray(parsed.advances) &&
          'adjustments' in parsed &&
          Array.isArray(parsed.adjustments) &&
          'tipsPools' in parsed &&
          Array.isArray(parsed.tipsPools) &&
          'payrollRuns' in parsed &&
          Array.isArray(parsed.payrollRuns) &&
          'payrollSlips' in parsed &&
          Array.isArray(parsed.payrollSlips)
        ) {
          const state = parsed as DatabaseState;
          const requiresMigration = state.version < 7 || !Array.isArray(state.officialHolidays);
          state.officialHolidays = Array.isArray(state.officialHolidays) ? state.officialHolidays : [];
          const migrated = removeDemoData(
            state.version < 5 ? migratePayrollCalculations(state) : state
          );
          migrated.version = 7;
          if (requiresMigration) this.saveToStorage(migrated);
          return migrated;
        }
      }
    } catch (e) {
      console.warn('Failed to parse storage, initializing fresh Moroccan DATABEST state:', e);
    }
    const fresh = createInitialMoroccanDatabaseState();
    this.saveToStorage(fresh);
    return fresh;
  }

  private saveToStorage(state: DatabaseState): void {
    try {
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.saveToStorage(this.state);
    this.listeners.forEach(fn => fn());
  }

  // Getters
  public getState(): DatabaseState {
    return this.state;
  }

  public getSettings(): RestaurantSettings {
    return this.state.settings;
  }

  public getEmployees(): Employee[] {
    return this.state.employees;
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.state.employees.find(e => e.id === id);
  }

  public getAttendance(): AttendanceRecord[] {
    return this.state.attendance;
  }

  public getOfficialHolidays(): OfficialHoliday[] {
    return this.state.officialHolidays;
  }

  public getAdvances(): AdvanceRecord[] {
    return this.state.advances;
  }

  public getAdjustments(): BonusPenaltyRecord[] {
    return this.state.adjustments;
  }

  public getTipsPools(): TipsPoolRecord[] {
    return this.state.tipsPools;
  }

  public getPayrollRuns(): PayrollRun[] {
    return this.state.payrollRuns;
  }

  public getPayrollSlips(month?: string): PayrollSlip[] {
    if (month) {
      return this.state.payrollSlips.filter(s => s.month === month);
    }
    return this.state.payrollSlips;
  }

  // Mutations - Settings
  public updateSettings(settings: RestaurantSettings): void {
    this.state.settings = settings;
    this.notify();
  }

  // Mutations - Employees
  public addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const id = `emp-${Date.now()}`;
    const newEmp: Employee = { ...employee, id };
    this.state.employees.unshift(newEmp);
    this.notify();
    return newEmp;
  }

  public updateEmployee(id: string, updates: Partial<Employee>): void {
    this.state.employees = this.state.employees.map(e =>
      e.id === id ? { ...e, ...updates } : e
    );
    this.notify();
  }

  public deleteEmployee(id: string): void {
    this.state.employees = this.state.employees.filter(e => e.id !== id);
    this.notify();
  }

  // Mutations - Attendance
  public recordAttendance(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const existingIndex = this.state.attendance.findIndex(
      a => a.employeeId === record.employeeId && a.date === record.date
    );
    const id = existingIndex >= 0 ? this.state.attendance[existingIndex].id : `att-${Date.now()}`;
    const saved: AttendanceRecord = { ...record, id };

    if (existingIndex >= 0) {
      this.state.attendance[existingIndex] = saved;
    } else {
      this.state.attendance.unshift(saved);
    }
    this.notify();
    return saved;
  }

  public deleteAttendance(id: string): void {
    this.state.attendance = this.state.attendance.filter(a => a.id !== id);
    this.notify();
  }

  // Mutations - Official Holidays
  public addOfficialHoliday(holiday: Omit<OfficialHoliday, 'id'>): OfficialHoliday {
    const newHoliday: OfficialHoliday = { ...holiday, id: `holiday-${Date.now()}` };
    this.state.officialHolidays.unshift(newHoliday);
    this.notify();
    return newHoliday;
  }

  public deleteOfficialHoliday(id: string): void {
    this.state.officialHolidays = this.state.officialHolidays.filter(holiday => holiday.id !== id);
    this.notify();
  }

  // Mutations - Advances
  public addAdvance(advance: Omit<AdvanceRecord, 'id'>): AdvanceRecord {
    const newAdv: AdvanceRecord = { ...advance, id: `adv-${Date.now()}` };
    this.state.advances.unshift(newAdv);
    this.notify();
    return newAdv;
  }

  public updateAdvance(id: string, updates: Partial<AdvanceRecord>): void {
    this.state.advances = this.state.advances.map(a =>
      a.id === id ? { ...a, ...updates } : a
    );
    this.notify();
  }

  public updateAdvanceStatus(id: string, status: AdvanceRecord['status']): void {
    this.state.advances = this.state.advances.map(a =>
      a.id === id ? { ...a, status } : a
    );
    this.notify();
  }

  public deleteAdvance(id: string): void {
    this.state.advances = this.state.advances.filter(a => a.id !== id);
    this.notify();
  }

  // Mutations - Adjustments
  public addAdjustment(record: Omit<BonusPenaltyRecord, 'id'>): BonusPenaltyRecord {
    const newRecord: BonusPenaltyRecord = { ...record, id: `adj-${Date.now()}` };
    this.state.adjustments.unshift(newRecord);
    this.notify();
    return newRecord;
  }

  public updateAdjustment(id: string, updates: Partial<BonusPenaltyRecord>): void {
    this.state.adjustments = this.state.adjustments.map(a =>
      a.id === id ? { ...a, ...updates } : a
    );
    this.notify();
  }

  public deleteAdjustment(id: string): void {
    this.state.adjustments = this.state.adjustments.filter(a => a.id !== id);
    this.notify();
  }

  // Mutations - Tips Pool
  public addTipsPool(pool: Omit<TipsPoolRecord, 'id'>): TipsPoolRecord {
    const newPool: TipsPoolRecord = { ...pool, id: `tips-${Date.now()}` };
    this.state.tipsPools.unshift(newPool);
    this.notify();
    return newPool;
  }

  public updateTipsPool(id: string, updates: Partial<TipsPoolRecord>): void {
    this.state.tipsPools = this.state.tipsPools.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    this.notify();
  }

  public deleteTipsPool(id: string): void {
    this.state.tipsPools = this.state.tipsPools.filter(t => t.id !== id);
    this.notify();
  }

  public deletePayrollSlip(id: string): void {
    const target = this.state.payrollSlips.find(s => s.id === id);
    this.state.payrollSlips = this.state.payrollSlips.filter(s => s.id !== id);
    if (target) {
      const remaining = this.state.payrollSlips.filter(s => s.month === target.month);
      const runIndex = this.state.payrollRuns.findIndex(r => r.month === target.month);
      if (runIndex >= 0) {
        this.state.payrollRuns[runIndex].totalEmployees = remaining.length;
        this.state.payrollRuns[runIndex].totalGross = remaining.reduce((sum, s) => sum + s.totalGrossSalary, 0);
        this.state.payrollRuns[runIndex].totalNet = remaining.reduce((sum, s) => sum + s.netSalary, 0);
        this.state.payrollRuns[runIndex].totalOvertimeAmount = remaining.reduce((sum, s) => sum + s.overtimeAmount, 0);
        this.state.payrollRuns[runIndex].totalTipsDistributed = remaining.reduce((sum, s) => sum + s.tipsShare, 0);
        this.state.payrollRuns[runIndex].totalDeductions = remaining.reduce((sum, s) => sum + s.totalDeductions, 0);
      }
    }
    this.notify();
  }

  public deletePayrollRun(month: string): void {
    this.state.payrollRuns = this.state.payrollRuns.filter(r => r.month !== month);
    this.state.payrollSlips = this.state.payrollSlips.filter(s => s.month !== month);
    this.notify();
  }

  // Mutations - Payroll Runs & Slips
  public generateOrRecalculatePayroll(month: string): PayrollRun {
    const existingRunIndex = this.state.payrollRuns.findIndex(r => r.month === month);
    if (existingRunIndex >= 0 && this.state.payrollRuns[existingRunIndex].status === 'PAID') {
      throw new Error(`Cannot recalculate a paid payroll run: ${month}`);
    }
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      throw new RangeError(`Invalid payroll month: ${month}`);
    }

    const existingSlips = this.state.payrollSlips.filter(s => s.month === month);
    const previousSlipByEmployee = new Map(existingSlips.map(slip => [slip.employeeId, slip]));

    // Remove old slips for this month
    this.state.payrollSlips = this.state.payrollSlips.filter(s => s.month !== month);

    const activeEmployees = this.state.employees.filter(e => e.status !== 'TERMINATED');
    const newSlips: PayrollSlip[] = activeEmployees.map(emp => {
      const employeeAtt = this.state.attendance.filter(
        a => a.employeeId === emp.id && a.date.startsWith(month)
      );
      const totalOvertime = employeeAtt.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);

      const generatedSlip = computeMoroccanSlipForEmployee(
        emp,
        month,
        this.state.settings,
        this.state.advances,
        this.state.adjustments,
        this.state.tipsPools,
        totalOvertime,
        employeeAtt
      );
      const previousSlip = previousSlipByEmployee.get(emp.id);
      return previousSlip
        ? recalculateSlipAmounts({
            ...generatedSlip,
            sickDays: previousSlip.sickDays ?? generatedSlip.sickDays,
            absentDays: previousSlip.absentDays ?? generatedSlip.absentDays,
            doubleShiftCount: previousSlip.doubleShiftCount ?? generatedSlip.doubleShiftCount,
            restDayWorkDays: previousSlip.restDayWorkDays ?? generatedSlip.restDayWorkDays,
            advancesDeducted: previousSlip.advancesDeducted,
          }, this.state.settings)
        : generatedSlip;
    });

    this.state.payrollSlips.push(...newSlips);

    const totalGross = newSlips.reduce((acc, s) => acc + s.totalGrossSalary, 0);
    const totalNet = newSlips.reduce((acc, s) => acc + s.netSalary, 0);
    const totalOvertime = newSlips.reduce((acc, s) => acc + s.overtimeAmount, 0);
    const totalTips = newSlips.reduce((acc, s) => acc + s.tipsShare, 0);
    const totalDeductions = newSlips.reduce((acc, s) => acc + s.totalDeductions, 0);

    const run: PayrollRun = {
      id: `run-${month}`,
      month,
      year,
      monthNumber: monthNum,
      generatedDate: getCurrentDateString(),
      totalEmployees: newSlips.length,
      totalGross,
      totalNet,
      totalOvertimeAmount: totalOvertime,
      totalTipsDistributed: totalTips,
      totalDeductions,
      status: 'DRAFT',
      notes: `مسير رواتب شهر ${month} بالمغرب - تم التوليد بنجاح لـ ${newSlips.length} موظف`,
    };

    if (existingRunIndex >= 0) {
      this.state.payrollRuns[existingRunIndex] = run;
    } else {
      this.state.payrollRuns.unshift(run);
    }

    this.notify();
    return run;
  }

  public updatePayrollSlip(id: string, updates: Partial<PayrollSlip>): void {
    this.state.payrollSlips = this.state.payrollSlips.map(s => {
      if (s.id === id) {
        return recalculateSlipAmounts({ ...s, ...updates }, this.state.settings);
      }
      return s;
    });

    const targetSlip = this.state.payrollSlips.find(s => s.id === id);
    if (targetSlip) {
      const monthSlips = this.state.payrollSlips.filter(s => s.month === targetSlip.month);
      const runIndex = this.state.payrollRuns.findIndex(r => r.month === targetSlip.month);
      if (runIndex >= 0) {
        this.state.payrollRuns[runIndex].totalGross = monthSlips.reduce((sum, s) => sum + s.totalGrossSalary, 0);
        this.state.payrollRuns[runIndex].totalNet = monthSlips.reduce((sum, s) => sum + s.netSalary, 0);
        this.state.payrollRuns[runIndex].totalOvertimeAmount = monthSlips.reduce((sum, s) => sum + s.overtimeAmount, 0);
        this.state.payrollRuns[runIndex].totalTipsDistributed = monthSlips.reduce((sum, s) => sum + s.tipsShare, 0);
        this.state.payrollRuns[runIndex].totalDeductions = monthSlips.reduce((sum, s) => sum + s.totalDeductions, 0);
      }
    }

    this.notify();
  }

  public updatePayrollRunStatus(month: string, status: PayrollRun['status']): void {
    const run = this.state.payrollRuns.find(r => r.month === month);
    if (run) {
      run.status = status;
      this.state.payrollSlips = this.state.payrollSlips.map(s => {
        if (s.month === month) {
          return {
            ...s,
            status,
            paymentDate: status === 'PAID' ? getCurrentDateString() : s.paymentDate,
          };
        }
        return s;
      });

      if (status === 'PAID') {
        this.state.advances = this.state.advances.map(a => {
          if (a.deductionMonth === month && a.status === 'APPROVED') {
            return { ...a, status: 'DEDUCTED' };
          }
          return a;
        });
      }

      this.notify();
    }
  }

  // Backup & Restore
  public exportBackupJson(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public importBackupJson(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString) as DatabaseState;
      if (
        !parsed ||
        (parsed.version !== 2 && parsed.version !== 3 && parsed.version !== 4 && parsed.version !== 5 && parsed.version !== 6 && parsed.version !== 7) ||
        !parsed.settings ||
        !Array.isArray(parsed.employees) ||
        !Array.isArray(parsed.attendance) ||
        !Array.isArray(parsed.advances) ||
        !Array.isArray(parsed.adjustments) ||
        !Array.isArray(parsed.tipsPools) ||
        !Array.isArray(parsed.payrollRuns) ||
        !Array.isArray(parsed.payrollSlips)
      ) {
        return { success: false, message: 'ملف النسخة الاحتياطية غير صالح أو ناقص البنية' };
      }
      const state = parsed as DatabaseState;
      state.officialHolidays = Array.isArray(state.officialHolidays) ? state.officialHolidays : [];
      this.state = removeDemoData(
        parsed.version < 5 ? migratePayrollCalculations(state) : state
      );
      this.state.version = 7;
      this.notify();
      return { success: true, message: 'تم استعادة قاعدة بيانات DATABEST بنجاح' };
    } catch (e) {
      return { success: false, message: 'خطأ في قراءة ملف JSON' };
    }
  }

  public resetToDefaultSeed(): void {
    this.state = createInitialMoroccanDatabaseState();
    this.notify();
  }
}

export const databest = new DatabaseManager();
