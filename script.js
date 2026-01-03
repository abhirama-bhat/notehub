let notes = [];
let activeTags = new Set();

const notesDiv = document.getElementById("notes");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".filter");

// Load notes
fetch("notes.json")
  .then(res => res.json())
  .then(data => {
    notes = data;
    renderNotes();
  });

// Toggle tag buttons
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tag = btn.dataset.tag;

    if (activeTags.has(tag)) {
      activeTags.delete(tag);
      btn.classList.remove("active");
    } else {
      activeTags.add(tag);
      btn.classList.add("active");
    }

    renderNotes();
  });
});

// Render notes
function renderNotes() {
  notesDiv.innerHTML = "";
  const keyword = search.value.toLowerCase();

  const filtered = notes.filter(note =>
    [...activeTags].every(tag => note.tags.includes(tag)) &&
    note.title.toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    notesDiv.innerHTML = "<p>Select filters to see notes.</p>";
    return;
  }

  filtered.forEach(note => {
    notesDiv.innerHTML += `
      <div class="note">
        <h3>${note.title}</h3>
        <p>${note.tags.join(" • ")}</p>
        <a href="${note.file}" download>⬇ Download PDF</a>
      </div>
    `;
  });
}

search.addEventListener("input", renderNotes);
