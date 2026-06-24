const components = [
  "header",
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "tools",
  "process",
  "certificates",
  "contact",
  "footer"
];

async function loadComponents() {
  const targets = document.querySelectorAll("[data-component]");

  await Promise.all([...targets].map(async target => {
    const name = target.dataset.component;
    const response = await fetch(`components/${name}.html`);
    if (!response.ok) throw new Error(`Không thể tải component: ${name}`);
    target.innerHTML = await response.text();
  }));
}

function setupNavigation() {
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("siteNav");
  const links = document.querySelectorAll("a[href^='#']");

  window.addEventListener("scroll", () => {
    document.body.classList.toggle("scrolled", window.scrollY > 90);
  }, { passive: true });

  menuBtn?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    menuBtn.classList.toggle("open", Boolean(open));
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  links.forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      if (!id) return;
      if (id === "#") {
        event.preventDefault();
        return;
      }
      const target = id && document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      nav?.classList.remove("open");
      menuBtn?.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
      window.scrollTo({ top: target.offsetTop - 18, behavior: "smooth" });
    });
  });

  const sections = [...document.querySelectorAll("section[id], .hero[id]")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".quick-nav a").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-28% 0px -62% 0px" });

  sections.forEach(section => observer.observe(section));
}

function setupReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add("visible"), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}

function setupCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const end = Number(element.dataset.count || 0);
      const suffix = element.dataset.suffix || "";
      const duration = 1300;
      const startTime = performance.now();

      const tick = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(end * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll("[data-count]").forEach(element => observer.observe(element));
}

function setupCaseTabs() {
  const tabs = document.querySelectorAll(".case-tabs button");
  const titles = [
    "Rối loạn chức năng thất trái ở bệnh nhân tăng huyết áp lâu năm",
    "Theo dõi đáp ứng điều trị suy tim bằng siêu âm tim",
    "Tối ưu phác đồ giáo dục sức khỏe cho bệnh nhân ngoại trú"
  ];

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach(item => item.classList.remove("active"));
      tab.classList.add("active");
      const title = document.querySelector(".case-content h3");
      if (title) title.textContent = titles[index];
    });
  });
}

function setupPanelMotion() {
  const panels = document.querySelectorAll(".panel, .stats-strip article, .book-row article");

  panels.forEach(panel => {
    panel.addEventListener("pointermove", event => {
      if (window.matchMedia("(max-width: 760px)").matches) return;
      const rect = panel.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -3;
      const rotateY = ((x / rect.width) - 0.5) * 3;
      panel.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    panel.addEventListener("pointerleave", () => {
      panel.style.transform = "";
    });
  });
}

function setupPlayButton() {
  const button = document.querySelector(".play-btn");
  button?.addEventListener("click", () => {
    button.classList.toggle("playing");
    button.textContent = button.classList.contains("playing") ? "❚❚" : "▶";
  });
}

function setupBackTop() {
  const button = document.getElementById("backTop");

  window.addEventListener("scroll", () => {
    button?.classList.toggle("visible", window.scrollY > 600);
  }, { passive: true });

  button?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

loadComponents()
  .then(() => {
    setupNavigation();
    setupReveal();
    setupCounters();
    setupCaseTabs();
    setupPanelMotion();
    setupPlayButton();
    setupBackTop();
    console.info("Loaded medical profile:", components.join(", "));
  })
  .catch(error => {
    document.body.insertAdjacentHTML("afterbegin", `<pre class="load-error">${error.message}</pre>`);
    console.error(error);
  });
