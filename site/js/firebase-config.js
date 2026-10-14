// Firebase project settings.
// While apiKey is left as "PASTE_API_KEY", the site runs in DEMO MODE:
// the stock list is saved only in the browser of the phone you test on.
// See README.md → "Connect Firebase" for where to copy these values from.

export const FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  appId: "PASTE_APP_ID",
};

export const FIREBASE_SDK_VERSION = "12.19.0";

export const isDemoMode = () => FIREBASE_CONFIG.apiKey.startsWith("PASTE_");
