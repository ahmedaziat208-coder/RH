export type RestaurantStation = 
  | 'KITCHEN'      // المطبخ
  | 'HALL'         // الصالة
  | 'BAR'          // البار / المشروبات
  | 'CASHIER'      // الصندوق
  | 'CLEANING'     // النظافة وغسيل الأواني
  | 'DELIVERY'     // التوصيل
  | 'MANAGEMENT';  // الإدارة

export type ContractType = 
  | 'CDI'         // عقد غير محدد المدة
  | 'CDD'         // عقد محدد المدة
  | 'ANAPEC'      // عقد الوكالة الوطنية لإنعاش التشغيل والكفاءات (ANAPEC)
  | 'JOURNALIER'  // يومي / باليومية
  | 'STAGE'       // تدريب مهني
  | 'SAISONNIER'; // عقد موسمي

export type SalaryType = 'MONTHLY' | 'DAILY' | 'HOURLY';

export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED';

export interface Employee {
  id: string;
  matricule: string;          // رقم الموظف RH (e.g. OB-001)
  fullName: string;           // الاسم واللقب
  roleTitle: string;          // المسمى الوظيفي
  station: RestaurantStation; // قسم العمل في المطعم
  phone: string;
  cin: string;                // بطاقة التعريف الوطنية CIN (e.g. BE123456)
  cnssNumber: string;         // رقم الانخراط بالضمان الاجتماعي CNSS
  birthDate: string;
  hireDate: string;
  contractType: ContractType;
  salaryType: SalaryType;
  baseSalary: number;         // الراتب الأساسي بالدرهم المغربي (MAD / د.م)
  healthCardExpiry: string;   // تاريخ انتهاء الشهادة الطبية/الصحية (Carte sanitaire)
  status: EmployeeStatus;
  taxDependents?: number;
  ribAccount?: string;        // رقم الحساب البنكي RIB (24 رقماً - البنوك المغربية)
  bankName?: string;          // Attijariwafa Bank, Banque Populaire, CIH, BMCE Bank of Africa...
  notes?: string;
  avatarUrl?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type OvertimePeriod = 'DAY' | 'NIGHT' | 'REST_DAY' | 'REST_NIGHT';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;               // YYYY-MM-DD
  checkIn: string;            // HH:MM
  checkOut: string;           // HH:MM
  regularHours: number;
  overtimeHours: number;
  overtimePeriod?: OvertimePeriod;
  status: AttendanceStatus;
  notes?: string;
}

export type AdvanceStatus = 'PENDING' | 'APPROVED' | 'DEDUCTED' | 'REJECTED';

export interface AdvanceRecord {
  id: string;
  employeeId: string;
  amount: number;             // بالدرهم المغربي
  requestDate: string;
  deductionMonth: string;     // YYYY-MM
  status: AdvanceStatus;
  reason: string;
  approvedBy?: string;
}

export type BonusPenaltyType = 'BONUS' | 'PENALTY';

export type AdjustmentCategory = 
  | 'PERFORMANCE'         // مكافأة أداء
  | 'TIPS_SHARE'           // حصة بقشيش إضافية
  | 'SENIORITY'            // علاوة الأقدمية (Prime d'ancienneté)
  | 'MEAL_ALLOWANCE'       // بدل وجبة (Panier)
  | 'TRANSPORT_ALLOWANCE'  // بدل تنقل (Transport)
  | 'DELAY'                // تأخر عن العمل
  | 'BREAKAGE'             // كسر أواني وصحون
  | 'HYGIENE_VIOLATION'    // مخالفة قواعد النظافة
  | 'ABSENCE_UNJUSTIFIED'  // غياب غير مبرر
  | 'OTHER';               // أخرى

export interface BonusPenaltyRecord {
  id: string;
  employeeId: string;
  type: BonusPenaltyType;
  category: AdjustmentCategory;
  amount: number;             // بالدرهم المغربي
  month: string;              // YYYY-MM
  date: string;
  description: string;
}

