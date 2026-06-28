'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

// ==========================================
// BILINGUAL TRANSLATION DATA
// ==========================================
const t = {
  ar: {
    // Navbar
    navHome: 'الرئيسية',
    navCourses: 'الكورسات',
    navAbout: 'من نحن',
    navContact: 'تواصل معنا',
    logoText: 'SMART ACADEMY',
    logoSub: 'أرت سمارت اكاديمي',
    langToggleLabel: 'English',
    ctaRegister: 'سجّل الآن',
    studentPortal: '🎓 بوابة الطلاب',

    // Hero
    heroBadge: '🎓 أرت سمارت اكاديمي',
    heroTitle: 'اكتشف موهبتك، طوّر مهاراتك',
    heroSub: 'حيث يلتقي الإبداع بالتميّز — انضم إلى مجتمع يحوّل الشغف إلى مهارة والأفكار إلى أثر.',
    heroBtnPrimary: 'سجّل الآن',
    heroBtnSecondary: 'اكتشف الكورسات',
    heroSlogan: 'اكتشف · تعلّم · ابدع',

    // Stats
    statsGraduates: '+500 طالب متخرج',
    statsFields: '7 مجالات تدريبية',
    statsTrainers: '+20 مدرب متخصص',
    statsExperience: '٤ سنوات خبرة',

    // Courses Section
    coursesLabel: 'الكورسات التدريبية',
    coursesTitle: 'الكورسات التدريبية',
    coursesSub: 'كورسات احترافية مع أفضل المدربين',
    coursesDuration: 'المدة',
    coursesPrice: 'السعر',
    coursesEnroll: 'سجّل الآن',
    coursesList: [
      {
        id: 1,
        title: 'التفكير الإبداعي',
        description: 'تعلّم كيف تفكر خارج الصندوق وتحوّل أفكارك إلى حلول مبتكرة. كورس مكثّف يطوّر مهاراتك الإبداعية وقدرتك على حل المشكلات بأساليب غير تقليدية.',
        instructor: 'د. سارة محمد',
        price: '٢٫٥٠٠ جنيه',
        duration: '٨ أسابيع',
        icon: 'lightbulb',
        initials: 'س م'
      },
      {
        id: 2,
        title: 'الذكاء الاصطناعي',
        description: 'مقدمة شاملة في عالم الذكاء الاصطناعي وتطبيقاته العملية. تعرّف على أساسيات ML والـ AI وكيفية توظيفها في حياتك المهنية.',
        instructor: 'م. أحمد خالد',
        price: '٣٫٠٠٠ جنيه',
        duration: '١٠ أسابيع',
        icon: 'cpu',
        initials: 'أ خ'
      },
      {
        id: 3,
        title: 'اللغة الصينية',
        description: 'تعلّم اللغة الصينية من الصفر مع أفضل الأساليب الحديثة. كورس متكامل يشمل المحادثة والكتابة والثقافة الصينية.',
        instructor: 'أ. لي وانغ',
        price: '٢٫٢٠٠ جنيه',
        duration: '١٢ أسبوعًا',
        icon: 'globe',
        initials: 'ل و'
      }
    ],

    // About Section
    aboutBadge: 'من نحن؟',
    aboutTitle: 'أرت سمارت اكاديمي',
    aboutBody: 'أرت سمارت اكاديمي هي أكاديمية تدريب متخصصة تابعة لشركة أرت سمارت سوليوشنز، نؤمن بأن الإبداع والتعلّم يصنعان الفرق. نقدم برامج تدريبية متنوعة لجميع الأعمار من ٤ إلى ٣٠ عامًا في مجالات اللغات والفنون والموسيقى والرياضة والعلوم والابتكار وتطوير الذات.',
    aboutFeature1: 'بيئة تعليمية متميزة',
    aboutFeature2: 'مدربون معتمدون',
    aboutFeature3: 'منهج دولي',

    // AI Conference
    conferenceBadge: '🏆 إنجازنا الأحدث',
    conferenceTitle: 'نظّمنا المؤتمر الدولي للذكاء الاصطناعي',
    conferenceBody: 'فخورون بتنظيم المؤتمر الدولي للذكاء الاصطناعي، وعرض ابتكارات طلابنا، وتقديم أحدث التطورات التعليمية في مجالات الذكاء الاصطناعي وتطبيقاته وتطوير مهارات المستقبل.',
    conferenceUniversity: '',

    // How to Register
    registerTitle: 'كيف تسجّل؟',
    step1Title: 'اختر الكورس',
    step1Desc: 'تصفح كورساتنا المميزة واختيار التخصص المناسب لك ولأهدافك.',
    step2Title: 'املأ البيانات',
    step2Desc: 'قم بملء استمارة التسجيل الإلكترونية بكافة البيانات المطلوبة للتواصل.',
    step3Title: 'ادفع',
    step3Desc: 'طرق الدفع المتوفرة والميسرة لتأكيد التسجيل بكل سهولة وأمان.',
    step3Detail: '(Fawry, Vodafone Cash, InstaPay)',
    step4Title: 'ابدأ رحلتك',
    step4Desc: 'انطلق في رحلة التعلم والإبداع والتطور العملي مع أفضل الخبراء.',

    // Testimonials
    testimonialsTitle: 'ماذا قال طلابنا؟',
    testimonialsList: [
      {
        stars: 5,
        quote: 'المؤتمر الدولي للذكاء الاصطناعي كان تجربة استثنائية. استفدت من المحتوى العلمي والتواصل مع خبراء من مختلف أنحاء العالم.',
        name: 'كريم أحمد',
        course: 'المؤتمر الدولي للذكاء الاصطناعي',
        initials: 'ك أ'
      },
      {
        stars: 5,
        quote: 'مشاركتي في المؤتمر الدولي للذكاء الاصطناعي فتحت أمامي آفاقاً جديدة. العروض التقديمية والنقاشات كانت على أعلى مستوى.',
        name: 'مريم علي',
        course: 'المؤتمر الدولي للذكاء الاصطناعي',
        initials: 'م ع'
      },
      {
        stars: 5,
        quote: 'حضرت المؤتمر الدولي للذكاء الاصطناعي وخرجت بأفكار ومهارات لم أتوقعها. فريق أرت سمارت أكاديمي محترف جداً في التنظيم.',
        name: 'منى يوسف',
        course: 'المؤتمر الدولي للذكاء الاصطناعي',
        initials: 'م ي'
      }
    ],

    // Final CTA
    ctaTitle: 'جاهز تبدأ رحلتك؟',
    ctaPrimary: 'سجّل الآن',
    ctaWhatsApp: 'تواصل على واتساب',

    // Footer
    footerTagline: 'اكتشف · تعلّم · ابدع',
    footerQuickLinks: 'روابط سريعة',
    footerContact: 'تواصل معنا',
    footerPhone: '+20 100 000 0000',
    footerEmail: 'info@artsmartacademy.com',
    footerAddress: 'القاهرة، مصر',
    footerCopyright: '© 2026 أرت سمارت اكاديمي. جميع الحقوق محفوظة.'
  },
  en: {
    // Navbar
    navHome: 'Home',
    navCourses: 'Courses',
    navAbout: 'About Us',
    navContact: 'Contact Us',
    logoText: 'SMART ACADEMY',
    logoSub: 'Art Smart Academy',
    langToggleLabel: 'العربية',
    ctaRegister: 'Register Now',
    studentPortal: '🎓 Student Portal',

    // Hero
    heroBadge: '🎓 Art Smart Academy',
    heroTitle: 'Discover Your Talent, Develop Your Skills',
    heroSub: 'Where creativity meets excellence — join a community that turns passion into skill and ideas into impact.',
    heroBtnPrimary: 'Register Now',
    heroBtnSecondary: 'Explore Courses',
    heroSlogan: 'Discover · Learn · Create',

    // Stats
    statsGraduates: '+500 Graduates',
    statsFields: '7 Training Fields',
    statsTrainers: '+20 Expert Trainers',
    statsExperience: '4 Years Experience',

    // Courses Section
    coursesLabel: 'Training Courses',
    coursesTitle: 'Training Courses',
    coursesSub: 'Professional courses with top instructors',
    coursesDuration: 'Duration',
    coursesPrice: 'Price',
    coursesEnroll: 'Enroll Now',
    coursesList: [
      {
        id: 1,
        title: 'Creative Thinking',
        description: 'Learn to think outside the box and turn your ideas into innovative solutions. An intensive course that builds creative skills and unconventional problem-solving.',
        instructor: 'Dr. Sara Mohamed',
        price: 'EGP 2,500',
        duration: '8 Weeks',
        icon: 'lightbulb',
        initials: 'SM'
      },
      {
        id: 2,
        title: 'Artificial Intelligence',
        description: 'A comprehensive introduction to AI and its practical applications. Learn ML fundamentals and how to apply them in your career.',
        instructor: 'Eng. Ahmed Khaled',
        price: 'EGP 3,000',
        duration: '10 Weeks',
        icon: 'cpu',
        initials: 'AK'
      },
      {
        id: 3,
        title: 'Chinese Language',
        description: 'Learn Chinese from scratch with modern methods. A complete course covering conversation, writing, and Chinese culture.',
        instructor: 'Prof. Li Wang',
        price: 'EGP 2,200',
        duration: '12 Weeks',
        icon: 'globe',
        initials: 'LW'
      }
    ],

    // About Section
    aboutBadge: 'About Us',
    aboutTitle: 'Art Smart Academy',
    aboutBody: 'Art Smart Academy is a specialized training academy under Art Smart Solutions. We believe creativity and learning make the difference. We offer diverse training programs for all ages from 4 to 30 in languages, arts, music, sports, sciences, innovation, and personal development.',
    aboutFeature1: 'Excellence',
    aboutFeature2: 'Certified Trainers',
    aboutFeature3: 'International Curriculum',

    // AI Conference
    conferenceBadge: '🏆 Our Latest Achievement',
    conferenceTitle: 'We Organized the International AI Conference',
    conferenceBody: 'Proud to have organized the International AI Conference — showcasing student innovations and the latest advancements in AI education.',
    conferenceUniversity: '',

    // How to Register
    registerTitle: 'How to Register?',
    step1Title: 'Choose Course',
    step1Desc: 'Browse our distinct courses and choose the track that fits your goals.',
    step2Title: 'Fill Details',
    step2Desc: 'Complete the online registration form with all required details.',
    step3Title: 'Pay',
    step3Desc: 'Easy and secure payment methods to confirm your seat booking.',
    step3Detail: '(Fawry, Vodafone Cash, InstaPay)',
    step4Title: 'Start Your Journey',
    step4Desc: 'Embark on a journey of learning, creativity, and career development.',

    // Testimonials
    testimonialsTitle: 'What Our Students Say',
    testimonialsList: [
      {
        stars: 5,
        quote: 'The AI International Conference was an exceptional experience. I gained so much from the scientific content and networking with experts from around the world.',
        name: 'Karim Ahmed',
        course: 'AI International Conference',
        initials: 'KA'
      },
      {
        stars: 5,
        quote: 'Attending the AI International Conference opened new horizons for me. The presentations and discussions were at the highest level.',
        name: 'Mariam Ali',
        course: 'AI International Conference',
        initials: 'MA'
      },
      {
        stars: 5,
        quote: 'I attended the AI International Conference and left with ideas and skills I never expected. Art Smart Academy's team is incredibly professional.',
        name: 'Mona Youssef',
        course: 'AI International Conference',
        initials: 'MY'
      }
    ],

    // Final CTA
    ctaTitle: 'Ready to Start Your Journey?',
    ctaPrimary: 'Register Now',
    ctaWhatsApp: 'WhatsApp Chat',

    // Footer
    footerTagline: 'Discover · Learn · Create',
    footerQuickLinks: 'Quick Links',
    footerContact: 'Contact Us',
    footerPhone: '+20 100 000 0000',
    footerEmail: 'info@artsmartacademy.com',
    footerAddress: 'Cairo, Egypt',
    footerCopyright: '© 2026 Art Smart Academy. All Rights Reserved.'
  }
}

