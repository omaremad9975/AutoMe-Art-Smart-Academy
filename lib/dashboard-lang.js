'use client'

import { createContext, useContext, useState } from 'react'

// ── Translations ───────────────────────────────────────────────────────────────
export const dt = {
  ar: {
    // Layout / Sidebar
    adminPanel: 'لوحة التحكم',
    navigation: 'القائمة',
    admin: 'مدير',
    logout: 'تسجيل الخروج',
    nav: {
      overview:      'نظرة عامة',
      registrations: 'التسجيلات',
      landing:       'إدارة الموقع',
      payments:      'المدفوعات',
      users:         'المستخدمون',
      settings:      'الإعدادات',
    },

    // Overview
    overviewTitle:    'نظرة عامة',
    overviewSub:      'نظرة عامة على أداء الأكاديمية',
    totalReg:         'إجمالي التسجيلات',
    totalRevenue:     'إجمالي الإيرادات',
    activeCourses:    'الكورسات الفعّالة',
    pendingPayments:  'مدفوعات معلّقة',
    confirmed:        'مؤكد',
    actionNeeded:     'يحتاج متابعة',
    allClear:         'لا توجد',
    recentReg:        'آخر التسجيلات',
    viewAll:          'عرض الكل ←',
    noRegYet:         'لا توجد تسجيلات بعد',
    colStudent:       'الطالب',
    colCourse:        'الكورس',
    colMethod:        'طريقة الدفع',
    colStatus:        'الحالة',
    colDate:          'التاريخ',
    colAmount:        'المبلغ',
    colRef:           'المرجع',
    colAction:        'إجراء',

    // Landing / Courses
    landingTitle:     'إدارة الموقع',
    landingSub:       'التحكم في محتوى الصفحة الرئيسية',
    tabCourses:       'الكورسات',
    tabSocial:        'وسائل التواصل',
    coursesTitle:     'الكورسات',
    addCourse:        '+ إضافة كورس',
    active:           'فعّال',
    inactive:         'غير فعّال',
    edit:             '✏️ تعديل',
    delete:           '🗑️ حذف',
    noCoursesYet:     'لا توجد كورسات بعد. أضف أول كورس!',
    addNewCourse:     'إضافة كورس جديد',
    editCourse:       'تعديل الكورس',
    deleteCourse:     'حذف الكورس',
    deleteConfirm:    'هل أنت متأكد من حذف',
    deleteWarning:    'لا يمكن التراجع عن هذا الإجراء.',
    fieldNameAr:      'اسم الكورس (بالعربية)',
    fieldNameEn:      'اسم الكورس (بالإنجليزية)',
    fieldPrice:       'السعر (جنيه)',
    fieldDuration:    'المدة',
    fieldSeats:       'المقاعد',
    fieldActive:      'فعّال',
    cancel:           'إلغاء',
    save:             'حفظ التغييرات',
    saving:           'جارٍ الحفظ...',
    deleting:         'جارٍ الحذف...',
    price:            'السعر',
    duration:         'المدة',
    seats:            'المقاعد',
    courses:          'كورس',

    // Social Media
    socialTitle:      'روابط وسائل التواصل',
    socialSub:        'هذه الروابط تظهر في الصفحة الرئيسية للموقع',
    socialFacebook:   'رابط فيسبوك',
    socialInstagram:  'رابط انستغرام',
    socialTiktok:     'رابط تيك توك',
    socialYoutube:    'رابط يوتيوب',
    saveSocial:       'حفظ الروابط',
    socialSaved:      '✓ تم الحفظ',

    // Registrations
    registrationsTitle: 'التسجيلات',
    searchPlaceholder:  'البحث بالاسم أو الهاتف أو البريد...',
    all:              'الكل',
    pending:          'معلّق',
    noResults:        'لا توجد نتائج',
    colPhone:         'الهاتف',
    colEmail:         'البريد الإلكتروني',

    // Payments
    paymentsTitle:    'المدفوعات',
    totalPayments:    'إجمالي المدفوعات',
    noPayments:       'لا توجد مدفوعات بعد',

    // Users
    usersTitle:       'المستخدمون والصلاحيات',
    usersSub:         'إدارة حسابات الدخول إلى لوحة التحكم',
    addUser:          '+ إضافة مستخدم',
    noUsers:          'لا يوجد مستخدمون بعد',
    addUserTitle:     'إضافة مستخدم جديد',
    fieldEmail:       'البريد الإلكتروني',
    fieldPassword:    'كلمة المرور',
    fieldRole:        'الصلاحية',
    addBtn:           'إضافة',
    removeUser:       'إزالة المستخدم',
    removeConfirm:    'إزالة',
    removing:         'جارٍ الإزالة...',
    adding:           'جارٍ الإضافة...',
    colUser:          'المستخدم',
    colEmail2:        'البريد الإلكتروني',
    colRole:          'الصلاحية',
    colJoined:        'تاريخ الإضافة',
    colActions:       'إجراءات',
    roleAdmin:        'مدير',
    roleSuperAdmin:   'مدير عام',
    roleMarketing:    'متخصص تسويق',
    youLabel:         'أنت',

    // Settings
    settingsTitle:    'الإعدادات',
    settingsSub:      'معلومات وإعدادات الأكاديمية',
    sectionAcademy:   '🏫 معلومات الأكاديمية',
    sectionAcademySub:'Basic information',
    sectionCert:      '🎓 صيغة رقم الشهادة',
    sectionCertSub:   'Certificate ID format',
    academyName:      'اسم الأكاديمية',
    phone:            'رقم الهاتف',
    email:            'البريد الإلكتروني',
    whatsapp:         'واتساب',
    certFormat:       'صيغة الشهادة',
    certHelp:         'استخدم: [COURSE], [YEAR], [NUMBER]',
    certPreview:      'معاينة',
    saveSettings:     'حفظ الإعدادات',
    savingSettings:   '⏳ جارٍ الحفظ...',
    saved:            '✓ تم الحفظ',
  },
  en: {
    // Layout / Sidebar
    adminPanel: 'Admin Panel',
    navigation: 'Navigation',
    admin: 'Admin',
    logout: 'Logout',
    nav: {
      overview:      'Overview',
      registrations: 'Registrations',
      landing:       'Landing Page',
      payments:      'Payments',
      users:         'Users',
      settings:      'Settings',
    },

    // Overview
    overviewTitle:    'Dashboard Overview',
    overviewSub:      'General overview of academy performance',
    totalReg:         'Total Registrations',
    totalRevenue:     'Total Revenue',
    activeCourses:    'Active Courses',
    pendingPayments:  'Pending Payments',
    confirmed:        'Confirmed',
    actionNeeded:     'Action needed',
    allClear:         'All clear',
    recentReg:        'Recent Registrations',
    viewAll:          'View All →',
    noRegYet:         'No registrations yet',
    colStudent:       'Student',
    colCourse:        'Course',
    colMethod:        'Method',
    colStatus:        'Status',
    colDate:          'Date',
    colAmount:        'Amount',
    colRef:           'Reference',
    colAction:        'Action',

    // Landing / Courses
    landingTitle:     'Landing Page',
    landingSub:       'Control what appears on your public website',
    tabCourses:       'Courses',
    tabSocial:        'Social Media',
    coursesTitle:     'Courses',
    addCourse:        '+ Add Course',
    active:           'Active',
    inactive:         'Inactive',
    edit:             '✏️ Edit',
    delete:           '🗑️ Delete',
    noCoursesYet:     'No courses yet. Add your first course!',
    addNewCourse:     'Add New Course',
    editCourse:       'Edit Course',
    deleteCourse:     'Delete Course',
    deleteConfirm:    'Are you sure you want to delete',
    deleteWarning:    'This action cannot be undone.',
    fieldNameAr:      'Course Name (Arabic)',
    fieldNameEn:      'Course Name (English)',
    fieldPrice:       'Price (EGP)',
    fieldDuration:    'Duration',
    fieldSeats:       'Seats',
    fieldActive:      'Active',
    cancel:           'Cancel',
    save:             'Save Changes',
    saving:           'Saving...',
    deleting:         'Deleting...',
    price:            'Price',
    duration:         'Duration',
    seats:            'Seats',
    courses:          'courses',

    // Social Media
    socialTitle:      'Social Media Links',
    socialSub:        'These links appear in your landing page footer',
    socialFacebook:   'Facebook URL',
    socialInstagram:  'Instagram URL',
    socialTiktok:     'TikTok URL',
    socialYoutube:    'YouTube URL',
    saveSocial:       'Save Links',
    socialSaved:      '✓ Saved',

    // Registrations
    registrationsTitle: 'Registrations',
    searchPlaceholder:  'Search by name, email or phone...',
    all:              'All',
    pending:          'Pending',
    noResults:        'No results found',
    colPhone:         'Phone',
    colEmail:         'Email',

    // Payments
    paymentsTitle:    'Payments',
    totalPayments:    'Total Payments',
    noPayments:       'No payments yet',

    // Users
    usersTitle:       'Users & Permissions',
    usersSub:         'Manage dashboard login accounts',
    addUser:          '+ Add User',
    noUsers:          'No users yet',
    addUserTitle:     'Add New User',
    fieldEmail:       'Email Address',
    fieldPassword:    'Password',
    fieldRole:        'Role',
    addBtn:           'Add User',
    removeUser:       'Remove User',
    removeConfirm:    'Remove',
    removing:         'Removing...',
    adding:           'Adding...',
    colUser:          'User',
    colEmail2:        'Email',
    colRole:          'Role',
    colJoined:        'Joined',
    colActions:       'Actions',
    roleAdmin:        'Admin',
    roleSuperAdmin:   'Super Admin',
    roleMarketing:    'Marketing',
    youLabel:         'You',

    // Settings
    settingsTitle:    'Settings',
    settingsSub:      'Academy information & configuration',
    sectionAcademy:   '🏫 Academy Information',
    sectionAcademySub:'معلومات الأكاديمية',
    sectionCert:      '🎓 Certificate ID Format',
    sectionCertSub:   'صيغة رقم الشهادة',
    academyName:      'Academy Name',
    phone:            'Phone Number',
    email:            'Email Address',
    whatsapp:         'WhatsApp Number',
    certFormat:       'Certificate ID Format',
    certHelp:         'Use placeholders: [COURSE], [YEAR], [NUMBER]',
    certPreview:      'Preview',
    saveSettings:     '💾 Save Settings',
    savingSettings:   '⏳ Saving...',
    saved:            '✓ Settings saved!',
  }
}

// ── Context ────────────────────────────────────────────────────────────────────
const DashboardLangContext = createContext({ lang: 'ar', t: dt.ar, isRTL: true, toggleLang: () => {} })

export function DashboardLangProvider({ children }) {
  const [lang, setLang] = useState('ar')
  const toggleLang = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))
  return (
    <DashboardLangContext.Provider value={{ lang, t: dt[lang], isRTL: lang === 'ar', toggleLang }}>
      {children}
    </DashboardLangContext.Provider>
  )
}

export function useDashboardLang() {
  return useContext(DashboardLangContext)
}
