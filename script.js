
"use strict";

/* ========================================
   InviteUs Smart — BINC 2026
   Frontend / Section A
   DEMO + Future Cloudflare API
======================================== */

document.documentElement.classList.add("js");

const EVENT = {
  nameAr: "مؤتمر بغداد الدولي لجراحة الجملة العصبية 2026",
  nameEn: "Baghdad International Neurosurgery Conference 2026",
  start: "2026-12-12T09:00:00+03:00",
  end: "2026-12-12T17:00:00+03:00",
  defaultMaxCompanions: 2
};

const path = window.location.pathname;
const tokenMatch = path.match(
  /^\/invite\/([A-Za-z0-9_-]{32,128})\/?$/
);

const state = {
  language: "ar",
  mode: path.startsWith("/invite/") ? "live" : "demo",
  token: tokenMatch ? tokenMatch[1] : null,
  invitation: null,
  programFilter: "all",
  requestPending: false,
  feedbackKey: null,
  feedbackError: false
};

const $ = id => document.getElementById(id);

/* ========================================
   Translations
======================================== */

const TRANSLATIONS = {
  ar: {
    skip: "الانتقال إلى المحتوى",
    demoBar: "مؤتمر افتراضي لأغراض العرض والتجربة فقط",
    navAbout: "عن المؤتمر",
    navProgram: "البرنامج",
    navSpeakers: "المتحدثون",
    navVenue: "الموعد",
    invitation: "دعوتك",
    heroEyebrow: "بغداد | 12 ديسمبر 2026",
    heroTitle: "مؤتمر بغداد الدولي لجراحة الجملة العصبية",
    heroDescription:
      "لقاء علمي افتراضي يجمع الجراحين والباحثين لاستكشاف مستقبل جراحة الدماغ والعمود الفقري والتقنيات العصبية الحديثة.",
    heroDate: "السبت، 12 ديسمبر 2026",
    heroTime: "9 صباحاً – 5 مساءً",
    heroLocation: "بغداد، العراق",
    viewInvite: "استعرض دعوتك",
    exploreProgram: "استكشف البرنامج",
    countTitle: "الوقت المتبقي للمؤتمر",
    eventStarted: "انتهى الموعد المحدد للعرض التجريبي",
    days: "يوم",
    hours: "ساعة",
    minutes: "دقيقة",
    seconds: "ثانية",

    aboutTitle: "حيث يلتقي العلم بمستقبل الجراحة",
    aboutText:
      "يُقدم هذا المؤتمر الافتراضي تجربة علمية تستعرض الابتكارات في جراحة الأعصاب والتصوير العصبي والجراحة الدقيقة، ضمن برنامج يجمع المحاضرات والنقاشات العلمية.",
    metricGuests: "حاضر متوقع",
    metricSessions: "جلسات علمية",
    metricTracks: "محاور رئيسية",
    allDemo: "الأسماء والإحصاءات والبرنامج بيانات افتراضية.",

    tracksTitle: "المحاور العلمية",
    tracksIntro: "ثلاثة مسارات تتناول أبرز مجالات جراحة الأعصاب.",
    track1Title: "جراحة أورام الدماغ",
    track1Desc:
      "الاستئصال الموجّه بالصور والتقنيات الجراحية الدقيقة.",
    track2Title: "جراحة العمود الفقري",
    track2Desc:
      "الأساليب طفيفة التوغل والملاحة الجراحية في عمليات العمود الفقري.",
    track3Title: "التقنيات العصبية المتقدمة",
    track3Desc:
      "الذكاء الاصطناعي والتخطيط الجراحي والتصوير العصبي الحديث.",

    programTitle: "البرنامج العلمي",
    programIntro:
      "جدول جلسات تفاعلي موزع بين الصباح والمساء.",
    tabAll: "البرنامج الكامل",
    tabMorning: "الفترة الصباحية",
    tabAfternoon: "الفترة المسائية",
    programDemo:
      "البرنامج والمحاضرات لغرض العرض فقط وقد تم اختلاقها.",
    session: "جلسة علمية",
    opening: "افتتاح",
    break: "استراحة",
    closing: "ختام",

    speakersTitle: "المتحدثون الافتراضيون",
    speakersIntro:
      "شخصيات علمية خيالية أُنشئت لغرض تجربة التصميم.",
    speakerDisclaimer: "شخصية افتراضية",

    venueTitle: "موعد ومكان المؤتمر",
    detailDateLabel: "التاريخ",
    detailDate: "السبت، 12 ديسمبر 2026",
    detailTimeLabel: "الوقت",
    detailTime: "9:00 صباحاً – 5:00 مساءً",
    detailPlaceLabel: "المكان الافتراضي",
    detailPlace: "قاعة الرافدين للمؤتمرات الطبية",
    venueFiction:
      "اسم القاعة افتراضي ولا يمثل موقعاً حقيقياً.",
    detailZoneLabel: "التوقيت",
    addCalendar: "أضف إلى التقويم",
    viewMap: "عرض مدينة بغداد",

    personalTitle: "دعوتك الشخصية",
    personalIntro: "نرحب بمشاركتكم في هذا اللقاء العلمي.",
    loadingInvite: "جارٍ تحميل بيانات الدعوة...",
    formalInvitation: "دعوة رسمية للمشاركة",
    inviteEvent: "مؤتمر بغداد الدولي لجراحة الجملة العصبية 2026",
    inviteDate: "السبت 12 ديسمبر 2026 | بغداد",
    personalMessage:
      "يسر اللجنة المنظمة الافتراضية لمؤتمر بغداد الدولي لجراحة الجملة العصبية دعوة {name} للمشاركة في فعاليات المؤتمر.",
    rsvpTitle: "تأكيد الحضور",
    rsvpExplain:
      "حدّد قرار الحضور وعدد المرافقين وأسماءهم.",
    companionLabel: "عدد المرافقين",
    companionName: "اسم المرافق",
    companionPlaceholder: "اكتب الاسم الكامل",
    attend: "سأحضر",
    decline: "أعتذر عن الحضور",
    demoModeNote:
      "وضع DEMO: يمكنك تجربة النموذج، لكن لن تُحفظ البيانات على الخادم ولن تصدر رموز QR حقيقية.",
    liveModeNote:
      "سيُرسل تأكيدك إلى النظام الآمن الخاص بالمؤتمر.",
    demoAttending:
      "تمت معاينة تأكيد الحضور محلياً فقط. لم تُسجل أي بيانات حقيقية.",
    demoDeclined:
      "تمت معاينة الاعتذار فقط. لم يُسجل أي تغيير حقيقي.",
    successAttending:
      "تم إرسال طلب الحضور. تظهر التذاكر الصادرة من الخادم أدناه.",
    successDeclined: "تم تسجيل الاعتذار عبر الخادم.",
    confirmDecline: "هل تريد تسجيل الاعتذار عن الحضور؟",
    statusAttending: "حالة الدعوة: مؤكدة للحضور",
    statusDeclined: "حالة الدعوة: اعتذار عن الحضور",
    statusPending: "حالة الدعوة: بانتظار الرد",
    invalidCompanions: "يرجى كتابة أسماء جميع المرافقين.",
    invalidGuest:
      "يرجى التحقق من أسماء المرافقين وعدم تركها فارغة.",
    loadingAction: "جارٍ إرسال الطلب...",
    loadingError:
      "تعذر تحميل الدعوة. تحقق من الرابط أو اتصال الخادم.",
    invalidToken:
      "رابط الدعوة غير صحيح أو غير مكتمل.",
    networkError:
      "تعذر تأكيد العملية عبر الخادم. افتح الدعوة مجدداً للتحقق من حالتها قبل إعادة المحاولة.",

    ticketHeading: "تذاكر الحضور",
    ticketExplanation:
      "تصدر تذكرة منفصلة لكل شخص عند الربط الحقيقي.",
    ticketPrimary: "المدعو الأساسي",
    ticketCompanion: "مرافق",
    ticketDemo: "معاينة فقط",
    ticketActive: "فعالة",
    ticketUsed: "مستخدمة",
    ticketCancelled: "ملغاة",
    noRealQR: "لا يوجد QR حقيقي في وضع العرض التجريبي.",
    qrUnavailable: "تعذر تحميل رمز QR من الخادم.",
    ticketNoData:
      "لم يعرض الخادم تذاكر حالياً. لا تعتبر الدعوة تذكرة دخول حتى تُصدر التذكرة الحقيقية.",
    ticketDemoNote:
      "هذه بطاقات استعراضية لا يمكن استخدامها للدخول أو المسح.",
    ticketLiveNote:
      "يُتحقق من التذاكر عند بوابات الدخول. رمز QR لا يثبت هوية حامله دون فحص بشري.",
    saveTicket: "حفظ / طباعة",
    shareTicket: "مشاركة",
    shareCopied: "تم نسخ رابط مشاركة التذكرة.",
    shareUnavailable: "تعذرت مشاركة التذكرة.",
    ticketDate: "12 ديسمبر 2026",

    privacyText:
      "الإصدار التجريبي لا يخزن تأكيدات الحضور على خادم. التذاكر الحقيقية تتطلب ربط النظام بقاعدة البيانات.",
    footerName:
      "مؤتمر بغداد الدولي لجراحة الجملة العصبية",
    footerDisclaimer:
      "هذا مؤتمر افتراضي غير تابع لأي جهة طبية حقيقية."
  },

  en: {
    skip: "Skip to content",
    demoBar: "Fictional conference for demonstration purposes only",
    navAbout: "About",
    navProgram: "Program",
    navSpeakers: "Speakers",
    navVenue: "Event Details",
    invitation: "My Invitation",
    heroEyebrow: "Baghdad | December 12, 2026",
    heroTitle: "Baghdad International Neurosurgery Conference",
    heroDescription:
      "A fictional scientific gathering exploring the future of brain and spine surgery, advanced surgical methods and emerging neurotechnologies.",
    heroDate: "Saturday, December 12, 2026",
    heroTime: "9:00 AM – 5:00 PM",
    heroLocation: "Baghdad, Iraq",
    viewInvite: "View Invitation",
    exploreProgram: "Explore Program",
    countTitle: "Time Until Conference",
    eventStarted: "The scheduled demo date has passed",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",

    aboutTitle: "Where Science Meets the Future of Surgery",
    aboutText:
      "This fictional medical conference presents developments in neurosurgery, neuroimaging and microsurgical techniques through an engaging program of lectures and scientific discussions.",
    metricGuests: "Expected Guests",
    metricSessions: "Scientific Sessions",
    metricTracks: "Main Tracks",
    allDemo: "All speakers, statistics and sessions are fictional.",

    tracksTitle: "Scientific Tracks",
    tracksIntro:
      "Three tracks exploring important areas of neurosurgery.",
    track1Title: "Brain Tumor Surgery",
    track1Desc:
      "Image-guided resection and contemporary microsurgical approaches.",
    track2Title: "Spinal Surgery",
    track2Desc:
      "Minimally invasive procedures and image-guided spine surgery.",
    track3Title: "Advanced Neurotechnology",
    track3Desc:
      "Artificial intelligence, surgical planning and modern neuroimaging.",

    programTitle: "Scientific Program",
    programIntro:
      "An interactive agenda covering the morning and afternoon.",
    tabAll: "Full Program",
    tabMorning: "Morning",
    tabAfternoon: "Afternoon",
    programDemo:
      "All lectures and program details are fictional.",
    session: "Scientific Session",
    opening: "Opening",
    break: "Break",
    closing: "Closing",

    speakersTitle: "Fictional Speakers",
    speakersIntro:
      "Imaginary medical professionals created for this design demonstration.",
    speakerDisclaimer: "Fictional character",

    venueTitle: "Date & Location",
    detailDateLabel: "Date",
    detailDate: "Saturday, December 12, 2026",
    detailTimeLabel: "Time",
    detailTime: "9:00 AM – 5:00 PM",
    detailPlaceLabel: "Fictional Venue",
    detailPlace: "Al-Rafidain Medical Conference Hall",
    venueFiction:
      "This is a fictional venue and not a real mapped location.",
    detailZoneLabel: "Time Zone",
    addCalendar: "Add to Calendar",
    viewMap: "View Baghdad",

    personalTitle: "Your Personal Invitation",
    personalIntro:
      "We welcome your participation in this scientific gathering.",
    loadingInvite: "Loading invitation...",
    formalInvitation: "Official Invitation",
    inviteEvent: "Baghdad International Neurosurgery Conference 2026",
    inviteDate: "December 12, 2026 | Baghdad",
    personalMessage:
      "The fictional organizing committee of the Baghdad International Neurosurgery Conference is pleased to invite {name} to participate in the conference.",
    rsvpTitle: "RSVP",
    rsvpExplain:
      "Confirm attendance and provide accompanying guests' names.",
    companionLabel: "Number of Companions",
    companionName: "Companion Name",
    companionPlaceholder: "Enter full name",
    attend: "I Will Attend",
    decline: "Decline Invitation",
    demoModeNote:
      "DEMO MODE: You can explore the form, but no data is saved to a server and no real QR tickets are issued.",
    liveModeNote:
      "Your response will be submitted to the secure conference system.",
    demoAttending:
      "Attendance preview completed locally. Nothing was registered on a server.",
    demoDeclined:
      "Decline preview completed locally. No server data was changed.",
    successAttending:
      "Attendance submitted. Server-issued tickets are shown below.",
    successDeclined:
      "Your decline was registered by the server.",
    confirmDecline:
      "Do you want to decline this invitation?",
    statusAttending: "Invitation Status: Attending",
    statusDeclined: "Invitation Status: Declined",
    statusPending: "Invitation Status: Awaiting Response",
    invalidCompanions: "Please enter every companion's name.",
    invalidGuest: "Please check all companion names.",
    loadingAction: "Submitting...",
    loadingError:
      "Could not load the invitation. Check the link or server connection.",
    invalidToken: "Invalid or incomplete invitation link.",
    networkError:
      "The server could not confirm the operation. Reopen the invitation to verify its status before retrying.",

    ticketHeading: "Admission Tickets",
    ticketExplanation:
      "A separate ticket is issued for each individual when connected to the real backend.",
    ticketPrimary: "Primary Guest",
    ticketCompanion: "Companion",
    ticketDemo: "Preview Only",
    ticketActive: "Active",
    ticketUsed: "Used",
    ticketCancelled: "Cancelled",
    noRealQR: "No real QR code is issued in DEMO mode.",
    qrUnavailable: "Could not load QR code from server.",
    ticketNoData:
      "No server-issued tickets are currently available. This invitation is not an admission ticket until one is issued.",
    ticketDemoNote:
      "These demonstration cards cannot be scanned or used for admission.",
    ticketLiveNote:
      "Tickets are verified at the entry gates. A QR code does not independently establish the holder's identity.",
    saveTicket: "Save / Print",
    shareTicket: "Share",
    shareCopied: "Ticket-sharing link copied.",
    shareUnavailable: "Unable to share ticket.",
    ticketDate: "December 12, 2026",

    privacyText:
      "The demonstration does not store RSVP data on a server. Real ticket issuance requires a connected database.",
    footerName:
      "Baghdad International Neurosurgery Conference",
    footerDisclaimer:
      "This is a fictional conference unaffiliated with any real medical organization."
  }
};