// ==========================================
// SVG ICON COMPONENT
// ==========================================
function Icon({ name, className = 'w-6 h-6', ...props }) {
  const icons = {
    lightbulb: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8M12 3a9 9 0 0 0-9 9c0 1.94.62 3.73 1.68 5.18L6.4 19.4a1 1 0 0 0 .76.6h9.68a1 1 0 0 0 .76-.6l1.72-2.22A8.96 8.96 0 0 0 21 12a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    cpu: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
      </svg>
    ),
    globe: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
    check: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" {...props}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    star: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    award: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    phone: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.302a12.017 12.017 0 0 1-5.905-5.905c-.24-.441-.074-.927.302-1.21l1.293-.97a1.125 1.125 0 0 0 .417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    mail: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    mapPin: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    menu: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" {...props}>
        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    close: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" {...props}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    instagram: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    facebook: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    whatsapp: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
    tiktok: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.83 1.55V6.79a4.85 4.85 0 0 1-1.06-.1z" />
      </svg>
    ),
    youtube: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    palette: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-1.243 2.25 2.25 0 0 1 2.25-2.25h1.371a2.25 2.25 0 0 0 2.222-1.755 4.502 4.502 0 0 0-7.863-4.125Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121 19 19m-7-7 7-7m-7 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
      </svg>
    ),
    trophy: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3-3h.375a3 3 0 0 0 3-3v-.375a3 3 0 0 0-3-3h-.375a3 3 0 0 1-3-3V6.75m9 12V6.75m-9 12v-1.5m0-7.5h-9m0 0a3 3 0 0 0-3 3v.375a3 3 0 0 0 3 3H3.75a3 3 0 0 1 3 3v1.5m0-12v12m0 0a3 3 0 0 0 3 3h3a3 3 0 0 0 3-3V6.75m0 0a3 3 0 0 0-3-3h-3a3 3 0 0 0-3 3Z" />
      </svg>
    ),
    music: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 0v11.25m0-11.25L9 9M9 9v11.25m0 0a3 3 0 11-6 0 3 3 0 016 0zm10.5-3a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
  return icons[name] || null
}

const COURSE_ICON_MAP = {
  art:       { icon: 'palette', bg: '#F3E8FF', color: '#9333EA' },
  ai:        { icon: 'cpu',     bg: '#DBEAFE', color: '#3B82F6' },
  languages: { icon: 'globe',   bg: '#D1FAE5', color: '#059669' },
  sports:    { icon: 'trophy',  bg: '#FFE4E6', color: '#E11D48' },
  other:     { icon: 'star',    bg: '#FFF0E8', color: '#FF5C1A' },
}

// ==========================================
// MAIN LANDING PAGE COMPONENT
// ==========================================
// CONFERENCE PHOTO CAROUSEL
// ==========================================
// Hardcoded fallback (shown if DB has no photos yet)
const FALLBACK_PHOTOS = [
  { id: 'f1', url: '/conference/conf1.jpg',    caption_ar: 'صورة جماعية مع المشاركين والمنظمين',          caption_en: 'Group photo with all conference attendees and organizers' },
  { id: 'f2', url: '/conference/IMG_2259.jpg', caption_ar: 'طلاب أرت سمارت في المؤتمر',                   caption_en: 'Students representing Art Smart Academy at the conference' },
  { id: 'f3', url: '/conference/IMG_2308.jpg', caption_ar: 'اجتماع رسمي مع كبار المشاركين',               caption_en: 'Official meeting with conference dignitaries' },
  { id: 'f4', url: '/conference/conf2.jpg',    caption_ar: 'جلسات وعروض المؤتمر',                         caption_en: 'Conference sessions and presentations' },
  { id: 'f5', url: '/conference/conf3.jpg',    caption_ar: 'أبرز لحظات المؤتمر الدولي للذكاء الاصطناعي', caption_en: 'Highlights from the International AI Conference' },
]

// ==========================================
// REGISTRATION MODAL
// ==========================================
const MODAL_T = {
  ar: {
    title: 'سجّل في الكورس', sub: 'أدخل بياناتك وسنتواصل معك قريباً',
    name: 'الاسم الكامل', namePh: 'مثال: محمد أحمد',
    phone: 'رقم الهاتف', phonePh: '+20 / +1 / ...',
    email: 'البريد الإلكتروني', emailPh: 'example@email.com',
    sameWa: 'واتساب نفس رقم الهاتف',
    whatsapp: 'رقم واتساب', whatsappPh: '+20 / +1 / ...',
    course: 'الكورس المطلوب', selectCourse: '— اختر الكورس —',
    payment: 'طريقة الدفع',
    submit: 'إرسال الطلب', submitting: 'جارٍ الإرسال...',
    successTitle: 'شكراً لك! 🎉',
    successSub: 'تم استلام طلب تسجيلك بنجاح.',
    successCard: 'سيصلك إيميل تأكيد قريباً يحتوي على تعليمات الدفع بالبطاقة. بمجرد الدفع سيتم تأكيد تسجيلك تلقائياً.',
    successManual: 'تم استلام طلبك وإيصال الدفع بنجاح. سيقوم فريق الأكاديمية بمراجعة الإيصال وتأكيد تسجيلك خلال 24 ساعة — ستصلك رسالة تأكيد على بريدك الإلكتروني.',
    nextTitle: 'الخطوات القادمة',
    nextEmail: 'انتظر رسالة التأكيد على بريدك الإلكتروني بعد مراجعة الإيصال.',
    nextContact: 'سيتواصل معك فريقنا لتأكيد موعد بدء الكورس.',
    nextSpam: 'تحقق من مجلد Spam إذا لم تصلك رسالة التأكيد.',
    close: 'رائع، شكراً!', required: 'هذا الحقل مطلوب',
    loadingCourses: 'جارٍ تحميل الكورسات...',
    noCourses: 'لا توجد كورسات متاحة حالياً',
    spamNote: 'تحقق من مجلد الرسائل غير المرغوب فيها إذا لم يصلك الإيميل.',
    // Card details
    cardDetailsTitle: '٤ — بيانات البطاقة',
    cardName: 'الاسم على البطاقة', cardNamePh: 'مثال: MOHAMED AHMED',
    cardNumber: 'رقم البطاقة', cardNumberPh: 'XXXX  XXXX  XXXX  XXXX',
    cardExpiry: 'تاريخ الانتهاء', cardExpiryPh: 'MM/YY',
    cardCvv: 'CVV', cardCvvPh: '•••',
    cardNote: 'سيتواصل معك فريقنا لإتمام الدفع بالبطاقة عبر بوابة فوري الآمنة.',
    cardComingSoon: '🔒 بوابة الدفع الإلكتروني قيد الإعداد — سيتواصل معك فريقنا لإتمام العملية.',
    // Receipt upload
    payDetailsTitle: '٤ — أكمل الدفع وارفع الإيصال',
    payDetailsHolder: 'اسم الحساب',
    payDetailsNumber: 'الرقم',
    payDetailsInstruction: 'حوّل المبلغ المطلوب ثم ارفع صورة الإيصال أدناه.',
    receiptLabel: 'صورة إيصال الدفع',
    receiptBtn: 'اضغط لرفع الصورة',
    receiptHint: 'JPG, PNG, HEIC, PDF — حتى 5 ميغابايت',
    receiptUploading: 'جارٍ رفع الصورة...',
    receiptUploaded: '✓ تم رفع الإيصال',
    receiptRequired: 'يجب رفع إيصال الدفع قبل إرسال الطلب',
    receiptError: 'حدث خطأ أثناء رفع الصورة، حاول مرة أخرى',
  },
  en: {
    title: 'Register for a Course', sub: "Fill in your details and we'll be in touch soon",
    name: 'Full Name', namePh: 'e.g. Mohamed Ahmed',
    phone: 'Phone Number', phonePh: '+20 / +1 / ...',
    email: 'Email Address', emailPh: 'example@email.com',
    sameWa: 'WhatsApp is same as phone',
    whatsapp: 'WhatsApp Number', whatsappPh: '+20 / +1 / ...',
    course: 'Course', selectCourse: '— Select a course —',
    payment: 'Payment Method',
    submit: 'Submit Registration', submitting: 'Submitting...',
    successTitle: 'Thank You! 🎉',
    successSub: 'Your registration has been received successfully.',
    successCard: "A confirmation email is on its way with your card payment instructions. Once paid, your registration will be auto-confirmed.",
    successManual: "Your registration and receipt have been received. Our team will review your payment and confirm your registration within 24 hours — you'll receive a confirmation email once done.",
    nextTitle: "What's next",
    nextEmail: 'Wait for a confirmation email after your receipt is reviewed.',
    nextContact: 'Our team will reach out to confirm your course start date.',
    nextSpam: "Check your Spam folder if the confirmation email doesn't show up.",
    close: 'Got it, thank you!', required: 'This field is required',
    loadingCourses: 'Loading courses...',
    noCourses: 'No courses available right now',
    spamNote: "Check your spam folder too if the email doesn't arrive within a few minutes.",
    // Card details
    cardDetailsTitle: '4 — Card Details',
    cardName: 'Name on Card', cardNamePh: 'e.g. MOHAMED AHMED',
    cardNumber: 'Card Number', cardNumberPh: 'XXXX  XXXX  XXXX  XXXX',
    cardExpiry: 'Expiry Date', cardExpiryPh: 'MM/YY',
    cardCvv: 'CVV', cardCvvPh: '•••',
    cardNote: 'Our team will contact you to complete card payment via Fawry secure gateway.',
    cardComingSoon: '🔒 Online card payment gateway is being set up — our team will contact you to complete the payment.',
    // Receipt upload
    payDetailsTitle: '4 — Complete Payment & Upload Receipt',
    payDetailsHolder: 'Account Name',
    payDetailsNumber: 'Number',
    payDetailsInstruction: 'Send the required amount, then upload your payment screenshot below.',
    receiptLabel: 'Payment Receipt Screenshot',
    receiptBtn: 'Click to upload screenshot',
    receiptHint: 'JPG, PNG, HEIC, PDF — up to 5 MB',
    receiptUploading: 'Uploading...',
    receiptUploaded: '✓ Receipt uploaded',
    receiptRequired: 'Please upload a payment receipt before submitting',
    receiptError: 'Upload failed, please try again',
  },
}