export interface TipsPoolRecord {
  id: string;
  title: string;
  month: string;              // YYYY-MM
  startDate: string;
  endDate: string;
  totalCollected: number;     // بالدرهم المغربي
  distributionMethod: 'EQUAL' | 'ROLE_WEIGHTED' | 'HOURS_WORKED';
  shares: {
    employeeId: string;
    employeeName: string;
    role: string;
    amount: number;
  }[];
  isAppliedToPayroll: boolean;
  notes?: string;
}

export type PayrollStatus = 'DRAFT' | 'APPROVED' | 'PAID';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHECK';

export interface PayrollSlip {
  id: string;
  payrollRunId: string;
  employeeId: string;
  employeeName: string;
  employeeMatricule: string;
  cin: string;                // رقم بطاقة التعريف الوطنية CIN
  cnssNumber: string;         // رقم التسجيل بالضمان الاجتماعي CNSS
  roleTitle: string;
  station: RestaurantStation;
  contractType: ContractType;
  salaryType: SalaryType;
  month: string;              // YYYY-MM
  
  // Earnings (المستحقات - Gains Brut)
  baseSalary: number;         // الراتب الأساسي بالدرهم
  daysWorked: number;
  workedHours: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimePeriod?: OvertimePeriod;
  overtimeAmount: number;
  tipsShare: number;          // حصة البقشيش (Pourboires)
  seniorityBonus: number;     // علاوة الأقدمية (Prime d'ancienneté)
  mealAllowance: number;      // منحة القفة والوجبة (Panier)
  transportAllowance: number; // تعويض النقل (Transport)
  performanceBonus: number;   // مكافأة المردودية والخدمة
  totalGrossSalary: number;   // الراتب الإجمالي الخام (Salaire Brut Global)

  // Deductions (الاستقطاعات المغربية - Retenues)
  cnssRate: number;           // CNSS (4.48% بحد أقصى 6000 درهم سقف الاشتراك)
  cnssAmount: number;         // اشتراك CNSS
  amoRate: number;            // التأمين الإجباري عن المرض AMO (2.26%)
  amoAmount: number;          // اشتراك AMO
  irAmount: number;           // الضريبة على الدخل بالمغرب (IR - Impôt sur le Revenu)
  advancesDeducted: number;   // استقطاع السلفة على الراتب (Acompte)
  penaltiesDeducted: number;  // خصومات التأخير والكسر (Sanctions & Casse)
  totalDeductions: number;

  // Final Net (صافي الراتب للدفع - Net à Payer)
  netSalary: number;          // صافي الراتب بالدرهم المغربي
  status: PayrollStatus;
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  paymentReference?: string;
  notes?: string;
}

export interface PayrollRun {
  id: string;
  month: string;
  year: number;
  monthNumber: number;
  generatedDate: string;
  totalEmployees: number;
  totalGross: number;         // بالدرهم
  totalNet: number;           // بالدرهم
  totalOvertimeAmount: number;
  totalTipsDistributed: number;
  totalDeductions: number;
  status: PayrollStatus;
  notes?: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  restaurantSubtitle: string;
  country: string;            // "المملكة المغربية"
  city: string;               // "الدار البيضاء"، "مراكش"، "الرباط"، "طنجة"
  iceNumber: string;          // المعرف الموحد للمقاولة ICE (15 رقماً)
  commercialRegister: string; // السجل التجاري RC (e.g. RC Casablanca 584920)
  taxId: string;              // التعريف الضريبي IF (Identifiant Fiscal)
  patenteNumber: string;      // رقم الضريبة المهنية (Patente)
  cnssAffiliation: string;    // رقم الانخراط بالضمان الاجتماعي CNSS
  address: string;
  phone: string;
  email: string;
  currency: string;           // 'MAD'
  currencySymbol: string;     // 'د.م' أو 'DH'
  defaultOvertimeRate: number;// e.g. 1.25 أو 1.50 (وفق مدونة الشغل المغربية)
  defaultCnssRate: number;    // 4.48%
  defaultAmoRate: number;     // 2.26%
  defaultMealAllowance: number;      // e.g. 500 درهم
  defaultTransportAllowance: number; // e.g. 400 درهم
  restaurantManager: string;
  rhManager: string;
  stampNote: string;
  language?: 'ar' | 'fr' | 'en';
}