function t(key) {
  return TRANSLATIONS[state.language][key] || key;
}

/* ========================================
   Fictional Scientific Program
======================================== */

const PROGRAM = [
  {
    time: "09:00",
    period: "morning",
    type: "opening",
    ar: "التسجيل واستقبال المشاركين",
    en: "Registration & Participant Reception",
    descAr: "استقبال الحضور وتنظيم الدخول.",
    descEn: "Participant arrival and registration."
  },
  {
    time: "09:30",
    period: "morning",
    type: "opening",
    ar: "الجلسة الافتتاحية: مستقبل جراحة الأعصاب",
    en: "Opening Keynote: The Future of Neurosurgery",
    descAr: "نظرة عامة على التطورات الحديثة في اختصاص جراحة الأعصاب.",
    descEn: "An overview of developments in neurosurgical practice."
  },
  {
    time: "10:00",
    period: "morning",
    type: "session",
    ar: "الاستئصال الدقيق لأورام الدماغ",
    en: "Precision Resection of Brain Tumors",
    descAr: "تقنيات الملاحة الجراحية والتصوير داخل العمليات.",
    descEn: "Surgical navigation and intraoperative imaging."
  },
  {
    time: "10:45",
    period: "morning",
    type: "session",
    ar: "الجراحة طفيفة التوغل للعمود الفقري",
    en: "Minimally Invasive Spine Surgery",
    descAr: "مقاربات حديثة لتقليل الرض الجراحي.",
    descEn: "Contemporary approaches to reducing surgical trauma."
  },
  {
    time: "11:30",
    period: "morning",
    type: "session",
    ar: "جراحة الأوعية الدماغية المعقدة",
    en: "Complex Cerebrovascular Surgery",
    descAr: "مناقشة استراتيجيات التعامل مع الآفات الوعائية.",
    descEn: "Strategies for challenging cerebrovascular lesions."
  },
  {
    time: "12:15",
    period: "morning",
    type: "break",
    ar: "استراحة وغداء",
    en: "Lunch Break",
    descAr: "استراحة بين الجلسات العلمية.",
    descEn: "Break between scientific sessions."
  },
  {
    time: "13:15",
    period: "afternoon",
    type: "session",
    ar: "التصوير العصبي والتخطيط قبل العمليات",
    en: "Neuroimaging & Preoperative Planning",
    descAr: "دمج الصور العصبية في اتخاذ القرار الجراحي.",
    descEn: "Integrating neuroimaging into surgical decisions."
  },
  {
    time: "14:00",
    period: "afternoon",
    type: "session",
    ar: "التنظير العصبي في الجراحة الحديثة",
    en: "Neuroendoscopy in Modern Surgery",
    descAr: "التطبيقات المعاصرة للجراحة العصبية بالمنظار.",
    descEn: "Contemporary applications of neuroendoscopy."
  },
  {
    time: "14:45",
    period: "afternoon",
    type: "session",
    ar: "المراقبة العصبية أثناء الجراحة",
    en: "Intraoperative Neurophysiological Monitoring",
    descAr: "استخدام المراقبة الوظيفية للمساعدة في سلامة العمليات.",
    descEn: "Functional monitoring in surgical safety."
  },
  {
    time: "15:30",
    period: "afternoon",
    type: "session",
    ar: "الذكاء الاصطناعي في جراحة الدماغ",
    en: "Artificial Intelligence in Brain Surgery",
    descAr: "التخطيط وتحليل الصور وتطبيقات الدعم الجراحي.",
    descEn: "Planning, imaging analysis and decision support."
  },
  {
    time: "16:15",
    period: "afternoon",
    type: "closing",
    ar: "النقاش الختامي والتوصيات",
    en: "Closing Discussion & Recommendations",
    descAr: "نقاش مفتوح واختتام البرنامج الافتراضي عند الخامسة.",
    descEn: "Open discussion and conclusion by 5:00 PM."
  }
];

