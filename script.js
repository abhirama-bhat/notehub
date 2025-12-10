// script.js
// Single entrypoint for Notes, Upload, Issues, Admin pages
// Usage: included as <script type="module" src="/script.js"></script>

import { initFirebase, db } from "./firebase.js";
import { uploadPdfToCloudinary, uploadImageToCloudinary } from "./cloudinary.js";
import {
  collection, query, where, orderBy, getDocs, addDoc, serverTimestamp,
  doc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDKt2SwZ8huxz9kmXhqkvHTQWRwnE8MUO8",
  authDomain: "studyhub-519c3.firebaseapp.com",
  projectId: "studyhub-519c3",
  storageBucket: "studyhub-519c3.firebasestorage.app",
  messagingSenderId: "154821601505",
  appId: "1:154821601505:web:84012068aba30ada806fa0"
};

// init firebase once
initFirebase(FIREBASE_CONFIG);

// small helpers
const el = (sel) => document.querySelector(sel);
const create = (tag, cls) => { const d = document.createElement(tag); if (cls) d.className = cls; return d; };

// local unique id for this device + pins storage
let localId = localStorage.getItem("notehub_id");
if (!localId) { localId = "u_" + Math.random().toString(36).slice(2); localStorage.setItem("notehub_id", localId); }
const getPins = () => JSON.parse(localStorage.getItem("pins_" + localId) || "[]");
const setPins = (pins) => localStorage.setItem("pins_" + localId, JSON.stringify(pins));

// detect page by pathname
const path = location.pathname.replace(/\/+$/, "") || "/";

// --- Page initializers ---
if (path === "/" || path === "/index.html") {
  // nothing heavy on home
  // vanta inlined in HTML
} else if (path.startsWith("/notes") || path === "/notes.html") {
  initNotesPage();
} else if (path.startsWith("/upload") || path === "/upload.html") {
  initUploadPage();
} else if (path.startsWith("/issues") || path === "/issues.html") {
  initIssuesPage();
} else if (path.startsWith("/admin") || path === "/admin.html") {
  initAdminPage();
}

