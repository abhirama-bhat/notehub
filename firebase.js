// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export let db = null;

export function initFirebase(config) {
  if (!config) throw new Error("Missing firebase config");
  const app = initializeApp(config);
  db = getFirestore(app);
  console.log("Firebase Initialized");
}
