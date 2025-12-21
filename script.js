// ---------- small helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

$("#year").textContent = new Date().getFullYear();

// Copy email button
const copyBtn = $("#copyEmailBtn");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const email = copyBtn.getAttribute("data-email") || "you@email.com";
    try {
      await navigator.clipboard.writeText(email);
      const prev = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = prev), 900);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
}

// Active nav link (based on scroll)
const navLinks = $$(".nav__link");
const sections = navLinks
  .map(a => $(a.getAttribute("href")))
  .filter(Boolean);

const setActive = () => {
  const y = window.scrollY + 120;
  let activeId = "home";

  for (const sec of sections) {
    if (sec.offsetTop <= y) activeId = sec.id;
  }

  navLinks.forEach(a => {
    const id = a.getAttribute("href").replace("#", "");
    a.classList.toggle("is-active", id === activeId);
  });
};

window.addEventListener("scroll", setActive, { passive: true });
setActive();

// Reveal on scroll
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(el => io.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("is-visible"));
}

// ---------- Canvas background: subtle cyber particle network ----------
const canvas = $("#fx-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

let w = 0, h = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
let particles = [];
const N = 70;

function resize() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function init() {
  particles = [];
  for (let i = 0; i < N; i++) {
    particles.push({
      x: rand(0, w),
      y: rand(0, h),
      vx: rand(-0.35, 0.35),
      vy: rand(-0.35, 0.35),
      r: rand(1.0, 2.0),
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  const grad = ctx.createRadialGradient(w * 0.5, h * 0.15, 80, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
  grad.addColorStop(0, "rgba(0,245,212,0.045)");
  grad.addColorStop(0.4, "rgba(0,163,255,0.030)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -20) p.x = w + 20;
    if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20;
    if (p.y > h + 20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      const maxDist = 130;

      if (dist < maxDist) {
        const t = 1 - dist / maxDist;
        ctx.strokeStyle = `rgba(0,245,212,${0.06 * t})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

resize();
init();

if (!prefersReduced) {
  draw();
} else {
  draw();
}

window.addEventListener("resize", () => {
  resize();
  init();
});