// ---------------- NOTES PAGE ----------------
async function initNotesPage() {
  const resultsGrid = el('#resultsGrid');
  const pinnedRow = el('#pinnedRow');
  const noResults = el('#noResults');

  let allNotes = [];

  // load notes from firestore
  async function loadNotes() {
    resultsGrid.innerHTML = "<p class='muted'>Loading...</p>";
    const q = query(collection(db, "materials"), where("approved", "==", true), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    allNotes = [];
    snap.forEach(d => {
      const it = d.data(); it.id = d.id;
      allNotes.push(it);
    });
    renderActiveTab();
  }

  // filters
  const fSubject = el('#f-subject');
  const fModule = el('#f-module');
  const fType = el('#f-type');
  const fSort = el('#f-sort');
  const clearBtn = el('#clearFilters');

  function filterAndSort(list) {
    const s = fSubject?.value || '';
    const m = fModule?.value || '';
    const t = fType?.value || '';
    const sort = fSort?.value || 'new';

    let filtered = list.filter(it =>
      (!s || (it.subject || '') === s) &&
      (!m || (it.module || '') == m) &&
      (!t || (it.type || '') === t)
    );

    if (sort === 'views') filtered.sort((a,b)=> (b.views||0) - (a.views||0));
    else filtered.sort((a,b)=> (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    return filtered;
  }

  // tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderActiveTab();
    });
  });

  function setNoResults(flag) {
    if (flag) noResults.style.display = 'block';
    else noResults.style.display = 'none';
  }

  function renderActiveTab() {
    const active = document.querySelector('.tab.active').id;
    if (active === 'tabPinned') renderPinned();
    else if (active === 'tabAll') renderAll();
    else if (active === 'tabTrending') renderTrending();
  }

  function renderPinned() {
    pinnedRow.innerHTML = "";
    const pins = getPins();
    const pinList = allNotes.filter(n => pins.includes(n.id));
    if (!pinList.length) pinnedRow.innerHTML = "<p class='muted'>No pinned notes yet. Pin some notes from All or Trending.</p>";
    else pinList.forEach(it => {
      const tile = makeNoteTile(it, true);
      tile.classList.add('pinned-tile');
      pinnedRow.appendChild(tile);
    });
    resultsGrid.innerHTML = "";
    setNoResults(false);
  }

  function renderAll() {
    pinnedRow.innerHTML = "";
    const list = filterAndSort(allNotes);
    resultsGrid.innerHTML = "";
    if (!list.length) { setNoResults(true); return; }
    setNoResults(false);
    list.forEach(it => resultsGrid.appendChild(makeNoteTile(it)));
  }

  function renderTrending() {
    pinnedRow.innerHTML = "";
    const list = allNotes.slice().sort((a,b)=> (b.views||0) - (a.views||0)).slice(0, 12);
    resultsGrid.innerHTML = "";
    if (!list.length) { setNoResults(true); return; }
    setNoResults(false);
    list.forEach(it => resultsGrid.appendChild(makeNoteTile(it)));
  }

  function makeNoteTile(it, pinnedTile = false) {
    const card = create('div', 'card note-card');
    card.innerHTML = `
      <div class="note-thumb">PDF</div>
      <div style="flex:1">
        <h3 style="margin:0">${escapeHtml(it.title || 'Untitled')}</h3>
        <div class="note-meta">${escapeHtml(it.subject || '-') } • Module ${escapeHtml(it.module || '-') } • ${escapeHtml(it.type || '-') } • ${it.views || 0} views</div>
        <p class="muted" style="margin-top:8px">${escapeHtml(it.description || '')}</p>
        <div class="card-actions">
          <a class="btn small viewBtn" target="_blank" href="${it.urlView || it.urlRaw || it.url || '#'}">View PDF</a>
          <button class="btn small ghost pinBtn">${getPins().includes(it.id) ? 'Unpin' : 'Pin'}</button>
          <a class="btn small ghost" href="/issues?noteId=${it.id}">Report</a>
        </div>
      </div>
    `;
    const pinBtn = card.querySelector('.pinBtn');
    pinBtn.onclick = () => {
      let pins = getPins();
      if (pins.includes(it.id)) pins = pins.filter(x => x !== it.id);
      else pins.push(it.id);
      setPins(pins);
      renderActiveTab();
    };

    const viewLink = card.querySelector('.viewBtn');
    viewLink.addEventListener('click', async () => {
      try {
        const ref = doc(db, 'materials', it.id);
        await updateDoc(ref, { views: (it.views || 0) + 1 });
      } catch (e) { console.warn('View increment failed', e); }
    });

    return card;
  }

  // filter listeners
  [fSubject, fModule, fType, fSort].forEach(i => { if (i) i.addEventListener('change', renderActiveTab); });
  if (clearBtn) clearBtn.addEventListener('click', ()=> { if (fSubject) fSubject.value=''; if (fModule) fModule.value=''; if (fType) fType.value=''; if (fSort) fSort.value='new'; renderActiveTab(); });

  // initial
  await loadNotes();
}

// ---------------- UPLOAD PAGE ----------------
function initUploadPage() {
  const form = el('#uploadForm');
  const status = el('#status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = "Uploading to Cloudinary...";
    const file = el('#file').files[0];
    if (!file) { status.textContent = "Choose a PDF file."; return; }

    try {
      const pdf = await uploadPdfToCloudinary(file);
      status.textContent = "Saving metadata...";

      await addDoc(collection(db, "materials"), {
        title: el('#title').value || 'Untitled',
        subject: el('#subject').value || '',
        module: el('#module').value || '',
        type: el('#type').value || '',
        tags: el('#tags').value || '',
        description: el('#desc').value || '',
        urlRaw: pdf.raw,
        urlView: pdf.view,
        approved: false,
        createdAt: serverTimestamp(),
        views: 0
      });

      status.textContent = "Upload submitted — pending admin approval.";
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = "Upload failed: " + (err.message || '');
    }
  });
}

