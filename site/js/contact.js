import { SHOP } from "./config.js";
import { initPage, localDigits, renderStatus, telLink } from "./common.js";
import { formatTime, pick, t } from "./i18n.js";
import { nepalNow } from "./nepal-time.js";
import { cachedPublicData, loadPublicData } from "./store.js";

initPage();

function renderHours() {
  document.getElementById("hours-vary").hidden = Boolean(SHOP.hours);
  document.getElementById("hours-table").hidden = !SHOP.hours;
  if (!SHOP.hours) return;
  const today = nepalNow().day;
  // Start the week on Sunday, as calendars in Nepal do.
  const rows = [0, 1, 2, 3, 4, 5, 6].map((day) => {
    const tr = document.createElement("tr");
    if (day === today) tr.className = "today";
    const name = document.createElement("td");
    name.textContent = t("days")[day];
    const time = document.createElement("td");
    const hours = SHOP.hours[day];
    time.textContent = hours ? `${formatTime(hours[0])} – ${formatTime(hours[1])}` : t("closed");
    tr.append(name, time);
    return tr;
  });
  document.getElementById("hours").replaceChildren(...rows);
}

function renderEmergency() {
  document.getElementById("num-ambulance").textContent = localDigits("102");
  document.getElementById("num-police").textContent = localDigits("100");
  const hospital = SHOP.nearestHospital;
  document.getElementById("hospital").hidden = !hospital.phone;
  if (!hospital.phone) return;
  document.getElementById("hospital").href = telLink(hospital.phone);
  document.getElementById("hospital-name").textContent = pick(hospital.name);
  document.getElementById("hospital-phone").textContent = localDigits(hospital.phone);
}

function render() {
  renderHours();
  renderEmergency();
}

document.addEventListener("langchange", render);
render();

const show = (data) => data && renderStatus(data.closedDate);
show(cachedPublicData());
loadPublicData().then(show, () => {});
