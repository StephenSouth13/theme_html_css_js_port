/* ========================================
   NGUYỄN HƯNG PORTFOLIO - main.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- HEADER SCROLL EFFECT ---- */
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---- ACTIVE NAV LINKS ---- */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.header-nav a');

  const observerNav = new IntersectionObserver((entries) => {
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
  }, { threshold: 0.5 });

  sections.forEach(sec => observerNav.observe(sec));

  /* ---- MOBILE HAMBURGER ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- THEME TOGGLE ---- */
  const themeBtn = document.getElementById('themeToggle');
  let isDark = true;

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      isDark = !isDark;
      themeBtn.textContent = isDark ? '🌙' : '☀️';
      if (!isDark) {
        document.documentElement.style.setProperty('--bg-primary', '#f8f9ff');
        document.documentElement.style.setProperty('--bg-secondary', '#f0f0fa');
        document.documentElement.style.setProperty('--bg-card', '#ffffff');
        document.documentElement.style.setProperty('--text-primary', '#0a0a1a');
        document.documentElement.style.setProperty('--text-secondary', '#4a4a6a');
        document.documentElement.style.setProperty('--text-muted', '#8888aa');
        document.documentElement.style.setProperty('--border', 'rgba(0,0,0,0.08)');
      } else {
        document.documentElement.style.setProperty('--bg-primary', '#0a0a0f');
        document.documentElement.style.setProperty('--bg-secondary', '#0f0f18');
        document.documentElement.style.setProperty('--bg-card', '#111120');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', '#a0a0b8');
        document.documentElement.style.setProperty('--text-muted', '#6b6b88');
        document.documentElement.style.setProperty('--border', 'rgba(255,255,255,0.07)');
      }
    });
  }

  /* ---- FADE IN ON SCROLL ---- */
  const fadeEls = document.querySelectorAll('.fade-up');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ---- BACK TO TOP BUTTON ---- */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backTop.classList.add('visible');
      } else {
        backTop.classList.remove('visible');
      }
    }, { passive: true });
  }

  /* ---- STATS COUNTER ANIMATION ---- */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const startTime = performance.now();

        const easeOut = t => 1 - Math.pow(1 - t, 3);

        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.round(easeOut(progress) * target);
          el.textContent = current;
          if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => countObserver.observe(el));

  /* ---- SKILL TABS ---- */
  const skillTabs = document.querySelectorAll('.skill-tab');
  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ---- CAROUSEL DOTS (decorative) ---- */
  const dotGroups = document.querySelectorAll('.carousel-dots');
  dotGroups.forEach(group => {
    const dots = group.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
    });
  });

  /* ---- SMOOTH SCROLL for all anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- PROJECT CARD HOVER TILT ---- */
  const cards = document.querySelectorAll('.project-card, .testimonial-card, .blog-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- HERO FLOATING CARDS STAGGER ---- */
  const heroCards = document.querySelectorAll('.hero-card');
  heroCards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.5}s`;
    card.style.animationDuration = `${3.5 + i * 0.5}s`;
  });

  console.log('✅ Portfolio Nguyễn Hưng — Initialized');
});