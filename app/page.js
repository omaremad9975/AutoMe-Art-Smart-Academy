'use client'

import { useState, useEffect } from 'react'

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
        quote: 'تجربة ممتازة وتدريب على أعلى مستوى. المحتوى مميز جداً والمدربين محترفين ومستعدين للمساعدة في أي وقت.',
        name: 'كريم أحمد',
        course: 'التفكير الإبداعي',
        initials: 'ك أ'
      },
      {
        stars: 5,
        quote: 'كورس الذكاء الاصطناعي كان مذهلاً! تعلّمت الكثير من الجوانب العملية والتقنيات الحديثة وكيفية تطبيقها.',
        name: 'مريم علي',
        course: 'الذكاء الاصطناعي',
        initials: 'م ع'
      },
      {
        stars: 5,
        quote: 'كورس اللغة الصينية ممتاز جداً والمنهج مبسط وممتع. ابنتي استمتعت وتطورت لغتها بشكل ملحوظ وسريع.',
        name: 'منى يوسف',
        course: 'اللغة الصينية',
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
        quote: 'Excellent experience and top-tier training. The content is outstanding and the trainers are highly professional and supportive.',
        name: 'Karim Ahmed',
        course: 'Creative Thinking',
        initials: 'KA'
      },
      {
        stars: 5,
        quote: 'The AI course was amazing! I learned a lot of practical aspects, modern techniques, and how to apply them.',
        name: 'Mariam Ali',
        course: 'Artificial Intelligence',
        initials: 'MA'
      },
      {
        stars: 5,
        quote: 'The Chinese language course is very excellent and the curriculum is simple and fun. My daughter enjoyed it and improved rapidly.',
        name: 'Mona Youssef',
        course: 'Chinese Language',
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

// ==========================================
// MAIN LANDING PAGE COMPONENT
// ==========================================
// CONFERENCE PHOTO CAROUSEL
// ==========================================
const conferencePhotos = [
  { src: '/conference/conf1.jpg', caption: 'Group photo with all conference attendees and organizers' },
  { src: '/conference/IMG_2259.jpg', caption: 'Students representing Art Smart Academy at the conference' },
  { src: '/conference/IMG_2308.jpg', caption: 'Official meeting with conference dignitaries' },
  { src: '/conference/conf2.jpg', caption: 'Conference sessions and presentations' },
  { src: '/conference/conf3.jpg', caption: 'Highlights from the International AI Conference' },
]

function ConferenceCarousel() {
  const [current, setCurrent] = useState(0)
  const total = conferencePhotos.length

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % total), 4500)
    return () => clearInterval(timer)
  }, [total])

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Main image */}
      <div className="relative rounded-asa-radius-xl overflow-hidden shadow-asa-shadow-orange" style={{ aspectRatio: '16/9' }}>
        {conferencePhotos.map((photo, i) => (
          <img
            key={i}
            src={photo.src}
            alt={photo.caption}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
        {/* Gradient overlay at bottom for caption */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        {/* Caption */}
        <p className="absolute bottom-4 left-6 right-6 text-white text-xs md:text-sm font-semibold font-cairo text-center drop-shadow">
          {conferencePhotos[current].caption}
        </p>
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
        {conferencePhotos.map((_, i) => (
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

  const currentTranslations = t[lang]
  const isRTL = lang === 'ar'

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
            <img src="/logo_mark_blue.png" alt="Art Smart Academy Logo" className="h-9 w-auto object-contain group-hover:opacity-70 transition-opacity duration-300" style={{ filter: 'brightness(0) saturate(100%)' }} />
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
            {/* CTA Button */}
            <a
              href="#contact"
              className="bg-asa-orange hover:bg-asa-orange-light text-white font-bold px-6 py-2.5 rounded-asa-radius-full text-sm transition-all duration-300 shadow-asa-shadow-orange hover:shadow-[0_8px_36px_rgba(255,92,26,0.4)] hover:-translate-y-0.5 whitespace-nowrap"
            >
              {currentTranslations.ctaRegister}
            </a>
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
              <img src="/logo_mark_blue.png" alt="Logo" className="h-8 w-auto object-contain" style={{ filter: 'brightness(0) saturate(100%)' }} />
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
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-asa-orange hover:bg-asa-orange-light text-white font-bold text-center rounded-asa-radius-full text-sm transition-all duration-300 shadow-asa-shadow-orange"
            >
              {currentTranslations.ctaRegister}
            </a>
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
            <img src="/logo_mark_blue.png" className="h-16 w-auto mx-auto object-contain" alt="Art Smart Academy Logo" style={{ filter: 'brightness(0) saturate(100%)' }} />
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
            <a
              href="#contact"
              className="w-full sm:w-auto bg-asa-orange hover:bg-asa-orange-light text-white font-bold px-8 py-3.5 rounded-asa-radius-full transition-all duration-300 shadow-asa-shadow-orange hover:shadow-[0_8px_36px_rgba(255,92,26,0.4)] hover:-translate-y-1 text-center whitespace-nowrap"
            >
              {currentTranslations.heroBtnPrimary}
            </a>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coursesData[lang].map((course) => (
              <div
                key={course.title}
                className="warm-card rounded-asa-radius-xl flex flex-col p-5 md:p-6 relative overflow-hidden"
              >
                {/* 4px top orange accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-asa-orange" />

                {/* Icon in a light circle with orange glow */}
                <div className="w-14 h-14 rounded-asa-radius-full bg-asa-orange-tint border border-asa-border flex items-center justify-center text-asa-orange shadow-[0_0_15px_rgba(255,92,26,0.12)] mb-6 self-start">
                  <Icon name={course.icon} className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3 className="text-asa-text font-bold text-xl md:text-2xl font-cairo mb-3">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-asa-text-muted text-sm font-medium leading-relaxed flex-grow mb-6">
                  {course.description}
                </p>

                {/* Instructor Row */}
                <div className="flex items-center gap-3 border-t border-asa-border pt-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-asa-orange text-white flex items-center justify-center text-xs font-bold font-cairo">
                    {course.initials}
                  </div>
                  <span className="text-asa-text text-sm font-semibold font-cairo">
                    {course.instructor}
                  </span>
                </div>

                {/* Duration Badge & Price */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs px-3 py-1 rounded-asa-radius-full bg-asa-orange-tint border border-asa-border text-asa-orange font-bold font-cairo">
                    {course.duration}
                  </span>
                  <span className="text-asa-orange font-extrabold text-lg md:text-xl font-cairo">
                    {course.price}
                  </span>
                </div>

                {/* Enroll Now Button */}
                <a
                  href="#contact"
                  className="w-full bg-asa-orange hover:bg-asa-orange-light text-white text-center font-bold py-3 rounded-asa-radius-full text-sm transition-all duration-300 shadow-asa-shadow-orange hover:shadow-[0_8px_24px_rgba(255,92,26,0.35)]"
                >
                  {currentTranslations.coursesEnroll}
                </a>
              </div>
            ))}
          </div>
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
                  <img src="/logo_mark_white.png" alt="Logo" className="w-8 h-auto" />
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
          <ConferenceCarousel />

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
              <span className="text-asa-orange font-bold text-[10px] font-cairo leading-normal max-w-[180px] mb-2 block">
                {currentTranslations.step3Detail}
              </span>
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
                    "{test.quote}"
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
            <a
              href="#contact"
              className="bg-white text-asa-orange hover:bg-[#FFF0E8] font-extrabold px-8 py-3.5 rounded-asa-radius-full transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap font-cairo"
            >
              {currentTranslations.ctaPrimary}
            </a>

            {/* WhatsApp — white outline, keeps green icon accent */}
            <a
              href="https://wa.me/201000000000"
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
                <img src="/logo_mark_blue.png" alt="Logo" className="h-8 w-auto" style={{ filter: 'brightness(0) saturate(100%)' }} />
                <span className="text-[#1A1A1A] font-extrabold text-lg tracking-wider uppercase font-cairo">
                  {currentTranslations.logoText}
                </span>
              </div>
              <p className="text-[#6B6B6B] text-sm font-medium leading-relaxed mb-6 font-cairo">
                {currentTranslations.footerTagline}
              </p>
              {/* Social Icons */}
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#FFE4D4] hover:border-asa-orange bg-white flex items-center justify-center text-[#6B6B6B] hover:text-asa-orange hover:bg-asa-orange-light/10 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Icon name="facebook" className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#FFE4D4] hover:border-asa-orange bg-white flex items-center justify-center text-[#6B6B6B] hover:text-asa-orange hover:bg-asa-orange-light/10 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Icon name="instagram" className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#FFE4D4] hover:border-asa-orange bg-white flex items-center justify-center text-[#6B6B6B] hover:text-asa-orange hover:bg-asa-orange-light/10 transition-all duration-300"
                  aria-label="TikTok"
                >
                  <Icon name="tiktok" className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/201000000000"
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
                  <span className="text-[#6B6B6B] text-sm font-semibold font-cairo">{currentTranslations.footerPhone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#FFE4D4] flex items-center justify-center text-asa-orange flex-shrink-0">
                    <Icon name="mail" className="w-4 h-4" />
                  </div>
                  <span className="text-[#6B6B6B] text-sm font-semibold font-cairo">{currentTranslations.footerEmail}</span>
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
    </main>
  )
}

// ==========================================
// COURSE STATIC DATA IN TRANSLATABLE ARRAYS
// ==========================================
const coursesData = {
  ar: [
    {
      title: 'التفكير الإبداعي',
      description: 'تعلّم كيف تفكر خارج الصندوق وتحوّل أفكارك إلى حلول مبتكرة. كورس مكثّف يطوّر مهاراتك الإبداعية وقدرتك على حل المشكلات بأساليب غير تقليدية.',
      instructor: 'د. سارة محمد',
      price: '٢٫٥٠٠ جنيه',
      duration: '٨ أسابيع',
      icon: 'lightbulb',
      initials: 'س م'
    },
    {
      title: 'الذكاء الاصطناعي',
      description: 'مقدمة شاملة في عالم الذكاء الاصطناعي وتطبيقاته العملية. تعرّف على أساسيات ML والـ AI وكيفية توظيفها في حياتك المهنية.',
      instructor: 'م. أحمد خالد',
      price: '٣٫٠٠٠ جنيه',
      duration: '١٠ أسابيع',
      icon: 'cpu',
      initials: 'أ خ'
    },
    {
      title: 'اللغة الصينية',
      description: 'تعلّم اللغة الصينية من الصفر مع أفضل الأساليب الحديثة. كورس متكامل يشمل المحادثة والكتابة والثقافة الصينية.',
      instructor: 'أ. لي وانغ',
      price: '٢٫٢٠٠ جنيه',
      duration: '١٢ أسبوعًا',
      icon: 'globe',
      initials: 'ل و'
    }
  ],
  en: [
    {
      title: 'Creative Thinking',
      description: 'Learn to think outside the box and turn your ideas into innovative solutions. An intensive course that builds creative skills and unconventional problem-solving.',
      instructor: 'Dr. Sara Mohamed',
      price: 'EGP 2,500',
      duration: '8 Weeks',
      icon: 'lightbulb',
      initials: 'SM'
    },
    {
      title: 'Artificial Intelligence',
      description: 'A comprehensive introduction to AI and its practical applications. Learn ML fundamentals and how to apply them in your career.',
      instructor: 'Eng. Ahmed Khaled',
      price: 'EGP 3,000',
      duration: '10 Weeks',
      icon: 'cpu',
      initials: 'AK'
    },
    {
      title: 'Chinese Language',
      description: 'Learn Chinese from scratch with modern methods. A complete course covering conversation, writing, and Chinese culture.',
      instructor: 'Prof. Li Wang',
      price: 'EGP 2,200',
      duration: '12 Weeks',
      icon: 'globe',
      initials: 'LW'
    }
  ]
}
