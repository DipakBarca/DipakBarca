// The stock screen for the shop owners. Nepali first, big buttons, one job per screen.

import { ADMIN_EMAILS } from "./config.js";
import { registerServiceWorker } from "./common.js";
import { GROUPS, getLang, groupLabel, initLang, setLang, t as translate, toNepaliDigits } from "./i18n.js";
import { nepalNow } from "./nepal-time.js";
import { createAdminStore, itemList, newId } from "./store.js";

const TEXT = {
  ne: {
    title: "स्टक",
    lang_switch: "English",
    demo_banner: "डेमो: यहाँका परिवर्तन यो फोनमा मात्र सेभ हुन्छन्।",
    loading: "लोड हुँदैछ…",
    load_error: "खुलेन। इन्टरनेट जोडेर फेरि प्रयास गर्नुहोस्।",
    retry: "फेरि प्रयास गर्नुहोस्",
    welcome: "नमस्ते!",
    signin_help: "औषधिको स्टक मिलाउन आफ्नो Google खाताबाट एक पटक लगइन गर्नुहोस्।",
    signin: "Google बाट लगइन गर्नुहोस्",
    denied: "यो खाताबाट स्टक मिलाउन मिल्दैन।",
    signout: "लगआउट",
    tab_stock: "औषधि",
    tab_shop: "सूचना / पसल",
    search: "औषधि खोज्नुहोस्…",
    filter_all: "सबै ({n})",
    filter_out: "सकिएका ({n})",
    add: "+ नयाँ औषधि थप्नुहोस्",
    has: "छ",
    finished: "सकियो",
    edit: "मिलाउनुहोस्",
    no_results: "कुनै औषधि भेटिएन।",
    no_out: "सबै औषधि छन्। केही सकिएको छैन।",
    closed_title: "आज पसल बन्द छ?",
    closed_yes: "हो, आज बन्द छ",
    closed_no: "होइन, पसल खुला छ",
    closed_help: "यो सूचना भोलि आफैं हट्छ।",
    notice_title: "ग्राहकका लागि सूचना",
    notice_help: "यो सूचना वेबसाइटको पहिलो पानामा देखिन्छ। खाली राखे केही देखिँदैन।",
    save: "सेभ गर्नुहोस्",
    clear: "हटाउनुहोस्",
    cancel: "रद्द गर्नुहोस्",
    view_site: "वेबसाइट हेर्नुहोस्",
    new_item: "नयाँ औषधि",
    edit_item: "औषधि मिलाउनुहोस्",
    name_label: "औषधिको नाम",
    group_label: "समूह",
    remove: "यो औषधि हटाउनुहोस्",
    duplicate: "यो नाम पहिले नै सूचीमा छ।",
    undo: "↶ फिर्ता",
    toast_has: "{name}: छ",
    toast_finished: "{name}: सकियो",
    toast_added: "{name} थपियो",
    toast_saved: "{name} सेभ भयो",
    toast_removed: "{name} हटाइयो",
    toast_notice: "सूचना सेभ भयो",
    toast_closed: "आज बन्द देखिन्छ",
    toast_open: "\"आज बन्द\" हटाइयो",
    sync_saved: "✓ सबै सेभ भयो",
    sync_saving: "सेभ हुँदैछ…",
    sync_offline: "इन्टरनेट छैन — इन्टरनेट आएपछि आफैं सेभ हुन्छ",
    err_denied: "यो खाताबाट परिवर्तन गर्न मिल्दैन।",
    err_save: "सेभ भएन। फेरि प्रयास गर्नुहोस्।",
    err_signin: "लगइन भएन। फेरि प्रयास गर्नुहोस्।",
  },
  en: {
    title: "Stock",
    lang_switch: "नेपाली",
    demo_banner: "Demo: changes here are saved only on this phone.",
    loading: "Loading…",
    load_error: "Could not open. Connect to the internet and try again.",
    retry: "Try again",
    welcome: "Hello!",
    signin_help: "Sign in once with your Google account to update the medicine stock.",
    signin: "Sign in with Google",
    denied: "This account is not allowed to change the stock.",
    signout: "Sign out",
    tab_stock: "Medicines",
    tab_shop: "Notice / Shop",
    search: "Search medicine…",
    filter_all: "All ({n})",
    filter_out: "Finished ({n})",
    add: "+ Add new medicine",
    has: "Have",
    finished: "Finished",
    edit: "Edit",
    no_results: "No medicine found.",
    no_out: "Everything is in stock. Nothing is finished.",
    closed_title: "Is the shop closed today?",
    closed_yes: "Yes, closed today",
    closed_no: "No, the shop is open",
    closed_help: "This switches off by itself tomorrow.",
    notice_title: "Notice for customers",
    notice_help: "This notice shows on the website's first page. Leave it empty to show nothing.",
    save: "Save",
    clear: "Remove",
    cancel: "Cancel",
    view_site: "View website",
    new_item: "New medicine",
    edit_item: "Edit medicine",
    name_label: "Medicine name",
    group_label: "Group",
    remove: "Remove this medicine",
    duplicate: "This name is already in the list.",
    undo: "↶ Undo",
    toast_has: "{name}: have",
    toast_finished: "{name}: finished",
    toast_added: "{name} added",
    toast_saved: "{name} saved",
    toast_removed: "{name} removed",
    toast_notice: "Notice saved",
    toast_closed: "Shows closed today",
    toast_open: "\"Closed today\" removed",
    sync_saved: "✓ All saved",
    sync_saving: "Saving…",
    sync_offline: "No internet — will save by itself when it returns",
    err_denied: "This account cannot make changes.",
    err_save: "Not saved. Please try again.",
    err_signin: "Sign-in failed. Please try again.",
  },
};

