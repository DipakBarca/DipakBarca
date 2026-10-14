// The shop works on Nepal time, whatever time zone the visitor's phone is in.

const TZ = "Asia/Kathmandu";

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function nepalNow(date = new Date()) {
  const p = Object.fromEntries(partsFormatter.formatToParts(date).map((x) => [x.type, x.value]));
  return {
    dateStr: `${p.year}-${p.month}-${p.day}`,
    day: WEEKDAYS.indexOf(p.weekday),
    minutes: Number(p.hour) * 60 + Number(p.minute),
  };
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// Returns { open: true, closesAt } or { open: false, closedToday, opensAt, inDays }.
export function shopStatus(hours, closedDate, date = new Date()) {
  const now = nepalNow(date);
  const closedToday = closedDate === now.dateStr;
  const todayHours = hours[now.day];

  if (!closedToday && todayHours) {
    const [from, to] = todayHours.map(toMinutes);
    if (now.minutes >= from && now.minutes < to) return { open: true, closesAt: todayHours[1] };
    if (now.minutes < from) return { open: false, closedToday: false, opensAt: todayHours[0], inDays: 0 };
  }

  for (let inDays = 1; inDays <= 7; inDays++) {
    const next = hours[(now.day + inDays) % 7];
    if (next) return { open: false, closedToday, opensAt: next[0], inDays, day: (now.day + inDays) % 7 };
  }
  return { open: false, closedToday };
}
