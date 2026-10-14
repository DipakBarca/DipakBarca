// English and Nepali text for the whole site.
// Elements with data-i18n="key" get their text from here;
// data-i18n-placeholder="key" sets an input's placeholder.

export const GROUPS = [
  { key: "fever", en: "Fever & pain", ne: "ज्वरो र दुखाइ" },
  { key: "cold", en: "Cold, cough & allergy", ne: "रुघा, खोकी र एलर्जी" },
  { key: "stomach", en: "Stomach & digestion", ne: "पेट र पाचन" },
  { key: "bp", en: "Blood pressure & heart", ne: "प्रेसर र मुटु" },
  { key: "diabetes", en: "Diabetes", ne: "मधुमेह (सुगर)" },
  { key: "antibiotic", en: "Antibiotics", ne: "एन्टिबायोटिक" },
  { key: "vitamins", en: "Vitamins & supplements", ne: "भिटामिन र पोषण" },
  { key: "skin", en: "Skin", ne: "छाला" },
  { key: "eye_ear", en: "Eye & ear", ne: "आँखा र कान" },
  { key: "baby", en: "Baby & mother", ne: "बच्चा र आमा" },
  { key: "women", en: "Women's health", ne: "महिला स्वास्थ्य" },
  { key: "firstaid", en: "First aid", ne: "प्राथमिक उपचार" },
  { key: "other", en: "Other", ne: "अन्य" },
];

const TEXT = {
  en: {
    nav_home: "Home",
    nav_medicines: "Medicines",
    nav_contact: "Contact",
    lang_switch: "नेपाली",

    open_now: "Open now",
    closes_at: "closes {time}",
    closed_now: "Closed now",
    closed_today: "Closed today",
    opens_at: "opens {when} {time}",
    today: "today",
    tomorrow: "tomorrow",

    call: "Call",
    whatsapp: "WhatsApp",
    check_medicines: "Check if a medicine is available",
    notice: "Notice",

    services_title: "Our services",
    svc_medicines: "Medicines & advice",
    svc_medicines_desc: "Everyday and long-term medicines, with advice on how to take them.",
    svc_bp: "Blood pressure check",
    svc_bp_desc: "Quick BP check at the shop. Ask us any time we are open.",
    svc_firstaid: "First aid",
    svc_firstaid_desc: "Cleaning and dressing small wounds, burns and cuts.",

    about_title: "About us",
    about_text:
      "A family-run pharmacy serving our village. All medicines come from registered suppliers and are stored properly.",
    pharmacist: "Pharmacist",
    npc_reg: "Nepal Pharmacy Council Reg. No.",
    dda_license: "DDA License No.",

    rx_note: "Prescription medicines are given only with a doctor's prescription.",
    staff_login: "Staff",

    medicines_title: "Medicines",
    medicines_intro:
      "Search to see if a medicine is in stock. Not sure? Ask us on WhatsApp before you come.",
    search_placeholder: "Search medicine name…",
    all: "All",
    available: "Available",
    out_of_stock: "Out of stock",
    ask: "Ask",
    not_found: "Can't find your medicine? Ask us — we may have it or can order it.",
    ask_us_whatsapp: "Ask us on WhatsApp",
    list_updated: "List updated {date}",
    loading: "Loading…",
    load_error: "Could not load the list. Check your internet and try again.",
    count_available: "{n} available",
    wa_ask_medicine: "Hello, do you have {name}?",
    wa_hello: "Hello, I have a question about a medicine.",

    contact_title: "Contact us",
    phone: "Phone",
    address: "Address",
    landmark: "Landmark",
    open_maps: "Open in Google Maps",
    hours_title: "Opening hours",
    closed: "Closed",
    emergency_title: "Emergency numbers",
    ambulance: "Ambulance",
    police: "Police",
    nearest_hospital: "Nearest hospital",

    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },

  ne: {
    nav_home: "गृहपृष्ठ",
    nav_medicines: "औषधि",
    nav_contact: "सम्पर्क",
    lang_switch: "English",

    open_now: "अहिले खुला छ",
    closes_at: "{time} बन्द हुन्छ",
    closed_now: "अहिले बन्द छ",
    closed_today: "आज बन्द छ",
    opens_at: "{when} {time} खुल्छ",
    today: "आज",
    tomorrow: "भोलि",

    call: "फोन गर्नुहोस्",
    whatsapp: "WhatsApp",
    check_medicines: "औषधि पाइन्छ कि पाइँदैन हेर्नुहोस्",
    notice: "सूचना",

    services_title: "हाम्रा सेवाहरू",
    svc_medicines: "औषधि र सल्लाह",
    svc_medicines_desc: "दैनिक र लामो समय खाने औषधि, खाने तरिकाको सल्लाहसहित।",
    svc_bp: "प्रेसर (रक्तचाप) जाँच",
    svc_bp_desc: "पसलमै छिटो प्रेसर जाँच। पसल खुला हुँदा जुनसुकै बेला आउनुहोस्।",
    svc_firstaid: "प्राथमिक उपचार",
    svc_firstaid_desc: "सानो घाउ, पोलेको र काटेकोमा सफा गर्ने र पट्टी लगाउने।",

    about_title: "हाम्रो बारेमा",
    about_text:
      "हाम्रो गाउँको सेवा गर्दै आएको पारिवारिक फार्मेसी। सबै औषधि दर्ता भएका आपूर्तिकर्ताबाट ल्याइन्छ र राम्रोसँग राखिन्छ।",
    pharmacist: "फार्मासिस्ट",
    npc_reg: "नेपाल फार्मेसी काउन्सिल दर्ता नं.",
    dda_license: "औषधि व्यवस्था विभाग इजाजत नं.",

    rx_note: "डाक्टरको पुर्जा (प्रेस्क्रिप्सन) बिना प्रेस्क्रिप्सन औषधि दिइँदैन।",
    staff_login: "कर्मचारी",

    medicines_title: "औषधिहरू",
    medicines_intro:
      "औषधि पसलमा छ कि छैन खोज्नुहोस्। पक्का भएन भने आउनुअघि WhatsApp मा सोध्नुहोस्।",
    search_placeholder: "औषधिको नाम खोज्नुहोस्…",
    all: "सबै",
    available: "उपलब्ध छ",
    out_of_stock: "सकिएको छ",
    ask: "सोध्नुहोस्",
    not_found: "तपाईंको औषधि भेटिएन? हामीलाई सोध्नुहोस् — हुन सक्छ वा मगाइदिन सक्छौं।",
    ask_us_whatsapp: "WhatsApp मा सोध्नुहोस्",
    list_updated: "सूची अपडेट: {date}",
    loading: "लोड हुँदैछ…",
    load_error: "सूची खुलेन। इन्टरनेट जाँचेर फेरि प्रयास गर्नुहोस्।",
    count_available: "{n} उपलब्ध",
    wa_ask_medicine: "नमस्ते, {name} पाइन्छ?",
    wa_hello: "नमस्ते, मलाई औषधिबारे सोध्नु छ।",

    contact_title: "सम्पर्क",
    phone: "फोन",
    address: "ठेगाना",
    landmark: "चिनारी",
    open_maps: "गुगल नक्सामा हेर्नुहोस्",
    hours_title: "खुल्ने समय",
    closed: "बन्द",
    emergency_title: "आपतकालीन नम्बर",
    ambulance: "एम्बुलेन्स",
    police: "प्रहरी",
    nearest_hospital: "नजिकको अस्पताल",

    days: ["आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"],
  },
};

