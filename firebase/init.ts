import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, settings, type Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID,
};

const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: "select_account",
});
const githubAuthProvider = new GithubAuthProvider();
githubAuthProvider.setCustomParameters({ allow_signup: "true" });
const storage = getStorage(app);

let analytics: Analytics | null = null;
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  try {
    // Firebase replaces window.gtag with a wrapper that drops the field name
    // in gtag("set", <field>, <value>). A dedicated name leaves the snippet
    // gtag intact; dataLayer stays shared.
    settings({ gtagName: "gtagFirebase" });
    analytics = getAnalytics(app);
  } catch {
    analytics = null;
  }
}

export {
  db,
  app,
  storage,
  auth,
  googleAuthProvider,
  githubAuthProvider,
  analytics,
};
