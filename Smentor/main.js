/* ============================================================
   MAIN.JS
   SMENTOR LANDING PAGE
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initRevealAnimation();
  initActiveNavigation();
  initVideoModal();
  initCounters();
  initBackToTop();
});

/* ============================================================
   STICKY HEADER
   ============================================================ */

function initStickyHeader() {
  const header = document.getElementById("header");

  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 40
    );
  };

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );
}

/* ============================================================
   MOBILE MENU
   ============================================================ */

function initMobileMenu() {
  const hamburger =
    document.getElementById("hamburger");

  const mobileNav =
    document.getElementById("mobileNav");

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    const isOpen =
      mobileNav.classList.toggle("is-open");

    hamburger.classList.toggle(
      "is-active",
      isOpen
    );

    hamburger.setAttribute(
      "aria-expanded",
      isOpen
    );
  });

  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      hamburger.classList.remove("is-active");

      hamburger.setAttribute(
        "aria-expanded",
        "false"
      );
    });
  });
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */

function initSmoothScroll() {
  document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {
      anchor.addEventListener("click", e => {
        const targetId =
          anchor.getAttribute("href");

        if (!targetId || targetId === "#")
          return;

        const target =
          document.querySelector(targetId);

        if (!target) return;

        e.preventDefault();

        const header =
          document.getElementById("header");

        const headerHeight =
          header?.offsetHeight || 0;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          10;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      });
    });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */

function initRevealAnimation() {
  const reveals =
    document.querySelectorAll(".reveal");

  if (!reveals.length) return;

  const observer =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );
          }
        });
      },
      {
        threshold: 0.15
      }
    );

  reveals.forEach(item =>
    observer.observe(item)
  );
}

/* ============================================================
   ACTIVE NAVIGATION
   ============================================================ */

function initActiveNavigation() {
  const sections =
    document.querySelectorAll(
      "section[id]"
    );

  const navLinks =
    document.querySelectorAll(
      ".header__nav a"
    );

  if (
    !sections.length ||
    !navLinks.length
  )
    return;

  const updateActiveLink = () => {
    let currentSection = "";

    sections.forEach(section => {
      const top =
        section.offsetTop - 150;

      const bottom =
        top + section.offsetHeight;

      if (
        window.scrollY >= top &&
        window.scrollY < bottom
      ) {
        currentSection =
          section.id;
      }
    });

    navLinks.forEach(link => {
      const href =
        link.getAttribute("href");

      link.classList.toggle(
        "is-active",
        href ===
          `#${currentSection}`
      );
    });
  };

  updateActiveLink();

  window.addEventListener(
    "scroll",
    updateActiveLink,
    { passive: true }
  );
}

/* ============================================================
   VIDEO MODAL
   ============================================================ */

function initVideoModal() {
  const trigger =
    document.getElementById(
      "videoTrigger"
    );

  const modal =
    document.getElementById(
      "videoModal"
    );

  const closeBtn =
    document.getElementById(
      "videoModalClose"
    );

  if (!trigger || !modal) return;

  const closeModal = () => {
    modal.classList.remove(
      "is-open"
    );

    document.body.style.overflow =
      "";
  };

  trigger.addEventListener(
    "click",
    () => {
      modal.classList.add(
        "is-open"
      );

      document.body.style.overflow =
        "hidden";
    }
  );

  closeBtn?.addEventListener(
    "click",
    closeModal
  );

  modal.addEventListener(
    "click",
    e => {
      if (e.target === modal) {
        closeModal();
      }
    }
  );

  document.addEventListener(
    "keydown",
    e => {
      if (
        e.key === "Escape" &&
        modal.classList.contains(
          "is-open"
        )
      ) {
        closeModal();
      }
    }
  );
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */

function initCounters() {
  const counters =
    document.querySelectorAll(
      "[data-counter]"
    );

  if (!counters.length) return;

  const animateCounter =
    counter => {
      const target =
        parseInt(
          counter.dataset.counter,
          10
        );

      if (isNaN(target)) return;

      let current = 0;

      const increment =
        Math.max(
          1,
          Math.ceil(target / 60)
        );

      const update = () => {
        current += increment;

        if (current >= target) {
          counter.textContent =
            target.toLocaleString();
          return;
        }

        counter.textContent =
          current.toLocaleString();

        requestAnimationFrame(
          update
        );
      };

      update();
    };

  const observer =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (
            entry.isIntersecting
          ) {
            animateCounter(
              entry.target
            );

            observer.unobserve(
              entry.target
            );
          }
        });
      },
      {
        threshold: 0.3
      }
    );

  counters.forEach(counter =>
    observer.observe(counter)
  );
}

/* ============================================================
   BACK TO TOP
   ============================================================ */

function initBackToTop() {
  const btn =
    document.getElementById(
      "backTop"
    );

  if (!btn) return;

  const toggleButton = () => {
    btn.classList.toggle(
      "is-visible",
      window.scrollY > 500
    );
  };

  toggleButton();

  window.addEventListener(
    "scroll",
    toggleButton,
    { passive: true }
  );

  btn.addEventListener(
    "click",
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );
}