/* ========================================
   Fictional Speakers
======================================== */

const SPEAKERS = [
  {
    initials: "SK",
    nameAr: "الدكتور سامر الكرخي",
    nameEn: "Dr. Samer Al-Karkhi",
    roleAr: "جراحة أورام الدماغ والجراحة الدقيقة",
    roleEn: "Brain Tumor & Microsurgical Neurosurgery"
  },
  {
    initials: "LN",
    nameAr: "الدكتورة ليلى النعيمي",
    nameEn: "Dr. Layla Al-Nuaimi",
    roleAr: "جراحة العمود الفقري والتقنيات طفيفة التوغل",
    roleEn: "Spine & Minimally Invasive Surgery"
  },
  {
    initials: "HA",
    nameAr: "الدكتور حيدر العبيدي",
    nameEn: "Dr. Haider Al-Obaidi",
    roleAr: "التقنيات العصبية والتخطيط الجراحي",
    roleEn: "Neurotechnology & Surgical Planning"
  }
];

/* ========================================
   Language
======================================== */

function setLanguage(lang) {
  if (lang !== "ar" && lang !== "en") return;

  state.language = lang;

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.title = lang === "ar"
    ? EVENT.nameAr + " | DEMO"
    : EVENT.nameEn + " | DEMO";

  document.querySelectorAll("[data-t]").forEach(element => {
    element.textContent = t(element.dataset.t);
  });

  const toggle = $("languageToggle");
  toggle.textContent = lang === "ar" ? "EN" : "عربي";
  toggle.setAttribute(
    "aria-label",
    lang === "ar" ? "Switch to English" : "التبديل إلى العربية"
  );

  renderProgram();
  renderSpeakers();
  renderCountdown();

  if (state.invitation) {
    renderInvitation();
    updateCompanionLabels();
  }

  if (state.feedbackKey) {
    showFeedback(state.feedbackKey, state.feedbackError);
  }

  if (state.mode === "live" && !state.invitation) {
    $("modeNotice").textContent = t("liveModeNote");
  }

  document.querySelector(".program-tabs").setAttribute(
    "aria-label",
    lang === "ar" ? "الفترة الزمنية للبرنامج" : "Program period"
  );
}