const t = (key, vars) => translate(key, vars, TEXT);
const digits = (n) => (getLang() === "ne" ? toNepaliDigits(n) : String(n));
const $ = (id) => document.getElementById(id);

initLang({ key: "adminLang", fallback: "ne" });

let store;
let data = null;
let pending = false;
let filter = "all";
let editingId = null;
let subscribed = false;

/* ---------- Views ---------- */

function showView(name) {
  for (const view of ["loading", "error", "signin", "denied", "app"]) {
    $(`view-${view}`).hidden = view !== name;
  }
}

function applyText() {
  document.documentElement.lang = getLang();
  document.querySelectorAll("[data-a]").forEach((el) => (el.textContent = t(el.dataset.a)));
  document.querySelectorAll("[data-a-placeholder]").forEach((el) => (el.placeholder = t(el.dataset.aPlaceholder)));
  document.title = t("title");
  render();
}

function render() {
  if (!data) return;
  renderStock();
  renderShop();
  renderSync();
}

/* ---------- Stock tab ---------- */

function renderStock() {
  const all = itemList(data);
  const outCount = all.filter((item) => !item.available).length;
  document.querySelector('[data-filter="all"]').textContent = t("filter_all", { n: digits(all.length) });
  document.querySelector('[data-filter="out"]').textContent = t("filter_out", { n: digits(outCount) });
  document.querySelectorAll("[data-filter]").forEach((chip) =>
    chip.setAttribute("aria-pressed", String(chip.dataset.filter === filter)),
  );

  const query = $("a-q").value.trim().toLowerCase();
  const items = all.filter(
    (item) => (filter === "all" || !item.available) && item.name.toLowerCase().includes(query),
  );

  $("stock-list").replaceChildren(...items.map(stockRow));
  $("stock-empty").hidden = items.length > 0;
  $("stock-empty").textContent = filter === "out" && !query ? t("no_out") : t("no_results");
}

function stockRow(item) {
  const li = document.createElement("li");
  li.className = "stock-row";

  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "stock-name";
  edit.setAttribute("aria-label", `${t("edit")}: ${item.name}`);
  const name = document.createElement("span");
  name.textContent = item.name;
  const group = document.createElement("small");
  group.textContent = `✎ ${groupLabel(item.group)}`;
  edit.append(name, group);
  edit.addEventListener("click", () => openItemDialog(item.id));

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = `stock-toggle ${item.available ? "has" : "out"}`;
  toggle.setAttribute("aria-pressed", String(item.available));
  toggle.setAttribute("aria-label", `${item.name}: ${item.available ? t("has") : t("finished")}`);
  toggle.textContent = item.available ? `✓ ${t("has")}` : `✗ ${t("finished")}`;
  toggle.addEventListener("click", () => {
    const next = !item.available;
    store.setAvailable(item.id, next);
    showToast(t(next ? "toast_has" : "toast_finished", { name: item.name }), () =>
      store.setAvailable(item.id, !next),
    );
  });

  li.append(edit, toggle);
  return li;
}

/* ---------- Add / edit dialog ---------- */

