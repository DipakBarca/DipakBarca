// Firebase project settings (from Firebase console → Project settings → Your apps).
// These values are meant to be public: the rules in firestore.rules protect the data.
// If apiKey is changed back to "PASTE_API_KEY", the site runs in DEMO MODE with
// example medicines saved only in the browser.

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyACwCRIi1K0W5ncYbbr8VEvzMtSK9GpubE",
  authDomain: "dipakpharmacy-47654.firebaseapp.com",
  projectId: "dipakpharmacy-47654",
  appId: "1:742844462663:web:c14388bc80a5263ac7a362",
};

export const FIREBASE_SDK_VERSION = "12.19.0";

export const isDemoMode = () => FIREBASE_CONFIG.apiKey.startsWith("PASTE_");