// ── Payment Logos ────────────────────────────────────────────────────────────

function CardLogo() {
  // Visa + Mastercard side by side
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', height: '28px' }}>
      {/* Visa */}
      <svg width="38" height="12" viewBox="0 0 216 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#1A1F71" d="M87.5 1.4L58.6 66.6H38.8L24.5 17.1c-.9-3.4-1.6-4.7-4.3-6.1C14.6 8.7 5.8 6.5.9 5.1L1.4 1.4h33.1c4.2 0 8 2.8 9 7.4l8.2 43.5L76.2 1.4h11.3zm44.3 43.9c.1-18.8-26-19.8-25.8-28.2.1-2.6 2.5-5.3 7.8-6 2.7-.3 10-.5 18.4 3.2l3.3-15.2C131.8.5 127-.6 121.1 0 101.9 0 88.4 11 88.3 26.7c-.1 12.5 11.2 19.4 19.7 23.5 8.8 4.3 11.7 7 11.7 10.9 0 5.9-7 8.5-13.5 8.6-11.3.2-17.8-3-23-5.5l-4.1 19C83.5 85.5 91 87.2 100 87.3c20.3 0 33.5-10 33.5-25.6l.3-16.4zm73.7 21.3H188l-19.3-65.2h-16c-3.7 0-6.8 2.1-8.2 5.4L116.4 66.6H136l4.1-11.4h24.5l2.3 11.4zm-21-30.5l10-27.5 5.8 27.5h-15.8zM94.7 1.4L79.3 66.6H60.5L75.9 1.4h18.8z"/>
      </svg>
      {/* Mastercard */}
      <svg width="30" height="19" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="12" r="12" fill="#EB001B"/>
        <circle cx="24" cy="12" r="12" fill="#F79E1B"/>
        <path fill="#FF5F00" d="M19 3.5A12 12 0 0 1 23.2 12 12 12 0 0 1 19 20.5 12 12 0 0 1 14.8 12 12 12 0 0 1 19 3.5z"/>
      </svg>
    </div>
  )
}

function VodafoneCashLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {/* Vodafone red circle with official speech-bubble mark */}
      <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#E60000"/>
        {/* Vodafone speech bubble shape — open at bottom-left */}
        <path fill="white" d="
          M 65,22
          C 81,22 81,42 65,42
          C 59,42 54,39 51,36
          L 44,44 L 47.5,35.5
          C 33,33 33,22 50,22 Z
        "/>
        <circle cx="50" cy="32" r="6" fill="#E60000"/>
      </svg>
      <span style={{ fontWeight: 800, fontSize: '13px', color: '#E60000', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.3px' }}>Cash</span>
    </div>
  )
}

function InstaPayLogo() {
  return (
    <svg width="80" height="26" viewBox="0 0 200 65" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B2FC9"/>
          <stop offset="100%" stopColor="#5B0FA8"/>
        </linearGradient>
      </defs>
      <rect width="200" height="65" rx="10" fill="url(#ip-grad)"/>
      {/* instaPay wordmark */}
      <text x="100" y="27" textAnchor="middle" fill="white" fontSize="16" fontWeight="400" fontFamily="Arial, sans-serif" letterSpacing="0.5">insta</text>
      <text x="100" y="48" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-0.5">Pay</text>
    </svg>
  )
}

const PAYMENT_OPTIONS = [
  { key: 'fawry',         ar: 'بطاقة',          en: 'Card',           noteAr: 'تأكيد تلقائي',  noteEn: 'Auto-confirmed', color: '#1A1F71', bg: '#EEF2FF', Logo: CardLogo },
  { key: 'vodafone_cash', ar: 'فودافون كاش',    en: 'Vodafone Cash',  noteAr: '',               noteEn: '',               color: '#E60000', bg: '#FFF1F1', Logo: VodafoneCashLogo },
  { key: 'instapay',      ar: 'إنستاباي',       en: 'InstaPay',       noteAr: '',               noteEn: '',               color: '#6B2FA0', bg: '#F5F0FF', Logo: InstaPayLogo },
]

const COUNTRY_CODES = [
  { code: '+20',  flag: '🇪🇬', name: 'Egypt' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+963', flag: '🇸🇾', name: 'Syria' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: '+218', flag: '🇱🇾', name: 'Libya' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+249', flag: '🇸🇩', name: 'Sudan' },
  { code: '+1',   flag: '🇺🇸', name: 'USA / Canada' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: '+39',  flag: '🇮🇹', name: 'Italy' },
  { code: '+34',  flag: '🇪🇸', name: 'Spain' },
  { code: '+31',  flag: '🇳🇱', name: 'Netherlands' },
  { code: '+46',  flag: '🇸🇪', name: 'Sweden' },
  { code: '+47',  flag: '🇳🇴', name: 'Norway' },
  { code: '+45',  flag: '🇩🇰', name: 'Denmark' },
  { code: '+32',  flag: '🇧🇪', name: 'Belgium' },
  { code: '+41',  flag: '🇨🇭', name: 'Switzerland' },
  { code: '+90',  flag: '🇹🇷', name: 'Turkey' },
  { code: '+7',   flag: '🇷🇺', name: 'Russia' },
  { code: '+86',  flag: '🇨🇳', name: 'China' },
  { code: '+81',  flag: '🇯🇵', name: 'Japan' },
  { code: '+82',  flag: '🇰🇷', name: 'South Korea' },
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+92',  flag: '🇵🇰', name: 'Pakistan' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+27',  flag: '🇿🇦', name: 'South Africa' },
  { code: '+55',  flag: '🇧🇷', name: 'Brazil' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore' },
]

