import { formatDate, initPage, localDigits, waLink } from "./common.js";
import { GROUPS, groupLabel, t } from "./i18n.js";
import { cachedPublicData, itemList, loadPublicData } from "./store.js";

initPage();

const listEl = document.getElementById("list");
const chipsEl = document.getElementById("chips");
const countEl = document.getElementById("count");
const updatedEl = document.getElementById("updated");
const searchEl = document.getElementById("q");
const askMissingEl = document.getElementById("ask-missing");

const ASK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>';

let data = cachedPublicData();
let group = "all";
let loadFailed = false;

function renderChips() {
  const used = new Set(data ? Object.values(data.items).map((item) => item.group) : []);
  const chips = [{ key: "all", label: t("all") }].concat(
    GROUPS.filter((g) => used.has(g.key)).map((g) => ({ key: g.key, label: groupLabel(g.key) })),
  );
  chipsEl.replaceChildren(
    ...chips.map(({ key, label }) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = label;
      chip.setAttribute("aria-pressed", String(key === group));
      chip.addEventListener("click", () => {
        group = key;
        render();
      });
      return chip;
    }),
  );
}

function renderList() {
  const query = searchEl.value.trim().toLowerCase();
  askMissingEl.href = waLink(query ? t("wa_ask_medicine", { name: searchEl.value.trim() }) : t("wa_hello"));

  if (!data) {
    countEl.textContent = loadFailed ? t("load_error") : t("loading");
    listEl.replaceChildren();
    listEl.hidden = true;
    return;
  }

  const items = itemList(data).filter(
    (item) => (group === "all" || item.group === group) && item.name.toLowerCase().includes(query),
  );

  listEl.hidden = items.length === 0;
  listEl.replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.className = "med";

      const info = document.createElement("div");
      info.className = "med-info";
      const name = document.createElement("div");
      name.className = "med-name";
      name.textContent = item.name;
      const groupName = document.createElement("div");
      groupName.className = "med-group";
      groupName.textContent = groupLabel(item.group);
      info.append(name, groupName);

      const badge = document.createElement("span");
      badge.className = `badge ${item.available ? "ok" : "bad"}`;
      badge.textContent = item.available ? t("available") : t("out_of_stock");

      const ask = document.createElement("a");
      ask.className = "ask-link";
      ask.href = waLink(t("wa_ask_medicine", { name: item.name }));
      ask.target = "_blank";
      ask.rel = "noopener";
      ask.title = t("ask");
      ask.setAttribute("aria-label", `${t("ask")}: ${item.name}`);
      ask.innerHTML = ASK_ICON;

      li.append(info, badge, ask);
      return li;
    }),
  );

  const available = items.filter((item) => item.available).length;
  countEl.textContent = t("count_available", { n: localDigits(available) });
  updatedEl.textContent = data.updatedAt ? t("list_updated", { date: formatDate(data.updatedAt) }) : "";
}

function render() {
  renderChips();
  renderList();
}

searchEl.addEventListener("input", renderList);
document.addEventListener("langchange", render);
render();

loadPublicData().then(
  (fresh) => {
    data = fresh;
    render();
  },
  () => {
    loadFailed = true;
    render();
  },
);