function buildGroupGrid() {
  $("group-grid").replaceChildren(
    ...GROUPS.map((g) => {
      const label = document.createElement("label");
      label.className = "group-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "group";
      input.value = g.key;
      const text = document.createElement("span");
      text.textContent = groupLabel(g.key);
      label.append(input, text);
      return label;
    }),
  );
}

function openItemDialog(id = null) {
  editingId = id;
  const item = id ? data.items[id] : null;
  buildGroupGrid();
  $("item-title").textContent = id ? t("edit_item") : t("new_item");
  $("item-name").value = item ? item.name : $("a-q").value.trim();
  const groupKey = item ? item.group : "other";
  document.querySelector(`#group-grid input[value="${groupKey}"]`).checked = true;
  $("item-remove").hidden = !id;
  $("item-error").hidden = true;
  $("item-dialog").showModal();
  if (!id) $("item-name").focus();
}

function findByName(name) {
  const wanted = name.trim().toLowerCase();
  return Object.entries(data.items).find(([, item]) => item.name.trim().toLowerCase() === wanted)?.[0];
}

$("item-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("item-name").value.trim().replace(/\s+/g, " ");
  if (!name) return;
  const group = document.querySelector("#group-grid input:checked")?.value ?? "other";

  const existing = findByName(name);
  if (existing && existing !== editingId) {
    if (editingId) {
      $("item-error").textContent = t("duplicate");
      $("item-error").hidden = false;
      return;
    }
    // Adding something that is already there: show them that row instead.
    $("item-dialog").close();
    $("a-q").value = data.items[existing].name;
    filter = "all";
    renderStock();
    showToast(t("duplicate"));
    return;
  }

  if (editingId) {
    const before = { ...data.items[editingId] };
    const id = editingId;
    store.saveItem(id, { ...before, name, group });
    showToast(t("toast_saved", { name }), () => store.saveItem(id, before));
  } else {
    const id = newId();
    store.saveItem(id, { name, group, available: true });
    $("a-q").value = "";
    showToast(t("toast_added", { name }), () => store.removeItem(id));
  }
  $("item-dialog").close();
});

$("item-cancel").addEventListener("click", () => $("item-dialog").close());

$("item-remove").addEventListener("click", () => {
  const id = editingId;
  const before = { ...data.items[id] };
  store.removeItem(id);
  $("item-dialog").close();
  showToast(t("toast_removed", { name: before.name }), () => store.saveItem(id, before));
});

/* ---------- Shop tab ---------- */

function renderShop() {
  const today = nepalNow().dateStr;
  const closed = data.closedDate === today;
  const toggle = $("closed-toggle");
  toggle.setAttribute("aria-pressed", String(closed));
  toggle.classList.toggle("on", closed);
  toggle.textContent = closed ? t("closed_yes") : t("closed_no");

  // Do not overwrite what they are typing.
  if (document.activeElement !== $("notice-input")) $("notice-input").value = data.notice;
}

$("closed-toggle").addEventListener("click", () => {
  const today = nepalNow().dateStr;
  const closing = data.closedDate !== today;
  const before = data.closedDate;
  store.setClosedDate(closing ? today : "");
  showToast(t(closing ? "toast_closed" : "toast_open"), () => store.setClosedDate(before));
});

$("notice-save").addEventListener("click", () => {
  const before = data.notice;
  store.setNotice($("notice-input").value.trim());
  $("notice-input").blur();
  showToast(t("toast_notice"), () => store.setNotice(before));
});

$("notice-clear").addEventListener("click", () => {
  const before = data.notice;
  $("notice-input").value = "";
  store.setNotice("");
  showToast(t("toast_notice"), () => store.setNotice(before));
});

/* ---------- Setup tools (for the family helper) ---------- */

function parseCsvLine(line) {
  const fields = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      fields.push(field);
      field = "";
    } else field += ch;
  }
  fields.push(field);
  return fields.map((f) => f.trim());
}

function findGroup(text) {
  const wanted = (text ?? "").trim().toLowerCase();
  if (!wanted) return null;
  return GROUPS.find((g) => [g.key, g.en, g.ne].some((v) => v.toLowerCase() === wanted))?.key ?? null;
}

