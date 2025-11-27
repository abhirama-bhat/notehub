// ---------------- Firebase Config ----------------
const firebaseConfig = {
  apiKey: "AIzaSyDKt2SwZ8huxz9kmXhqkvHTQWRwnE8MUO8",
  authDomain: "studyhub-519c3.firebaseapp.com",
  projectId: "studyhub-519c3",
  storageBucket: "studyhub-519c3.firebasestorage.app",
  messagingSenderId: "154821601505",
  appId: "1:154821601505:web:84012068aba30ada806fa0",
  measurementId: "G-YG6H2PEP1G"
};

// ---------------- Initialize Firebase ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let app = null;
let db = null;

export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db  = getFirestore(app);
    console.log("🔥 Firebase initialized");
  }
}

// Export db for other pages
export { db };
