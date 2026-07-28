/**
 * Smartland — Main Script
 * Kiến trúc: Module + Component + Scroll Animations
 *
 * Các component được nạp động qua fetch().
 *
 * LƯU Ý: Website phải chạy qua HTTP server (ví dụ: VS Code Live Server,
 * npx http-server, hoặc bất kỳ web server nào) để fetch() hoạt động đúng.
 * Mở trực tiếp bằng file:// sẽ bị chặn bởi CORS policy của trình duyệt.
 *
 * Khởi chạy nhanh:
 *   npx http-server . -p 3000
 *   Sau đó truy cập: http://localhost:3000
 */

(async () => {
    await loadComponents();
    initApp();
})();

/* ==========================================================================
   COMPONENT LOADER
   Tìm tất cả [data-component], fetch HTML, thay thế {{ROOT}} và inject vào DOM.
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
                console.warn(`[Smartland Component Loader] Không thể nạp: ${src}`, err);
                slot.remove();
            }
        })
    );
}

/* ==========================================================================
   APP INIT — Chạy sau khi tất cả components đã được inject vào DOM
   ========================================================================== */
function initApp() {
    initHeader();
    initNavMenu();
    initActiveNav();
    initBackToTop();
    initScrollAnimations();
    initParallax();
    if (document.getElementById('flipbook')) {
        initFlipBook();
    }
}
/* ==========================================================================
   HEADER — Trạng thái scroll (thêm class is-scrolled khi cuộn)
   ========================================================================== */
function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* ==========================================================================
   NAVIGATION — Tự động đóng menu mobile khi click vào nav link
   ========================================================================== */
function initNavMenu() {
    const menu = document.querySelector('.navbar-collapse');
    if (!menu) return;

    document.querySelectorAll('.navbar .nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('show') && window.bootstrap) {
                bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });
}

/* ==========================================================================
   ACTIVE NAV LINK — Tự động highlight nav link tương ứng với trang hiện tại
   ========================================================================== */
function initActiveNav() {
    const path = window.location.pathname;

    document.querySelectorAll('.navbar .nav-link[data-nav-page]').forEach((link) => {
        const page = link.dataset.navPage;
        let isActive = false;

        switch (page) {
            case 'home':
                // Active khi ở trang chủ (không phải trong /pages/)
                isActive = !path.includes('/pages/');
                break;
            case 'du-an':
                isActive = path.includes('/pages/du-an/');
                break;
            case 'giai-thuong':
                isActive = path.includes('/pages/giai-thuong/');
                break;
            case 'tin-tuc':
                isActive = path.includes('/pages/tin-tuc/');
                break;
            default:
                isActive = false;
        }

        link.classList.toggle('active', isActive);
    });
}



/* ==========================================================================
   BACK TO TOP — Nút cuộn về đầu trang
   ========================================================================== */
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const toggle = () => btn.classList.toggle('visible', window.scrollY > 300);
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ==========================================================================
   SCROLL ANIMATIONS — Intersection Observer & Staggered delay
   ========================================================================== */
