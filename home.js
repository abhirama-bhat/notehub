document.getElementById("popularBtn").onclick = () => {
  localStorage.setItem("showPopular", "true");
  location.href = "notes.html";
};