/* ========================================
   Countdown
======================================== */

function pad(number) {
  return String(number).padStart(2, "0");
}

function renderCountdown() {
  const remaining = Math.max(
    0,
    new Date(EVENT.start).getTime() - Date.now()
  );

  const totalSeconds = Math.floor(remaining / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $("days").textContent = pad(days);
  $("hours").textContent = pad(hours);
  $("minutes").textContent = pad(minutes);
  $("seconds").textContent = pad(seconds);

  if (remaining === 0) {
    document.querySelector(".countdown-intro h2")
      .textContent = t("eventStarted");
  }
}

/* ========================================
   Program Rendering
======================================== */

function makeElement(tag, className, content = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = content;
  return element;
}

function renderProgram() {
  const list = $("programList");
  list.replaceChildren();

  const filtered = PROGRAM.filter(item =>
    state.programFilter === "all" ||
    item.period === state.programFilter
  );

  filtered.forEach(item => {
    const article = makeElement("article", "program-item");

    const time = makeElement(
      "time",
      "program-time",
      item.time
    );

    const content = makeElement("div", "program-content");

    const title = makeElement(
      "h3",
      "",
      state.language === "ar" ? item.ar : item.en
    );

    const description = makeElement(
      "p",
      "",
      state.language === "ar" ? item.descAr : item.descEn
    );

    content.append(title, description);

    const type = makeElement(
      "span",
      "program-type",
      t(item.type)
    );

    article.append(time, content, type);
    list.appendChild(article);
  });

  document.querySelectorAll(".program-tabs .tab")
    .forEach(button => {
      const active = button.dataset.filter === state.programFilter;

      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;

      if (active) {
        list.setAttribute("aria-labelledby", button.id);
      }
    });
}

function initProgramTabs() {
  const tabs = Array.from(
    document.querySelectorAll(".program-tabs .tab")
  );

  tabs.forEach((button, index) => {
    button.addEventListener("click", () => {
      state.programFilter = button.dataset.filter;
      renderProgram();
    });

    button.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"]
        .includes(event.key)) return;

      event.preventDefault();

      let nextIndex = index;

      if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else {
        const step = event.key === "ArrowRight" ? 1 : -1;
        nextIndex = (index + step + tabs.length) % tabs.length;
      }

      tabs[nextIndex].click();
      tabs[nextIndex].focus();
    });
  });
}