function initScrollAnimations() {
    // 1. Tự động gắn class animation cho các thành phần tiêu biểu
    document.querySelectorAll('.section-title, .section-heading h2, .section-heading span, .news-page-title').forEach(el => {
        if (!el.classList.contains('anim-blur-in')) el.classList.add('anim-blur-in');
    });

    document.querySelectorAll('.section-desc, .section-heading p').forEach(el => {
        if (!el.classList.contains('anim-fade-up')) el.classList.add('anim-fade-up');
    });

    // Gom nhóm các items theo danh sách để làm Staggered Animation
    const staggerConfigs = [
        { parent: '.stats-row', child: '.stat-item' },
        { parent: '.project-grid', child: '.project-list-card' },
        { parent: '.row', child: '.project-card' },
        { parent: '.row', child: '.category-card' },
        { parent: '.news-grid', child: '.news-card' },
        { parent: '.news-list-grid', child: '.news-list-card' },
        { parent: '.award-timeline', child: '.award-row' },
        { parent: '.timeline-wrap', child: '.award-item' }
    ];

    staggerConfigs.forEach(cfg => {
        document.querySelectorAll(cfg.parent).forEach(parentEl => {
            const children = parentEl.querySelectorAll(cfg.child);
            children.forEach((childEl, index) => {
                // Thêm class fade up nếu chưa có
                if (!childEl.classList.contains('anim-fade-up') && !childEl.classList.contains('anim-fade-left') && !childEl.classList.contains('anim-fade-right')) {
                    childEl.classList.add('anim-fade-up');
                }
                // Tính toán delay động theo từng phần tử (100ms, 150ms, 200ms, ...)
                const delay = 100 + index * 100;
                childEl.style.transitionDelay = `${delay}ms`;
            });
        });
    });

    // Các thành phần riêng lẻ khác
    document.querySelectorAll('.partners-image, .profile-slider, .profile-actions, .subscribe-form, .news-sidebar-widget, .career-banner').forEach(el => {
        if (!el.classList.contains('anim-fade-up')) el.classList.add('anim-fade-up');
    });

    // 2. Thiết lập Intersection Observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -10% 0px', // kích hoạt khi cách viewport 10%
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Trực quan hóa Counter khi có stat-item hiển thị
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
                
                // Chạy xong hiệu ứng thì ngưng quan sát (animation chỉ chạy 1 lần)
                self.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Bắt đầu quan sát các phần tử
    const animTargets = document.querySelectorAll(
        '.anim-fade-in, .anim-fade-up, .anim-fade-left, .anim-fade-right, .anim-zoom-in, .anim-zoom-out, .anim-blur-in, .anim-image-reveal, .anim-text-reveal, .stat-item'
    );
    animTargets.forEach(target => observer.observe(target));
}

/* ==========================================================================
   COUNTER ANIMATION — Đếm số thống kê khi cuộn trang tới
   ========================================================================== */
function animateCounter(statItemEl) {
    const strongEl = statItemEl.querySelector('strong');
    if (!strongEl || strongEl.dataset.counted === 'true') return;

    strongEl.dataset.counted = 'true';
    const textVal = strongEl.innerText.trim();
    
    // Tách số từ text (Ví dụ: "10000+" -> { num: 10000, suffix: "+" })
    const numberMatch = textVal.match(/^([0-9]+)(.*)$/);
    if (!numberMatch) return;

    const targetNumber = parseInt(numberMatch[1], 10);
    const suffix = numberMatch[2] || '';
    
    let currentNumber = 0;
    const duration = 1800; // Thời gian chạy (ms)
    const startTime = performance.now();

    function updateCounter(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out cubic: mượt ở cuối
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        
        currentNumber = Math.floor(easeOutProgress * targetNumber);
        
        // Định dạng có dấu phẩy ngăn cách hàng nghìn nếu cần
        strongEl.innerText = currentNumber.toLocaleString('en-US') + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            strongEl.innerText = textVal; // Đảm bảo hiển thị chuẩn text gốc ở cuối cùng
        }
    }

    requestAnimationFrame(updateCounter);
}

/* ==========================================================================
   PARALLAX SCROLLING — Hiệu ứng parallax nhẹ trên các banner chính
   ========================================================================== */
function initParallax() {
    const parallaxBanners = document.querySelectorAll('.hero-section, .project-banner, .career-banner');
    if (!parallaxBanners.length || window.innerWidth < 768) return; // Không chạy trên mobile để mượt hơn

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        parallaxBanners.forEach(banner => {
            const rect = banner.getBoundingClientRect();
            // Chỉ tính toán khi phần tử đang xuất hiện trên màn hình
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.15; // Tốc độ di chuyển nền chậm
                const offset = (rect.top) * speed;
                banner.style.backgroundPositionY = `calc(50% + ${offset}px)`;
            }
        });
    }, { passive: true });
}

/* ==========================================================================
   FLIPBOOK — Tích hợp PDF.js & StPageFlip
   ========================================================================== */
