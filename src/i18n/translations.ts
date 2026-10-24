export type AppLanguage = 'ar' | 'fr' | 'en';

export interface TranslationDictionary {
  dir: 'rtl' | 'ltr';
  appName: string;
  appSubtitle: string;
  moroccoRhTag: string;
  databestConnected: string;
  records: string;
  
  // Header
  quickAttendance: string;
  calculatePayroll: string;
  addEmployee: string;
  settings: string;
  currencySelect: string;

  // Nav Tabs
  navDashboard: string;
  navEmployees: string;
  navPayroll: string;
  navAttendance: string;
  navAdvances: string;
  navTips: string;
  navDatabest: string;
  healthCardsExpiringSoon: string;
  pendingAdvancesBadge: string;

  // Settings Modal
  settingsTitle: string;
  settingsSubtitle: string;
  languageSectionTitle: string;
  languageSectionDesc: string;
  selectLanguage: string;
  langArabic: string;
  langFrench: string;
  langEnglish: string;
  restaurantLegalProfile: string;
  restaurantName: string;
  city: string;
  iceNumber: string;
  commercialRegister: string;
  taxId: string;
  patenteNumber: string;
  cnssAffiliation: string;
  phone: string;
  address: string;
  rhManager: string;
  payrollRulesTitle: string;
  payrollCalculationFormula: string;
  payrollCalculationWarning: string;
  cnssEmployeeRate: string;
  cnssCeilingNote: string;
  amoRate: string;
  amoNote: string;
  mealAllowance: string;
  payslipFooterNote: string;
  saveChanges: string;
  cancel: string;

  // Employee Table & Dashboard
  empTableTitle: string;
  empTableDesc: string;
  totalEmployees: string;
  netPayroll: string;
  overtimeHoursAmt: string;
  tipsPoolAmt: string;
  salariedCount: string;
  searchPlaceholder: string;
  allStations: string;
  filterByStation: string;
  exportExcel: string;
  addNewEmployee: string;
  colIndex: string;
  colEmpName: string;
  colPost: string;
  colSalary: string;
  colPhone: string;
  colCin: string;
  colHireDate: string;
  colActions: string;
  btnEdit: string;
  btnDelete: string;
  noMatchingEmployees: string;
  yearsSeniority: string;
  monthlyBase: string;

  // Stations
  stationKitchen: string;
  stationHall: string;
  stationBar: string;
  stationCashier: string;
  stationCleaning: string;
  stationDelivery: string;
  stationManagement: string;

  // Dashboard sections
  stationsOverviewTitle: string;
  stationsOverviewDesc: string;
  viewAll: string;
  kitchenDesc: string;
  hallDesc: string;
  barDesc: string;
  cashierCleaningDesc: string;
  advancesTitle: string;
  pendingRequests: string;
  totalPendingAdv: string;
  manageAllAdvances: string;
  statusApproved: string;
  statusPending: string;
  statusDeducted: string;

  // Employee Modal
  modalEditTitle: string;
  modalAddTitle: string;
  fieldFullName: string;
  fieldPost: string;
  fieldBaseSalary: string;
  fieldPhone: string;
  fieldCin: string;
  fieldHireDate: string;
  fieldStation: string;
  fieldContractType: string;
  fieldCnssNumber: string;
  fieldStatus: string;
  statusActive: string;
  statusOnLeave: string;
  statusSuspended: string;
  statusTerminated: string;
  contractCdi: string;
  contractCdd: string;
  contractAnapec: string;
  contractExtra: string;
  btnSaveEmployee: string;
  btnUpdateEmployee: string;
  confirmDeleteEmp: string;

  // Generic
  active: string;
  footerText: string;
}

