let notes = [];
const activeTags = {};

const notesDiv = document.getElementById("notes");
const search = document.getElementById("search");

// Load notes
fetch("notes.json")
  .then(r => r.json())
  .then(data => {
    notes = data;
    renderNotes();
  });

// Handle filter groups
document.querySelectorAll(".filter-group").forEach(group => {
  const groupName = group.dataset.group;

  group.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      // Unselect others in same group
      group.querySelectorAll("button").forEach(b => b.classList.remove("active"));

      // Toggle current
      if (activeTags[groupName] === btn.dataset.tag) {
        delete activeTags[groupName];
      } else {
        btn.classList.add("active");
        activeTags[groupName] = btn.dataset.tag;
      }

      renderNotes();
    });
  });
});

search.addEventListener("input", renderNotes);

// Render
function renderNotes() {
  notesDiv.innerHTML = "";
  const keyword = search.value.toLowerCase();

  const filtered = notes.filter(note =>
    Object.values(activeTags).every(tag => note.tags.includes(tag)) &&
    note.title.toLowerCase().includes(keyword)
  );

  if (!filtered.length) {
    notesDiv.innerHTML = "<p>Select filters to view notes.</p>";
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