// ---------------- ISSUES PAGE ----------------
function initIssuesPage() {
  const params = new URLSearchParams(location.search);
  const preNote = params.get('noteId');
  const noteInput = el('#noteId');
  if (noteInput && preNote) noteInput.value = preNote;

  const form = el('#issueForm');
  const status = el('#status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = "Submitting...";
    try {
      let screenshotUrl = "";
      const file = el('#screenshot').files[0];
      if (file) screenshotUrl = await uploadImageToCloudinary(file);

      await addDoc(collection(db, "issues"), {
        noteId: noteInput.value || null,
        issueType: el('#issueType').value || 'Other',
        description: el('#desc').value || '',
        screenshotUrl,
        createdAt: serverTimestamp(),
        status: "pending"
      });

      status.textContent = "Issue submitted — admin will review it.";
      form.reset();
      if (noteInput && preNote) noteInput.value = preNote;
    } catch (err) {
      console.error(err);
      status.textContent = "Submission failed: " + (err.message || '');
    }
  });
}

// ---------------- ADMIN PAGE ----------------
function initAdminPage() {
  const ADMIN_PASS = "notehub-admin-2025";
  const unlockBtn = el('#unlock');
  const passInput = el('#pass');
  const adminArea = el('#adminArea');
  const pendingUploads = el('#pendingUploads');
  const issueReports = el('#issueReports');
  const tabUploads = el('#tabUploads');
  const tabIssues = el('#tabIssues');

  unlockBtn.onclick = () => {
    if (passInput.value !== ADMIN_PASS) { alert('Wrong password'); return; }
    adminArea.style.display = 'block';
    loadPending();
    loadIssues();
  };

  tabUploads.onclick = () => { pendingUploads.style.display='block'; issueReports.style.display='none'; tabUploads.classList.remove('ghost'); tabIssues.classList.add('ghost'); };
  tabIssues.onclick = () => { pendingUploads.style.display='none'; issueReports.style.display='block'; tabIssues.classList.remove('ghost'); tabUploads.classList.add('ghost'); };

  async function loadPending() {
    pendingUploads.innerHTML = "<p class='muted'>Loading...</p>";
    const q = query(collection(db,'materials'), where('approved','==',false), orderBy('createdAt','desc'));
    const snap = await getDocs(q);
    pendingUploads.innerHTML = '';
    snap.forEach(d => {
      const it = d.data(); it.id = d.id;
      const div = create('div','card');
      div.innerHTML = `
        <h3>${escapeHtml(it.title)}</h3>
        <div class="muted">${escapeHtml(it.subject)} • Module ${escapeHtml(it.module)} • ${escapeHtml(it.type)}</div>
        <p class="muted">${escapeHtml(it.description || '')}</p>
        <div class="card-actions">
          <a class="btn small" target="_blank" href="${it.urlView || it.urlRaw || it.url}">Open</a>
          <button class="btn small approveBtn">Approve</button>
          <button class="btn small ghost deleteBtn">Delete</button>
        </div>
      `;
      div.querySelector('.approveBtn').onclick = async () => { await updateDoc(doc(db,'materials',it.id), { approved:true }); div.remove(); };
      div.querySelector('.deleteBtn').onclick = async () => { await deleteDoc(doc(db,'materials',it.id)); div.remove(); };
      pendingUploads.appendChild(div);
    });
  }

  async function loadIssues() {
    issueReports.innerHTML = "<p class='muted'>Loading issues...</p>";
    const q = query(collection(db,'issues'), orderBy('createdAt','desc'));
    const snap = await getDocs(q);
    issueReports.innerHTML = '';
    snap.forEach(d => {
      const it = d.data(); it.id = d.id;
      const div = create('div','card');
      div.innerHTML = `
        <h3>${escapeHtml(it.issueType)}</h3>
        <div class="muted">Note: ${escapeHtml(it.noteId || '—')}</div>
        <p class="muted">${escapeHtml(it.description || '')}</p>
        ${it.screenshotUrl ? `<div style="margin-top:8px"><img src="${it.screenshotUrl}" style="max-width:250px;border-radius:8px"></div>` : ''}
        <div class="card-actions">
          <button class="btn small resolveBtn">Mark Resolved</button>
          <button class="btn small ghost delReportBtn">Delete Report</button>
        </div>
      `;
      div.querySelector('.resolveBtn').onclick = async () => { await updateDoc(doc(db,'issues',it.id), { status:'resolved' }); div.remove(); };
      div.querySelector('.delReportBtn').onclick = async () => { await deleteDoc(doc(db,'issues',it.id)); div.remove(); };
      issueReports.appendChild(div);
    });
  }
}

// ---------------- Utilities ----------------
function escapeHtml(s) {
  if (!s && s !== 0) return '';
  return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}
