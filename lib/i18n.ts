export const LOCALES = ["ko", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_COOKIE = "yak-locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ko" || value === "en";
}

export type Messages = typeof ko;

const ko = {
  meta: {
    title: "디지털 타임캡슐",
    description: "지금 약속을 남기고, 정해진 날에만 열어보세요.",
  },
  brand: {
    header: "약속",
    subtitle: "",
    headerBilingual: "약속",
    mark: "약속",
    markNone: "없음",
  },
  nav: {
    list: "목록",
    create: "만들기",
    home: "홈으로",
    langKo: "한국어",
    langEn: "English",
  },
  home: {
    titleBefore: "오늘의 말을",
    titleAfter: "그날까지 약속하세요",
    lead: "메시지를 남기고 개봉 시각을 정한 뒤 USD $2.00로 약속합니다. 그 전까지 내용은 화면에 나타나지 않습니다.",
    cta: "타임캡슐 만들기",
    note: "개봉 날짜는 년·월·일·시·분을 비운 채로 직접 적습니다.",
    secondary: "어떻게 하나요",
  },
  empty: {
    line1: "별이 빛나는 밤에",
    line2: "꿈과 사랑, 약속을 묻다",
    line3: "그 후 우리는 ...",
  },
  create: {
    title: "새 타임캡슐",
    lead: "이메일, 메시지, 개봉 시각을 적고 USD $2.00로 약속하세요. 약속된 카드에는 개봉 시각만 보입니다.",
    email: "이메일",
    emailHelp: "개봉 안내를 받을 주소입니다.",
    emailPlaceholder: "you@example.com",
    body: "메시지",
    bodyPlaceholder: "미래의 나에게 남길 말을 적어 주세요.",
    bodyHelp: "1–4000자. 약속 후에는 미리보기가 없습니다.",
    dateLabel: "개봉 날짜 (한국 시간)",
    timeLabel: "개봉 시각",
    year: "년",
    month: "월",
    day: "일",
    hour: "시",
    minute: "분",
    dateHelp: "년 → 월 → 일, 시·분을 직접 적습니다. 지금으로부터 최소 10분 이후 (한국 시간).",
    submit: "USD $2.00로 약속하기",
    demoNote: "가상 결제입니다. 실제 청구는 없습니다. 라이브 모드에서는 Stripe Checkout $2.00로 이동합니다.",
    liveNote: "Stripe Checkout으로 USD $2.00를 결제하면 약속됩니다. 실패·취소 시 봉인되지 않습니다.",
    sealingDemo: "약속하는 중",
    sealingLive: "결제로 이동 중",
    sealedEyebrow: "약속됨",
    sealedUntil: "까지 약속됨",
    sealedHidden: "내용은 개봉 전까지 이 화면에도 표시되지 않습니다.",
    startFailed: "약속을 시작하지 못했습니다",
    canceledTitle: "결제가 취소되었습니다",
    canceledBody: "아직 약속되지 않았습니다. 실제 청구는 없습니다.",
    canceledUnlock: "개봉 예정:",
    canceledRetryHint: "저장된 메시지는 이 화면에 다시 보이지 않습니다. 같은 초안으로 결제만 이어갈 수 있습니다.",
    canceledRewriteHint: "아래 빈 칸에 다시 적어 약속하거나, 라이브 모드에서는 같은 초안을 다시 결제하세요.",
    retry: "같은 초안으로 USD $2.00 다시 약속하기",
  },
  errors: {
    emailRequired: "이메일을 입력해 주세요.",
    emailInvalid: "올바른 이메일 형식이 아닙니다.",
    bodyRequired: "메시지를 입력해 주세요. (1–4000자)",
    bodyTooLong: "메시지는 4000자를 넘을 수 없습니다.",
    unlockRequired: "개봉 날짜(년·월·일)와 시각(시·분)을 모두 입력해 주세요.",
    unlockSoon: "개봉 시각은 지금으로부터 10분 이후여야 합니다. (한국 시간)",
    unlockInvalid: "존재하지 않는 날짜이거나 시각이 올바르지 않습니다.",
    stripeMissing: "Stripe가 설정되지 않았습니다. DEMO_MODE=true이거나 STRIPE_SECRET_KEY가 필요합니다.",
    liveKeysMissing: "DEMO_MODE=false 인데 Stripe 키가 없습니다. 가상 결제로 넘어가지 않습니다.",
  },
  list: {
    title: "내 약속",
    lead: "목록에는 본문이 없습니다. 개봉 뒤에만 메일 링크로 내용을 엽니다.",
    mark: "약속",
    emptyTitle: "아직 여기에 보이는 약속이 없습니다",
    emptyBody: "새 타임캡슐을 만들거나, 개봉 안내에 있는 고유 링크로 열어 주세요. 약속된 글은 이 화면에 미리 보이지 않습니다.",
    cta: "타임캡슐 만들기",
    unlockOnly: "개봉 시각",
    pending: "결제 대기",
    sealed: "약속됨",
    ready: "개봉 가능",
  },
  success: {
    missingTitle: "결제 세션이 없습니다",
    missingBody: "Stripe에서 돌아온 세션 정보가 없습니다. 다시 약속해 주세요.",
    missingCta: "다시 만들기",
    unconfiguredTitle: "Stripe가 설정되지 않았습니다",
    unconfiguredBody: "데모 모드이거나 결제 키가 없습니다. 데모에서는 /new에서 가상 결제로 약속하세요.",
    unconfiguredCta: "만들기로",
    title: "약속됨",
    body: "내용은 개봉 전까지 화면에 나타나지 않습니다. 개봉 안내는 메일로 도착합니다.",
    until: "까지 약속됨",
    list: "목록 보기",
  },
  open: {
    lockedEyebrow: "약속됨",
    lockedTitle: "아직 개봉할 수 없습니다",
    lockedBody: "정해진 시각이 되기 전에는 내용이 보이지 않습니다.",
    until: "개봉 예정",
    openedEyebrow: "열림",
    openedTitle: "약속이 열렸습니다",
    create: "나도 약속하기",
    hint: "그날까지 기다리면 됩니다.",
  },
  notFound: {
    title: "페이지를 찾을 수 없습니다",
    body: "주소가 잘못되었거나, 메일로 받은 열람 링크가 아닙니다.",
    cta: "홈으로",
  },
  email: {
    subject: "약속이 열렸습니다",
    heading: "봉인이 풀렸습니다",
    intro: "정해진 날에 남긴 말이 도착했습니다.",
    cta: "약속 열기",
  },
};

