const componentOrder = [
  "header",
  "hero",
  "service",
  "gallery",
  "contact",
  "footer"
];

async function loadComponents() {
  const targets = document.querySelectorAll("[data-component]");
  await Promise.all([...targets].map(async target => {
    const name = target.dataset.component;
    const response = await fetch(`components/${name}.html`);
    if (!response.ok) throw new Error(`Cannot load component: ${name}`);
    target.innerHTML = await response.text();
  }));
}

function setupNavigation() {
  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const links = document.querySelectorAll(".desktop-nav a, .mobile-nav a");

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 20);
    document.getElementById("backTop")?.classList.toggle("visible", window.scrollY > 520);
  }, { passive: true });

  menuBtn?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  links.forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      mobileNav?.classList.remove("open");
      menuBtn?.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
      window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
    });
  });

  const sections = [...document.querySelectorAll("section[id]")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".desktop-nav a").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => observer.observe(section));
}

function setupReveal() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add("visible"), delay);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
}

function setupCounters() {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count || 0);
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const duration = 1300;
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(end * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: .6 });
  document.querySelectorAll("[data-count]").forEach(el => counterObserver.observe(el));
}

function setupTilt() {
  document.querySelectorAll(".tilt-card").forEach(card => {
    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function setupMagneticButtons() {
  document.querySelectorAll(".magnetic").forEach(button => {
    button.addEventListener("mousemove", event => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * .08}px, ${y * .16}px)`;
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

function setupBackTop() {
  document.getElementById("backTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

loadComponents()
  .then(() => {
    setupNavigation();
    setupReveal();
    setupCounters();
    setupTilt();
    setupMagneticButtons();
    setupBackTop();
    console.info("Tran Van Tien Thanh portfolio loaded:", componentOrder.join(", "));
  })
  .catch(error => {
    document.body.insertAdjacentHTML("afterbegin", `<pre style="padding:16px;color:#b91c1c">${error.message}</pre>`);
    console.error(error);
  });
