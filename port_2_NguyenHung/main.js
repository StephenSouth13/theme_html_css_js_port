const GTA = {
    init: function() {
        this.initStickyHeader();
        this.initAnimations();
        this.initServiceCards();
        this.initProjectCarousel();
        this.initTestimonials();
    },

    // 1. Sticky Header
    initStickyHeader: function() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (header) header.classList.toggle('scrolled', window.scrollY > 50);
        });
    },

    // 2. Fade-in cho các section tổng
    initAnimations: function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('fade-in');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.section').forEach(s => observer.observe(s));
    },

    // 3. Hiệu ứng cho Service Cards
    initServiceCards: function() {
        const cards = document.querySelectorAll('.service-card');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });

        cards.forEach(card => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
            observer.observe(card);
        });
    },

    // 4. Project Carousel
    initProjectCarousel: function() {
        const container = document.querySelector('[data-section="project-carousel"] .carousel-container');
        if (!container) return;

        container.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                container.scrollLeft += e.deltaY;
            }
        });
    },

    // 5. Testimonials
    initTestimonials: function() {
        // Mở rộng logic tại đây nếu cần slider
    }
};

// Khởi chạy duy nhất 1 lần
document.addEventListener('DOMContentLoaded', () => GTA.init());