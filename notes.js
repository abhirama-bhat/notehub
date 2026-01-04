let allNotes = [];
const active = {};
const grid = document.getElementById("notesGrid");

showSkeletons();

fetch("notes.json")
  .then(r => r.json())
  .then(data => {
    allNotes = data;

    if (localStorage.getItem("showPopular")) {
      allNotes = allNotes.filter(n => n.popular);
      localStorage.removeItem("showPopular");
    }

    render();
  });

document.querySelectorAll(".filters button").forEach(btn => {
  btn.onclick = () => {
    const g = btn.dataset.group;
    const t = btn.dataset.tag;

    document
      .querySelectorAll(`button[data-group="${g}"]`)
      .forEach(b => b.classList.remove("active"));

    if (active[g] === t) delete active[g];
    else {
      active[g] = t;
      btn.classList.add("active");
    }

    transitionRender();
  };
});

function transitionRender() {
  grid.style.opacity = "0";
  setTimeout(() => {
    showSkeletons(3);
    setTimeout(render, 200);
  }, 150);
}

function render() {
  const filtered = allNotes.filter(n =>
    Object.values(active).every(t => n.tags.includes(t))
  );

  grid.innerHTML = filtered.length
    ? filtered.map(n => `
      <div class="note-card">
        <h3>${n.title}</h3>
        <p>${n.tags.join(" • ")}</p>
        <a href="${n.file}" download>Download PDF</a>
      </div>
    `).join("")
    : `<p class="empty">No notes for this selection.</p>`;

  grid.style.opacity = "1";
}

function showSkeletons(c = 4) {
  grid.innerHTML = Array.from({ length: c }).map(() => `
    <div class="skeleton">
      <div class="skel-title"></div>
      <div class="skel-meta"></div>
    </div>
  `).join("");
}

function toggleFilters() {
  document.getElementById("filters").classList.toggle("show");
}
