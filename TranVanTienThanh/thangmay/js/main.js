/**
 * Thang máy FUJI Phương Đông — Main Script
 * Kiến trúc: Component Loader + Module
 *
 * Các component được nạp động qua fetch().
 *
 * LƯU Ý: Website phải chạy qua HTTP server (VS Code Live Server,
 * npx http-server, v.v.) để fetch() hoạt động đúng.
 * Mở trực tiếp bằng file:// sẽ bị chặn bởi CORS policy của trình duyệt.
 */

(async () => {
  await loadComponents();
  initApp();
})();

/* ==========================================================================
   COMPONENT LOADER
   Tìm tất cả [data-component], fetch HTML, thay {{ROOT}} và inject vào DOM.
   ========================================================================== */
async function loadComponents() {
  const root = window.ROOT_PATH || './';
  const slots = document.querySelectorAll('[data-component]');
  if (!slots.length) return;

  await Promise.all(
    Array.from(slots).map(async (slot) => {
      const src = slot.dataset.src;
      if (!src) return;

      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${src}`);

        let html = await res.text();
        // Thay thế {{ROOT}} bằng đường dẫn gốc thực tế
        html = html.replaceAll('{{ROOT}}', root);

        // Parse và inject HTML vào DOM
        const temp = document.createElement('div');
        temp.innerHTML = html;
        slot.replaceWith(...temp.childNodes);
      } catch (err) {
        console.warn(`[FUJI Component Loader] Không thể nạp: ${src}`, err);
        slot.remove();
      }
    })
  );
}

/* ==========================================================================
   APP INIT — Chạy sau khi tất cả components đã được inject vào DOM
   ========================================================================== */
function initApp() {
  const slides = Array.from(document.querySelectorAll(".hero__slide"));
  const dots = Array.from(document.querySelectorAll(".hero__dots button"));
  const prevButton = document.querySelector(".hero__arrow--prev");
  const nextButton = document.querySelector(".hero__arrow--next");
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector("#mainNav");
  const header = document.querySelector(".site-header");
  const backToTop = document.querySelector(".back-to-top");
  const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const contactForms = Array.from(document.querySelectorAll(".contact-form"));
  const cabinViewer = document.querySelector("[data-cabin-viewer]");
  const projectFilters = document.querySelector("[data-project-filters]");
  const projectGrid = document.querySelector("[data-project-grid]");

  let currentSlide = 0;
  let slideTimer;

  // --- 1. Hero Slider ---
  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentSlide);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentSlide);
    });
  }

  function startSlideTimer() {
    if (!slides.length) return;
    window.clearInterval(slideTimer);
    slideTimer = window.setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  if (slides.length && dots.length && prevButton && nextButton) {
    prevButton.addEventListener("click", () => {
      showSlide(currentSlide - 1);
      startSlideTimer();
    });

    nextButton.addEventListener("click", () => {
      showSlide(currentSlide + 1);
      startSlideTimer();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        startSlideTimer();
      });
    });

    showSlide(0);
    startSlideTimer();
  }

  // --- 2. Mobile Navigation Toggle ---
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target) && mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close on ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav && navToggle) {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // --- 3. Header Scrolled State & Scroll Tracking ---
  let isTicking = false;

  function onScroll() {
    const scrollY = window.scrollY;

    // Header elevation
    if (header) {
      header.classList.toggle("scrolled", scrollY > 20);
    }

    // Back to top button
    if (backToTop) {
      backToTop.classList.toggle("show", scrollY > 400);
    }

    // Active navigation target for single-page links
    const scrollPosition = scrollY + 160;
    const hasLocalNavTargets = navLinks.some((link) => link.getAttribute("href")?.startsWith("#"));

    if (hasLocalNavTargets && sections.length) {
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${section.id}`);
          });
        }
      });
    }

    isTicking = false;
  }

  window.addEventListener("scroll", () => {
    if (!isTicking) {
      window.requestAnimationFrame(onScroll);
      isTicking = true;
    }
  }, { passive: true });

  onScroll();

  // --- 4. Smooth Anchor Scrolling with Header Offset ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth"
        });
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- 5. Contact Form Handler (Vietnamese message) ---
  contactForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("Cảm ơn bạn! Phương Đông sẽ liên hệ tư vấn trong thời gian sớm nhất.");
      form.reset();
    });
  });

  // --- 6. Cabin Viewer Interaction (san-pham.html) ---
  if (cabinViewer) {
    const cabinButtons = Array.from(cabinViewer.querySelectorAll(".cabin-strip button"));
    const cabinMainImage = cabinViewer.querySelector("[data-cabin-main]");
    const cabinCode = cabinViewer.querySelector("[data-cabin-code]");
    const cabinTitle = cabinViewer.querySelector("[data-cabin-title]");
    const cabinPrice = cabinViewer.querySelector("[data-cabin-price]");
    const cabinTabs = Array.from(cabinViewer.querySelectorAll(".cabin-tabs button"));

    cabinButtons.forEach((button) => {
      button.addEventListener("click", () => {
        cabinButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        if (cabinMainImage && button.dataset.image) {
          // Smooth crossfade animation
          cabinMainImage.style.opacity = "0.3";
          cabinMainImage.style.transform = "scale(0.98)";
          setTimeout(() => {
            cabinMainImage.src = button.dataset.image;
            cabinMainImage.alt = button.dataset.code || "Cabin";
            cabinMainImage.style.opacity = "1";
            cabinMainImage.style.transform = "scale(1)";
          }, 150);
        }

        if (cabinCode && button.dataset.code) {
          cabinCode.textContent = button.dataset.code;
        }

        if (cabinTitle && button.dataset.title) {
          cabinTitle.textContent = button.dataset.title;
        }

        if (cabinPrice && button.dataset.price) {
          cabinPrice.textContent = button.dataset.price;
        }
      });
    });

    cabinTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        cabinTabs.forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");
      });
    });
  }

  // --- 7. Project Filtering with Smooth Animation (du-an.html) ---
  if (projectFilters && projectGrid) {
    const filterButtons = Array.from(projectFilters.querySelectorAll("button"));
    const projectCards = Array.from(projectGrid.querySelectorAll("[data-category]"));

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
          const categories = (card.dataset.category || "").split(" ");
          const shouldShow = filter === "all" || categories.includes(filter);

          if (shouldShow) {
            card.classList.remove("is-hidden");
            card.style.opacity = "0";
            card.style.transform = "scale(0.95)";
            setTimeout(() => {
              card.style.transition = "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            }, 30);
          } else {
            card.classList.add("is-hidden");
          }
        });
      });
    });
  }

  // --- 8. IntersectionObserver Scroll Reveal ---
  const revealTargets = document.querySelectorAll(
    ".section-heading, .product-card, .service-card, .reason-card, .news-card, .project-card, .team-card, .timeline article, .about-stat-grid article, .service-process-grid article, .address-grid article, .process-row article, .story-list article, .feature-row article, .about-project-grid article"
  );

  if ("IntersectionObserver" in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.1
    });

    revealTargets.forEach((el, index) => {
      el.classList.add("reveal-init");
      // Add a slight stagger delay for siblings
      const siblingIndex = Array.from(el.parentNode?.children || []).indexOf(el);
      if (siblingIndex > 0) {
        el.style.transitionDelay = `${Math.min(siblingIndex * 0.08, 0.4)}s`;
      }
      revealObserver.observe(el);
    });
  }

  // --- 9. Animated Number Counters ---
  const statNumbers = document.querySelectorAll(
    ".stats strong, .dark-stats strong, .about-stat-grid strong, .project-stats strong"
  );

  if ("IntersectionObserver" in window && statNumbers.length) {
    const animateCounter = (element) => {
      const rawText = element.textContent.trim();
      const match = rawText.match(/^([\d.,]+)(.*)$/);
      if (!match) return;

      const numStr = match[1].replace(/\./g, "").replace(/,/g, "");
      const suffix = match[2] || "";
      const targetNumber = parseInt(numStr, 10);
      if (isNaN(targetNumber)) return;

      const duration = 1400; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(easeProgress * targetNumber);

        // Format with thousand dots
        const formatted = current.toLocaleString("vi-VN") + suffix;
        element.textContent = formatted;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          element.textContent = rawText; // restore original string
        }
      }

      requestAnimationFrame(updateNumber);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach((num) => counterObserver.observe(num));
  }
}

