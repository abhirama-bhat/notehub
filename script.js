let notes = [];

const tagFilter = document.getElementById("tagFilter");
const notesDiv = document.getElementById("notes");
const search = document.getElementById("search");

// Load notes
fetch("notes.json")
  .then(res => res.json())
  .then(data => {
    notes = data;
    populateTags();
    renderNotes();
  })
  .catch(() => {
    notesDiv.innerHTML = "<p>Error loading notes.</p>";
  });

// Build tag filter from JSON
function populateTags() {
  const tags = new Set();

  notes.forEach(note => {
    note.tags.forEach(tag => tags.add(tag));
  });

  tags.forEach(tag => {
    const opt = document.createElement("option");
    opt.value = tag;
    opt.textContent = tag;
    tagFilter.appendChild(opt);
  });
}

// Render notes
function renderNotes() {
  notesDiv.innerHTML = "";

  const selectedTag = tagFilter.value;
  const keyword = search.value.toLowerCase();

  const filtered = notes.filter(note =>
    (!selectedTag || note.tags.includes(selectedTag)) &&
    note.title.toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    notesDiv.innerHTML = "<p>No notes found.</p>";
    return;
  }

  filtered.forEach(note => {
    notesDiv.innerHTML += `
      <div class="note">
        <h3>${note.title}</h3>
        <p>Tags: ${note.tags.join(", ")}</p>
        <a href="${note.file}" download>⬇ Download PDF</a>
      </div>
    `;
  });
}

// Events
tagFilter.addEventListener("change", renderNotes);
search.addEventListener("input", renderNotes);