async function initFlipBook() {
    const flipbookEl = document.getElementById('flipbook');
    const loadingText = document.querySelector('.loading-overlay span');
    const root = window.ROOT_PATH || './';
    const pdfUrl = `${root}img/1-VN-HO-SO-NANG-LUC-SML_SMR_18122025.pdf`;

    // 1. Cấu hình PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

    try {
        // Tải tài liệu PDF
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        document.getElementById('total-pages').textContent = totalPages;

        // 2. Render từng trang PDF thành Canvas
        for (let i = 1; i <= totalPages; i++) {
            if (loadingText) {
                loadingText.textContent = `Đang xử lý trang ${i} / ${totalPages}...`;
            }

            const page = await pdf.getPage(i);
            // Dùng scale 1.5 để hiển thị rõ nét trên màn hình
            const viewport = page.getViewport({ scale: 1.5 });

            const pageDiv = document.createElement('div');
            pageDiv.className = 'page-content';
            
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d');

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;
            pageDiv.appendChild(canvas);
            flipbookEl.appendChild(pageDiv);
        }

        // Lấy kích thước của trang đầu tiên để làm kích thước chuẩn của sách
        const firstPage = await pdf.getPage(1);
        const firstViewport = firstPage.getViewport({ scale: 1 });
        const bookWidth = firstViewport.width;
        const bookHeight = firstViewport.height;

        // 3. Khởi tạo PageFlip
        const pageFlip = new St.PageFlip(flipbookEl, {
            width: bookWidth,
            height: bookHeight,
            size: "stretch",
            minWidth: 320,
            maxWidth: 1000,
            minHeight: 400,
            maxHeight: 1400,
            drawShadow: true,
            showCover: true,
            usePortrait: true,
            maxShadowOpacity: 0.25,
            swipeDistance: 30
        });

        pageFlip.loadFromHTML(document.querySelectorAll('.page-content'));
        
        // Ẩn overlay loading và hiển thị sách
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) overlay.style.display = 'none';
        flipbookEl.classList.add('ready');

        // Cập nhật chỉ số trang ban đầu
        document.getElementById('current-page').textContent = pageFlip.getCurrentPageIndex() + 1;

        // 4. Các sự kiện điều hướng & điều khiển
        document.getElementById('btn-prev')?.addEventListener('click', () => pageFlip.flipPrev());
        document.getElementById('btn-next')?.addEventListener('click', () => pageFlip.flipNext());
        document.getElementById('btn-viewport-prev')?.addEventListener('click', () => pageFlip.flipPrev());
        document.getElementById('btn-viewport-next')?.addEventListener('click', () => pageFlip.flipNext());

        pageFlip.on('flip', (e) => {
            document.getElementById('current-page').textContent = e.data + 1;
        });

        // Điều hướng bàn phím
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') pageFlip.flipPrev();
            if (e.key === 'ArrowRight') pageFlip.flipNext();
        });

        // Zoom logic
        let zoomScale = 1;
        const zoomContainer = document.getElementById('flipbook-zoom-container');
        
        document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
            zoomScale = Math.min(zoomScale + 0.15, 2);
            if (zoomContainer) {
                zoomContainer.style.transform = `scale(${zoomScale})`;
            }
        });

        document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
            zoomScale = Math.max(zoomScale - 0.15, 0.7);
            if (zoomContainer) {
                zoomContainer.style.transform = `scale(${zoomScale})`;
            }
        });

        // Fullscreen logic
        const wrapper = document.querySelector('.flipbook-wrapper-container');
        const fsBtn = document.getElementById('btn-fullscreen');
        
        fsBtn?.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                wrapper.requestFullscreen().then(() => {
                    fsBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
                }).catch(err => console.error('Lỗi Fullscreen:', err));
            } else {
                document.exitFullscreen();
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && fsBtn) {
                fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
                zoomScale = 1;
                if (zoomContainer) zoomContainer.style.transform = 'scale(1)';
            }
            // Gọi update size của pageFlip khi đổi kích thước màn hình
            setTimeout(() => pageFlip.update(), 150);
        });

    } catch (error) {
        console.error('Không thể khởi tạo 3D FlipBook:', error);
        if (loadingText) {
            loadingText.innerHTML = '<span class="text-danger">Lỗi tải tài liệu. Vui lòng tải lại trang hoặc kiểm tra file PDF!</span>';
        }
    }
}

