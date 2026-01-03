let notes = [];

// UI elements
const cluster = document.getElementById("cluster");
const subject = document.getElementById("subject");
const moduleSel = document.getElementById("module");
const notesDiv = document.getElementById("notes");
const search = document.getElementById("search");

// Load notes data
fetch("notes.json")
  .then(res => res.json())
  .then(data => {
    notes = data;
    renderNotes();
  })
  .catch(() => {
    notesDiv.innerHTML = "<p>Error loading notes.</p>";
  });

// Event listeners
cluster.addEventListener("change", () => {
  subject.innerHTML = `<option value="">Select Subject</option>`;
  moduleSel.innerHTML = `<option value="">Select Module</option>`;
  updateSubjects();
  renderNotes();
});

subject.addEventListener("change", () => {
  moduleSel.innerHTML = `<option value="">Select Module</option>`;
  updateModules();
  renderNotes();
});

moduleSel.addEventListener("change", renderNotes);
search.addEventListener("input", renderNotes);

// Populate subject dropdown
function updateSubjects() {
  if (!cluster.value) return;

  const subjects = [...new Set(
    notes
      .filter(n => n.cluster === cluster.value)
      .map(n => n.subject)
  )];

  subjects.forEach(s => {
    subject.innerHTML += `<option value="${s}">${s}</option>`;
  });
}

// Populate module dropdown
function updateModules() {
  if (!cluster.value || !subject.value) return;

  const modules = [...new Set(
    notes
      .filter(n =>
        n.cluster === cluster.value &&
        n.subject === subject.value
      )
      .map(n => n.module)
  )];

  modules.forEach(m => {
    moduleSel.innerHTML += `<option value="${m}">${m}</option>`;
  });
}

// Render notes
function renderNotes() {
  notesDiv.innerHTML = "";

  const keyword = search.value.toLowerCase();

  const filtered = notes.filter(n =>
    (!cluster.value || n.cluster === cluster.value) &&
    (!subject.value || n.subject === subject.value) &&
    (!moduleSel.value || n.module === moduleSel.value) &&
    n.title.toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    notesDiv.innerHTML = "<p>No notes available.</p>";
    return;
  }

  filtered.forEach(n => {
    notesDiv.innerHTML += `
      <div class="note">
        <h3>${n.title}</h3>
        <p>${n.subject} — ${n.module}</p>
        <a href="${n.file}" download>⬇ Download PDF</a>
      </div>
    `;
  });
}