/* ========================================
   Speakers Rendering
======================================== */

function renderSpeakers() {
  const grid = $("speakersGrid");
  grid.replaceChildren();

  SPEAKERS.forEach((speaker, index) => {
    const card = makeElement("article", "speaker-card");

    const visual = makeElement("div", "speaker-visual");
    visual.setAttribute("aria-hidden", "true");

    const orbit = makeElement("div", "speaker-orbit");
    const initials = makeElement(
      "span",
      "speaker-initials",
      speaker.initials
    );

    orbit.appendChild(initials);
    visual.appendChild(orbit);

    const content = makeElement("div", "speaker-content");

    content.append(
      makeElement(
        "span",
        "speaker-index",
        "FACULTY / " + pad(index + 1)
      ),
      makeElement(
        "h3",
        "",
        state.language === "ar" ? speaker.nameAr : speaker.nameEn
      ),
      makeElement(
        "p",
        "",
        state.language === "ar" ? speaker.roleAr : speaker.roleEn
      ),
      makeElement("small", "", t("speakerDisclaimer"))
    );

    card.append(visual, content);
    grid.appendChild(card);
  });
}

/* ========================================
   Calendar (Baghdad UTC+03:00)
======================================== */

function formatICSDate(date) {
  return date.toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeICS(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function downloadCalendar() {
  const title = state.language === "ar"
    ? EVENT.nameAr
    : EVENT.nameEn;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//InviteUs Smart//BINC Demo//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:binc2026-demo@inviteus.party",
    "DTSTAMP:" + formatICSDate(new Date()),
    "DTSTART:" + formatICSDate(new Date(EVENT.start)),
    "DTEND:" + formatICSDate(new Date(EVENT.end)),
    "SUMMARY:" + escapeICS(title + " (DEMO)"),
    "LOCATION:" + escapeICS("Baghdad, Iraq — Fictional Venue"),
    "DESCRIPTION:" + escapeICS(
      "Fictional medical conference for demonstration only."
    ),
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  const blob = new Blob(
    [lines.join("\r\n") + "\r\n"],
    { type: "text/calendar;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "BINC-2026-DEMO.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ========================================
   DEMO invitation data
   No database, no real ticket issuance
======================================== */

function demoInvitation() {
  return {
    guest: {
      displayName: "الدكتور محمد أحمد"
    },
    maxCompanions: 2,
    rsvp: {
      status: "pending",
      companions: []
    },
    tickets: []
  };
}

function getGuestName() {
  if (!state.invitation) return "";

  if (state.mode === "demo") {
    return state.language === "ar"
      ? "الدكتور محمد أحمد"
      : "Dr. Mohammed Ahmed";
  }

  return state.invitation.guest.displayName;
}

/* ========================================
   Backend API contract
   GET  /api/v1/public/invitations/:token
   POST /api/v1/public/invitations/:token/rsvp
======================================== */

async function requestJSON(url, options = {}) {
  const controller = new AbortController();

  const timeout = window.setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const contentType =
      response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error("Invalid API content type");
    }

    const payload = await response.json();

    if (payload.success === false) {
      throw new Error("API request failed");
    }

    return payload.data || payload;
  } finally {
    window.clearTimeout(timeout);
  }
}

function normalizeInvitation(payload) {
  if (!payload || !payload.guest ||
      typeof payload.guest.displayName !== "string") {
    throw new Error("Invalid invitation response");
  }

  const rawMax = Number(payload.maxCompanions);
  const maxCompanions = Number.isInteger(rawMax)
    ? Math.max(0, Math.min(30, rawMax))
    : 0;

  const rawRSVP = payload.rsvp || {};
  const status = ["pending", "attending", "declined"]
    .includes(rawRSVP.status)
    ? rawRSVP.status
    : "pending";

  const companions = Array.isArray(rawRSVP.companions)
    ? rawRSVP.companions
        .filter(name => typeof name === "string")
        .map(name => name.slice(0, 120))
        .slice(0, maxCompanions)
    : [];

  return {
    guest: {
      displayName: payload.guest.displayName.slice(0, 150)
    },
    maxCompanions,
    rsvp: { status, companions },
    tickets: Array.isArray(payload.tickets)
      ? payload.tickets
      : []
  };
}

function invitationURL() {
  return "/api/v1/public/invitations/" +
    encodeURIComponent(state.token);
}

async function loadInvitation() {
  if (state.mode === "demo") {
    state.invitation = demoInvitation();
    syncFormFromInvitation();
    renderInvitation();
    $("invitationLoading").hidden = true;
    return;
  }

  if (!state.token) {
    $("invitationLoading").textContent = t("invalidToken");
    return;
  }

  try {
    const response = await requestJSON(invitationURL());

    state.invitation = normalizeInvitation(response);

    syncFormFromInvitation();
    renderInvitation();

    $("invitationLoading").hidden = true;
  } catch (error) {
    console.error("Invitation loading error:", error);
    $("invitationLoading").textContent = t("loadingError");
  }
}

/* ========================================
   Companion Form
======================================== */

function syncFormFromInvitation() {
  const invitation = state.invitation;
  if (!invitation) return;

  const select = $("companionCount");
  select.replaceChildren();

  const max = invitation.maxCompanions;

  for (let i = 0; i <= max; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = String(i);
    select.appendChild(option);
  }

  const names = invitation.rsvp.companions;

  select.value = String(Math.min(names.length, max));
  renderCompanionFields(names);
}

function renderCompanionFields(providedNames = null) {
  const container = $("companionsFields");
  const count = Number($("companionCount").value);

  const oldNames = Array.from(
    container.querySelectorAll("input")
  ).map(input => input.value);

  const values = Array.isArray(providedNames)
    ? providedNames
    : oldNames;

  container.replaceChildren();

  for (let i = 0; i < count; i++) {
    const wrap = makeElement("div", "companion-field");

    const label = makeElement(
      "label",
      "",
      t("companionName") + " " + (i + 1)
    );

    const input = document.createElement("input");

    input.type = "text";
    input.id = "companion-" + i;
    input.name = "companion-" + i;
    input.maxLength = 120;
    input.minLength = 2;
    input.required = true;
    input.autocomplete = "name";
    input.placeholder = t("companionPlaceholder");
    input.value = values[i] || "";

    label.htmlFor = input.id;
    wrap.append(label, input);
    container.appendChild(wrap);
  }
}

function updateCompanionLabels() {
  const inputs = $("companionsFields").querySelectorAll("input");

  inputs.forEach((input, index) => {
    const label = input.previousElementSibling;
    if (label) {
      label.textContent = t("companionName") + " " + (index + 1);
    }
    input.placeholder = t("companionPlaceholder");
  });
}

function collectCompanions() {
  return Array.from(
    $("companionsFields").querySelectorAll("input")
  ).map(input => input.value.trim().replace(/\s+/g, " "));
}

/* ========================================
   RSVP Display
======================================== */

function renderInvitation() {
  if (!state.invitation) return;

  const name = getGuestName();

  $("invitationPanel").hidden = false;
  $("guestName").textContent = name;

  $("personalMessage").textContent =
    t("personalMessage").replace("{name}", name);

  document.querySelector(".card-demo-tag").hidden =
    state.mode !== "demo";

  $("modeNotice").textContent = t(
    state.mode === "demo" ? "demoModeNote" : "liveModeNote"
  );

  const status = state.invitation.rsvp.status;

  if (!state.feedbackKey) {
    if (status === "attending") {
      showFeedback("statusAttending");
    } else if (status === "declined") {
      showFeedback("statusDeclined");
    } else {
      showFeedback("statusPending");
    }
  }

  if (status === "attending") {
    renderTickets();
  } else {
    $("ticketSection").hidden = true;
    $("ticketsGrid").replaceChildren();
  }
}

function showFeedback(key, isError = false) {
  state.feedbackKey = key;
  state.feedbackError = isError;

  const feedback = $("rsvpFeedback");
  feedback.textContent = t(key);
  feedback.classList.toggle("error", isError);
}

function setSubmitting(submitting) {
  state.requestPending = submitting;

  $("attendButton").disabled = submitting;
  $("declineButton").disabled = submitting;
  $("companionCount").disabled = submitting;

  $("companionsFields").querySelectorAll("input")
    .forEach(input => {
      input.disabled = submitting;
    });

  if (submitting) {
    $("rsvpFeedback").textContent = t("loadingAction");
  }
}

/* ========================================
   Ticket Rendering
======================================== */

function safeTicketID(value) {
  return typeof value === "string" &&
    /^[A-Za-z0-9_-]{8,100}$/.test(value);
}

function ticketStatusKey(status) {
  if (status === "active") return "ticketActive";
  if (status === "used") return "ticketUsed";
  if (status === "cancelled") return "ticketCancelled";
  return "ticketDemo";
}

function makeTicketCard(ticket, demo = false) {
  const card = makeElement("article", "ticket-card");

  if (safeTicketID(ticket.id)) {
    card.dataset.ticketId = ticket.id;
  }

  const top = makeElement("div", "ticket-top");

  top.append(
    makeElement("span", "", "BINC / 2026"),
    makeElement(
      "span",
      "ticket-status " + (demo ? "" : ticket.status),
      t(demo ? "ticketDemo" : ticketStatusKey(ticket.status))
    )
  );

  const holder = makeElement(
    "h4",
    "ticket-holder",
    String(ticket.holderName || "")
  );

  const kind = makeElement(
    "p",
    "ticket-kind",
    t(ticket.type === "companion"
      ? "ticketCompanion"
      : "ticketPrimary")
  );

  const qrArea = makeElement("div", "ticket-qr");

  if (demo) {
    qrArea.appendChild(makeElement(
      "span",
      "ticket-qr-placeholder",
      t("noRealQR")
    ));
  } else if (safeTicketID(ticket.id) && state.token) {
    const image = document.createElement("img");

    image.src =
      invitationURL() + "/tickets/" +
      encodeURIComponent(ticket.id) + "/qr";

    image.alt = "QR";
    image.referrerPolicy = "no-referrer";

    image.addEventListener("error", () => {
      qrArea.replaceChildren(
        makeElement(
          "span",
          "ticket-qr-placeholder",
          t("qrUnavailable")
        )
      );
    });

    qrArea.appendChild(image);
  } else {
    qrArea.appendChild(makeElement(
      "span",
      "ticket-qr-placeholder",
      t("qrUnavailable")
    ));
  }

  const date = makeElement(
    "p",
    "ticket-kind",
    t("ticketDate")
  );

  card.append(top, holder, kind, qrArea, date);

  if (!demo && ticket.status !== "cancelled") {
    const actions = makeElement("div", "ticket-actions");

    if (safeTicketID(ticket.id)) {
      const save = makeElement(
        "button",
        "",
        t("saveTicket")
      );

      save.type = "button";
      save.dataset.action = "print";
      save.dataset.id = ticket.id;

      actions.appendChild(save);
    }

    if (typeof ticket.shareUrl === "string" &&
        validShareURL(ticket.shareUrl)) {
      const share = makeElement(
        "button",
        "",
        t("shareTicket")
      );

      share.type = "button";
      share.dataset.action = "share";
      share.dataset.id = ticket.id;

      actions.appendChild(share);
    }

    if (actions.children.length) {
      card.appendChild(actions);
    }
  }

  return card;
}

function validShareURL(value) {
  try {
    const url = new URL(value, window.location.origin);

    return url.origin === window.location.origin &&
      url.pathname.startsWith("/ticket/") &&
      !url.username &&
      !url.password;
  } catch {
    return false;
  }
}

function renderTickets() {
  const grid = $("ticketsGrid");
  const section = $("ticketSection");

  grid.replaceChildren();
  section.hidden = false;

  if (state.mode === "demo") {
    const names = [
      getGuestName(),
      ...state.invitation.rsvp.companions
    ];

    names.forEach((name, index) => {
      grid.appendChild(makeTicketCard({
        holderName: name,
        type: index === 0 ? "primary" : "companion",
        status: "demo"
      }, true));
    });

    $("ticketNotice").textContent = t("ticketDemoNote");
    return;
  }

  const tickets = state.invitation.tickets;

  if (!tickets.length) {
    grid.appendChild(makeElement(
      "p",
      "ticket-notice",
      t("ticketNoData")
    ));
  } else {
    tickets.forEach(ticket => {
      grid.appendChild(makeTicketCard(ticket));
    });
  }

  $("ticketNotice").textContent = t("ticketLiveNote");
}

/* ========================================
   RSVP Submission
======================================== */

async function submitRSVP(status, companions = []) {
  if (!state.invitation || state.requestPending) return;

  if (state.mode === "demo") {
    state.invitation.rsvp = {
      status,
      companions: status === "attending" ? companions : []
    };

    state.invitation.tickets = [];

    showFeedback(
      status === "attending"
        ? "demoAttending"
        : "demoDeclined"
    );

    renderInvitation();
    return;
  }

  setSubmitting(true);

  try {
    const body = {
      status,
      companions: status === "attending" ? companions : []
    };

    if (window.crypto && window.crypto.randomUUID) {
      body.idempotencyKey = window.crypto.randomUUID();
    }

    await requestJSON(invitationURL() + "/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // Fetch authoritative state from the server again.
    const updated = await requestJSON(invitationURL());

    state.invitation = normalizeInvitation(updated);
    syncFormFromInvitation();

    showFeedback(
      status === "attending"
        ? "successAttending"
        : "successDeclined"
    );

    renderInvitation();
  } catch (error) {
    console.error("RSVP error:", error);
    showFeedback("networkError", true);
  } finally {
    setSubmitting(false);
  }
}

function initRSVP() {
  $("companionCount").addEventListener("change", () => {
    renderCompanionFields();
  });

  $("rsvpForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (state.requestPending) return;
    if (!$("rsvpForm").reportValidity()) return;

    const companions = collectCompanions();
    const selected = Number($("companionCount").value);

    if (companions.length !== selected ||
        companions.some(name => name.length < 2)) {
      showFeedback("invalidCompanions", true);
      return;
    }

    await submitRSVP("attending", companions);
  });

  $("declineButton").addEventListener("click", async () => {
    if (state.requestPending) return;

    if (!window.confirm(t("confirmDecline"))) {
      return;
    }

    await submitRSVP("declined", []);
  });
}

/* ========================================
   Print / Share Tickets
======================================== */

function printTicket(ticketId) {
  const cards = Array.from(
    document.querySelectorAll("#ticketsGrid .ticket-card")
  );

  const selected = cards.find(card =>
    card.dataset.ticketId === ticketId
  );

  if (!selected) return;

  cards.forEach(card => {
    card.classList.toggle(
      "selected-for-print",
      card === selected
    );
  });

  document.body.classList.add("print-ticket-mode");

  const cleanup = () => {
    document.body.classList.remove("print-ticket-mode");
    cards.forEach(card => {
      card.classList.remove("selected-for-print");
    });
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();
}

async function shareTicket(shareUrl) {
  if (!validShareURL(shareUrl)) return;

  const url = new URL(
    shareUrl,
    window.location.origin
  ).href;

  const title = state.language === "ar"
    ? EVENT.nameAr
    : EVENT.nameEn;

  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    showFeedback("shareCopied");
  } catch {
    showFeedback("shareUnavailable", true);
  }
}

function initTicketActions() {
  $("ticketsGrid").addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button || state.mode !== "live") return;

    const ticket = state.invitation?.tickets.find(item =>
      item.id === button.dataset.id
    );

    if (!ticket || ticket.status === "cancelled") return;

    if (button.dataset.action === "print") {
      printTicket(ticket.id);
    }

    if (button.dataset.action === "share" && ticket.shareUrl) {
      shareTicket(ticket.shareUrl);
    }
  });
}

/* ========================================
   Scroll Reveals
======================================== */

function initReveals() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px 30px 0px"
  });

  items.forEach(item => observer.observe(item));
}

/* ========================================
   Initialize
======================================== */

function init() {
  initProgramTabs();
  initRSVP();
  initTicketActions();
  initReveals();

  $("languageToggle").addEventListener("click", () => {
    setLanguage(
      state.language === "ar" ? "en" : "ar"
    );
  });

  $("calendarButton").addEventListener(
    "click",
    downloadCalendar
  );

  setLanguage("ar");
  renderCountdown();

  window.setInterval(renderCountdown, 1000);

  loadInvitation();
}

init();
