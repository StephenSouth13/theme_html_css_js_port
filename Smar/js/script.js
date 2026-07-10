document.addEventListener("DOMContentLoaded", async () => {
  const siteBasePath = window.SMAR_BASE_PATH || "";
  const isLocalUrl = (url) => {
    return url &&
      !url.startsWith("#") &&
      !url.startsWith("/") &&
      !url.startsWith("http://") &&
      !url.startsWith("https://") &&
      !url.startsWith("tel:") &&
      !url.startsWith("mailto:") &&
      !url.startsWith("data:") &&
      !url.startsWith("javascript:");
  };
  const resolveSiteUrl = (url) => {
    if (!isLocalUrl(url) || url.startsWith(siteBasePath) || url.startsWith("../")) {
      return url;
    }

    return `${siteBasePath}${url}`;
  };
  const adjustLocalUrls = (container) => {
    container.querySelectorAll("[href]").forEach((element) => {
      element.setAttribute("href", resolveSiteUrl(element.getAttribute("href")));
    });

    container.querySelectorAll("[src]").forEach((element) => {
      element.setAttribute("src", resolveSiteUrl(element.getAttribute("src")));
    });
  };

  // ================= LOAD HEADER =================
  const header = document.getElementById("header");

  if (header) {
    const res = await fetch(`${siteBasePath}pages/shared/header.html`);
    header.innerHTML = await res.text();
    adjustLocalUrls(header);
  }

  // ================= LOAD FOOTER =================
  const footer = document.getElementById("footer");

  if (footer) {
    const res = await fetch(`${siteBasePath}pages/shared/footer.html`);
    footer.innerHTML = await res.text();
    adjustLocalUrls(footer);
  }

  // ================= LOAD COMPONENTS =================
  const components = document.querySelectorAll("[data-component]");

  for (const component of components) {
    const componentPath = component.dataset.component;
    if (!componentPath) continue;

    const res = await fetch(componentPath);
    component.innerHTML = await res.text();
    adjustLocalUrls(component);
  }

  // ================= LOAD POPUP =================
  const popupContainer = document.getElementById("popup-container");

  if (popupContainer) {
    const res = await fetch(`${siteBasePath}pages/shared/popup.html`);
    popupContainer.innerHTML = await res.text();
    adjustLocalUrls(popupContainer);
  }

  // Khởi tạo icon sau khi load HTML
  if (window.lucide) {
    lucide.createIcons();
  }

  // ================= MENU =================
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen);
    });

    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

  }

  // ================= FORM =================
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Cảm ơn bạn! Yêu cầu tư vấn đã được ghi nhận.");
      contactForm.reset();
    });

  }

  // ================= LỌC DỰ ÁN =================
  const projectButtons = document.querySelectorAll(".project-filters button");
  const projectLinks = document.querySelectorAll(".project-link");

  if (projectButtons.length && projectLinks.length) {

    projectButtons.forEach(button => {

      button.addEventListener("click", () => {

        projectButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        projectLinks.forEach(link => {

          const card = link.querySelector(".project-card");
          if (!card) return;

          const categories = card.dataset.category.split(" ");

          if (filter === "all" || categories.includes(filter)) {
            link.style.display = "";
          } else {
            link.style.display = "none";
          }

        });

      });

    });

  }

  // ================= LỌC BÀI VIẾT =================
  const newsButtons = document.querySelectorAll(".share-categories button");
  const newsLinks = document.querySelectorAll(".news-link");

  if (newsButtons.length && newsLinks.length) {

    newsButtons.forEach(button => {

      button.addEventListener("click", () => {

        newsButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        newsLinks.forEach(link => {

          const category = link.dataset.category;

          if (filter === "all" || category === filter) {
            link.style.display = "";
          } else {
            link.style.display = "none";
          }

        });

      });

    });

  }

  // ================= POPUP =================
  const popup = document.getElementById("popup");
  const openPopup = document.getElementById("openPopup");
  const closePopup = document.getElementById("closePopup");

  if (popup && openPopup && closePopup) {

    openPopup.addEventListener("click", function (e) {
      e.preventDefault();
      popup.classList.add("active");
    });

    closePopup.addEventListener("click", function () {
      popup.classList.remove("active");
    });

    popup.addEventListener("click", function (e) {
      if (e.target === popup) {
        popup.classList.remove("active");
      }
    });

  }

  // Tạo lại icon sau khi load popup
  if (window.lucide) {
    lucide.createIcons();
  }

  // ================= DANH MỤC NỘI DUNG =================
  const toc = document.querySelector(".table-content");
  const tocHeader = document.querySelector(".toc-header");

  if (toc && tocHeader) {

    tocHeader.addEventListener("click", () => {

      toc.classList.toggle("active");

    });

  }

});
