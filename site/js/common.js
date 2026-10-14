// Shared by the public pages: language switch, shop details, open/closed badge.

import { SHOP } from "./config.js";
import { applyTranslations, formatTime, getLang, initLang, pick, setLang, t, toNepaliDigits } from "./i18n.js";
import { shopStatus } from "./nepal-time.js";

export function waLink(text) {
  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function localDigits(value) {
  return getLang() === "ne" ? toNepaliDigits(value) : String(value);
}

export function formatDate(ms) {
  if (!ms) return "";
  const text = new Intl.DateTimeFormat(getLang() === "ne" ? "ne-NP" : "en-GB", {
    timeZone: "Asia/Kathmandu",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(ms);
  return localDigits(text);
}

function fillShopDetails() {
  document.querySelectorAll("[data-shop]").forEach((el) => {
    el.textContent = localDigits(pick(SHOP[el.dataset.shop]));
  });
  const links = {
    tel: telLink(SHOP.phone),
    whatsapp: waLink(t("wa_hello")),
    maps: SHOP.mapsUrl,
  };
  document.querySelectorAll("[data-shop-href]").forEach((el) => {
    el.href = links[el.dataset.shopHref];
  });
  document.querySelectorAll("[data-shop-photo]").forEach((img) => {
    if (!SHOP.photo) return;
    img.src = SHOP.photo;
    img.alt = pick(SHOP.name);
    img.hidden = false;
  });
  const pageTitle = document.body.dataset.titleKey;
  const shopName = pick(SHOP.name);
  document.title = pageTitle ? `${t(pageTitle)} · ${shopName}` : shopName;
}

let lastClosedDate = "";

export function renderStatus(closedDate = lastClosedDate) {
  lastClosedDate = closedDate;
  const status = shopStatus(SHOP.hours, closedDate);
  let label;
  let detail = "";
  if (status.open) {
    label = t("open_now");
    detail = t("closes_at", { time: formatTime(status.closesAt) });
  } else {
    label = status.closedToday ? t("closed_today") : t("closed_now");
    if (status.opensAt) {
      const when =
        status.inDays === 0 ? t("today") : status.inDays === 1 ? t("tomorrow") : t("days")[status.day];
      detail = t("opens_at", { when, time: formatTime(status.opensAt) });
    }
  }
  document.querySelectorAll("[data-status]").forEach((el) => {
    el.classList.toggle("is-open", status.open);
    el.innerHTML = "";
    const strong = document.createElement("strong");
    strong.textContent = label;
    el.append(strong);
    if (detail) el.append(` · ${detail}`);
  });
}

export function initPage() {
  initLang({ key: "lang", fallback: "en" });

  const refresh = () => {
    applyTranslations();
    fillShopDetails();
    renderStatus();
  };
  refresh();
  document.addEventListener("langchange", refresh);

  document.querySelectorAll("[data-lang-toggle]").forEach((btn) =>
    btn.addEventListener("click", () => setLang(getLang() === "en" ? "ne" : "en")),
  );

  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.dataset.nav === page) a.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // Keep the open/closed badge correct if the page stays open.
  setInterval(() => renderStatus(), 60_000);

  // Sticky elements sit just below the sticky header, whatever its height.
  const header = document.querySelector(".site-header");
  if (header && "ResizeObserver" in window) {
    new ResizeObserver(() =>
      document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`),
    ).observe(header);
  }

  registerServiceWorker();
}

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) return;
  try {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  } catch {
    // Some embedded browsers forbid service workers; the site works without one.
  }
}
