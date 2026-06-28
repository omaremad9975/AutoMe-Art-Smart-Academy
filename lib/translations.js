'use client'

// Bilingual translation data for the landing page
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

export default t
