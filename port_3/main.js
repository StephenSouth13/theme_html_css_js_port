/* ============================================================
   QUÁCH THÀNH LONG PORTFOLIO — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- HEADER SCROLL ---- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ---- ACTIVE NAV ON SCROLL ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header-nav a');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

  /* ---- HAMBURGER / MOBILE NAV ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      // Animate hamburger to X
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- THEME TOGGLE (dark mode) ---- */
  const themeBtn = document.getElementById('themeToggle');
  let dark = false;

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      dark = !dark;
      themeBtn.textContent = dark ? '☀️' : '🌙';
      if (dark) {
        document.documentElement.style.setProperty('--bg', '#0f0e17');
        document.documentElement.style.setProperty('--bg-soft', '#14121f');
        document.documentElement.style.setProperty('--bg-lavender', '#1a1728');
        document.documentElement.style.setProperty('--text', '#f0eeff');
        document.documentElement.style.setProperty('--text-mid', '#a0a0b8');
        document.documentElement.style.setProperty('--text-muted', '#6b6b8a');
        document.documentElement.style.setProperty('--border', '#2a2840');
        document.documentElement.style.setProperty('--card-shadow', '0 4px 24px rgba(0,0,0,0.3)');
        document.body.style.background = '#0f0e17';
      } else {
        document.documentElement.style.setProperty('--bg', '#ffffff');
        document.documentElement.style.setProperty('--bg-soft', '#faf9ff');
        document.documentElement.style.setProperty('--bg-lavender', '#f5f3ff');
        document.documentElement.style.setProperty('--text', '#1a1a2e');
        document.documentElement.style.setProperty('--text-mid', '#4b5563');
        document.documentElement.style.setProperty('--text-muted', '#9ca3af');
        document.documentElement.style.setProperty('--border', '#e5e7eb');
        document.documentElement.style.setProperty('--card-shadow', '0 4px 24px rgba(124,58,237,0.08)');
        document.body.style.background = '#ffffff';
      }
    });
  }

  /* ---- FADE UP ON SCROLL ---- */
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const delay = parseFloat(entry.target.style.animationDelay || '0') * 1000;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ---- STATS COUNTER ---- */
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseFloat(el.dataset.count);
      const isFloat = el.dataset.count.includes('.');
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const v = ease(p) * end;
        el.textContent = (isFloat ? v.toFixed(1) : Math.round(v)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => countObserver.observe(el));

  /* ---- BACK TO TOP ---- */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 480);
    }, { passive: true });
  }

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 68, behavior: 'smooth' });
      }
    });
  });

  /* ---- PROJECT CAROUSEL (dots only) ---- */
  const cdots = document.querySelectorAll('.cdot');
  cdots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      cdots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  /* ---- CARD MICRO-TILT ---- */
  const tiltCards = document.querySelectorAll('.proj-card, .strength-card, .testi-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---- FLOATING HERO CARDS STAGGER ---- */
  document.querySelectorAll('.hero-float').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.55}s`;
    el.style.animationDuration = `${3.8 + i * 0.4}s`;
  });

  /* ---- BRAND ROW HOVER ---- */
  document.querySelectorAll('.brand-item').forEach(b => {
    b.addEventListener('mouseenter', () => b.style.transform = 'translateY(-2px)');
    b.addEventListener('mouseleave', () => b.style.transform = '');
    b.style.transition = '0.25s ease';
  });

  console.log('✅ Portfolio Quách Thành Long — Ready');
});