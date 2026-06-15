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

  menuBtn?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  links.forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      nav?.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
      window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
    });
  });
}

function setupBackTop() {
  const button = document.getElementById("backTop");
  window.addEventListener("scroll", () => {
    button?.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });

  button?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

loadComponents()
  .then(() => {
    setupNavigation();
    setupBackTop();
    console.info("Loaded BA portfolio:", components.join(", "));
  })
  .catch(error => {
    document.body.insertAdjacentHTML("afterbegin", `<pre class="load-error">${error.message}</pre>`);
    console.error(error);
  });
