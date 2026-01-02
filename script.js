let notes = [];

const cluster = document.getElementById("cluster");
const subject = document.getElementById("subject");
const moduleSel = document.getElementById("module");
const notesDiv = document.getElementById("notes");
const search = document.getElementById("search");

fetch("notes.json")
  .then(r => r.json())
  .then(d => {
    notes = d;
    updateSubjects();
    renderNotes();
  });

cluster.onchange = () => {
  subject.innerHTML = `<option value="">Select Subject</option>`;
  moduleSel.innerHTML = `<option value="">Select Module</option>`;
  updateSubjects();
  renderNotes();
};

subject.onchange = () => {
  moduleSel.innerHTML = `<option value="">Select Module</option>`;
  updateModules();
  renderNotes();
};

moduleSel.onchange = renderNotes;
search.oninput = renderNotes;

function updateSubjects() {
  if (!cluster.value) return;
  const subjects = [...new Set(
    notes.filter(n => n.cluster === cluster.value).map(n => n.subject)
  )];
  subjects.forEach(s => subject.innerHTML += `<option>${s}</option>`);
}

function updateModules() {
  if (!cluster.value || !subject.value) return;
  const modules = [...new Set(
    notes.filter(n =>
      n.cluster === cluster.value && n.subject === subject.value
    ).map(n => n.module)
  )];
  modules.forEach(m => moduleSel.innerHTML += `<option>${m}</option>`);
}

function renderNotes() {
  notesDiv.innerHTML = "";

  const filtered = notes.filter(n =>
    (!cluster.value || n.cluster === cluster.value) &&
    (!subject.value || n.subject === subject.value) &&
    (!moduleSel.value || n.module === moduleSel.value) &&
    (n.title?.toLowerCase().includes(search.value.toLowerCase()) ||
     n.content?.toLowerCase().includes(search.value.toLowerCase()))
  );

  if (filtered.length === 0) {
    notesDiv.innerHTML = "<p>No notes available.</p>";
    return;
  }

  filtered.forEach(n => {
    notesDiv.innerHTML += `
      <div class="note">
        <h3>${n.title}</h3>
        <p>${n.content}</p>
        <button onclick="downloadNote('${n.title}','${n.content}')">
          ⬇ Download
        </button>
      </div>
    `;
  });
}

function downloadNote(title, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = title + ".txt";
  a.click();
}
