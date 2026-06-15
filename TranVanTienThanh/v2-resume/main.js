const componentOrder = [
  "hero",
  "service",
  "about",
  "gallery",
  "team",
  "pricing",
  "contact",
  "testimonial",
  "blog",
  "brand",
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
  
  // After components are loaded, initialize interactions
  initializeAnimations();
}

function initializeAnimations() {
  const header = document.querySelector('.header');
  const backTop = document.getElementById('backTop');

  function updateScrollState() {
    header?.classList.toggle('scrolled', window.scrollY > 20);
    backTop?.classList.toggle('visible', window.scrollY > 520);
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Smooth Scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Add animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  document.querySelectorAll('.section, .experience-item, .project-card, .stat, .tool-item, .interest-item').forEach(el => {
    observer.observe(el);
  });

  // Add CSS animation if not in stylesheet
  if (!document.querySelector('style[data-animation]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animation', 'true');
    style.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Email link functionality
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const email = this.getAttribute('href').replace('mailto:', '');
      window.location.href = 'mailto:' + email;
    });
  });

  // External links
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

// Load all components on page load
document.addEventListener('DOMContentLoaded', () => {
  loadComponents().catch(error => {
    console.error('Error loading components:', error);
  });
});

console.log('Portfolio v2-resume component system initialized!');
