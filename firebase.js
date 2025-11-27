// -------- Firebase Config + Initialization --------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// These will be filled when initFirebase() is called
let app = null;
let db = null;

// Called by upload.html, notes.html, admin.html
export function initFirebase(config) {
  if (!app) {
    app = initializeApp(config);
    db = getFirestore(app);
    console.log("Firebase initialized");
  }
}

// Export db so pages can use it
export { db };
