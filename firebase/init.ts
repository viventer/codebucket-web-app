import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCvoXm7RJj1vEmBdRY121MHqdyle_7U5KI",
  authDomain: "codebucket-prod.firebaseapp.com",
  projectId: "codebucket-prod",
  storageBucket: "codebucket-prod.firebasestorage.app",
  messagingSenderId: "835872666263",
  appId: "1:835872666263:web:e70b713509946ae006afd2",
  measurementId: "G-3Y1MLWNSN2",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
