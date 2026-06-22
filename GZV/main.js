/* ============================================================
   GZVLP — main.js | Hệ thống chuẩn hóa GZV (Production Ready)
   ============================================================ */

document.documentElement.classList.add('js');

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initHamburgerMenu();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    
    // Chỉ gọi các hàm nếu tồn tại để tránh crash
    if (typeof initIndustryTabs === 'function') initIndustryTabs();
    if (typeof initServiceRipple === 'function') initServiceRipple();
    if (typeof initCardTilt === 'function') initCardTilt();
    if (typeof initPricingHover === 'function') initPricingHover();
    initContactForm();
  });

  window.addEventListener('load', () => {
    initSformSystem();
  });

  /* --- CÁC HÀM XỬ LÝ --- */

  function initHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if (!header) return;
      header.classList.toggle('scrolled', window.scrollY > 50);
      const bt = document.getElementById('backTop');
      if (bt) bt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
  }

  function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        }
      });
    });
  }

  function initScrollReveal() {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => revealObs.observe(el));

    // Dự phòng: Ép hiện sau 500ms nếu Observer bị kẹt
    setTimeout(() => {
      elements.forEach(el => el.classList.add('visible'));
    }, 500);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const end = parseFloat(el.dataset.count);
          const dur = 1800;
          const start = performance.now();
          const tick = now => {
            const p = Math.min((now - start) / dur, 1);
            el.textContent = Math.round(p * end);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          countObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObs.observe(el));
  }

  function initSformSystem() {
    if (typeof SFORM_COMPONENT !== 'undefined' && typeof $ !== 'undefined') {
      $('.sform-container').each(function() {
        SFORM_COMPONENT.showSform($(this));
      });
    } else {
      setTimeout(initSformSystem, 1000); // Thử lại lâu hơn để chờ thư viện
    }
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("GZV System: Lead Captured");
      });
    }
  }

})();