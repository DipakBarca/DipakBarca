import { initPage, renderStatus } from "./common.js";
import { cachedPublicData, loadPublicData } from "./store.js";

initPage();

function show(data) {
  if (!data) return;
  renderStatus(data.closedDate);
  const notice = document.getElementById("notice");
  document.getElementById("notice-text").textContent = data.notice;
  notice.hidden = !data.notice.trim();
}

show(cachedPublicData());
loadPublicData().then(show, () => {});
