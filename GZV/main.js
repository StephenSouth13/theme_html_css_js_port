/* ============================================================
   GZVLP — main.js | Chuẩn hóa hệ thống 1000GENZer
   ============================================================ */

document.documentElement.classList.add('js'); // Kích hoạt CSS reveal

(function () {
  'use strict';

  // 1. Khởi tạo các thành phần GZV
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initHamburgerMenu();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initIndustryTabs();
    initServiceRipple();
    initCardTilt();
    initContactForm();
    initPricingHover();
  });

  // 2. Khởi tạo hệ thống Form (đợi DOM và thư viện sẵn sàng)
  window.addEventListener('load', () => {
    initSformSystem();
  });

  /* --- CÁC HÀM XỬ LÝ --- */

  function initHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
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
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
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
    // Kiểm tra xem hệ thống của anh Ban đã load chưa
    if (typeof SFORM_COMPONENT !== 'undefined') {
      console.log("✅ GZV Form System Ready");
      $('.sform-container').each(function() {
        SFORM_COMPONENT.showSform($(this));
      });
    } else {
      // Nếu chưa load, thử lại sau 500ms
      setTimeout(initSformSystem, 500);
    }
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Logic gửi form tùy chỉnh của ông ở đây nếu cần
        console.log("GZV Lead Submitted");
      });
    }
  }

  // Các hàm khác (Tilt, Ripple...) giữ nguyên logic cũ
  function initIndustryTabs() { /*...*/ }
  function initServiceRipple() { /*...*/ }
  function initCardTilt() { /*...*/ }
  function initPricingHover() { /*...*/ }

})();