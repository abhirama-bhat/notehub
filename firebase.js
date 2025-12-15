import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export let db;

export function initFirebase(){
  const app = initializeApp({
    apiKey:"AIzaSyDKt2SwZ8huxz9kmXhqkvHTQWRwnE8MUO8",
    authDomain:"studyhub-519c3.firebaseapp.com",
    projectId:"studyhub-519c3"
  });
  db = getFirestore(app);
}