function parseBulk(text) {
  const NO = ["no", "n", "false", "0", "out", "finished", "सकियो", "छैन"];
  const rows = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    // Skip empty lines and a spreadsheet header row such as "name,group,available".
    if (!line || /^name\s*([,|\t]|$)/i.test(line)) continue;
    let fields;
    if (line.includes("\t")) fields = line.split("\t").map((f) => f.trim());
    else if (line.includes("|")) fields = line.split("|").map((f) => f.trim());
    else {
      const csv = parseCsvLine(line);
      fields = csv.length >= 2 && findGroup(csv[1]) ? csv : [line];
    }
    const [name, group, available] = fields;
    if (!name) continue;
    rows.push({
      name: name.replace(/\s+/g, " "),
      group: findGroup(group) ?? "other",
      available: !NO.includes((available ?? "").trim().toLowerCase()),
    });
  }
  return rows;
}

$("group-keys").textContent = "Groups: " + GROUPS.map((g) => `${g.key} (${g.en})`).join(", ");

$("bulk-add").addEventListener("click", () => {
  const seen = new Set(Object.values(data.items).map((item) => item.name.toLowerCase()));
  const toAdd = [];
  let skipped = 0;
  for (const row of parseBulk($("bulk-input").value)) {
    const key = row.name.toLowerCase();
    if (seen.has(key)) {
      skipped++;
      continue;
    }
    seen.add(key);
    toAdd.push(row);
  }
  if (toAdd.length) store.addMany(toAdd);
  $("bulk-result").textContent = `Added ${toAdd.length}. Skipped ${skipped} already in the list.`;
  if (toAdd.length) $("bulk-input").value = "";
});

$("export").addEventListener("click", () => {
  const quote = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = ["name,group,available"].concat(
    itemList(data).map((item) => [quote(item.name), item.group, item.available ? "yes" : "no"].join(",")),
  );
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `medicines-${nepalNow().dateStr}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});

/* ---------- Toast with undo ---------- */

let toastTimer;
let undoAction = null;

function showToast(message, undo = null) {
  undoAction = undo;
  $("toast-text").textContent = message;
  $("toast-undo").hidden = !undo;
  $("toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").hidden = true), 8000);
}

$("toast-undo").addEventListener("click", () => {
  undoAction?.();
  undoAction = null;
  $("toast").hidden = true;
});

/* ---------- Save status ---------- */

function renderSync() {
  const el = $("sync");
  if (store.demo) {
    el.textContent = "";
    return;
  }
  el.textContent = !pending ? t("sync_saved") : navigator.onLine ? t("sync_saving") : t("sync_offline");
  el.classList.toggle("waiting", pending);
}

window.addEventListener("online", renderSync);
window.addEventListener("offline", renderSync);

/* ---------- Tabs, search, filters ---------- */

document.querySelectorAll("[data-tab]").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach((other) => {
      const selected = other === tab;
      other.setAttribute("aria-selected", String(selected));
      $(`tab-${other.dataset.tab}`).hidden = !selected;
    });
  }),
);

$("a-q").addEventListener("input", renderStock);

document.querySelectorAll("[data-filter]").forEach((chip) =>
  chip.addEventListener("click", () => {
    filter = chip.dataset.filter;
    renderStock();
  }),
);

$("add-btn").addEventListener("click", () => openItemDialog());

document.querySelectorAll("[data-lang-toggle]").forEach((btn) =>
  btn.addEventListener("click", () => setLang(getLang() === "ne" ? "en" : "ne")),
);
document.addEventListener("langchange", applyText);

/* ---------- Start ---------- */

async function start() {
  applyText();
  try {
    store = await createAdminStore();
  } catch (err) {
    console.error(err);
    showView("error");
    return;
  }

  $("demo-banner").hidden = !store.demo;
  store.onError((err) => {
    console.error(err);
    showToast(err?.code === "permission-denied" ? t("err_denied") : t("err_save"));
  });

  document.querySelectorAll("[data-signout]").forEach((btn) =>
    btn.addEventListener("click", () => store.signOut()),
  );
  $("signin-btn").addEventListener("click", () =>
    store.signIn().catch((err) => {
      console.error(err);
      if (err?.code !== "auth/popup-closed-by-user") showToast(t("err_signin"));
    }),
  );

  store.onAuth((user) => {
    if (!user) return showView("signin");
    const email = (user.email ?? "").toLowerCase();
    if (!store.demo && !ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email)) {
      $("denied-email").textContent = user.email ?? "";
      return showView("denied");
    }
    $("signed-in-as").textContent = store.demo ? "Demo mode (no account)" : `Signed in as ${user.email}`;
    showView("app");
    if (subscribed) return;
    subscribed = true;
    store.subscribe((fresh, meta) => {
      data = fresh;
      pending = meta.pending;
      render();
    });
  });
}

registerServiceWorker();
start();
