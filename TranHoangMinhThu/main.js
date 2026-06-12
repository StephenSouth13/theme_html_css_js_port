/* ============================================================
   MAIN.JS — Production Ready
   ============================================================ */

(function () {
  'use strict';

  /* ---- Helpers ---- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
  const raf = requestAnimationFrame;

  let initialized = false;

  function initApp() {
    if (initialized) return;
    initialized = true;

    initLoader();
    initCursor();
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initTestimonialSlider();
    initFAQAccordion();
    initBackToTop();
    initActiveNav();
    initButtonRipple();
    initFormSubmit();
    initHoverCursor();
  }

  /* ---- Wait for DOM ---- */
  function waitForComponents(cb, tries = 0) {
    if (document.getElementById('site-header') || tries > 40) {
      cb();
    } else {
      setTimeout(() => waitForComponents(cb, tries + 1), 150);
    }
  }

  /* ============================================================
     PAGE LOADER
     ============================================================ */
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
    document.body.style.overflow = 'hidden';
  }

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    let mx = -100, my = -100;
    let fx = -100, fy = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function animateCursor() {
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;
      raf(animateCursor);
    }
    raf(animateCursor);

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  /* ============================================================
     HOVER CURSOR ENLARGEMENT
     ============================================================ */
  function initHoverCursor() {
    const hoverEls = $$('a, button, [data-hover]');
    hoverEls.forEach(el => {
      on(el, 'mouseenter', () => document.body.classList.add('cursor-hover'));
      on(el, 'mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ============================================================
     STICKY HEADER
     ============================================================ */
  function initHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const update = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  function initMobileNav() {
    const toggle = $('.nav-toggle');
    const nav = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;

    const links = $$('.mobile-nav-link, .mobile-nav a', nav);

    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      nav.classList.toggle('open', open);
      nav.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.forEach(link => {
      on(link, 'click', () => {
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        nav.classList.remove('open');
        nav.setAttribute('aria-hidden', true);
        document.body.style.overflow = '';
      });
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        toggle.click();
      }
    });
  }

  /* ============================================================
     SMOOTH SCROLL
     ============================================================ */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      on(anchor, 'click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const header = document.getElementById('site-header');
        const offset = header ? header.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  function initScrollReveal() {
    const els = $$('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    els.forEach(el => observer.observe(el));
  }

  /* ============================================================
     COUNTER ANIMATION
     ============================================================ */
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1800;
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) raf(step);
        else el.textContent = target;
      }
      raf(step);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ============================================================
     TESTIMONIAL SLIDER (mobile / fallback)
     ============================================================ */
  function initTestimonialSlider() {
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');
    const dots    = $$('.testi-dot');
    const cards   = $$('.testi-card');
    if (!prevBtn || !cards.length) return;

    let current = 0;
    const total = Math.min(cards.length, dots.length);

    function goTo(idx) {
      current = (idx + total) % total;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      // On mobile, show only active card
      if (window.innerWidth <= 820) {
        cards.forEach((c, i) => {
          c.style.display = i === current ? '' : 'none';
        });
      } else {
        cards.forEach(c => { c.style.display = ''; });
      }
    }

    on(prevBtn, 'click', () => goTo(current - 1));
    on(nextBtn, 'click', () => goTo(current + 1));
    dots.forEach((dot, i) => on(dot, 'click', () => goTo(i)));

    // Auto-play
    let autoPlay = setInterval(() => goTo(current + 1), 5000);
    const slider = document.getElementById('testimonials-slider');
    if (slider) {
      on(slider, 'mouseenter', () => clearInterval(autoPlay));
      on(slider, 'mouseleave', () => { autoPlay = setInterval(() => goTo(current + 1), 5000); });
    }

    // Responsive init
    function handleResize() { goTo(current); }
    window.addEventListener('resize', handleResize, { passive: true });
    goTo(0);
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  function initFAQAccordion() {
    $$('.faq-item').forEach(item => {
      const trigger = $('.faq-trigger', item);
      const body    = $('.faq-body', item);
      if (!trigger || !body) return;

      on(trigger, 'click', () => {
        const open = item.classList.toggle('open');
        trigger.setAttribute('aria-expanded', open);
        body.style.maxHeight = open ? body.scrollHeight + 'px' : '0';
      });
    });
  }

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ============================================================
     ACTIVE NAV
     ============================================================ */
  function initActiveNav() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + id);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(sec => observer.observe(sec));
  }

  /* ============================================================
     BUTTON RIPPLE
     ============================================================ */
  function initButtonRipple() {
    $$('.btn').forEach(btn => {
      on(btn, 'click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.cssText = `
          width:${size}px; height:${size}px;
          left:${e.clientX - rect.left - size/2}px;
          top:${e.clientY - rect.top - size/2}px;
        `;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });
  }

  /* ============================================================
     FORM SUBMIT
     ============================================================ */
  function initFormSubmit() {
    const submitBtn = document.getElementById('form-submit');
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');
    if (!submitBtn || !form) return;

    on(submitBtn, 'click', () => {
      const nameEl  = document.getElementById('cf-name');
      const emailEl = document.getElementById('cf-email');
      if (!nameEl || !emailEl) return;

      if (!nameEl.value.trim() || !emailEl.value.trim()) {
        [nameEl, emailEl].forEach(el => {
          if (!el.value.trim()) {
            el.style.borderColor = '#8B1A2A';
            setTimeout(() => { el.style.borderColor = ''; }, 2000);
          }
        });
        return;
      }

      // Simulate submission
      submitBtn.textContent = 'Đang gửi...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        if (success) {
          success.style.display = 'flex';
          success.style.flexDirection = 'column';
          success.style.alignItems = 'center';
        }
      }, 1200);
    });
  }

  /* ============================================================
     FLOATING ANIMATION CONTROLLER
     ============================================================ */
  function initFloatingCards() {
    const cards = $$('[data-float]');
    cards.forEach((card, i) => {
      card.style.animationDelay = (i * 1.3) + 's';
    });
  }

  /* ============================================================
     PARALLAX (subtle)
     ============================================================ */
  function initParallax() {
    const glows = $$('.hero-glow, .philo-glow');
    if (!glows.length) return;

    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.3;
      glows.forEach(g => {
        g.style.transform = `translateY(${y}px)`;
      });
    }, { passive: true });
  }

  /* ============================================================
     INIT
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForComponents(initApp));
  } else {
    waitForComponents(initApp);
  }

  // Also expose for index.html dynamic component loading
  window.initApp = initApp;

})();