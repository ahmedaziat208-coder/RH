import { RestaurantStation, ContractType, EmployeeStatus } from '../types';

export function getCurrentDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonth(): string {
  return getCurrentDateString().slice(0, 7);
}

export function getMonthDateRange(month: string): { startDate: string; endDate: string } {
  const [year, monthNumber] = month.split('-').map(Number);
  const endDay = new Date(year, monthNumber, 0).getDate();
  return {
    startDate: `${month}-01`,
    endDate: `${month}-${String(endDay).padStart(2, '0')}`,
  };
}

export function formatCurrency(amount: number, symbol: string = 'د.م'): string {
  if (isNaN(amount)) return `0 ${symbol}`;
  const formatted = new Intl.NumberFormat('fr-MA', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ${symbol}`;
}

export function getStationMeta(station: RestaurantStation): {
  labelAr: string;
  labelFr: string;
  color: string;
  bgLight: string;
  border: string;
  icon: string;
} {
  switch (station) {
    case 'KITCHEN':
      return {
        labelAr: 'المطبخ والطهي',
        labelFr: 'Cuisine',
        color: 'text-amber-400',
        bgLight: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        border: 'border-amber-500/30',
        icon: 'ChefHat',
      };
    case 'HALL':
      return {
        labelAr: 'الصالة والخدمة',
        labelFr: 'Salle & Service',
        color: 'text-emerald-400',
        bgLight: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        border: 'border-emerald-500/30',
        icon: 'UtensilsCrossed',
      };
    case 'BAR':
      return {
        labelAr: 'البار والمشروبات',
        labelFr: 'Bar & Boissons',
        color: 'text-cyan-400',
        bgLight: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
        border: 'border-cyan-500/30',
        icon: 'Coffee',
      };
    case 'CASHIER':
      return {
        labelAr: 'الصندوق والمحاسبة',
        labelFr: 'Caisse',
        color: 'text-purple-400',
        bgLight: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        border: 'border-purple-500/30',
        icon: 'Receipt',
      };
    case 'CLEANING':
      return {
        labelAr: 'النظافة والتعقيم',
        labelFr: 'Plonge & Hygiène',
        color: 'text-sky-400',
        bgLight: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
        border: 'border-sky-500/30',
        icon: 'Sparkles',
      };
    case 'DELIVERY':
      return {
        labelAr: 'خدمة التوصيل',
        labelFr: 'Livraison',
        color: 'text-orange-400',
        bgLight: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
        border: 'border-orange-500/30',
        icon: 'Bike',
      };
    case 'MANAGEMENT':
      return {
        labelAr: 'الإدارة والإشراف',
        labelFr: 'Direction',
        color: 'text-rose-400',
        bgLight: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        border: 'border-rose-500/30',
        icon: 'ShieldCheck',
      };
    default:
      return {
        labelAr: 'عام',
        labelFr: 'Général',
        color: 'text-slate-400',
        bgLight: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
        border: 'border-slate-500/30',
        icon: 'Users',
      };
  }
}

export function getContractLabel(contract: ContractType): { ar: string; fr: string } {
  switch (contract) {
    case 'CDI':
      return { ar: 'عقد دائم غير محدد المدة (CDI)', fr: 'Contrat Indéterminé' };
    case 'CDD':
      return { ar: 'عقد محدد المدة (CDD)', fr: 'Contrat Déterminé' };
    case 'ANAPEC':
      return { ar: 'عقد إدماج مهني (ANAPEC)', fr: 'Contrat d’Insertion ANAPEC' };
    case 'JOURNALIER':
      return { ar: 'عامل يومي (Journalier)', fr: 'Journalier' };
    case 'STAGE':
      return { ar: 'تدريب مهني (Stage)', fr: 'Stagiaire' };
    case 'SAISONNIER':
      return { ar: 'عقد موسمي (Saisonnier)', fr: 'Saisonnier' };
  }
}

export function getStatusBadge(status: EmployeeStatus): { ar: string; bg: string } {
  switch (status) {
    case 'ACTIVE':
      return { ar: 'نشط على رأس العمل', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    case 'ON_LEAVE':
      return { ar: 'في عطلة / إجازة', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
    case 'SUSPENDED':
      return { ar: 'موقوف مؤقتاً', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
    case 'TERMINATED':
      return { ar: 'منتهي العقد', bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30' };
  }
}

export function checkHealthCardStatus(expiryDateStr: string): {
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysRemaining: number;
  message: string;
} {
  if (!expiryDateStr) {
    return { isExpired: true, isExpiringSoon: true, daysRemaining: 0, message: 'لا توجد شهادة صحية مسجلة' };
  }
  const today = new Date(`${getCurrentDateString()}T00:00:00`);
  const expiry = new Date(expiryDateStr);
  const diffTime = expiry.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      isExpired: true,
      isExpiringSoon: false,
      daysRemaining,
      message: `منتهية منذ ${Math.abs(daysRemaining)} يوماً!`,
    };
  } else if (daysRemaining <= 30) {
    return {
      isExpired: false,
      isExpiringSoon: true,
      daysRemaining,
      message: `تنتهي خلال ${daysRemaining} يوماً (تجديد عاجل)`,
    };
  } else {
    return {
      isExpired: false,
      isExpiringSoon: false,
      daysRemaining,
      message: `صالحة (متبقي ${daysRemaining} يوماً)`,
    };
  }
}

// Convert amount to Moroccan Dirhams in friendly Arabic words
export function amountToArabicWords(num: number, currencyName: string = 'درهم مغربي'): string {
  if (num <= 0) return `صفر ${currencyName}`;
  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;
  
  let result = '';
  if (thousands > 0) {
    result += `${thousands} ألف `;
  }
  if (remainder > 0) {
    if (thousands > 0) result += 'و ';
    result += `${remainder} `;
  }
  return `${result.trim()} ${currencyName} فقط لا غير`;
}
