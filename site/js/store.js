// Where the stock list lives.
//
// The whole site is stored as one small document (site/main), so a visitor
// downloads everything in a single request:
//   { notice, closedDate: "YYYY-MM-DD" | "", updatedAt,
//     items: { <id>: { name, group, available } } }
//
// DEMO MODE (no Firebase keys yet): the same data is kept in localStorage.

import { FIREBASE_CONFIG, FIREBASE_SDK_VERSION, isDemoMode } from "./firebase-config.js";
import { SAMPLE_ITEMS, SAMPLE_NOTICE } from "./sample-data.js";

const DEMO_KEY = "pharmacy-demo-data";
const CACHE_KEY = "pharmacy-public-cache";

let idCounter = 0;
export function newId() {
  idCounter += 1;
  return "m" + Date.now().toString(36) + idCounter.toString(36) + Math.random().toString(36).slice(2, 6);
}

function toMillis(value) {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (typeof value.toMillis === "function") return value.toMillis();
  return null;
}

function normalise(raw = {}) {
  const items = {};
  for (const [id, item] of Object.entries(raw.items ?? {})) {
    if (!item?.name) continue;
    items[id] = {
      name: String(item.name),
      group: item.group || "other",
      available: item.available !== false,
    };
  }
  return {
    notice: raw.notice ?? "",
    closedDate: raw.closedDate ?? "",
    items,
    updatedAt: toMillis(raw.updatedAt),
  };
}

export function itemList(data) {
  return Object.entries(data.items)
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true }));
}

/* ---------- Public pages (read only) ---------- */

// Firestore's REST API returns typed values ({ stringValue: "…" }); unwrap them.
function decodeValue(v) {
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("timestampValue" in v) return Date.parse(v.timestampValue);
  if ("mapValue" in v) return decodeFields(v.mapValue.fields ?? {});
  if ("arrayValue" in v) return (v.arrayValue.values ?? []).map(decodeValue);
  return null;
}

function decodeFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]));
}

export function cachedPublicData() {
  if (isDemoMode()) return readDemo();
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? normalise(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

// Plain fetch instead of the Firebase SDK keeps public pages tiny on slow mobile data.
export async function loadPublicData() {
  if (isDemoMode()) return readDemo();
  const { projectId, apiKey } = FIREBASE_CONFIG;
  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    `/databases/(default)/documents/site/main?key=${apiKey}`;
  const res = await fetch(url);
  if (res.status === 404) return normalise();
  if (!res.ok) throw new Error(`Firestore returned ${res.status}`);
  const data = normalise(decodeFields((await res.json()).fields ?? {}));
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
  return data;
}

/* ---------- Demo storage ---------- */

function readDemo() {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) return normalise(JSON.parse(raw));
  } catch {}
  const items = {};
  SAMPLE_ITEMS.forEach((item, i) => (items[`demo${i}`] = item));
  return { notice: SAMPLE_NOTICE, closedDate: "", items, updatedAt: Date.now() };
}

function writeDemo(data) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(data));
  } catch {}
}

/* ---------- Stock screen (read + write) ---------- */

// Every store has the same methods, so admin.js does not care which one it gets.
export function createAdminStore() {
  return isDemoMode() ? createDemoStore() : createFirebaseStore();
}

async function createDemoStore() {
  let data = readDemo();
  const listeners = new Set();
  const emit = () => listeners.forEach((cb) => cb(data, { pending: false }));

  const change = (fn) => {
    fn(data);
    data.updatedAt = Date.now();
    writeDemo(data);
    emit();
  };

  window.addEventListener("storage", (e) => {
    if (e.key === DEMO_KEY) {
      data = readDemo();
      emit();
    }
  });

  return {
    demo: true,
    onAuth(cb) {
      cb({ email: "demo", displayName: "Demo" });
    },
    async signIn() {},
    async signOut() {},
    onError() {},
    subscribe(cb) {
      listeners.add(cb);
      cb(data, { pending: false });
      return () => listeners.delete(cb);
    },
    setAvailable: (id, available) => change((d) => d.items[id] && (d.items[id].available = available)),
    saveItem: (id, item) => change((d) => (d.items[id] = { ...item })),
    removeItem: (id) => change((d) => delete d.items[id]),
    addMany: (items) => change((d) => items.forEach((item) => (d.items[newId()] = item))),
    setNotice: (notice) => change((d) => (d.notice = notice)),
    setClosedDate: (closedDate) => change((d) => (d.closedDate = closedDate)),
  };
}

async function createFirebaseStore() {
  const base = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
  const [{ initializeApp }, fs, au] = await Promise.all([
    import(`${base}/firebase-app.js`),
    import(`${base}/firebase-firestore.js`),
    import(`${base}/firebase-auth.js`),
  ]);

  const app = initializeApp(FIREBASE_CONFIG);
  // Local cache: the stock screen still opens and accepts taps with no
  // internet; changes upload by themselves when the connection returns.
  const db = fs.initializeFirestore(app, {
    localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }),
  });
  const auth = au.getAuth(app);
  const ref = fs.doc(db, "site", "main");

  let errorHandler = console.error;
  au.getRedirectResult(auth).catch((err) => errorHandler(err));

  // set + merge creates the document on first use and only touches the given fields.
  const write = (fields) =>
    fs.setDoc(ref, { ...fields, updatedAt: fs.serverTimestamp() }, { merge: true }).catch((err) => errorHandler(err));

  return {
    demo: false,
    onAuth(cb) {
      au.onAuthStateChanged(auth, cb);
    },
    async signIn() {
      const provider = new au.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      try {
        await au.signInWithPopup(auth, provider);
      } catch (err) {
        const usePageRedirect = [
          "auth/popup-blocked",
          "auth/operation-not-supported-in-this-environment",
          "auth/web-storage-unsupported",
        ];
        if (usePageRedirect.includes(err.code)) return au.signInWithRedirect(auth, provider);
        throw err;
      }
    },
    signOut: () => au.signOut(auth),
    onError(cb) {
      errorHandler = cb;
    },
    subscribe(cb) {
      return fs.onSnapshot(
        ref,
        { includeMetadataChanges: true },
        (snap) => {
          const raw = snap.exists() ? snap.data({ serverTimestamps: "estimate" }) : {};
          cb(normalise(raw), { pending: snap.metadata.hasPendingWrites });
        },
        (err) => errorHandler(err),
      );
    },
    setAvailable: (id, available) => write({ items: { [id]: { available } } }),
    saveItem: (id, item) => write({ items: { [id]: { ...item } } }),
    removeItem: (id) => write({ items: { [id]: fs.deleteField() } }),
    addMany: (items) => write({ items: Object.fromEntries(items.map((item) => [newId(), item])) }),
    setNotice: (notice) => write({ notice }),
    setClosedDate: (closedDate) => write({ closedDate }),
  };
}
