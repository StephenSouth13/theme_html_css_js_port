/* ============================================================
   1000GENZER — main.js  |  Full interactions & FX
   ============================================================ */

(function () {
  'use strict';

  /* ====================================================
     1. HEADER — scroll behaviour + active nav
  ==================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', onScroll, { passive: true });

  function onScroll () {
    // Scrolled class
    header.classList.toggle('scrolled', window.scrollY > 50);

    // Back-to-top
    const bt = document.getElementById('backTop');
    if (bt) bt.classList.toggle('visible', window.scrollY > 500);

    // Active nav based on scroll position
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  /* ====================================================
     2. HAMBURGER MENU
  ==================================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      const [s1, , s3] = hamburger.querySelectorAll('span');
      if (open) {
        s1.style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
        hamburger.querySelectorAll('span')[1].style.opacity = '0';
        s3.style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
      } else {
        hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
      }
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
        document.body.style.overflow = '';
      });
    });
  }

  /* ====================================================
     3. SMOOTH SCROLL (all #anchors)
  ==================================================== */
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

  // Back to top
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ====================================================
     4. SCROLL REVEAL (IntersectionObserver)
  ==================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.style.transitionDelay || el.dataset.delay || '0') * 1000;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  /* ====================================================
     5. COUNTER ANIMATION (data-count attr)
  ==================================================== */
  const counters = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseFloat(el.dataset.count);
      const isFloat = String(el.dataset.count).includes('.');
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = (isFloat ? (ease(p) * end).toFixed(1) : Math.round(ease(p) * end)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObs.observe(el));

  /* ====================================================
     6. INDUSTRY PILL TABS
  ==================================================== */
  const indPills = document.querySelectorAll('.industry-pill');
  indPills.forEach(pill => {
    pill.addEventListener('click', () => {
      indPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  /* ====================================================
     7. SERVICE CARD — ripple on click
  ==================================================== */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(108,58,253,0.12); transform:scale(0);
        animation:rippleAnim 0.5s ease-out forwards; pointer-events:none; z-index:10;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 520);
    });
  });

  /* ====================================================
     8. CARD TILT (micro 3D on hover)
  ==================================================== */
  const tiltTargets = document.querySelectorAll(
    '.service-card, .proj-card, .team-card, .pricing-card'
  );
  tiltTargets.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ====================================================
     9. FORM — animated submit feedback
  ==================================================== */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (form && submitBtn) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // Validate
      const inputs = form.querySelectorAll('[required]');
      let valid = true;
      inputs.forEach(inp => {
        if (!inp.value.trim()) {
          valid = false;
          inp.style.borderColor = '#ef4444';
          inp.addEventListener('input', () => inp.style.borderColor = '', { once: true });
        }
      });
      if (!valid) return;

      // Loading state
      submitBtn.textContent = '⏳ Đang gửi...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = '✅ Đã gửi thành công!';
        submitBtn.style.background = '#10b981';
        submitBtn.style.opacity = '1';
        form.reset();

        // Show success toast
        showToast('🎉 Cảm ơn! Chúng tôi sẽ liên hệ với bạn sớm nhất.');

        setTimeout(() => {
          submitBtn.innerHTML = 'Gửi yêu cầu tư vấn miễn phí <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1600);
    });

    // Real-time validation colour
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(inp => {
      inp.addEventListener('focus', () => {
        inp.parentElement.querySelector('.form-label')
          && (inp.parentElement.querySelector('.form-label').style.color = 'var(--purple)');
      });
      inp.addEventListener('blur', () => {
        inp.parentElement.querySelector('.form-label')
          && (inp.parentElement.querySelector('.form-label').style.color = '');
      });
    });
  }

  /* ====================================================
     10. TOAST NOTIFICATION
  ==================================================== */
  function showToast (msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `
      position:fixed; bottom:88px; right:28px; z-index:9999;
      background:#1a1a2e; color:#fff; font-size:13px; font-weight:600;
      padding:14px 22px; border-radius:12px;
      box-shadow:0 8px 32px rgba(0,0,0,0.25);
      transform:translateY(20px); opacity:0;
      transition:all 0.3s ease; max-width:320px; line-height:1.5;
      border-left:4px solid #10b981;
    `;
    document.body.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = '1'; t.style.transform = 'none';
    });
    setTimeout(() => {
      t.style.opacity = '0'; t.style.transform = 'translateY(10px)';
      setTimeout(() => t.remove(), 320);
    }, 4000);
  }

  /* ====================================================
     11. PROCESS STEPS — sequential reveal
  ==================================================== */
  const processSteps = document.querySelectorAll('.process-step');
  const processObs = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      processSteps.forEach((step, i) => {
        setTimeout(() => step.classList.add('visible'), i * 120);
      });
      processObs.disconnect();
    }
  }, { threshold: 0.2 });
  if (processSteps.length) processObs.observe(processSteps[0]);

  /* ====================================================
     12. BRANDS TRACK — pause on hover handled by CSS
        Extra: duplicate track if needed for seamless loop
  ==================================================== */
  const track = document.getElementById('brandsTrack');
  if (track) {
    // Already duplicated in HTML; nothing extra needed.
  }

  /* ====================================================
     13. PRICING — hover highlight
  ==================================================== */
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.pricing-card').forEach(c => {
        if (c !== card && !c.classList.contains('featured')) c.style.opacity = '0.65';
      });
    });
    card.addEventListener('mouseleave', () => {
      document.querySelectorAll('.pricing-card').forEach(c => c.style.opacity = '');
    });
  });

  /* ====================================================
     14. HERO — number ticker for stat cards
  ==================================================== */
  const heroStats = document.querySelectorAll('.sc-val[data-to]');
  heroStats.forEach(el => {
    const target = parseFloat(el.dataset.to);
    const suffix = el.dataset.suffix || '';
    const dur = 2000;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(ease(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  /* ====================================================
     15. INJECT ripple CSS once
  ==================================================== */
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(2.5); opacity: 0; }
    }
    .process-step { opacity:0; transform:translateY(24px); transition:opacity .5s ease,transform .5s ease; }
    .process-step.visible { opacity:1; transform:none; }
  `;
  document.head.appendChild(rippleStyle);

  console.log('✅ 1000GenZer — All systems go 🚀');

})();