export const translations: Record<AppLanguage, TranslationDictionary> = {
  ar: {
    dir: 'rtl',
    appName: 'OBAYOLI',
    appSubtitle: 'إدارة الموارد البشرية والرواتب بالمغرب',
    moroccoRhTag: 'RH المغرب 🇲🇦',
    databestConnected: 'DATABEST: متصل ومحفوظ',
    records: 'سجل',

    quickAttendance: 'حضور اليوم',
    calculatePayroll: 'حساب الرواتب',
    addEmployee: 'إضافة موظف',
    settings: 'الإعدادات',
    currencySelect: 'اختيار العملة',

    navDashboard: 'لوحة القيادة',
    navEmployees: 'أسماء الموظفين',
    navPayroll: 'جدول الرواتب',
    navAttendance: 'الحضور والشفتات',
    navAdvances: 'السلفيات والبدلات',
    navTips: 'صندوق البقشيش',
    navDatabest: 'قاعدة البيانات DATABEST',
    healthCardsExpiringSoon: 'شهادات صحية تنتهي قريباً',
    pendingAdvancesBadge: 'سلفيات معلقة للموافقة',

    settingsTitle: 'إعدادات OBAYOLI ومعادلة الرواتب المبسطة',
    settingsSubtitle: 'بيانات المنشأة بالمغرب • معادلة إدارية لا تشمل CNSS أو AMO أو IR',
    languageSectionTitle: 'لغة النظام (Langue du Système)',
    languageSectionDesc: 'اختر لغة واحدة للعمل بها في كامل أقسام وشاشات النظام',
    selectLanguage: 'اللغة الحالية للنظام',
    langArabic: 'العربية (المغرب) 🇲🇦',
    langFrench: 'Français (Maroc) 🇫🇷',
    langEnglish: 'English (US / UK) 🇬🇧',
    restaurantLegalProfile: 'بيانات وهوية المطعم القانونية بالمغرب',
    restaurantName: 'اسم المطعم التجاري *',
    city: 'المدينة المغربية (Casablanca, Marrakech...)',
    iceNumber: 'المعرف الموحد للمقاولة (ICE - 15 رقماً) *',
    commercialRegister: 'السجل التجاري (RC)',
    taxId: 'التعريف الضريبي (IF)',
    patenteNumber: 'رقم الضريبة المهنية (Patente)',
    cnssAffiliation: 'رقم انخراط المشغل بالضمان الاجتماعي (N° CNSS)',
    phone: 'الهاتف الإداري',
    address: 'العنوان والشارع',
    rhManager: 'مسؤول الموارد البشرية RH (خاتم الورقة)',
    payrollRulesTitle: 'معادلة جدول الرواتب المبسطة',
    payrollCalculationFormula: 'اليومي = الشهري ÷ 26. الصافي = الشهري − المرض − الغياب − التسبيق + Double Shift + عمل يوم الراحة.',
    payrollCalculationWarning: 'لا تحتسب المعادلة الحالية اقتطاعات CNSS أو AMO أو IR، ولا تستخدم كقسيمة قانونية معتمدة.',
    cnssEmployeeRate: 'نسبة اشتراك CNSS للمأجور (%)',
    cnssCeilingNote: 'القانوني 4.48% (سقف 6000 د.م)',
    amoRate: 'نسبة التأمين الإجباري AMO (%)',
    amoNote: 'القانوني 2.26% غير مسقوفة',
    mealAllowance: 'منحة القفة الافتراضية (Panier د.م)',
    payslipFooterNote: 'ملاحظة التذييل على ورقة الأداء (Bulletin de Paie)',
    saveChanges: 'حفظ التعديلات',
    cancel: 'إلغاء',

    empTableTitle: 'جدول معلومات الموظفين',
    empTableDesc: 'جدول تفصيلي يضم: اسم الموظف، الوظيفة (POST)، الراتب الشهري بالدرهم المغربي (MAD)، رقم الهاتف، رقم البطاقة الوطنية (CIN)، وتاريخ الدخول.',
    totalEmployees: 'إجمالي الموظفين',
    netPayroll: 'صافي الرواتب (Net)',
    overtimeHoursAmt: 'العمل الإضافي اليومي',
    tipsPoolAmt: 'صندوق البقشيش',
    salariedCount: 'مأجور',
    searchPlaceholder: 'بحث بالاسم، الوظيفة POST، رقم CIN، أو رقم الهاتف...',
    allStations: 'كافة الأقسام',
    filterByStation: 'تصفية الموظفين حسب القسم',
    exportExcel: 'تصدير Excel',
    addNewEmployee: 'إضافة موظف جديد',
    colIndex: '#',
    colEmpName: 'اسم الموظف',
    colPost: 'POSTE',
    colSalary: 'الراتب الشهري (د.م)',
    colPhone: 'رقم الهاتف',
    colCin: 'رقم البطاقة الوطنية (CIN)',
    colHireDate: 'تاريخ الدخول',
    colActions: 'إجراءات',
    btnEdit: 'تعديل',
    btnDelete: 'حذف',
    noMatchingEmployees: 'لا يوجد موظف مطابق للبحث الحالي.',
    yearsSeniority: 'سنوات أقدمية',
    monthlyBase: 'شهري أساسي',

    stationKitchen: 'المطبخ والطهي',
    stationHall: 'الصالة والخدمة',
    stationBar: 'البار والمشروبات',
    stationCashier: 'الصندوق',
    stationCleaning: 'النظافة والتعقيم',
    stationDelivery: 'التوصيل',
    stationManagement: 'الإدارة',

    stationsOverviewTitle: 'أقسام العمل ومحطات التشغيل في المطعم',
    stationsOverviewDesc: 'توزيع الكوادر البشرية على خطوط الإنتاج والخدمة',
    viewAll: 'عرض التفاصيل الكاملة',
    kitchenDesc: 'شيف تنفيذي، شيف مشاوي، مساعدين، وشيف حلويات',
    hallDesc: 'كابتن صالة، نوادل خدمة، استقبال الضيوف',
    barDesc: 'قهوة مختصة، عصائر طازجة، موكتيلات',
    cashierCleaningDesc: 'كاشير مبيعات، غسيل وتعقيم الأواني والمعدات',
    advancesTitle: 'طلبات السلفيات على الراتب',
    pendingRequests: 'طلب معلق',
    totalPendingAdv: 'إجمالي السلفيات المعلقة للموافقة:',
    manageAllAdvances: 'إدارة جميع السلفيات والخصومات',
    statusApproved: 'معتمدة',
    statusPending: 'قيد المراجعة',
    statusDeducted: 'مخصومة',

    modalEditTitle: 'تعديل بيانات الموظف',
    modalAddTitle: 'إضافة موظف جديد إلى المطعم',
    fieldFullName: 'اسم الموظف الكامل *',
    fieldPost: 'POSTE *',
    fieldBaseSalary: 'الراتب الشهري الأساسي (بالدرهم المغربي MAD) *',
    fieldPhone: 'رقم الهاتف *',
    fieldCin: 'رقم البطاقة الوطنية (CIN) *',
    fieldHireDate: 'تاريخ الدخول (Date d\'embauche) *',
    fieldStation: 'قسم العمل (Station) *',
    fieldContractType: 'نوع العقد (Contrat) *',
    fieldCnssNumber: 'رقم التسجيل في CNSS',
    fieldStatus: 'حالة الموظف',
    statusActive: 'نشط وعلى رأس العمل',
    statusOnLeave: 'في إجازة',
    statusSuspended: 'موقوف مؤقتاً',
    statusTerminated: 'منتهي العقد',
    contractCdi: 'عقد غير محدد المدة (CDI)',
    contractCdd: 'عقد محدد المدة (CDD)',
    contractAnapec: 'عقد إدماج أنابيك (ANAPEC)',
    contractExtra: 'مؤقت / إكسترا (Extra)',
    btnSaveEmployee: 'تسجيل الموظف',
    btnUpdateEmployee: 'حفظ التعديلات',
    confirmDeleteEmp: 'هل أنت متأكد من حذف هذا الموظف نهائياً من النظام وقاعدة البيانات DATABEST؟',

    active: 'نشط',
    footerText: 'نظام أوبايولي (OBAYOLI) • إدارة الموارد البشرية والرواتب لمطاعم المغرب 🇲🇦 • الدرهم المغربي (MAD) • قاعدة البيانات DATABEST',
  },

  fr: {
    dir: 'ltr',
    appName: 'OBAYOLI',
    appSubtitle: 'Gestion des Ressources Humaines & Paie au Maroc',
    moroccoRhTag: 'RH Maroc 🇲🇦',
    databestConnected: 'DATABEST: Connecté & Synchronisé',
    records: 'enregistrements',

    quickAttendance: 'Pointage du jour',
    calculatePayroll: 'Calculer la paie',
    addEmployee: 'Ajouter Salarié',
    settings: 'Paramètres',
    currencySelect: 'Devise',

    navDashboard: 'Tableau de Bord',
    navEmployees: 'Liste des Salariés',
    navPayroll: 'Tableau des salaires',
    navAttendance: 'Pointage & Horaires',
    navAdvances: 'Acomptes & Primes',
    navTips: 'Pourboires (Tips)',
    navDatabest: 'Base de Données DATABEST',
    healthCardsExpiringSoon: 'Certificats médicaux expirant bientôt',
    pendingAdvancesBadge: 'Acomptes en attente de validation',

    settingsTitle: 'Paramètres OBAYOLI et calcul simplifié des salaires',
    settingsSubtitle: 'Données de l’établissement • calcul sans retenues CNSS, AMO ou IR',
    languageSectionTitle: 'Langue du Système (System Language)',
    languageSectionDesc: 'Sélectionnez une langue unique pour l\'ensemble des modules du système',
    selectLanguage: 'Langue active de l\'application',
    langArabic: 'العربية (Maroc) 🇲🇦',
    langFrench: 'Français (Maroc) 🇫🇷',
    langEnglish: 'English (US / UK) 🇬🇧',
    restaurantLegalProfile: 'Identité Juridique de l\'Établissement (Maroc)',
    restaurantName: 'Raison Sociale / Nom Commercial *',
    city: 'Ville (Casablanca, Marrakech, Rabat...)',
    iceNumber: 'Identifiant Commun de l\'Entreprise (ICE - 15 chiffres) *',
    commercialRegister: 'Registre du Commerce (RC)',
    taxId: 'Identifiant Fiscal (IF)',
    patenteNumber: 'Taxe Professionnelle (Patente)',
    cnssAffiliation: 'N° d\'Affiliation Employeur CNSS',
    phone: 'Téléphone Administratif',
    address: 'Adresse & Siège Social',
    rhManager: 'Responsable RH (Signature & Cachet)',
    payrollRulesTitle: 'Calcul simplifié des salaires',
    payrollCalculationFormula: 'Journalier = mensuel ÷ 26. Net = mensuel − maladie − absence − avance + Double Shift + jour de repos travaillé.',
    payrollCalculationWarning: 'Cette formule ne calcule pas les retenues CNSS, AMO ou IR et ne constitue pas un bulletin de paie légal.',
    cnssEmployeeRate: 'Taux Salarié CNSS (%)',
    cnssCeilingNote: 'Légal: 4.48% (Plafond 6 000 MAD)',
    amoRate: 'Taux AMO Salarié (%)',
    amoNote: 'Légal: 2.26% non plafonné',
    mealAllowance: 'Indemnité Panier Standard (MAD)',
    payslipFooterNote: 'Mention légale de bas de bulletin de paie',
    saveChanges: 'Enregistrer les modifications',
    cancel: 'Annuler',

    empTableTitle: 'Tableau des Salariés',
    empTableDesc: 'Répertoire complet des collaborateurs: Nom, Poste, Salaire mensuel (MAD), Téléphone, CIN et Date d\'embauche.',
    totalEmployees: 'Effectif Total',
    netPayroll: 'Masse Nette (Net à Payer)',
    overtimeHoursAmt: 'Heures Supplémentaires',
    tipsPoolAmt: 'Cagnotte Pourboires',
    salariedCount: 'salariés',
    searchPlaceholder: 'Rechercher par nom, poste, CIN ou téléphone...',
    allStations: 'Tous les Départements',
    filterByStation: 'Filtrer par Département',
    exportExcel: 'Exporter Excel',
    addNewEmployee: 'Nouveau Salarié',
    colIndex: 'N°',
    colEmpName: 'Nom du Salarié',
    colPost: 'POSTE',
    colSalary: 'Salaire Mensuel (MAD)',
    colPhone: 'Téléphone',
    colCin: 'N° CIN',
    colHireDate: 'Date d\'embauche',
    colActions: 'Actions',
    btnEdit: 'Modifier',
    btnDelete: 'Supprimer',
    noMatchingEmployees: 'Aucun salarié ne correspond aux critères de recherche.',
    yearsSeniority: 'ans d\'ancienneté',
    monthlyBase: 'base mensuelle',

    stationKitchen: 'Cuisine & Chaud',
    stationHall: 'Salle & Service',
    stationBar: 'Bar & Boissons',
    stationCashier: 'Caisse',
    stationCleaning: 'Plonge & Hygiène',
    stationDelivery: 'Livraison',
    stationManagement: 'Direction',

    stationsOverviewTitle: 'Départements & Postes de Travail du Restaurant',
    stationsOverviewDesc: 'Répartition des ressources humaines sur les lignes de production et de service',
    viewAll: 'Afficher les détails',
    kitchenDesc: 'Chef exécutif, chefs de partie, commis et pâtissiers',
    hallDesc: 'Maîtres d\'hôtel, chefs de rang, serveurs et accueil',
    barDesc: 'Baristas, barmans cocktails et jus frais',
    cashierCleaningDesc: 'Caissiers de caisse, plongeurs et hygiène',
    advancesTitle: 'Demandes d\'Acomptes sur Salaire',
    pendingRequests: 'demandes en attente',
    totalPendingAdv: 'Total acomptes en attente de validation:',
    manageAllAdvances: 'Gérer tous les acomptes et primes',
    statusApproved: 'Validé',
    statusPending: 'En attente',
    statusDeducted: 'Déduit',

    modalEditTitle: 'Modifier le Salarié',
    modalAddTitle: 'Ajouter un Nouveau Salarié au Restaurant',
    fieldFullName: 'Nom & Prénom Complet *',
    fieldPost: 'POSTE *',
    fieldBaseSalary: 'Salaire de Base Mensuel (en Dirhams MAD) *',
    fieldPhone: 'Numéro de Téléphone *',
    fieldCin: 'Numéro de Carte d\'Identité Nationale (CIN) *',
    fieldHireDate: 'Date d\'embauche *',
    fieldStation: 'Département / Station *',
    fieldContractType: 'Type de Contrat *',
    fieldCnssNumber: 'Numéro d\'Immatriculation CNSS',
    fieldStatus: 'Statut du Salarié',
    statusActive: 'Actif en poste',
    statusOnLeave: 'En congé',
    statusSuspended: 'Suspendu',
    statusTerminated: 'Contrat clôturé',
    contractCdi: 'Contrat à Durée Indéterminée (CDI)',
    contractCdd: 'Contrat à Durée Déterminée (CDD)',
    contractAnapec: 'Contrat d\'Insertion ANAPEC',
    contractExtra: 'Extra / Shift Temporaire',
    btnSaveEmployee: 'Enregistrer le Salarié',
    btnUpdateEmployee: 'Enregistrer les Modifications',
    confirmDeleteEmp: 'Êtes-vous sûr de vouloir supprimer définitivement ce salarié de la base DATABEST ?',

    active: 'Actif',
    footerText: 'Système OBAYOLI • Gestion RH et Paie pour la Restauration au Maroc 🇲🇦 • Dirham Marocain (MAD) • Moteur DATABEST',
  },

  en: {
    dir: 'ltr',
    appName: 'OBAYOLI',
    appSubtitle: 'Restaurant HR & Payroll Management in Morocco',
    moroccoRhTag: 'Morocco HR 🇲🇦',
    databestConnected: 'DATABEST: Connected & Synced',
    records: 'records',

    quickAttendance: 'Today\'s Attendance',
    calculatePayroll: 'Calculate Payroll',
    addEmployee: 'Add Employee',
    settings: 'Settings',
    currencySelect: 'Currency',

    navDashboard: 'Dashboard',
    navEmployees: 'Employee Directory',
    navPayroll: 'Payroll Table',
    navAttendance: 'Attendance & Shifts',
    navAdvances: 'Advances & Bonuses',
    navTips: 'Tips Pool',
    navDatabest: 'Database DATABEST',
    healthCardsExpiringSoon: 'Health cards expiring soon',
    pendingAdvancesBadge: 'Advances pending approval',

    settingsTitle: 'OBAYOLI Settings & Simplified Payroll Formula',
    settingsSubtitle: 'Restaurant details • formula excludes CNSS, AMO, and income-tax deductions',
    languageSectionTitle: 'System Language',
    languageSectionDesc: 'Select a single language to operate across all modules of the application',
    selectLanguage: 'Active System Language',
    langArabic: 'العربية (Morocco) 🇲🇦',
    langFrench: 'Français (Morocco) 🇫🇷',
    langEnglish: 'English (US / UK) 🇬🇧',
    restaurantLegalProfile: 'Restaurant Legal Profile (Morocco)',
    restaurantName: 'Restaurant Registered Trade Name *',
    city: 'City (Casablanca, Marrakech, Rabat...)',
    iceNumber: 'Common Enterprise Identifier (ICE - 15 digits) *',
    commercialRegister: 'Commercial Register (RC)',
    taxId: 'Tax Identifier (IF)',
    patenteNumber: 'Professional Tax (Patente)',
    cnssAffiliation: 'Employer CNSS Affiliation Number',
    phone: 'Administrative Phone',
    address: 'Street Address & Headquarters',
    rhManager: 'HR Manager (Signature & Stamp)',
    payrollRulesTitle: 'Simplified payroll calculation',
    payrollCalculationFormula: 'Daily = monthly salary ÷ 26. Net = monthly − sick days − absences − advances + Double Shift + rest-day work.',
    payrollCalculationWarning: 'This formula does not calculate CNSS, AMO, or income-tax deductions and is not an official payslip.',
    cnssEmployeeRate: 'CNSS Employee Contribution Rate (%)',
    cnssCeilingNote: 'Legal rate: 4.48% (Cap at 6,000 MAD)',
    amoRate: 'AMO Health Insurance Rate (%)',
    amoNote: 'Legal rate: 2.26% uncapped',
    mealAllowance: 'Default Meal Allowance (Panier MAD)',
    payslipFooterNote: 'Official Payslip Footer Mention',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',

    empTableTitle: 'Employee Information Table',
    empTableDesc: 'Comprehensive staff directory: Name, Role (POST), Monthly Salary (MAD), Phone, National ID (CIN), and Hire Date.',
    totalEmployees: 'Total Employees',
    netPayroll: 'Net Payroll',
    overtimeHoursAmt: 'Daily Overtime',
    tipsPoolAmt: 'Tips Pool',
    salariedCount: 'employees',
    searchPlaceholder: 'Search by name, role (POST), CIN, or phone number...',
    allStations: 'All Departments',
    filterByStation: 'Filter by Department',
    exportExcel: 'Export Excel',
    addNewEmployee: 'Add New Employee',
    colIndex: '#',
    colEmpName: 'Employee Name',
    colPost: 'POSTE',
    colSalary: 'Monthly Salary (MAD)',
    colPhone: 'Phone Number',
    colCin: 'National ID (CIN)',
    colHireDate: 'Hire Date',
    colActions: 'Actions',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    noMatchingEmployees: 'No employee matches the current filter.',
    yearsSeniority: 'years seniority',
    monthlyBase: 'base monthly',

    stationKitchen: 'Kitchen & Cooking',
    stationHall: 'Dining Hall & Service',
    stationBar: 'Bar & Beverages',
    stationCashier: 'Cashier',
    stationCleaning: 'Cleaning & Stewarding',
    stationDelivery: 'Delivery',
    stationManagement: 'Management',

    stationsOverviewTitle: 'Restaurant Stations & Operating Sections',
    stationsOverviewDesc: 'Distribution of human resources across production and service lines',
    viewAll: 'View Details',
    kitchenDesc: 'Executive chef, station chefs, commis and pastry team',
    hallDesc: 'Floor captains, servers, hostesses and table service',
    barDesc: 'Specialty coffee baristas, mixologists and fresh juices',
    cashierCleaningDesc: 'POS cashiers, equipment dishwashing and sanitation',
    advancesTitle: 'Salary Advance Requests',
    pendingRequests: 'requests pending',
    totalPendingAdv: 'Total pending advances awaiting approval:',
    manageAllAdvances: 'Manage All Advances and Adjustments',
    statusApproved: 'Approved',
    statusPending: 'Pending Review',
    statusDeducted: 'Deducted',

    modalEditTitle: 'Edit Employee Information',
    modalAddTitle: 'Add New Restaurant Employee',
    fieldFullName: 'Full Name *',
    fieldPost: 'POSTE *',
    fieldBaseSalary: 'Monthly Base Salary (in Moroccan MAD) *',
    fieldPhone: 'Phone Number *',
    fieldCin: 'National Identity Card (CIN) *',
    fieldHireDate: 'Hire Date *',
    fieldStation: 'Department / Station *',
    fieldContractType: 'Contract Type *',
    fieldCnssNumber: 'CNSS Registration Number',
    fieldStatus: 'Employee Status',
    statusActive: 'Active on duty',
    statusOnLeave: 'On leave',
    statusSuspended: 'Temporarily suspended',
    statusTerminated: 'Contract ended',
    contractCdi: 'Permanent Contract (CDI)',
    contractCdd: 'Fixed-Term Contract (CDD)',
    contractAnapec: 'ANAPEC Insertion Contract',
    contractExtra: 'Shift Extra / Temporary',
    btnSaveEmployee: 'Save Employee',
    btnUpdateEmployee: 'Save Changes',
    confirmDeleteEmp: 'Are you sure you want to permanently delete this employee from DATABEST?',

    active: 'Active',
    footerText: 'OBAYOLI System • Restaurant HR & Payroll in Morocco 🇲🇦 • Moroccan Dirham (MAD) • DATABEST Engine',
  },
};

export const getTranslation = (lang?: string): TranslationDictionary => {
  if (lang === 'fr') return translations.fr;
  if (lang === 'en') return translations.en;
  return translations.ar;
};
