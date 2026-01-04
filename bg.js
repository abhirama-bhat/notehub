const bg = document.getElementById("bg");

if (!window.matchMedia("(pointer: coarse)").matches) {
  document.addEventListener("mousemove", e => {
    const x = (e.clientX / innerWidth - .5) * 10;
    const y = (e.clientY / innerHeight - .5) * 10;
    bg.style.transform = `translate(${x}px, ${y}px)`;
  });
}