// ── Searchable Country Dropdown ───────────────────────────────────────────────
function CountryDropdown({ value, onSelect }) {
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')
  const ref                 = useRef(null)
  const searchRef           = useRef(null)

  const selected = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0]
  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  )

  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch('') } }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  useEffect(() => { if (open) setTimeout(() => searchRef.current?.focus(), 50) }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0, width: '120px' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '4px', padding: '0 10px', borderRadius: '10px', border: '1.5px solid #E5E7EB',
          background: '#F9FAFB', cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
          fontSize: '13px', fontWeight: 600, color: '#111827',
        }}
      >
        <span>{selected.flag} {selected.code}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute', top: '46px', left: 0, zIndex: 9999,
          background: '#FFFFFF', border: '1.5px solid #FFE4D4', borderRadius: '12px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.14)', width: '240px',
          maxHeight: '280px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Search input */}
          <div style={{ padding: '8px 8px 4px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F9FAFB', borderRadius: '8px', padding: '6px 10px', border: '1px solid #E5E7EB' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', fontFamily: 'Cairo, sans-serif', color: '#111827', width: '100%' }}
              />
            </div>
          </div>
          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <p style={{ padding: '12px', fontSize: '12px', color: '#9CA3AF', textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>No results</p>
            ) : filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => { onSelect(c.code); setOpen(false); setSearch('') }}
                style={{
                  width: '100%', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '8px',
                  background: value === c.code ? '#FFF8F4' : 'transparent',
                  border: 'none', borderBottom: '1px solid #F9FAFB', cursor: 'pointer',
                  fontFamily: 'Cairo, sans-serif', fontSize: '13px', color: '#111827',
                }}
              >
                <span style={{ fontSize: '16px' }}>{c.flag}</span>
                <span style={{ flex: 1, textAlign: 'left', fontWeight: value === c.code ? 700 : 400 }}>{c.name}</span>
                <span style={{ color: '#6B7280', fontWeight: 700, fontSize: '12px' }}>{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const EMPTY_FORM = { name: '', phonePrefix: '+20', phoneLocal: '', email: '', sameWhatsapp: true, whatsappPrefix: '+20', whatsappLocal: '', courseId: '', paymentMethod: 'vodafone_cash' }

// Payment details for manual methods
const MANUAL_PAYMENT_DETAILS = {
  vodafone_cash: { holder: 'Mahmoud A**** S***', number: '01*********' },
  instapay:      { holder: 'Mahmoud A**** S***', number: '01*********' },
}

// ── ModalField — defined outside so React never remounts inputs ──────────────
function ModalField({ label, error, children, required = true }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 font-cairo">
        {label}{required && <span style={{ color: '#FF5C1A' }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1 font-cairo flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </p>
      )}
    </div>
  )
}

const INPUT_BASE = {
  width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
  fontFamily: 'Cairo, sans-serif', color: '#111827', outline: 'none',
  border: '1.5px solid #E5E7EB', background: '#F9FAFB', direction: 'ltr',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}
function onFocusIn(e)  { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.12)'; e.target.style.background = '#FFFFFF' }
function onFocusOut(e) { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }

function RegistrationModal({ onClose, lang, isRTL, courses, coursesLoading }) {
  const mt = MODAL_T[lang]
  const [form, setForm]               = useState(EMPTY_FORM)
  const [errors, setErrors]           = useState({})
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [serverError, setServerError] = useState('')

  // Receipt upload state
  const [receiptFile, setReceiptFile]           = useState(null)
  const [receiptUrl, setReceiptUrl]             = useState('')
  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const [receiptError, setReceiptError]         = useState('')

  // Card details state (UI only until Fawry merchant account is ready)
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })

  const isManual = form.paymentMethod === 'vodafone_cash' || form.paymentMethod === 'instapay'
  const isCard   = form.paymentMethod === 'fawry'

  const handleChange = useCallback((e) => {
    const key   = e.target.dataset.formkey
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }, [])

  const setPayment = useCallback((key) => () => {
    setForm((f) => ({ ...f, paymentMethod: key }))
    // Reset receipt + card when switching payment method
    setReceiptFile(null)
    setReceiptUrl('')
    setReceiptError('')
    setCard({ name: '', number: '', expiry: '', cvv: '' })
  }, [])

  const hasCourses = !coursesLoading && courses.length > 0

  async function handleReceiptChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const MAX = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX) {
      setReceiptError(isRTL ? 'حجم الملف أكبر من 5 ميغابايت' : 'File exceeds 5 MB limit')
      return
    }

    setReceiptFile(file)
    setReceiptError('')
    setUploadingReceipt(true)
    setReceiptUrl('')

    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const urlRes = await fetch(`/api/public/get-receipt-upload-url?ext=${ext}`)
      const urlData = await urlRes.json()
      if (!urlRes.ok || urlData.error) { setReceiptError(mt.receiptError); setUploadingReceipt(false); return }

      const uploadRes = await fetch(urlData.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type, 'x-upsert': 'false' },
      })
      if (!uploadRes.ok) { setReceiptError(mt.receiptError); setUploadingReceipt(false); return }

      setReceiptUrl(urlData.publicUrl)
    } catch {
      setReceiptError(mt.receiptError)
    }
    setUploadingReceipt(false)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = mt.required
    const phoneDigits = form.phoneLocal.replace(/\D/g, '')
    if (!form.phoneLocal.trim()) {
      e.phone = mt.required
    } else if (phoneDigits.length < 7 || phoneDigits.length > 11) {
      e.phone = isRTL ? 'رقم الهاتف يجب أن يكون بين 7 و 11 رقم' : 'Phone must be 7–11 digits'
    }
    if (!form.email.trim()) {
      e.email = mt.required
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = isRTL ? 'البريد الإلكتروني غير صحيح (مثال: name@gmail.com)' : 'Invalid email (e.g. name@gmail.com)'
    }
    if (hasCourses && !form.courseId) e.courseId = mt.required
    if (!form.sameWhatsapp && !form.whatsappLocal.trim()) e.whatsapp = mt.required
    if (isManual && !receiptUrl) e.receipt = mt.receiptRequired
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    setServerError('')
    try {
      const res = await fetch('/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:          form.name,
          phone:         form.phonePrefix + form.phoneLocal,
          email:         form.email,
          whatsapp:      form.sameWhatsapp ? (form.phonePrefix + form.phoneLocal) : (form.whatsappPrefix + form.whatsappLocal),
          courseId:      form.courseId || null,
          paymentMethod: form.paymentMethod,
          receiptUrl:    receiptUrl || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setServerError(data.error || 'Something went wrong'); setSubmitting(false); return }
      setSubmitted(true)
    } catch {
      setServerError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal shell — two-panel */}
      <div className="relative z-10 w-full flex overflow-hidden"
        style={{ maxWidth: '760px', maxHeight: '95vh', borderRadius: '16px', boxShadow: '0 40px 100px rgba(0,0,0,0.40)', background: '#FFFFFF' }}>

        {/* ── Left brand panel (hidden on small screens) ── */}
        <div className="hidden md:flex flex-col justify-between flex-shrink-0"
          style={{ width: '220px', background: 'linear-gradient(165deg, #FF5C1A 0%, #C73D08 100%)', padding: '32px 24px' }}>
          {/* Logo area */}
          <div>
            <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.18)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', padding: '6px' }}>
              <Image src="/logo_mark_white.png" alt="Art Smart Academy" width={44} height={21} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
            </div>
            <h3 style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '17px', lineHeight: 1.3, marginBottom: '8px', fontFamily: 'Cairo, sans-serif' }}>
              Art Smart Academy
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: '12px', lineHeight: 1.6, fontFamily: 'Cairo, sans-serif' }}>
              {isRTL ? 'انضم إلى أكثر من ٥٠٠ طالب وطوّر مهاراتك الإبداعية.' : 'Join 500+ students and develop your creative skills.'}
            </p>
          </div>
          {/* Trust bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(isRTL
              ? ['مدربون خبراء متخصصون', 'شهادات معتمدة', 'مجتمع إبداعي متميز']
              : ['Expert certified trainers', 'Accredited certificates', 'Creative community']
            ).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontFamily: 'Cairo, sans-serif' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '18px', color: '#111827', fontFamily: 'Cairo, sans-serif', margin: 0 }}>{mt.title}</h2>
              <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Cairo, sans-serif', margin: '2px 0 0' }}>{mt.sub}</p>
            </div>
            <button onClick={onClose}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#F3F4F6', color: '#6B7280', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              ✕
            </button>
          </div>

          {/* Scrollable form/success body */}
          <div style={{ overflowY: 'auto', flex: 1, padding: 'clamp(14px, 4vw, 24px)' }}>

            {submitted ? (
              /* ── SUCCESS STATE ── */
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                {/* Animated check */}
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 28px rgba(255,92,26,0.35)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '22px', color: '#111827', fontFamily: 'Cairo, sans-serif', margin: '0 0 6px' }}>{mt.successTitle}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Cairo, sans-serif', margin: '0 0 24px' }}>{mt.successSub}</p>

                {/* Email highlight */}
                <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', textAlign: isRTL ? 'right' : 'left' }}>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: '#C2410C', fontFamily: 'Cairo, sans-serif', margin: '0 0 4px' }}>
                    {isCard
                      ? (isRTL ? '📧 إيميل تأكيد في طريقه إليك!' : '📧 Confirmation email is on its way!')
                      : (isRTL ? '✅ تم استلام طلبك وإيصال الدفع!' : '✅ Registration & receipt received!')}
                  </p>
                  <p style={{ fontSize: '12px', color: '#78350F', fontFamily: 'Cairo, sans-serif', lineHeight: 1.6, margin: 0 }}>
                    {isCard ? mt.successCard : mt.successManual}
                  </p>
                </div>

                {/* Next steps */}
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', textAlign: isRTL ? 'right' : 'left' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', margin: '0 0 12px' }}>{mt.nextTitle}</p>
                  {[
                    { icon: '📬', text: mt.nextEmail },
                    { icon: '📞', text: mt.nextContact },
                    { icon: '📁', text: mt.nextSpam },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexDirection: isRTL ? 'row' : 'row', marginBottom: i < 2 ? '8px' : 0 }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{s.icon}</span>
                      <p style={{ fontSize: '12px', color: '#374151', fontFamily: 'Cairo, sans-serif', lineHeight: 1.5, margin: 0 }}>{s.text}</p>
                    </div>
                  ))}
                </div>

                <button onClick={onClose}
                  style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', fontWeight: 700, fontSize: '14px', fontFamily: 'Cairo, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,92,26,0.35)' }}>
                  {mt.close}
                </button>
              </div>
            ) : (
              /* ── FORM ── */
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Section 1 — Personal info */}
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                    {isRTL ? '١ — بياناتك الشخصية' : '1 — Your Information'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <ModalField label={mt.name} error={errors.name}>
                      <input data-formkey="name" type="text" value={form.name} onChange={handleChange}
                        placeholder={mt.namePh} style={INPUT_BASE} onFocus={onFocusIn} onBlur={onFocusOut} />
                    </ModalField>
                    <ModalField label={mt.phone} error={errors.phone}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <CountryDropdown value={form.phonePrefix} onSelect={(code) => setForm(f => ({ ...f, phonePrefix: code }))} />
                        <input data-formkey="phoneLocal" type="tel" inputMode="numeric" value={form.phoneLocal} onChange={handleChange}
                          placeholder="XXXXXXXXXX" maxLength={11} style={{ ...INPUT_BASE, flex: 1, minWidth: 0 }} onFocus={onFocusIn} onBlur={onFocusOut} />
                      </div>
                    </ModalField>
                  </div>
                  <ModalField label={mt.email} error={errors.email}>
                    <input data-formkey="email" type="email" value={form.email} onChange={handleChange}
                      placeholder={mt.emailPh} style={INPUT_BASE} onFocus={onFocusIn} onBlur={onFocusOut} />
                  </ModalField>

                  {/* WhatsApp toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <input data-formkey="sameWhatsapp" type="checkbox" checked={form.sameWhatsapp} onChange={handleChange}
                      style={{ width: '15px', height: '15px', accentColor: '#FF5C1A', cursor: 'pointer' }} />
                    <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>{mt.sameWa}</span>
                  </label>
                  {!form.sameWhatsapp && (
                    <div style={{ marginTop: '10px' }}>
                      <ModalField label={mt.whatsapp} error={errors.whatsapp}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <CountryDropdown value={form.whatsappPrefix} onSelect={(code) => setForm(f => ({ ...f, whatsappPrefix: code }))} />
                          <input data-formkey="whatsappLocal" type="tel" inputMode="numeric" value={form.whatsappLocal} onChange={handleChange}
                            placeholder="XXXXXXXXXX" style={{ ...INPUT_BASE, flex: 1 }} onFocus={onFocusIn} onBlur={onFocusOut} />
                        </div>
                      </ModalField>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #F3F4F6' }} />

                {/* Section 2 — Course */}
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                    {isRTL ? '٢ — اختر الكورس' : '2 — Select Course'}
                  </p>
                  <ModalField label={mt.course} error={errors.courseId} required={hasCourses}>
                    {coursesLoading ? (
                      <div style={{ ...INPUT_BASE, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5C1A" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                        {mt.loadingCourses}
                      </div>
                    ) : courses.length === 0 ? (
                      <div style={{ ...INPUT_BASE, color: '#9CA3AF', fontSize: '12px' }}>
                        {mt.noCourses}
                      </div>
                    ) : (
                      <select data-formkey="courseId" value={form.courseId} onChange={handleChange}
                        style={{ ...INPUT_BASE, cursor: 'pointer', appearance: 'auto' }}
                        onFocus={onFocusIn} onBlur={onFocusOut}>
                        <option value="">{mt.selectCourse}</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {lang === 'ar' ? c.name_ar : c.name_en} ({Number(c.price).toLocaleString()} {lang === 'ar' ? 'جنيه' : 'EGP'})
                          </option>
                        ))}
                      </select>
                    )}
                  </ModalField>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #F3F4F6' }} />

                {/* Section 3 — Payment */}
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                    {isRTL ? '٣ — طريقة الدفع' : '3 — Payment Method'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {PAYMENT_OPTIONS.map(({ key, ar, en, noteAr, noteEn, color, bg, Logo }) => {
                      const sel      = form.paymentMethod === key
                      const disabled = key === 'fawry'
                      return (
                        <div key={key} style={{ position: 'relative' }}>
                          <button type="button"
                            onClick={disabled ? undefined : setPayment(key)}
                            disabled={disabled}
                            style={{
                              width: '100%',
                              display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px',
                              borderRadius: '12px',
                              border: disabled ? '2px solid #E5E7EB' : sel ? `2px solid ${color}` : '2px solid #E5E7EB',
                              background: disabled ? '#F3F4F6' : sel ? bg : '#F9FAFB',
                              cursor: disabled ? 'not-allowed' : 'pointer',
                              textAlign: isRTL ? 'right' : 'left',
                              transition: 'all 0.15s',
                              boxShadow: (!disabled && sel) ? `0 2px 12px ${color}20` : 'none',
                              flexDirection: isRTL ? 'row-reverse' : 'row',
                              opacity: disabled ? 0.55 : 1,
                            }}>
                            {/* Logo */}
                            <div style={{ width: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Logo />
                            </div>
                            {/* Label */}
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', fontFamily: 'Cairo, sans-serif', color: disabled ? '#9CA3AF' : sel ? color : '#111827' }}>
                                {lang === 'ar' ? ar : en}
                              </p>
                              <p style={{ margin: '2px 0 0', fontSize: '11px', fontFamily: 'Cairo, sans-serif', color: '#9CA3AF' }}>
                                {disabled
                                  ? (isRTL ? 'قريباً — اختر طريقة دفع أخرى' : 'Coming soon — please choose another method')
                                  : (lang === 'ar' ? noteAr : noteEn)
                                }
                              </p>
                            </div>
                            {/* Radio dot or lock icon */}
                            {disabled ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                              </svg>
                            ) : (
                              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: sel ? `5px solid ${color}` : '2px solid #D1D5DB', background: sel ? '#FFFFFF' : 'transparent', flexShrink: 0, transition: 'all 0.15s' }} />
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Section 4a — Card details (Fawry/card payment) */}
                {isCard && (
                  <>
                    <div style={{ borderTop: '1px solid #F3F4F6' }} />
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                        {mt.cardDetailsTitle}
                      </p>

                      {/* Visa/MC logos */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div style={{ background: '#F3F4F6', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center' }}>
                          <CardLogo />
                        </div>
                        <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '8px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#4F46E5', fontFamily: 'Cairo, sans-serif' }}>Fawry Secure</span>
                        </div>
                      </div>

                      {/* Card number */}
                      <div style={{ marginBottom: '10px' }}>
                        <ModalField label={mt.cardNumber} error={null}>
                          <input
                            type="text" inputMode="numeric" maxLength={19}
                            placeholder={mt.cardNumberPh}
                            value={card.number}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
                              const fmt = raw.replace(/(.{4})/g, '$1 ').trim()
                              setCard((c) => ({ ...c, number: fmt }))
                            }}
                            style={{ ...INPUT_BASE, letterSpacing: '2px', fontSize: '15px', fontWeight: 600 }}
                            onFocus={onFocusIn} onBlur={onFocusOut}
                          />
                        </ModalField>
                      </div>

                      {/* Name on card */}
                      <div style={{ marginBottom: '10px' }}>
                        <ModalField label={mt.cardName} error={null}>
                          <input
                            type="text"
                            placeholder={mt.cardNamePh}
                            value={card.name}
                            onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))}
                            style={{ ...INPUT_BASE, textTransform: 'uppercase', letterSpacing: '1px' }}
                            onFocus={onFocusIn} onBlur={onFocusOut}
                          />
                        </ModalField>
                      </div>

                      {/* Expiry + CVV */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <ModalField label={mt.cardExpiry} error={null}>
                          <input
                            type="text" inputMode="numeric" maxLength={5}
                            placeholder={mt.cardExpiryPh}
                            value={card.expiry}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
                              const fmt = raw.length > 2 ? raw.slice(0,2) + '/' + raw.slice(2) : raw
                              setCard((c) => ({ ...c, expiry: fmt }))
                            }}
                            style={{ ...INPUT_BASE, letterSpacing: '2px', textAlign: 'center' }}
                            onFocus={onFocusIn} onBlur={onFocusOut}
                          />
                        </ModalField>
                        <ModalField label={mt.cardCvv} error={null}>
                          <input
                            type="password" inputMode="numeric" maxLength={3}
                            placeholder={mt.cardCvvPh}
                            value={card.cvv}
                            onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                            style={{ ...INPUT_BASE, letterSpacing: '4px', textAlign: 'center' }}
                            onFocus={onFocusIn} onBlur={onFocusOut}
                          />
                        </ModalField>
                      </div>

                      {/* Coming soon notice */}
                      <div style={{ marginTop: '12px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ fontSize: '13px', flexShrink: 0 }}>🔒</span>
                        <p style={{ margin: 0, fontSize: '11px', color: '#4338CA', fontFamily: 'Cairo, sans-serif', lineHeight: 1.6, textAlign: isRTL ? 'right' : 'left' }}>
                          {isRTL ? mt.cardComingSoon?.replace('🔒 ', '') : mt.cardComingSoon?.replace('🔒 ', '')}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Section 4b — Payment details + receipt upload (manual methods only) */}
                {isManual && (() => {
                  const details = MANUAL_PAYMENT_DETAILS[form.paymentMethod]
                  const accentColor = form.paymentMethod === 'vodafone_cash' ? '#E60000' : '#6B2FA0'
                  const accentBg    = form.paymentMethod === 'vodafone_cash' ? '#FFF1F1' : '#F5F0FF'
                  const accentBorder = form.paymentMethod === 'vodafone_cash' ? '#FECACA' : '#DDD6FE'
                  const selectedCoursePrice = courses.find(c => String(c.id) === String(form.courseId))?.price
                  const priceLabel = selectedCoursePrice ? `${Number(selectedCoursePrice).toLocaleString()} ${lang === 'ar' ? 'جنيه' : 'EGP'}` : null
                  const payInstruction = lang === 'ar'
                    ? (priceLabel ? `حوّل ${priceLabel} ثم ارفع صورة الإيصال أدناه.` : mt.payDetailsInstruction)
                    : (priceLabel ? `Send ${priceLabel}, then upload your payment screenshot below.` : mt.payDetailsInstruction)
                  return (
                    <>
                      <div style={{ borderTop: '1px solid #F3F4F6' }} />
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                          {mt.payDetailsTitle}
                        </p>

                        {/* Account details box */}
                        <div style={{ background: accentBg, border: `1.5px solid ${accentBorder}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>{mt.payDetailsHolder}</span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: accentColor, fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>{details.holder}</span>
                            </div>
                            <div style={{ height: '1px', background: accentBorder }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>{mt.payDetailsNumber}</span>
                              <span style={{ fontSize: '15px', fontWeight: 800, color: accentColor, fontFamily: 'monospace', letterSpacing: '1px', direction: 'ltr' }}>{details.number}</span>
                            </div>
                          </div>
                          <p style={{ margin: '12px 0 0', fontSize: '11px', color: '#4B5563', fontFamily: 'Cairo, sans-serif', lineHeight: 1.6, textAlign: isRTL ? 'right' : 'left' }}>
                            {payInstruction}
                          </p>
                        </div>

                        {/* Receipt upload area */}
                        <label style={{ display: 'block', cursor: 'pointer' }}>
                          <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleReceiptChange} disabled={uploadingReceipt} />
                          <div style={{
                            border: `2px dashed ${errors.receipt ? '#EF4444' : receiptUrl ? '#10B981' : '#D1D5DB'}`,
                            borderRadius: '12px', padding: '16px', textAlign: 'center',
                            background: receiptUrl ? 'rgba(16,185,129,0.05)' : '#FAFAFA',
                            transition: 'all 0.15s', cursor: 'pointer',
                          }}>
                            {uploadingReceipt ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                                <span style={{ fontSize: '13px', color: accentColor, fontFamily: 'Cairo, sans-serif' }}>{mt.receiptUploading}</span>
                              </div>
                            ) : receiptUrl ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#10B981', fontFamily: 'Cairo, sans-serif' }}>{mt.receiptUploaded}</span>
                                <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>({receiptFile?.name})</span>
                              </div>
                            ) : (
                              <>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" style={{ margin: '0 auto 8px', display: 'block' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{mt.receiptBtn}</p>
                                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9CA3AF', fontFamily: 'Cairo, sans-serif' }}>{mt.receiptHint}</p>
                              </>
                            )}
                          </div>
                        </label>
                        {receiptError && (
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#EF4444', fontFamily: 'Cairo, sans-serif' }}>{receiptError}</p>
                        )}
                        {errors.receipt && !receiptError && (
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#EF4444', fontFamily: 'Cairo, sans-serif' }}>{errors.receipt}</p>
                        )}
                      </div>
                    </>
                  )
                })()}

                {/* Server error */}
                {serverError && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <p style={{ margin: 0, fontSize: '13px', color: '#DC2626', fontFamily: 'Cairo, sans-serif' }}>{serverError}</p>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={submitting || uploadingReceipt}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                    background: (submitting || uploadingReceipt) ? '#FCA587' : 'linear-gradient(135deg,#FF5C1A,#FF7A40)',
                    color: '#FFFFFF', fontWeight: 800, fontSize: '15px', fontFamily: 'Cairo, sans-serif',
                    cursor: (submitting || uploadingReceipt) ? 'not-allowed' : 'pointer',
                    boxShadow: (submitting || uploadingReceipt) ? 'none' : '0 4px 20px rgba(255,92,26,0.40)',
                    transition: 'all 0.2s',
                  }}>
                  {submitting
                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                        {mt.submitting}
                      </span>
                    : mt.submit
                  }
                </button>

              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function ConferenceCarousel({ lang }) {
  const [photos, setPhotos]   = useState(FALLBACK_PHOTOS)
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const containerRef          = useRef(null)
  const isRTL = lang === 'ar'

  useEffect(() => {
    fetch('/api/public/gallery')
      .then((r) => r.json())
      .then(({ photos: dbPhotos }) => { if (dbPhotos?.length) { setPhotos(dbPhotos); setCurrent(0) } })
      .catch(() => {})
  }, [])

  // Pause auto-advance when carousel is off-screen
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const total = photos.length
  const prev  = () => setCurrent((c) => (c - 1 + total) % total)
  const next  = () => setCurrent((c) => (c + 1) % total)

  useEffect(() => {
    if (!visible) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % total), 4500)
    return () => clearInterval(timer)
  }, [total, visible])

  const caption = isRTL
    ? (photos[current]?.caption_ar || photos[current]?.caption_en || '')
    : (photos[current]?.caption_en || photos[current]?.caption_ar || '')

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto">
      {/* Main image */}
      <div className="relative rounded-asa-radius-xl overflow-hidden shadow-asa-shadow-orange" style={{ aspectRatio: '16/9' }}>
        {photos.map((photo, i) => (
          <img
            key={photo.id || i}
            src={photo.url || photo.src}
            alt={photo.caption_en || photo.caption_ar || ''}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
        {/* Gradient overlay at bottom for caption */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        {/* Caption */}
        {caption && (
          <p className="absolute bottom-4 left-6 right-6 text-white text-xs md:text-sm font-semibold font-cairo text-center drop-shadow">
            {caption}
          </p>
        )}
        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all duration-200"
          aria-label="Previous"
        >
          <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all duration-200"
          aria-label="Next"
        >
          <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-asa-orange w-6' : 'bg-asa-border w-2 hover:bg-asa-orange/40'}`}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ==========================================
export default function Home() {
  const [lang, setLang] = useState('ar')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [siteSettings, setSiteSettings] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [modalCourses, setModalCourses] = useState([])
  const [modalCoursesLoading, setModalCoursesLoading] = useState(true)

  const currentTranslations = t[lang]
  const isRTL = lang === 'ar'

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  // Single fetch for both courses + settings — reduces network round trips on first load
  useEffect(() => {
    fetch('/api/public/init')
      .then((r) => r.json())
      .then(({ courses, settings }) => {
        if (courses) setModalCourses(courses)
        if (settings) setSiteSettings(settings)
        setModalCoursesLoading(false)
      })
      .catch(() => setModalCoursesLoading(false))
  }, [])

  // Auto-open modal if redirected from old /register links (?register=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('register') === '1') {
      setShowModal(true)
      // Clean the URL without reloading
      window.history.replaceState({}, '', '/')
    }
  }, [])

  useEffect(() => {
    // Synchronize HTML attributes for proper multilingual reading flow
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isRTL])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))
  }

  // ── Build display courses fully from Supabase ─────────────────────────────
  // Enrichment table: static descriptions/instructors for known courses.
  // New courses added via dashboard get generic defaults automatically.
  const COURSE_ENRICHMENT = {
    'التفكير الإبداعي': {
      description_ar: 'تعلّم كيف تفكر خارج الصندوق وتحوّل أفكارك إلى حلول مبتكرة. كورس مكثّف يطوّر مهاراتك الإبداعية وقدرتك على حل المشكلات بأساليب غير تقليدية.',
      description_en: 'Learn to think outside the box and turn your ideas into innovative solutions. An intensive course that builds creative skills and unconventional problem-solving.',
      instructor_ar: 'د. سارة محمد', instructor_en: 'Dr. Sara Mohamed',
      icon: 'lightbulb', initials_ar: 'س م', initials_en: 'SM',
    },
    'الذكاء الاصطناعي': {
      description_ar: 'مقدمة شاملة في عالم الذكاء الاصطناعي وتطبيقاته العملية. تعرّف على أساسيات ML والـ AI وكيفية توظيفها في حياتك المهنية.',
      description_en: 'A comprehensive introduction to AI and its practical applications. Learn ML fundamentals and how to apply them in your career.',
      instructor_ar: 'م. أحمد خالد', instructor_en: 'Eng. Ahmed Khaled',
      icon: 'cpu', initials_ar: 'أ خ', initials_en: 'AK',
    },
    'اللغة الصينية': {
      description_ar: 'تعلّم اللغة الصينية من الصفر مع أفضل الأساليب الحديثة. كورس متكامل يشمل المحادثة والكتابة والثقافة الصينية.',
      description_en: 'Learn Chinese from scratch with modern methods. A complete course covering conversation, writing, and Chinese culture.',
      instructor_ar: 'أ. لي وانغ', instructor_en: 'Prof. Li Wang',
      icon: 'globe', initials_ar: 'ل و', initials_en: 'LW',
    },
  }

  const displayCourses = modalCourses.map((c) => {
    const enriched = COURSE_ENRICHMENT[c.name_ar] || {}
    const isAr = lang === 'ar'
    // Prefer DB fields → fall back to hardcoded enrichment
    const description = isAr
      ? (c.description_ar || enriched.description_ar || '')
      : (c.description_en || enriched.description_en || '')
    const instructor = isAr
      ? (c.instructor_ar || enriched.instructor_ar || '')
      : (c.instructor_en || enriched.instructor_en || '')
    const nameDisplay = isAr ? c.name_ar : (c.name_en || c.name_ar)
    const initials = isAr
      ? (enriched.initials_ar || c.name_ar.slice(0, 2))
      : (enriched.initials_en || (c.name_en || c.name_ar).slice(0, 2).toUpperCase())
    return {
      id:          c.id,
      title:       nameDisplay,
      description,
      instructor,
      icon:        (COURSE_ICON_MAP[c.icon_key] || COURSE_ICON_MAP.other).icon,
      iconBg:      (COURSE_ICON_MAP[c.icon_key] || COURSE_ICON_MAP.other).bg,
      iconColor:   (COURSE_ICON_MAP[c.icon_key] || COURSE_ICON_MAP.other).color,
      initials,
      price:       isAr ? `${Number(c.price).toLocaleString('ar-EG')} جنيه` : `EGP ${Number(c.price).toLocaleString()}`,
      duration:    c.duration,
      seats:       c.seats,
    }
  })

  return (
    <main className="overflow-x-hidden bg-asa-bg text-asa-text min-h-screen relative selection:bg-asa-orange selection:text-white">
      {/* Subtle background grain noise overall */}
      <div className="noise-overlay" />

      {/* ==========================================
          1. NAVBAR (DARK BACKGROUND FRAME)
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-[#FFF8F4]/95 backdrop-blur-md border-b border-[#FFE4D4] shadow-[0_4px_24px_rgba(255,92,26,0.08)]'
            : 'bg-[#FFF8F4]/90 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <a href="#hero" className="flex items-center gap-3 group">
            <Image src="/logo_mark_black.png" alt="Art Smart Academy Logo" width={76} height={36} className="object-contain group-hover:opacity-70 transition-opacity duration-300" />
            <div className="flex flex-col text-start">
              <span className="text-[#1A1A1A] font-extrabold text-sm md:text-base tracking-wider uppercase font-cairo">
                {currentTranslations.logoText}
              </span>
              {lang === 'ar' && (
                <span className="text-[#9A9A9A] text-xs font-semibold">
                  {currentTranslations.logoSub}
                </span>
              )}
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-[#6B6B6B] hover:text-asa-orange text-sm font-semibold transition-colors duration-200">
              {currentTranslations.navHome}
            </a>
            <a href="#courses" className="text-[#6B6B6B] hover:text-asa-orange text-sm font-semibold transition-colors duration-200">
              {currentTranslations.navCourses}
            </a>
            <a href="#about" className="text-[#6B6B6B] hover:text-asa-orange text-sm font-semibold transition-colors duration-200">
              {currentTranslations.navAbout}
            </a>
            <a href="#contact" className="text-[#6B6B6B] hover:text-asa-orange text-sm font-semibold transition-colors duration-200">
              {currentTranslations.navContact}
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="px-4 py-2 text-xs font-bold text-asa-orange border border-[#FFE4D4] rounded-asa-radius-full hover:bg-[#FFF0E8] transition-all duration-300 font-cairo bg-[#FFF0E8]"
            >
              {currentTranslations.langToggleLabel}
            </button>
            {/* Student Portal */}
            <a
              href="/student/login"
              className="px-4 py-2 text-xs font-bold text-[#6B6B6B] border border-[#E5E7EB] rounded-asa-radius-full hover:border-asa-orange hover:text-asa-orange transition-all duration-300 font-cairo whitespace-nowrap"
            >
              {currentTranslations.studentPortal}
            </a>
            {/* CTA Button */}
            <button
              onClick={openModal}
              className="bg-asa-orange hover:bg-asa-orange-light text-white font-bold px-6 py-2.5 rounded-asa-radius-full text-sm transition-all duration-300 shadow-asa-shadow-orange hover:shadow-[0_8px_36px_rgba(255,92,26,0.4)] hover:-translate-y-0.5 whitespace-nowrap font-cairo"
            >
              {currentTranslations.ctaRegister}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-asa-radius-md border border-[#FFE4D4] text-[#6B6B6B] hover:text-[#1A1A1A] bg-[#FFF0E8]"
            aria-label="Open Menu"
          >
            <Icon name="menu" className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Slide-Over */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-[#FFF8F4]/97 backdrop-blur-lg flex flex-col p-6 border-b border-[#FFE4D4]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Image src="/logo_mark_black.png" alt="Logo" width={68} height={32} className="object-contain" />
              <div className="flex flex-col">
                <span className="text-[#1A1A1A] font-extrabold text-sm tracking-wider uppercase font-cairo">
                  {currentTranslations.logoText}
                </span>
                {lang === 'ar' && (
                  <span className="text-[#9A9A9A] text-xs font-semibold">{currentTranslations.logoSub}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full border border-[#FFE4D4] text-[#6B6B6B] bg-[#FFF0E8]"
              aria-label="Close Menu"
            >
              <Icon name="close" className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col gap-6 flex-grow justify-center items-center text-center">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-[#6B6B6B] hover:text-asa-orange transition-colors py-2"
            >
              {currentTranslations.navHome}
            </a>
            <a
              href="#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-[#6B6B6B] hover:text-asa-orange transition-colors py-2"
            >
              {currentTranslations.navCourses}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-[#6B6B6B] hover:text-asa-orange transition-colors py-2"
            >
              {currentTranslations.navAbout}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-[#6B6B6B] hover:text-asa-orange transition-colors py-2"
            >
              {currentTranslations.navContact}
            </a>
          </div>
          <div className="flex flex-col gap-4 mt-auto">
            <button
              onClick={() => {
                toggleLang()
                setMobileMenuOpen(false)
              }}
              className="w-full py-3 text-sm font-bold text-asa-orange border border-[#FFE4D4] rounded-asa-radius-full hover:bg-[#FFF0E8] bg-[#FFF0E8] transition-all duration-300 font-cairo"
            >
              {currentTranslations.langToggleLabel}
            </button>
            <a
              href="/student/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-sm font-bold text-[#6B6B6B] border border-[#E5E7EB] rounded-asa-radius-full hover:border-asa-orange hover:text-asa-orange transition-all duration-300 font-cairo text-center"
            >
              {currentTranslations.studentPortal}
            </a>
            <button
              onClick={() => { setMobileMenuOpen(false); openModal() }}
              className="w-full py-3 bg-asa-orange hover:bg-asa-orange-light text-white font-bold text-center rounded-asa-radius-full text-sm transition-all duration-300 shadow-asa-shadow-orange font-cairo"
            >
              {currentTranslations.ctaRegister}
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          2. HERO SECTION (WARM CREAM + MESH)
          ========================================== */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center animated-warm-mesh pt-24 pb-10 overflow-hidden hero-perspective"
        style={{ scrollMarginTop: '80px' }}
      >
        {/* CSS 3D Floating Shapes */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {/* Shape 1: Orange blurred glowing circle */}
          <div
            className="absolute top-[20%] left-[10%] w-36 h-36 md:w-52 md:h-52 rounded-full animate-float-3d-1"
            style={{
              background: 'radial-gradient(circle, rgba(255,92,26,0.14) 0%, rgba(255,92,26,0) 70%)',
              filter: 'blur(10px)',
            }}
          />
          {/* Shape 2: Semi-transparent orange glass rounded square with border */}
          <div
            className="absolute top-[30%] right-[12%] w-24 h-24 md:w-40 md:h-40 rounded-asa-radius-xl border border-asa-orange/15 animate-float-3d-2"
            style={{
              background: 'linear-gradient(135deg, rgba(255,92,26,0.08) 0%, rgba(255,92,26,0.03) 100%)',
              backdropFilter: 'blur(4px)',
            }}
          />
          {/* Shape 3: Ring with offset animation */}
          <div
            className="absolute bottom-[25%] left-[15%] w-28 h-28 md:w-44 md:h-44 rounded-full border-2 border-asa-orange/8 animate-float-3d-3"
            style={{
              borderStyle: 'dashed',
            }}
          />
          {/* Shape 4: Pill floating element */}
          <div
            className="absolute bottom-[20%] right-[20%] w-32 h-12 md:w-48 md:h-16 rounded-asa-radius-full border border-asa-orange/10 animate-float-3d-1"
            style={{
              background: 'rgba(255,92,26,0.04)',
              backdropFilter: 'blur(2px)',
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto px-6 relative z-20 text-center flex flex-col items-center justify-center">
          {/* Logo Mark */}
          <div className="mb-5 animate-float">
            <Image src="/logo_mark_black.png" width={134} height={64} className="mx-auto object-contain" alt="Art Smart Academy Logo" />
          </div>

          {/* Label Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-asa-radius-full bg-asa-orange-tint border border-asa-border text-asa-orange text-xs md:text-sm font-bold mb-6 shadow-sm">
            {currentTranslations.heroBadge}
          </div>

          {/* Slogan as main heading */}
          <h1 className="text-asa-text font-extrabold tracking-tight leading-[1.1] mb-5 font-cairo text-balance" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
            {currentTranslations.heroSlogan}
          </h1>

          {/* Subheading */}
          <p className="text-asa-text-muted text-base md:text-lg font-medium max-w-2xl mb-8 font-cairo leading-relaxed">
            {currentTranslations.heroSub}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            <button
              onClick={openModal}
              className="w-full sm:w-auto bg-asa-orange hover:bg-asa-orange-light text-white font-bold px-8 py-3.5 rounded-asa-radius-full transition-all duration-300 shadow-asa-shadow-orange hover:shadow-[0_8px_36px_rgba(255,92,26,0.4)] hover:-translate-y-1 text-center whitespace-nowrap font-cairo"
            >
              {currentTranslations.heroBtnPrimary}
            </button>
            <a
              href="#courses"
              className="w-full sm:w-auto border border-asa-orange/30 hover:border-asa-orange/60 bg-white/70 hover:bg-asa-orange/10 text-asa-orange font-bold px-8 py-3.5 rounded-asa-radius-full transition-all duration-300 text-center backdrop-blur-md hover:-translate-y-1 whitespace-nowrap"
            >
              {currentTranslations.heroBtnSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. STATS BAR (DARK INTENTIONAL CONTRAST)
          ========================================== */}
      <section
        className="py-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FF7A40 0%, #E04A10 100%)' }}
      >
        {/* Subtle decorative circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-black/10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              currentTranslations.statsGraduates,
              currentTranslations.statsFields,
              currentTranslations.statsTrainers,
              currentTranslations.statsExperience,
            ].map((stat, i) => {
              const numberVal = stat.split(' ')[0]
              const labelVal = stat.substring(numberVal.length)
              return (
                <div key={i} className="flex flex-col items-center justify-center text-center">
                  <span className="text-white font-extrabold text-3xl md:text-4xl lg:text-5xl font-cairo mb-2">
                    {numberVal}
                  </span>
                  <span className="text-white/70 text-xs md:text-sm font-semibold tracking-wide uppercase">
                    {labelVal}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. TRAINING COURSES SECTION
          ========================================== */}
      <section id="courses" className="py-10 md:py-14 bg-asa-bg-2 relative" style={{ scrollMarginTop: '80px' }}>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-asa-text font-extrabold text-3xl md:text-4xl font-cairo mb-3">
              {currentTranslations.coursesTitle}
            </h2>
            <div className="w-16 h-1 bg-asa-orange mx-auto mb-3 rounded-asa-radius-full" />
            <p className="text-asa-text-muted text-sm max-w-xl mx-auto font-medium">
              {currentTranslations.coursesSub}
            </p>
          </div>

          {/* Cards Grid */}
          {modalCoursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="warm-card rounded-asa-radius-xl p-6 animate-pulse">
                  <div className="w-14 h-14 rounded-full bg-asa-border mb-6" />
                  <div className="h-6 bg-asa-border rounded mb-3 w-3/4" />
                  <div className="h-4 bg-asa-border rounded mb-2 w-full" />
                  <div className="h-4 bg-asa-border rounded mb-2 w-5/6" />
                  <div className="h-4 bg-asa-border rounded mb-6 w-4/6" />
                  <div className="h-10 bg-asa-border rounded-full mt-auto" />
                </div>
              ))}
            </div>
          ) : displayCourses.length === 0 ? (
            <p className="text-center text-asa-text-muted font-cairo py-10">{currentTranslations.noCourses}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayCourses.map((course) => (
                <div
                  key={course.id}
                  className="warm-card rounded-asa-radius-xl flex flex-col p-5 md:p-6 relative overflow-hidden"
                >
                  {/* 4px top orange accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-asa-orange" />

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-asa-radius-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.08)] mb-6 self-start"
                    style={{ background: course.iconBg, color: course.iconColor, border: `1px solid ${course.iconColor}33` }}
                  >
                    <Icon name={course.icon} className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-asa-text font-bold text-xl md:text-2xl font-cairo mb-3">
                    {course.title}
                  </h3>

                  {/* Duration Badge & Price */}
                  <div className="flex items-center justify-between mb-5 mt-auto">
                    <span className="text-xs px-3 py-1 rounded-asa-radius-full bg-asa-orange-tint border border-asa-border text-asa-orange font-bold font-cairo">
                      {course.duration}
                    </span>
                    <span className="text-asa-orange font-extrabold text-lg md:text-xl font-cairo">
                      {course.price}
                    </span>
                  </div>

                  {/* Instructor Row */}
                  {course.instructor && (
                    <div className="flex items-center gap-3 border-t border-asa-border pt-4 mb-5">
                      <div className="w-8 h-8 rounded-full bg-asa-orange text-white flex items-center justify-center text-xs font-bold font-cairo">
                        {course.initials}
                      </div>
                      <span className="text-asa-text text-sm font-semibold font-cairo">
                        {course.instructor}
                      </span>
                    </div>
                  )}

                  {/* Buttons row */}
                  <div className="flex gap-2">
                    <a
                      href={`/courses/${course.id}`}
                      className="flex-1 border-2 border-asa-orange text-asa-orange text-center font-bold py-3 rounded-asa-radius-full text-sm transition-all duration-300 font-cairo hover:bg-asa-orange-tint"
                    >
                      {lang === 'ar' ? 'تفاصيل' : 'Details'}
                    </a>
                    <button
                      onClick={openModal}
                      className="flex-1 bg-asa-orange hover:bg-asa-orange-light text-white text-center font-bold py-3 rounded-asa-radius-full text-sm transition-all duration-300 shadow-asa-shadow-orange font-cairo"
                    >
                      {currentTranslations.coursesEnroll}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          5. ABOUT SECTION
          ========================================== */}
      <section id="about" className="py-8 md:py-10 bg-asa-white relative overflow-hidden" style={{ scrollMarginTop: '80px' }}>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 flex flex-col text-start items-start">
              <span className="text-asa-orange text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-asa-radius-full bg-asa-orange-tint border border-asa-border inline-block mb-3 shadow-sm">
                {currentTranslations.aboutBadge}
              </span>
              <h2 className="text-asa-text font-extrabold text-2xl md:text-3xl lg:text-4xl font-cairo mb-4">
                {currentTranslations.aboutTitle}
              </h2>
              <div className="w-12 h-1 bg-asa-orange mb-4 rounded-asa-radius-full" />
              <p className="text-asa-text-muted text-sm font-medium leading-relaxed mb-6">
                {currentTranslations.aboutBody}
              </p>

              {/* 3 warm highlight badges */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {[
                  currentTranslations.aboutFeature1,
                  currentTranslations.aboutFeature2,
                  currentTranslations.aboutFeature3,
                ].map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-5 py-3 rounded-asa-radius-md bg-asa-orange-tint border border-asa-border text-asa-orange hover:border-asa-orange/40 transition-all duration-300 shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-asa-orange flex items-center justify-center text-white flex-shrink-0">
                      <Icon name="check" className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold font-cairo">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right decorative column */}
            <div className="lg:col-span-5 flex items-center justify-center relative h-52">
              {/* Outer ring */}
              <div className="w-48 h-48 rounded-full border border-asa-border absolute z-0 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border border-asa-border-subtle" />
              </div>

              {/* Center card */}
              <div className="w-36 h-36 rounded-asa-radius-xl bg-asa-bg border border-asa-border flex items-center justify-center relative z-10 shadow-asa-shadow-card">
                <div className="w-16 h-16 rounded-full bg-asa-orange flex items-center justify-center shadow-asa-shadow-orange animate-pulse">
                  <Image src="/logo_mark_white.png" alt="Logo" width={32} height={15} />
                </div>
              </div>

              {/* Orbiting circles */}
              <div className="absolute top-[2%] left-[8%] w-10 h-10 rounded-full bg-[#E8553A] flex items-center justify-center text-white shadow-md animate-float z-20">
                <Icon name="palette" className="w-4 h-4" />
              </div>
              <div className="absolute top-[5%] right-[8%] w-10 h-10 rounded-full bg-[#7B3FBF] flex items-center justify-center text-white shadow-md animate-float z-20" style={{ animationDelay: '1.5s' }}>
                <Icon name="music" className="w-4 h-4" />
              </div>
              <div className="absolute bottom-[2%] left-[8%] w-10 h-10 rounded-full bg-[#1A8C6C] flex items-center justify-center text-white shadow-md animate-float z-20" style={{ animationDelay: '3s' }}>
                <Icon name="trophy" className="w-4 h-4" />
              </div>
              <div className="absolute bottom-[5%] right-[8%] w-10 h-10 rounded-full bg-asa-orange flex items-center justify-center text-white shadow-md animate-float z-20" style={{ animationDelay: '4.5s' }}>
                <Icon name="lightbulb" className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. AI CONFERENCE ACHIEVEMENT
          ========================================== */}
      <section className="py-10 md:py-14 bg-asa-bg-2 relative overflow-hidden border-b border-asa-border">
        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Text block */}
          <div className="text-center mb-6">
            <h2 className="text-asa-text font-extrabold text-2xl md:text-3xl font-cairo mb-3 leading-snug">
              {currentTranslations.conferenceTitle}
            </h2>
            <p className="text-asa-text-muted text-sm font-medium max-w-2xl mx-auto leading-relaxed">
              {currentTranslations.conferenceBody}
            </p>
          </div>

          {/* Photo Carousel */}
          <ConferenceCarousel lang={lang} />

        </div>
      </section>

      {/* ==========================================
          7. HOW TO REGISTER
          ========================================== */}
      <section className="py-20 md:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Heading */}
          <div className="text-center mb-20">
            <h2 className="text-asa-text font-extrabold text-3xl md:text-4xl lg:text-5xl font-cairo mb-4">
              {currentTranslations.registerTitle}
            </h2>
            <div className="w-16 h-1 bg-asa-orange mx-auto rounded-asa-radius-full" />
          </div>

          {/* Steps Timeline Grid */}
          <div className="relative grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {/* Desktop Connector Line */}
            <div className="absolute top-[2rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-asa-orange/30 to-transparent hidden md:block z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-asa-orange text-white flex items-center justify-center font-extrabold text-xl mb-4 shadow-asa-shadow-orange hover:scale-105 transition-all duration-300">
                1
              </div>
              <h3 className="text-asa-text font-bold text-lg font-cairo mb-2">
                {currentTranslations.step1Title}
              </h3>
              <p className="text-asa-text-muted text-xs font-semibold leading-relaxed max-w-[200px]">
                {currentTranslations.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-asa-orange text-white flex items-center justify-center font-extrabold text-xl mb-4 shadow-asa-shadow-orange hover:scale-105 transition-all duration-300">
                2
              </div>
              <h3 className="text-asa-text font-bold text-lg font-cairo mb-2">
                {currentTranslations.step2Title}
              </h3>
              <p className="text-asa-text-muted text-xs font-semibold leading-relaxed max-w-[200px]">
                {currentTranslations.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-asa-orange text-white flex items-center justify-center font-extrabold text-xl mb-4 shadow-asa-shadow-orange hover:scale-105 transition-all duration-300">
                3
              </div>
              <h3 className="text-asa-text font-bold text-lg font-cairo mb-1">
                {currentTranslations.step3Title}
              </h3>
              <p className="text-asa-text-muted text-xs font-semibold leading-relaxed max-w-[200px]">
                {currentTranslations.step3Desc}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          8. TESTIMONIALS
          ========================================== */}
      <section className="py-20 md:py-28 bg-asa-bg-2 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Heading */}
          <div className="text-center mb-16">
            <h2 className="text-asa-text font-extrabold text-3xl md:text-4xl lg:text-5xl font-cairo mb-4">
              {currentTranslations.testimonialsTitle}
            </h2>
            <div className="w-16 h-1 bg-asa-orange mx-auto rounded-asa-radius-full" />
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentTranslations.testimonialsList.map((test, index) => (
              <div
                key={index}
                className="bg-asa-bg border border-asa-border hover:bg-white hover:border-asa-orange/30 hover:shadow-asa-shadow-orange rounded-asa-radius-xl p-8 flex flex-col justify-between relative transition-all duration-300"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-6 text-asa-orange">
                    {Array.from({ length: test.stars }).map((_, i) => (
                      <Icon key={i} name="star" className="w-5 h-5" />
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="text-asa-text-muted text-sm md:text-base font-medium italic leading-relaxed mb-8">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 border-t border-asa-border/60 pt-6 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-asa-orange text-white flex items-center justify-center text-xs font-bold font-cairo">
                    {test.initials}
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-asa-text font-bold text-sm font-cairo">
                      {test.name}
                    </span>
                    <span className="text-asa-text-muted text-xs font-medium font-cairo">
                      {test.course}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. FINAL CTA SECTION (ORANGE GRADIENT)
          ========================================== */}
      <section
        id="contact"
        className="relative overflow-hidden py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, #FF7A40 0%, #E04A10 100%)', scrollMarginTop: '80px' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-black/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          {/* Eyebrow */}
          <h2 className="text-white font-extrabold text-3xl md:text-4xl font-cairo mb-3 leading-tight">
            {currentTranslations.ctaTitle}
          </h2>

          <p className="text-white/70 text-sm font-medium mb-7 max-w-xl font-cairo leading-relaxed">
            {currentTranslations.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary — solid white */}
            <button
              onClick={openModal}
              className="bg-white text-asa-orange hover:bg-[#FFF0E8] font-extrabold px-8 py-3.5 rounded-asa-radius-full transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap font-cairo"
            >
              {currentTranslations.ctaPrimary}
            </button>

            {/* WhatsApp — white outline, keeps green icon accent */}
            <a
              href={`https://wa.me/${(siteSettings.whatsapp || '+20 100 000 0000').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/60 hover:border-white bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-asa-radius-full transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 whitespace-nowrap font-cairo text-sm md:text-base"
            >
              <Icon name="whatsapp" className="w-5 h-5" />
              <span>{currentTranslations.ctaWhatsApp}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==========================================
          10. FOOTER (DARK FRAME)
          ========================================== */}
      <footer className="bg-[#FFF0E8] py-8 relative overflow-hidden border-t border-[#FFE4D4]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4 text-start">
            {/* Column 1: Brand details */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo_mark_black.png" alt="Logo" width={68} height={32} />
                <span className="text-[#1A1A1A] font-extrabold text-lg tracking-wider uppercase font-cairo">
                  {currentTranslations.logoText}
                </span>
              </div>
              <p className="text-[#6B6B6B] text-sm font-medium leading-relaxed mb-6 font-cairo">
                {currentTranslations.footerTagline}
              </p>
              {/* Social Icons */}
              <div className="flex gap-4 flex-wrap">
                <a
                  href="https://www.facebook.com/share/1LGfL92Qxb/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#FFE4D4] hover:border-asa-orange bg-white flex items-center justify-center text-[#6B6B6B] hover:text-asa-orange hover:bg-asa-orange-light/10 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Icon name="facebook" className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/ai.conference10?igsh=eWJjZWZtOWJhbHp5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#FFE4D4] hover:border-asa-orange bg-white flex items-center justify-center text-[#6B6B6B] hover:text-asa-orange hover:bg-asa-orange-light/10 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Icon name="instagram" className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@ai.conference?_r=1&_t=ZS-97HcMz3ixcu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#FFE4D4] hover:border-asa-orange bg-white flex items-center justify-center text-[#6B6B6B] hover:text-asa-orange hover:bg-asa-orange-light/10 transition-all duration-300"
                  aria-label="TikTok"
                >
                  <Icon name="tiktok" className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@ai.conference?si=a9EKjWIq-3TaYtq4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#FFE4D4] hover:border-asa-orange bg-white flex items-center justify-center text-[#6B6B6B] hover:text-asa-orange hover:bg-asa-orange-light/10 transition-all duration-300"
                  aria-label="YouTube"
                >
                  <Icon name="youtube" className="w-5 h-5" />
                </a>
                <a
                  href={`https://wa.me/${(siteSettings.whatsapp || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#FFE4D4] hover:border-asa-orange bg-white flex items-center justify-center text-[#6B6B6B] hover:text-asa-orange hover:bg-asa-orange-light/10 transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <Icon name="whatsapp" className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick links */}
            <div className="flex flex-col items-start md:pl-8 lg:pl-16">
              <h3 className="text-[#1A1A1A] font-bold text-base md:text-lg font-cairo mb-4 border-b border-asa-orange/40 pb-2 inline-block">
                {currentTranslations.footerQuickLinks}
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="#hero" className="text-[#6B6B6B] hover:text-asa-orange text-sm font-semibold transition-colors duration-200">
                    {currentTranslations.navHome}
                  </a>
                </li>
                <li>
                  <a href="#courses" className="text-[#6B6B6B] hover:text-asa-orange text-sm font-semibold transition-colors duration-200">
                    {currentTranslations.navCourses}
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-[#6B6B6B] hover:text-asa-orange text-sm font-semibold transition-colors duration-200">
                    {currentTranslations.navAbout}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-[#6B6B6B] hover:text-asa-orange text-sm font-semibold transition-colors duration-200">
                    {currentTranslations.navContact}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contacts */}
            <div className="flex flex-col items-start">
              <h3 className="text-[#1A1A1A] font-bold text-base md:text-lg font-cairo mb-4 border-b border-asa-orange/40 pb-2 inline-block">
                {currentTranslations.footerContact}
              </h3>
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#FFE4D4] flex items-center justify-center text-asa-orange flex-shrink-0">
                    <Icon name="phone" className="w-4 h-4" />
                  </div>
                  <span className="text-[#6B6B6B] text-sm font-semibold font-cairo">{siteSettings.phone || currentTranslations.footerPhone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#FFE4D4] flex items-center justify-center text-asa-orange flex-shrink-0">
                    <Icon name="mail" className="w-4 h-4" />
                  </div>
                  <span className="text-[#6B6B6B] text-sm font-semibold font-cairo">{siteSettings.email || currentTranslations.footerEmail}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#FFE4D4] flex items-center justify-center text-asa-orange flex-shrink-0">
                    <Icon name="mapPin" className="w-4 h-4" />
                  </div>
                  <span className="text-[#6B6B6B] text-sm font-semibold font-cairo">{currentTranslations.footerAddress}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="pt-4 border-t border-[#FFE4D4] flex justify-center items-center">
            <span className="text-[#A0A0A0] text-xs font-semibold font-cairo text-center">
              {currentTranslations.footerCopyright}
            </span>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      {showModal && (
        <RegistrationModal
          onClose={closeModal}
          lang={lang}
          isRTL={isRTL}
          courses={modalCourses}
          coursesLoading={modalCoursesLoading}
        />
      )}
    </main>
  )
}

// coursesData removed — courses now render dynamically from Supabase via /api/public/courses
