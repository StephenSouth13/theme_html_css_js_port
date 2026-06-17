/* ============================================================
   QUÁCH THÀNH LONG PORTFOLIO — MAIN.JS (Hoàn chỉnh)
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

  /* ---- THEME TOGGLE ---- */
  const themeBtn = document.getElementById('themeToggle');
  let dark = false;
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      dark = !dark;
      themeBtn.textContent = dark ? '☀️' : '🌙';
      document.documentElement.style.setProperty('--bg', dark ? '#0f0e17' : '#ffffff');
      document.body.style.background = dark ? '#0f0e17' : '#ffffff';
    });
  }

  /* ---- FADE UP & STATS COUNTER & OTHERS ---- */
  // (Giữ nguyên các hiệu ứng Reveal, Counters, BackToTop, SmoothScroll, Tilt của ông ở đây)
  // ... [Code các hàm hiệu ứng hiện tại của ông] ...

  console.log('✅ Portfolio Quách Thành Long — Ready');


});

/* --- HÀM KHỞI TẠO SFORM AN TOÀN --- */
/* --- KHỞI TẠO SFORM MỚI (Tích hợp chuẩn) --- */
$(window).on('load', function() {
    console.log("Đang kiểm tra SFORM_COMPONENT...");
    
    let attempts = 0;
    const checkInterval = setInterval(function() {
        attempts++;
        // Kiểm tra biến hệ thống của anh Ban
        if (typeof SFORM_COMPONENT !== 'undefined') {
            clearInterval(checkInterval);
            console.log("✅ Hệ thống đã sẵn sàng, đang nạp form...");
            
            // Tìm container và nạp form
            $('.sform-container').each(function() {
                SFORM_COMPONENT.showSform($(this));
            });
        }
        
        // Dừng sau 10 giây nếu không thấy hệ thống
        if (attempts > 20) {
            clearInterval(checkInterval);
            console.error("❌ Không tìm thấy SFORM_COMPONENT! Kiểm tra lại file lp.js.");
        }
    }, 500);
});