import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export let db = null;

export function initFirebase(config) {
  const app = initializeApp(config);
  db = getFirestore(app);
  console.log("Firebase Initialized");
}