const en: Messages = {
  meta: {
    title: "Digital Time Capsule",
    description: "Leave a promise now, and open it only on the day you chose.",
  },
  brand: {
    header: "Promise",
    subtitle: "약속",
    headerBilingual: "Promise · 약속",
    mark: "약속",
    markNone: "없음",
  },
  nav: {
    list: "List",
    create: "Create",
    home: "Home",
    langKo: "한국어",
    langEn: "English",
  },
  home: {
    titleBefore: "A promise for later",
    titleAfter: "",
    lead: "Write it. Seal it. Open it when the time comes.",
    cta: "Start writing",
    note: "Unlock fields start empty — year, month, day, hour, and minute.",
    secondary: "How it works",
  },
  empty: {
    line1: "On a starry night…",
    line2: "we bury dreams, love, a promise",
    line3: "and then we …",
  },
  create: {
    title: "Write your promise",
    lead: "A few lines is enough. You’ll seal it next.",
    email: "Email",
    emailHelp: "Where the unlock notice will be sent.",
    emailPlaceholder: "you@example.com",
    body: "Message",
    bodyPlaceholder: "On a starry night…",
    bodyHelp: "1–4000 characters. There is no preview after you promise.",
    dateLabel: "Unlock date (Korea time)",
    timeLabel: "Unlock time",
    year: "Year",
    month: "Month",
    day: "Day",
    hour: "Hour",
    minute: "Min",
    dateHelp: "Fill year → month → day, then hour and minute. At least 10 minutes from now (Korea time).",
    submit: "Seal · $2",
    demoNote: "One-time. No subscription. Virtual payment in DEMO_MODE — live mode uses Stripe Checkout USD $2.00.",
    liveNote: "Seal for $2. Once sealed, it stays locked until your open date.",
    sealingDemo: "Sealing…",
    sealingLive: "Going to checkout…",
    sealedEyebrow: "Sealed",
    sealedUntil: "opens",
    sealedHidden: "Your promise is locked. We’ll email you when it’s time to open.",
    startFailed: "Could not start the promise",
    canceledTitle: "Payment was canceled",
    canceledBody: "It is not promised yet. You were not charged.",
    canceledUnlock: "Opens:",
    canceledRetryHint: "The saved message is not shown again. You can only continue checkout for the same draft.",
    canceledRewriteHint: "Write it again below, or in live mode retry checkout for the same draft.",
    retry: "Seal · $2 — same draft",
  },
  errors: {
    emailRequired: "Please enter an email.",
    emailInvalid: "That email does not look valid.",
    bodyRequired: "Please write a message (1–4000 characters).",
    bodyTooLong: "Messages cannot exceed 4000 characters.",
    unlockRequired: "Please fill year, month, day, hour, and minute.",
    unlockSoon: "Unlock time must be at least 10 minutes from now (Korea time).",
    unlockInvalid: "That date or time is not valid.",
    stripeMissing: "Stripe is not configured. Set DEMO_MODE=true or provide STRIPE_SECRET_KEY.",
    liveKeysMissing: "DEMO_MODE=false but Stripe keys are missing. Refusing silent demo.",
  },
  list: {
    title: "My promises",
    lead: "This list never shows the letter. Open the body only from the mailed token link.",
    mark: "Promise",
    emptyTitle: "No promises visible here yet",
    emptyBody: "Create a capsule, or open the unique link from the unlock notice. Promised writing is never previewed on this screen.",
    cta: "Create a time capsule",
    unlockOnly: "Unlocks",
    pending: "Awaiting payment",
    sealed: "Promised",
    ready: "Ready to open",
  },
  success: {
    missingTitle: "No payment session",
    missingBody: "Stripe did not return a session. Please promise again.",
    missingCta: "Create again",
    unconfiguredTitle: "Stripe is not configured",
    unconfiguredBody: "This is demo mode or payment keys are missing. In demo, promise with a virtual payment on /new.",
    unconfiguredCta: "Go to create",
    title: "Sealed",
    body: "Your promise is locked. We’ll email you when it’s time to open.",
    until: "opens",
    list: "Done",
  },
  open: {
    lockedEyebrow: "Locked",
    lockedTitle: "Locked",
    lockedBody: "This promise opens on {date}.",
    until: "Opens",
    openedEyebrow: "Opened",
    openedTitle: "Your promise is open",
    create: "Leave a promise too",
    hint: "Nothing to do until then.",
  },
  notFound: {
    title: "Page not found",
    body: "This address is wrong, or it is not the open link from your email.",
    cta: "Home",
  },
  email: {
    subject: "Your promise is ready to open",
    heading: "The time you chose has come.",
    intro: "Hi — the promise you sealed is ready. Open it when you’re ready.",
    cta: "Open your promise",
  },
};

const dictionaries: Record<Locale, Messages> = { ko, en };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") {
    if (clean === "/") return "/en";
    return `/en${clean}`;
  }
  return clean;
}

export function stripLocalePrefix(pathname: string): { locale: Locale; path: string } {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const rest = pathname.slice(3) || "/";
    return { locale: "en", path: rest };
  }
  return { locale: "ko", path: pathname || "/" };
}