const NEPALI_DIGITS = "०१२३४५६७८९";

export function toNepaliDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => NEPALI_DIGITS[d]);
}

let storageKey = "lang";
let currentLang = "en";

export function initLang({ key = "lang", fallback = "en" } = {}) {
  storageKey = key;
  let saved = null;
  try {
    saved = localStorage.getItem(storageKey);
  } catch {}
  currentLang = saved === "en" || saved === "ne" ? saved : fallback;
  document.documentElement.lang = currentLang;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  try {
    localStorage.setItem(storageKey, lang);
  } catch {}
  document.documentElement.lang = lang;
  applyTranslations();
  document.dispatchEvent(new CustomEvent("langchange"));
}

export function t(key, vars = {}, dict = TEXT) {
  const value = dict[currentLang]?.[key] ?? dict.en[key] ?? key;
  if (typeof value !== "string") return value;
  return value.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
}

// Pick the right language from a { en, ne } object.
export function pick(obj) {
  if (obj == null || typeof obj === "string") return obj ?? "";
  return obj[currentLang] ?? obj.en ?? "";
}

export function groupLabel(key) {
  const group = GROUPS.find((g) => g.key === key) ?? GROUPS[GROUPS.length - 1];
  return group[currentLang];
}

export function applyTranslations(root = document, dict = TEXT) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n, {}, dict);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder, {}, dict);
  });
}

// "19:30" → "7:30 PM" in English, "बेलुका ७:३० बजे" in Nepali.
export function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const mm = String(m).padStart(2, "0");
  const h12 = h % 12 || 12;
  if (currentLang === "ne") {
    const part = h < 12 ? "बिहान" : h < 16 ? "दिउँसो" : h < 19 ? "बेलुका" : "राति";
    return `${part} ${toNepaliDigits(`${h12}:${mm}`)} बजे`;
  }
  return `${h12}:${mm} ${h < 12 ? "AM" : "PM"}`;
}
