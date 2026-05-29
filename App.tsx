import React, { useEffect, useRef, useState } from 'react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  // Interactive Celestial Starfield Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let stars: Array<{
      x: number;
      y: number;
      r: number;
      alpha: number;
      speed: number;
      twinkleSpeed: number;
      twinkleDir: number;
      drift: number;
    }> = [];
    let rafId = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function createStars(n: number) {
      stars = [];
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.2,
          alpha: Math.random() * 0.7 + 0.1,
          speed: Math.random() * 0.12 + 0.02,
          twinkleSpeed: Math.random() * 0.008 + 0.002,
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          drift: (Math.random() - 0.5) * 0.04,
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha > 0.85 || s.alpha < 0.05) {
          s.twinkleDir *= -1;
        }
        s.y -= s.speed;
        s.x += s.drift;
        if (s.y < 0) {
          s.y = h;
          s.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 220, 160, ${s.alpha})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    }

    function onResize() {
      resize();
      createStars(180);
    }

    resize();
    createStars(180);
    draw();

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // IntersectionObserver for elements revealing on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, []);

  // Ripple effect on buttons
  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.1;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 700);
  };

  // Copy standard static standalone HTML to clipboard or fall back gracefully
  const handleCopyHtml = async () => {
    try {
      const rawHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Aryabhata — Ancient Genius</title>
<meta name="description" content="Discover Aryabhata (476–550 CE) — the Indian mathematician and astronomer who shaped the foundations of science." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
<style>
  :root {
    --ar-black: #000000;
    --ar-bg-deep: #050309;
    --ar-gold: #c9a84c;
    --ar-gold-light: #f0d080;
    --ar-gold-dim: #7a6030;
    --ar-white: #f5f0e8;
    --ar-white-dim: #a09880;
    --ar-glow: rgba(201, 168, 76, 0.35);
    --ar-font-display: "Cinzel Decorative", "Cinzel", "Playfair Display", Georgia, serif;
    --ar-font-body: "Crimson Pro", "Crimson Text", Georgia, serif;
    --ar-font-mono: "Space Mono", "JetBrains Mono", ui-monospace, monospace;
    --ar-page-max: clamp(20rem, 92vw, 30rem);
    --ar-pad-x: clamp(1rem, 4vw, 1.5rem);
    --ar-radius-card: clamp(0.875rem, 2vw, 1.25rem);
    --ar-radius-btn: clamp(0.625rem, 1.5vw, 1rem);
    --btn-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --btn-ease-press: cubic-bezier(0.34, 1.56, 0.64, 1);
    --btn-dur: 0.45s;
    --btn-glow: rgba(201, 168, 76, 0.55);
    --btn-glow-soft: rgba(201, 168, 76, 0.22);
    --btn-shimmer: rgba(240, 208, 128, 0.35);
  }
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    background: var(--ar-black);
    color: var(--ar-white);
    font-family: var(--ar-font-body);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  a { color: inherit; text-decoration: none; }
  .stars {
    position: fixed; inset: 0; width: 100%; height: 100%;
    z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse at 50% 0%, rgba(201, 168, 76, 0.08), transparent 60%),
      radial-gradient(ellipse at 50% 100%, rgba(122, 96, 48, 0.10), transparent 65%),
      var(--ar-bg-deep);
  }
  .aryabhata-root { position: relative; min-height: 100vh; }
  .page {
    position: relative; z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, var(--ar-page-max));
    justify-content: center;
    padding: clamp(1.25rem, 5vw, 2.5rem) var(--ar-pad-x) clamp(2rem, 6vw, 3.5rem);
    gap: clamp(1.25rem, 4vw, 2rem);
  }
  .topbar {
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
    font-family: var(--ar-font-mono);
    font-size: clamp(0.625rem, 2.2vw, 0.75rem);
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--ar-gold-dim);
  }
  .topbar-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--ar-gold); box-shadow: 0 0 8px var(--ar-gold);
  }
  .orbit-wrap { display: flex; justify-content: center; }
  .orbit-ring {
    position: relative;
    width: clamp(8rem, 32vw, 11rem);
    aspect-ratio: 1;
    border: 1px solid var(--ar-gold-dim);
    border-radius: 50%;
    display: grid; place-items: center;
    animation: ar-spin 28s linear infinite;
  }
  @keyframes ar-spin { to { transform: rotate(360deg); } }
  .orbit-planet {
    position: absolute; top: -4px; left: 50%;
    transform: translateX(-50%);
    width: 8px; height: 8px; border-radius: 50%;
    background: linear-gradient(135deg, var(--ar-gold-light), var(--ar-gold));
    box-shadow: 0 0 14px var(--ar-gold);
  }
  .orbit-core {
    font-family: var(--ar-font-display);
    font-size: clamp(2rem, 8vw, 3rem);
    color: var(--ar-gold);
    text-shadow: 0 0 20px var(--ar-glow), 0 0 40px rgba(201, 168, 76, 0.15);
    animation: ar-counterspin 28s linear infinite;
  }
  @keyframes ar-counterspin { to { transform: rotate(-360deg); } }
  .hero { text-align: center; }
  .hero-eyebrow {
    font-family: var(--ar-font-mono);
    font-size: clamp(0.625rem, 2.2vw, 0.75rem);
    letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--ar-gold-dim); margin-bottom: 0.75rem;
  }
  .hero-title {
    font-family: var(--ar-font-display); font-weight: 700;
    line-height: 1.05; color: var(--ar-white);
    font-size: clamp(2rem, 9vw, 3.25rem);
    margin-bottom: clamp(0.875rem, 3vw, 1.25rem);
  }
  .hero-title .line { display: block; }
  .hero-title .line-gold { color: var(--ar-gold); text-shadow: 0 0 24px var(--ar-glow); }
  .hero-sub {
    color: var(--ar-white-dim); font-style: italic;
    font-size: clamp(0.875rem, 3vw, 1rem); line-height: 1.6;
  }
  .divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin: clamp(0.5rem, 2vw, 1rem) auto; width: min(18rem, 80%);
  }
  .divider-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, var(--ar-gold-dim), transparent);
  }
  .divider-icon { color: var(--ar-gold); font-size: 0.875rem; }
  .btn-stack {
    display: grid; grid-template-columns: 1fr;
    gap: clamp(0.625rem, 2vw, 0.875rem);
    margin-bottom: clamp(1.5rem, 5vw, 2.25rem);
  }
  .btn {
    position: relative; display: flex; align-items: center;
    justify-content: space-between; gap: 0.75rem;
    min-height: 2.75rem;
    padding: clamp(0.875rem, 2.5vw, 1.125rem) clamp(1.125rem, 3vw, 1.5rem);
    border-radius: var(--ar-radius-btn);
    border: 1px solid; background: transparent;
    cursor: pointer; text-decoration: none;
    font-family: var(--ar-font-mono);
    font-size: clamp(0.625rem, 2.4vw, 0.75rem);
    letter-spacing: 0.18em; text-transform: uppercase;
    isolation: isolate; -webkit-tap-highlight-color: transparent;
    overflow: hidden; will-change: transform, box-shadow;
    transition:
      transform var(--btn-dur) var(--btn-ease),
      box-shadow var(--btn-dur) var(--btn-ease),
      background var(--btn-dur) var(--btn-ease),
      color var(--btn-dur) var(--btn-ease),
      border-color var(--btn-dur) var(--btn-ease);
  }
  .btn::before {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent 60%);
    pointer-events: none; z-index: 0;
  }
  .btn::after {
    content: ""; position: absolute; top: 0; left: -75%;
    width: 50%; height: 100%;
    background: linear-gradient(115deg, transparent 0%, var(--btn-shimmer) 50%, transparent 100%);
    transform: skewX(-20deg); opacity: 0; pointer-events: none;
    z-index: 1; transition: opacity 0.3s ease;
  }
  .btn:hover::after, .btn:focus-visible::after {
    opacity: 1; animation: ar-btn-sweep 1.1s var(--btn-ease) forwards;
  }
  @keyframes ar-btn-sweep { 0% { left: -75%; } 100% { left: 125%; } }
  @keyframes ar-btn-pulse {
    0%, 100% { box-shadow: 0 0 18px rgba(201,168,76,0.10), inset 0 0 18px rgba(201,168,76,0.03); }
    50%      { box-shadow: 0 0 26px rgba(201,168,76,0.22), inset 0 0 22px rgba(201,168,76,0.06); }
  }
  @keyframes ar-btn-pulse-soft {
    0%, 100% { box-shadow: 0 0 12px rgba(201,168,76,0.06); }
    50%      { box-shadow: 0 0 20px rgba(201,168,76,0.16); }
  }
  .btn-primary {
    border-color: var(--ar-gold); color: var(--ar-gold);
    box-shadow: 0 0 20px rgba(201,168,76,0.10), inset 0 0 20px rgba(201,168,76,0.03);
    animation: ar-btn-pulse 4.5s ease-in-out infinite;
  }
  .btn-secondary {
    border-color: rgba(201,168,76,0.4); color: var(--ar-white);
    animation: ar-btn-pulse-soft 5.5s ease-in-out infinite;
  }
  .btn-tertiary {
    border-color: rgba(201,168,76,0.25); color: var(--ar-white-dim);
    animation: ar-btn-pulse-soft 6.5s ease-in-out infinite;
  }
  .btn:hover, .btn:focus-visible {
    transform: translateY(-2px) scale(1.03); outline: none;
    animation-play-state: paused;
  }
  .btn-primary:hover, .btn-primary:focus-visible {
    box-shadow:
      0 0 0 1px var(--ar-gold-light),
      0 8px 24px rgba(0,0,0,0.4),
      0 0 38px var(--btn-glow),
      inset 0 0 32px rgba(201,168,76,0.10);
    background: rgba(201,168,76,0.07);
  }
  .btn-secondary:hover, .btn-secondary:focus-visible {
    box-shadow: 0 6px 20px rgba(0,0,0,0.35), 0 0 26px var(--btn-glow-soft);
    border-color: var(--ar-gold);
    background: rgba(201,168,76,0.05);
    color: var(--ar-gold-light);
  }
  .btn-tertiary:hover, .btn-tertiary:focus-visible {
    box-shadow: 0 6px 18px rgba(0,0,0,0.3), 0 0 22px rgba(201,168,76,0.18);
    border-color: rgba(201,168,76,0.55);
    background: rgba(201,168,76,0.04);
    color: var(--ar-white);
  }
  .btn:active {
    transform: translateY(0) scale(0.97);
    transition: transform 0.08s var(--btn-ease-press), box-shadow 0.15s ease;
  }
  .btn-label { font-weight: 700; position: relative; z-index: 2; }
  .btn-arrow {
    font-size: 1rem; font-family: ui-monospace, monospace;
    transition: transform 0.35s var(--btn-ease);
    position: relative; z-index: 2;
  }
  .btn:hover .btn-arrow, .btn:focus-visible .btn-arrow { transform: translateX(6px); }
  .btn .ripple {
    position: absolute; border-radius: 50%; transform: scale(0);
    pointer-events: none;
    background: radial-gradient(circle,
      rgba(240,208,128,0.55) 0%,
      rgba(201,168,76,0.25) 40%,
      transparent 70%);
    animation: ar-btn-ripple 0.65s var(--btn-ease) forwards;
    z-index: 1; mix-blend-mode: screen;
  }
  @keyframes ar-btn-ripple { to { transform: scale(2.6); opacity: 0; } }
  .section-label {
    text-align: center; font-family: var(--ar-font-mono);
    font-size: clamp(0.625rem, 2.2vw, 0.75rem);
    letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--ar-gold-dim);
    margin-bottom: clamp(0.875rem, 3vw, 1.25rem);
  }
  .cards { display: grid; grid-template-columns: 1fr; gap: clamp(0.875rem, 3vw, 1.25rem); }
  .card {
    position: relative; padding: clamp(1.125rem, 4vw, 1.5rem);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: var(--ar-radius-card);
    background: linear-gradient(180deg, rgba(201,168,76,0.04), rgba(0,0,0,0.3));
    overflow: hidden;
    transition: transform 0.4s var(--btn-ease), border-color 0.4s ease, box-shadow 0.4s ease;
    cursor: pointer;
  }
  .card:hover, .card:focus-visible {
    transform: translateY(-3px);
    border-color: rgba(201,168,76,0.5);
    box-shadow: 0 14px 40px rgba(0,0,0,0.5), 0 0 28px rgba(201,168,76,0.18);
    outline: none;
  }
  .card-glow {
    position: absolute; inset: -1px;
    background: radial-gradient(circle at 30% 0%, rgba(201,168,76,0.2), transparent 60%);
    opacity: 0; transition: opacity 0.4s ease; pointer-events: none;
  }
  .card:hover .card-glow { opacity: 1; }
  .card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.75rem;
  }
  .card-icon { font-size: 1.25rem; filter: drop-shadow(0 0 8px rgba(201,168,76,0.4)); }
  .card-tag {
    font-family: var(--ar-font-mono); font-size: 0.625rem;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--ar-gold-dim);
  }
  .card-title {
    font-family: var(--ar-font-display);
    font-size: clamp(1.25rem, 5vw, 1.5rem);
    color: var(--ar-white); margin-bottom: 0.5rem;
  }
  .card-desc {
    color: var(--ar-white-dim);
    font-size: clamp(0.875rem, 2.6vw, 0.95rem);
    line-height: 1.6; margin-bottom: 1rem;
  }
  .card-footer {
    display: flex; align-items: center; gap: 0.625rem;
    font-family: var(--ar-font-mono); font-size: 0.7rem;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--ar-gold);
  }
  .card-footer-line { flex: 1; height: 1px; background: rgba(201,168,76,0.3); }
  .card-arrow { color: var(--ar-gold); font-family: ui-monospace, monospace; }
  [data-reveal] {
    opacity: 0; transform: translateY(14px);
    transition: opacity 0.7s var(--btn-ease), transform 0.7s var(--btn-ease);
  }
  [data-reveal].is-visible { opacity: 1; transform: none; }
  @media (min-width: 720px) {
    :root { --ar-page-max: min(56rem, 92vw); }
    .cards { grid-template-columns: repeat(3, 1fr); }
    .btn-stack { grid-template-columns: repeat(3, 1fr); }
  }
  @media (min-width: 1100px) {
    :root { --ar-page-max: min(72rem, 90vw); }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
  .copy-btn {
    position: fixed; top: 16px; right: 16px; z-index: 9999;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 14px; min-height: 44px;
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: .18em; text-transform: uppercase;
    color: #f0dca0; background: rgba(15,10,5,.7);
    border: 1px solid rgba(240,220,160,.35);
    border-radius: 999px;
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    cursor: pointer;
    transition: all .3s cubic-bezier(.22,1,.36,1);
  }
  .copy-btn:hover {
    color: #0a0705; background: #f0dca0; border-color: #f0dca0;
    box-shadow: 0 8px 30px -8px rgba(240,220,160,.6);
  }
  .copy-btn.is-copied { background: #f0dca0; color: #0a0705; border-color: #f0dca0; }
  .copy-btn svg { width: 14px; height: 14px; }
</style>
</head>
<body>

<button class="copy-btn" id="copyHtmlBtn" type="button" aria-label="Copy full HTML source">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
  <span class="copy-btn-label">Copy HTML</span>
</button>

<div class="aryabhata-root">
  <canvas class="stars" aria-hidden="true"></canvas>

  <main class="page">
    <header class="topbar" data-reveal>
      <span class="topbar-label">476 CE — 550 CE</span>
      <span class="topbar-dot" aria-hidden="true"></span>
      <span class="topbar-label">Pataliputra, India</span>
    </header>

    <div class="orbit-wrap" data-reveal>
      <div class="orbit-ring" aria-hidden="true">
        <div class="orbit-planet"></div>
        <div class="orbit-core">आ</div>
      </div>
    </div>

    <section class="hero">
      <p class="hero-eyebrow" data-reveal>The Ancient Genius</p>
      <h1 class="hero-title">
        <span class="line" data-reveal>About</span>
        <span class="line line-gold" data-reveal>Aryabhata</span>
      </h1>
      <p class="hero-sub" data-reveal>
        Mathematician · Astronomer · Visionary<br />
        who shaped the foundations of science
      </p>
    </section>

    <div class="divider" data-reveal aria-hidden="true">
      <span class="divider-line"></span>
      <span class="divider-icon">✦</span>
      <span class="divider-line"></span>
    </div>

    <nav class="btn-stack" aria-label="Primary">
      <a href="#cards" class="btn btn-primary" data-reveal>
        <span class="btn-label">Explore Aryabhata</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </a>
      <a href="#cards" class="btn btn-secondary" data-reveal>
        <span class="btn-label">Credits</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </a>
    </nav>

    <p class="section-label" id="cards" data-reveal>Discover More</p>

    <section class="cards" aria-label="Topics">
      <article class="card" data-reveal tabindex="0">
        <div class="card-glow" aria-hidden="true"></div>
        <header class="card-header">
          <span class="card-icon" aria-hidden="true">🏛️</span>
          <span class="card-tag">Life &amp; Era</span>
        </header>
        <h2 class="card-title">Biography</h2>
        <p class="card-desc">
          Born in 476 CE, Aryabhata rose to become the first great mathematician
          of the classical age of Indian science — authoring the Aryabhatiya at just 23.
        </p>
        <footer class="card-footer">
          <span class="card-footer-line"></span>
          <span class="card-cta">Read more</span>
          <span class="card-arrow" aria-hidden="true">›</span>
        </footer>
      </article>

      <article class="card" data-reveal tabindex="0">
        <div class="card-glow" aria-hidden="true"></div>
        <header class="card-header">
          <span class="card-icon" aria-hidden="true">∞</span>
          <span class="card-tag">Numbers &amp; Logic</span>
        </header>
        <h2 class="card-title">Mathematics</h2>
        <p class="card-desc">
          He approximated π to 3.1416, introduced the concept of zero's role in
          place value, and solved quadratic equations centuries before Europe.
        </p>
        <footer class="card-footer">
          <span class="card-footer-line"></span>
          <span class="card-cta">Read more</span>
          <span class="card-arrow" aria-hidden="true">›</span>
        </footer>
      </article>

      <article class="card" data-reveal tabindex="0">
        <div class="card-glow" aria-hidden="true"></div>
        <header class="card-header">
          <span class="card-icon" aria-hidden="true">🪐</span>
          <span class="card-tag">Stars &amp; Cosmos</span>
        </header>
        <h2 class="card-title">Astronomy</h2>
        <p class="card-desc">
          Aryabhata declared the Earth rotates on its axis and calculated the
          sidereal year with remarkable accuracy — defying his era's geocentric myths.
        </p>
        <footer class="card-footer">
          <span class="card-footer-line"></span>
          <span class="card-cta">Read more</span>
          <span class="card-arrow" aria-hidden="true">›</span>
        </footer>
      </article>
    </section>
  </main>
</div>

<script>
(function () {
  /* STARFIELD */
  const canvas = document.querySelector('.stars');
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, stars = [], raf = 0;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  function createStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.12 + 0.02,
        twinkleSpeed: Math.random() * 0.008 + 0.002,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        drift: (Math.random() - 0.5) * 0.04
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 0.85 || s.alpha < 0.05) s.twinkleDir *= -1;
      s.y -= s.speed; s.x += s.drift;
      if (s.y < 0) { s.y = h; s.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240, 220, 160, ' + s.alpha + ')';
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }
  function onResize() { resize(); createStars(180); }
  resize(); createStars(180); draw();
  window.addEventListener('resize', onResize);

  /* REVEAL */
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

  /* BUTTON RIPPLE */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('pointerdown', function (e) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.1;
      const x = (e.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
      const y = (e.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    });
  });

  /* COPY HTML */
  var btn = document.getElementById('copyHtmlBtn');
  if (btn) {
    var label = btn.querySelector('.copy-btn-label');
    btn.addEventListener('click', async function () {
      try {
        var res = await fetch(location.href, { cache: 'no-store' });
        var txt = await res.text();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(txt);
        } else {
          var ta = document.createElement('textarea');
          ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); ta.remove();
        }
        btn.classList.add('is-copied'); label.textContent = 'Copied!';
        setTimeout(function () { btn.classList.remove('is-copied'); label.textContent = 'Copy HTML'; }, 1800);
      } catch (e) {
        label.textContent = 'Copy failed';
        setTimeout(function () { label.textContent = 'Copy HTML'; }, 1800);
      }
    });
  }
})();
</script>
</body>
</html>`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(rawHtml);
      } else {
        const ta = document.createElement('textarea');
        ta.value = rawHtml;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopyState('copied');
      setTimeout(() => {
        setCopyState('idle');
      }, 1800);
    } catch (err) {
      setCopyState('failed');
      setTimeout(() => {
        setCopyState('idle');
      }, 1800);
    }
  };

  return (
    <div className="aryabhata-root select-none">
      <canvas ref={canvasRef} className="stars" aria-hidden="true" />

      <main className="page">
        <header className="topbar" data-reveal>
          <div className="topbar-info flex items-center gap-3">
            <span className="topbar-label">476 CE — 550 CE</span>
            <span className="topbar-dot" aria-hidden="true"></span>
            <span className="topbar-label">Pataliputra, India</span>
          </div>
          <div className="topbar-archive">
            Digital Archive v1.0
          </div>
        </header>

        <div className="orbit-wrap" data-reveal>
          <div className="orbit-ring" aria-hidden="true">
            <div className="orbit-planet"></div>
            <div className="orbit-core">आ</div>
          </div>
        </div>

        <section className="hero">
          <p className="hero-eyebrow" data-reveal>The Ancient Genius</p>
          <h1 className="hero-title">
            <span className="line" data-reveal>About</span>
            <span className="line line-gold" data-reveal>Aryabhata</span>
          </h1>
          <p className="hero-sub" data-reveal>
            Mathematician · Astronomer · Visionary<br />
            who shaped the foundations of science
          </p>
        </section>

        <div className="divider" data-reveal aria-hidden="true">
          <span className="divider-line"></span>
          <span className="divider-icon">✦</span>
          <span className="divider-line"></span>
        </div>

        <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 mb-8 w-full max-w-lg mx-auto" aria-label="Primary nav">
          <div className="relative group w-full sm:w-auto flex-1 sm:flex-initial">
            {/* Ambient gold glow behind primary button */}
            <div className="absolute -inset-0.5 bg-[#c9a84c] rounded-lg opacity-22 blur-sm group-hover:opacity-40 transition duration-300"></div>
            <a
              href="https://aistudio.google.com/apps/ae1961e4-5f96-4598-b1fa-b252a5cced78?showAssistant=true&project=..."
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full sm:w-56 min-h-[3rem] px-8 py-3 bg-[#050309] border border-[#c9a84c] text-[#c9a84c] font-mono text-[10px] tracking-[0.2em] uppercase rounded-lg hover:bg-[#c9a84c] hover:text-[#050309] transition-all duration-300 flex items-center justify-center gap-2 select-none"
              data-reveal
              onPointerDown={handlePointerDown}
            >
              <span className="font-bold">Explore Aryabhata</span>
              <span className="transition-transform group-hover:translate-x-1 duration-300" aria-hidden="true">→</span>
            </a>
          </div>

          <div className="relative group w-full sm:w-auto flex-1 sm:flex-initial">
            {/* Ambient gold glow behind secondary button */}
            <div className="absolute -inset-0.5 bg-[#c9a84c] rounded-lg opacity-22 blur-sm group-hover:opacity-40 transition duration-300"></div>
            <a
              href="https://aistudio.google.com/apps/39c05126-6d56-4f5d-a206-d6360c9d87d0?showAssistant=true&showPreview=true"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full sm:w-56 min-h-[3rem] px-8 py-3 bg-[#050309] border border-[#c9a84c] text-[#c9a84c] font-mono text-[10px] tracking-[0.2em] uppercase rounded-lg hover:bg-[#c9a84c] hover:text-[#050309] transition-all duration-300 flex items-center justify-center gap-2 select-none"
              data-reveal
              onPointerDown={handlePointerDown}
            >
              <span className="font-bold">Credits</span>
              <span className="transition-transform group-hover:translate-x-1 duration-300" aria-hidden="true">→</span>
            </a>
          </div>
        </nav>

        <p className="section-label" id="cards" data-reveal>Discover More</p>

        <section className="cards" aria-label="Topics">
          <article className="card" data-reveal tabIndex={0}>
            <div className="card-glow" aria-hidden="true"></div>
            <header className="card-header">
              <span className="card-icon" aria-hidden="true">🏛️</span>
              <span className="card-tag">Life &amp; Era</span>
            </header>
            <h2 className="card-title">Biography</h2>
            <p className="card-desc">
              Born in 476 CE, Aryabhata rose to become the first great mathematician
              of the classical age of Indian science — authoring the Aryabhatiya at just 23.
            </p>
            <footer className="card-footer">
              <span className="card-footer-line"></span>
              <span className="card-cta">Read more</span>
              <span className="card-arrow" aria-hidden="true">›</span>
            </footer>
          </article>

          <article className="card" data-reveal tabIndex={0}>
            <div className="card-glow" aria-hidden="true"></div>
            <header className="card-header">
              <span className="card-icon" aria-hidden="true">∞</span>
              <span className="card-tag">Numbers &amp; Logic</span>
            </header>
            <h2 className="card-title">Mathematics</h2>
            <p className="card-desc">
              He approximated π to 3.1416, introduced the concept of zero's role in
              place value, and solved quadratic equations centuries before Europe.
            </p>
            <footer className="card-footer">
              <span className="card-footer-line"></span>
              <span className="card-cta">Read more</span>
              <span className="card-arrow" aria-hidden="true">›</span>
            </footer>
          </article>

          <article className="card" data-reveal tabIndex={0}>
            <div className="card-glow" aria-hidden="true"></div>
            <header className="card-header">
              <span className="card-icon" aria-hidden="true">🪐</span>
              <span className="card-tag">Stars &amp; Cosmos</span>
            </header>
            <h2 className="card-title">Astronomy</h2>
            <p className="card-desc">
              Aryabhata declared the Earth rotates on its axis and calculated the
              sidereal year with remarkable accuracy — defying his era's geocentric myths.
            </p>
            <footer className="card-footer">
              <span className="card-footer-line"></span>
              <span className="card-cta">Read more</span>
              <span className="card-arrow" aria-hidden="true">›</span>
            </footer>
          </article>
        </section>
      </main>
    </div>
  );
}

