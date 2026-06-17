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
      courses:       'الكورسات',
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

    // Courses
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
    usersTitle:       'المستخدمون',
    addAdmin:         '+ إضافة مدير',
    noUsers:          'لا يوجد مديرون بعد',
    addAdminTitle:    'إضافة مدير جديد',
    fieldEmail:       'البريد الإلكتروني',
    fieldPassword:    'كلمة المرور',
    fieldRole:        'الصلاحية',
    addBtn:           'إضافة',
    deleteAdmin:      'حذف المدير',

    // Settings
    settingsTitle:    'الإعدادات',
    settingsSub:      'إعدادات الأكاديمية',
    academyName:      'اسم الأكاديمية',
    phone:            'رقم الهاتف',
    email:            'البريد الإلكتروني',
    whatsapp:         'واتساب',
    certFormat:       'صيغة رقم الشهادة',
    saveSettings:     'حفظ الإعدادات',
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
      courses:       'Courses',
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

    // Courses
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
    usersTitle:       'Users',
    addAdmin:         '+ Add Admin',
    noUsers:          'No admins yet',
    addAdminTitle:    'Add New Admin',
    fieldEmail:       'Email',
    fieldPassword:    'Password',
    fieldRole:        'Role',
    addBtn:           'Add',
    deleteAdmin:      'Delete Admin',

    // Settings
    settingsTitle:    'Settings',
    settingsSub:      'Academy settings',
    academyName:      'Academy Name',
    phone:            'Phone Number',
    email:            'Email',
    whatsapp:         'WhatsApp',
    certFormat:       'Certificate ID Format',
    saveSettings:     'Save Settings',
    saved:            '✓ Saved',
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
