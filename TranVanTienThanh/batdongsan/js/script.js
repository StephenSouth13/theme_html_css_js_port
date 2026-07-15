/* =====================================================
COMPONENT LOADER & UTILITIES
===================================================== */
const rootPrefix = document.body.getAttribute('data-root') || './';

async function loadAllComponents() {
    async function loadPlaceholder(placeholder) {
        const url = placeholder.getAttribute('data-include');
        if (!url) return;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const htmlText = await response.text();
                
                // Parse the fetched HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlText;
                
                // Recursively load any data-include elements inside the fetched content
                const nestedPlaceholders = Array.from(tempDiv.querySelectorAll('[data-include]'));
                if (nestedPlaceholders.length > 0) {
                    await Promise.all(nestedPlaceholders.map(loadPlaceholder));
                }
                
                // Replace the placeholder with the loaded and fully resolved content
                const parent = placeholder.parentNode;
                if (parent) {
                    while (tempDiv.firstChild) {
                        parent.insertBefore(tempDiv.firstChild, placeholder);
                    }
                    parent.removeChild(placeholder);
                }
            } else {
                console.error(`Failed to load component: ${url}`, response.statusText);
            }
        } catch (error) {
            console.error(`Error loading component: ${url}`, error);
        }
    }
    
    let placeholders = Array.from(document.querySelectorAll('[data-include]'));
    await Promise.all(placeholders.map(loadPlaceholder));
}

function adjustLinks() {
    // Update anchor links
    const links = document.querySelectorAll('a[data-link]');
    links.forEach(link => {
        const relativePath = link.getAttribute('data-link');
        link.setAttribute('href', rootPrefix + relativePath);
    });

    // Update images
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        const relativePath = img.getAttribute('data-src');
        img.setAttribute('src', rootPrefix + relativePath);
    });
}

function highlightActiveLink() {
    const path = window.location.pathname;
    let page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    
    // Normalize if path ends with gioi-thieu/ or similar
    if (path.endsWith('/')) {
        page = 'index.html';
    }

    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        // Check if current page is active
        if (href.includes(page) && page !== 'index.html') {
            link.classList.add('active');
        } else if (page === 'index.html' && (href === 'index.html' || href === rootPrefix + 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* =====================================================
HEADER & NAVIGATION
===================================================== */
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
}

/* =====================================================
MENU (MOBILE NAVIGATION)
==================================================== */
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Animate hamburger spans into X shape
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile nav when link is clicked
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

/* =====================================================
SEARCH MODAL
===================================================== */
function initSearchModal() {
    const searchIconBtn = document.getElementById('search-btn');
    const searchModal = document.querySelector('.search-modal');
    const searchClose = document.querySelector('.search-close');

    if (searchIconBtn && searchModal && searchClose) {
        searchIconBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchModal.classList.add('active');
            const input = searchModal.querySelector('input');
            if (input) setTimeout(() => input.focus(), 300);
        });

        searchClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
        });

        // Close search on ESC key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                searchModal.classList.remove('active');
            }
        });
    }
}

/* =====================================================
HERO SLIDER
===================================================== */
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const bullets = document.querySelectorAll('.bullet');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const header = document.querySelector('header');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let isPlaying = true;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds per slide

    function updateHeaderTheme() {
        const activeSlide = slides[currentSlide];
        if (activeSlide && activeSlide.classList.contains('slide-dark')) {
            if (header) header.classList.add('hero-dark-active');
            const heroEl = document.getElementById('hero');
            if (heroEl) heroEl.classList.add('slide-dark-active');
        } else {
            if (header) header.classList.remove('hero-dark-active');
            const heroEl = document.getElementById('hero');
            if (heroEl) heroEl.classList.remove('slide-dark-active');
        }
    }

    function showSlide(index) {
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Toggle active slide
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Toggle active bullet
        bullets.forEach((bullet, i) => {
            if (i === currentSlide) {
                bullet.classList.add('active');
            } else {
                bullet.classList.remove('active');
            }
        });

        updateHeaderTheme();
    }

    function startSlideShow() {
        stopSlideShow();
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, slideDuration);
    }

    function stopSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Bullet indicators click handler
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', () => {
            showSlide(index);
            if (isPlaying) startSlideShow(); // Reset interval timer
        });
    });

    // Play/Pause Control handler
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                startSlideShow();
                playPauseBtn.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                `; // Pause Icon
            } else {
                stopSlideShow();
                playPauseBtn.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                `; // Play Icon
            }
        });
    }

    // Initialize Slider
    showSlide(0);
    startSlideShow();
}

/* =====================================================
NUMBER COUNTER ANIMATION
===================================================== */
function initStatsCounter() {
    const counterElements = document.querySelectorAll('.stat-number-value');
    if (counterElements.length === 0) return;
    
    function formatNumber(number, formatType) {
        if (formatType === 'dot') {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return number.toString();
    }

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-target'), 10);
                const formatType = target.getAttribute('data-format') || 'none';
                const duration = 2000; // 2 seconds animation duration
                const startTime = performance.now();
                
                const updateCount = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    
                    // Easing function: easeOutQuad
                    const easeProgress = progress * (2 - progress);
                    const currentValue = Math.floor(easeProgress * targetValue);
                    
                    target.textContent = formatNumber(currentValue, formatType);
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        target.textContent = formatNumber(targetValue, formatType);
                    }
                };
                
                requestAnimationFrame(updateCount);
                observer.unobserve(target); // Animate only once
            }
        });
    };

    const counterObserverOption = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const counterObserver = new IntersectionObserver(animateCounters, counterObserverOption);

    counterElements.forEach(element => {
        counterObserver.observe(element);
    });
}

/* =====================================================
ECOSYSTEM GALLERY SWIPER
===================================================== */
function initEcosystemSwiper() {
    if (typeof Swiper !== 'undefined' && document.querySelector('.ecosystemSwiper')) {
        new Swiper('.ecosystemSwiper', {
            slidesPerView: 1.2,
            spaceBetween: 16,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                480: {
                    slidesPerView: 2,
                    spaceBetween: 16
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 24
                }
            }
        });
    }
}

/* =====================================================
LOGO INTERACTION IN SERVICE NETWORK
===================================================== */
function initLogoInteraction() {
    const logos = document.querySelectorAll(".service-network .logo");
    const popup = document.getElementById("infoPopup");
    const popupText = document.getElementById("popupText");

    if (logos.length > 0 && popup && popupText) {
        logos.forEach((logo) => {
            logo.addEventListener("mouseenter", function () {
                logos.forEach(item => item.classList.remove("active"));
                this.classList.add("active");

                popupText.innerHTML = this.dataset.info;

                const network = this.parentElement;
                const logoRect = this.getBoundingClientRect();
                const networkRect = network.getBoundingClientRect();

                const x = logoRect.left - networkRect.left;
                const y = logoRect.top - networkRect.top;

                // Nếu logo ở nửa phải thì hiện popup bên trái
                if (x > network.offsetWidth / 2) {
                    popup.style.left = (x - 370) + "px";
                } else {
                    popup.style.left = (x + this.offsetWidth + 25) + "px";
                }

                popup.style.top = (y - 10) + "px";
                popup.style.display = "block";
            });
        });
    }
}

/* =====================================================
ABILITY TABS
===================================================== */
function initAbilityTabs() {
    const abilityTabs = document.querySelectorAll(".ability-tab");
    const tabContents = document.querySelectorAll(".tab-content");
    const subtitle = document.getElementById("serviceSubtitle");
    const title = document.getElementById("serviceTitle");

    if (abilityTabs.length > 0) {
        abilityTabs.forEach(tab => {
            tab.addEventListener("click", function () {
                // Active tab
                abilityTabs.forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");

                // Active content
                tabContents.forEach(content => content.classList.remove("active"));
                const targetContent = document.getElementById(this.dataset.tab);
                if (targetContent) targetContent.classList.add("active");

                // Đổi tiêu đề
                if (subtitle) subtitle.textContent = this.dataset.subtitle;
                if (title) title.textContent = this.dataset.title;
            });
        });
    }
}

/* =====================================================
PROJECT BANNER SHOWCASE
===================================================== */
function initProjectShowcase() {
    const projects = [
        {
            image: "img/vinhome-grandpark.jpg",
            title: "VINHOMES GRAND PARK",
            desc: "Đại đô thị đáng sống<br>Bậc nhất TP. Hồ Chí Minh",
            link: "vinhomes-grand-park.html"
        },
        {
            image: "img/the-prive.jpg",
            title: "THE PRIVÉ",
            desc: "Biểu tượng sống mới",
            link: "the-prive.html"
        },
        {
            image: "img/lan-anh-avenue.jpg",
            title: "LAN ANH AVENUE",
            desc: "Khu đô thị hiện đại",
            link: "lan-anh-avenue.html"
        },
        {
            image: "img/vinhome-green-city.jpg",
            title: "VINHOMES GREEN CITY",
            desc: "Không gian sống xanh",
            link: "green-city.html"
        }
    ];

    const bannerImage = document.getElementById("bannerImage");
    const projectTitle = document.getElementById("projectTitle");
    const projectDesc = document.getElementById("projectDesc");
    const projectLink = document.getElementById("projectLink");
    const thumbs = document.querySelectorAll(".project-thumb");

    if (bannerImage && thumbs.length > 0) {
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener("click", function () {
                // Nếu đang được chọn thì bỏ qua
                if (this.classList.contains("active")) return;

                // Active thumbnail
                thumbs.forEach(item => item.classList.remove("active"));
                this.classList.add("active");

                // Ảnh hiện tại trượt sang trái
                bannerImage.classList.add("slide-out");

                // Sau khi ảnh cũ đi hết
                setTimeout(() => {
                    // Đổi dữ liệu
                    if (bannerImage) bannerImage.src = rootPrefix + projects[index].image;
                    if (projectTitle) projectTitle.innerHTML = projects[index].title;
                    if (projectDesc) projectDesc.innerHTML = projects[index].desc;
                    if (projectLink) projectLink.href = projects[index].link;

                    // Đưa ảnh mới từ bên phải vào
                    bannerImage.classList.remove("slide-out");
                    bannerImage.classList.add("slide-in");

                    // Chạy animation
                    requestAnimationFrame(() => {
                        bannerImage.classList.remove("slide-in");
                    });
                }, 600);
            });
        });
    }
}

/* =====================================================
NEWS & PARTNER SWIPER
===================================================== */
function initNewsSwiper() {
    if (typeof Swiper !== 'undefined' && document.querySelector(".newsSwiper")) {
        new Swiper(".newsSwiper", {
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            speed: 800,
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 15
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }
}

function initPartnerSwiper() {
    if (typeof Swiper !== 'undefined' && document.querySelector(".partnerSwiper")) {
        new Swiper(".partnerSwiper", {
            slidesPerView: 4,
            spaceBetween: 60,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false
            },
            pagination: {
                el: ".partner-pagination",
                clickable: true
            },
            breakpoints: {
                0: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 40
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 60
                }
            }
        });
    }
}

/* =====================================================
HISTORY TIMELINE (GIỚI THIỆU)
===================================================== */
function initHistoryTimeline() {
    const timelineData = [
        {
            year: "2009",
            text: "Thành lập Công ty Cổ phần Dịch vụ Bất động sản Đất Xanh.",
            image: "img/gioithieu/2009.jpg"
        },
        {
            year: "2010",
            text: "Mở rộng hoạt động kinh doanh trên toàn quốc.",
            image: "img/gioithieu/2010.jpg"
        },
        {
            year: "2011",
            text: "Đưa vào vận hành hệ thống phân phối chuyên nghiệp.",
            image: "img/gioithieu/2011.jpg"
        },
        {
            year: "2016",
            text: "Khẳng định vị thế hàng đầu trong lĩnh vực dịch vụ bất động sản.",
            image: "img/gioithieu/2016.jpg"
        },
        {
            year: "2018",
            text: "Phát triển thêm nhiều dự án lớn trên toàn quốc.",
            image: "img/gioithieu/2018.jpg"
        },
        {
            year: "2019",
            text: "Đẩy mạnh chuyển đổi số và nâng cao trải nghiệm khách hàng.",
            image: "img/gioithieu/2019.png"
        },
        {
            year: "2020",
            text: "Ra mắt nền tảng Real Agent và mở rộng hệ sinh thái.",
            image: "img/gioithieu/2020.jpg"
        },
        {
            year: "2021",
            text: "Thích ứng linh hoạt và phát triển mạnh sau đại dịch.",
            image: "img/gioithieu/2021.jpg"
        },
        {
            year: "2023",
            text: "Mở rộng lĩnh vực hoạt động sang phân khúc thương mại.",
            image: "img/gioithieu/2023.png"
        },
        {
            year: "2024",
            text: "Đẩy mạnh hợp tác chiến lược với many đối tác lớn.",
            image: "img/gioithieu/2024.jpg"
        },
        {
            year: "2025",
            text: "Tiếp tục phát triển hệ sinh thái bất động sản toàn diện.",
            image: "img/gioithieu/2025.jpg"
        }
    ];

    const bgYear = document.getElementById("bgYear");
    const historyYear = document.getElementById("historyYear");
    const historyText = document.getElementById("historyText");
    const historyImage = document.getElementById("historyImage");
    const years = document.querySelectorAll(".year-item");

    if (bgYear && years.length > 0) {
        let current = 8; // mặc định 2023

        function changeHistory(index) {
            const data = timelineData[index];
            if (!data) return;

            // animation
            if (historyImage) {
                historyImage.style.opacity = "0";
                historyImage.style.transform = "scale(0.95)";
            }
            if (historyYear) historyYear.style.opacity = "0";
            if (historyText) historyText.style.opacity = "0";

            setTimeout(() => {
                if (bgYear) bgYear.textContent = data.year;
                if (historyYear) historyYear.textContent = data.year;
                if (historyText) historyText.innerHTML = data.text;
                if (historyImage) historyImage.src = rootPrefix + data.image;

                if (historyImage) {
                    historyImage.style.opacity = "1";
                    historyImage.style.transform = "scale(1)";
                }
                if (historyYear) historyYear.style.opacity = "1";
                if (historyText) historyText.style.opacity = "1";
            }, 250);
        }

        years.forEach((item, index) => {
            item.addEventListener("click", function () {
                years.forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");
                current = index;
                changeHistory(index);
            });
        });

        // nút trái phải
        const prev = document.querySelector(".timeline-btn.prev");
        const next = document.querySelector(".timeline-btn.next");

        if (prev) {
            prev.addEventListener("click", () => {
                current--;
                if (current < 0) current = timelineData.length - 1;
                years.forEach(btn => btn.classList.remove("active"));
                if (years[current]) years[current].classList.add("active");
                changeHistory(current);
            });
        }

        if (next) {
            next.addEventListener("click", () => {
                current++;
                if (current >= timelineData.length) current = 0;
                years.forEach(btn => btn.classList.remove("active"));
                if (years[current]) years[current].classList.add("active");
                changeHistory(current);
            });
        }
    }
}

/* =====================================================
TEAM MEMBERS SLIDER (GIỚI THIỆU)
===================================================== */
function initTeamSlider() {
    const members = [
        {
            name:"Ông TRẦN QUỐC THỊNH",
            position:"Tổng Giám đốc",
            desc:"Hơn 20 năm kinh nghiệm phát triển nguồn nhân lực và vận hành hệ thống tại các tập đoàn đa quốc gia...",
            image:"img/gioithieu/doi-ngu-2.png"
        },
        {
            name:"Ông NGUYỄN TRƯỜNG SƠN",
            position:"Chủ tịch HĐQT",
            desc:"Có nhiều năm kinh nghiệm lãnh đạo doanh nghiệp bất động sản, định hướng chiến lược phát triển bền vững.",
            image:"img/gioithieu/tgd-tran-quoc-thinh-1.png"
        }
    ];

    let currentMemberIndex = 0;

    const mainImg = document.getElementById("mainPhoto");
    const mainName = document.getElementById("mainName");
    const mainPosition = document.getElementById("mainPosition");
    const mainDesc = document.getElementById("mainDesc");
    const leftImg = document.getElementById("leftImg");
    const leftName = document.getElementById("leftName");
    const rightImg = document.getElementById("rightImg");
    const rightName = document.getElementById("rightName");

    function renderMember(){
        if (!mainImg && !leftImg && !rightImg) return;
        const total = members.length;
        const left = (currentMemberIndex - 1 + total) % total;
        const right = (currentMemberIndex + 1) % total;

        if (mainImg) mainImg.src = rootPrefix + members[currentMemberIndex].image;
        if (mainName) mainName.innerHTML = members[currentMemberIndex].name;
        if (mainPosition) mainPosition.innerHTML = members[currentMemberIndex].position;
        if (mainDesc) mainDesc.innerHTML = members[currentMemberIndex].desc;

        if (leftImg) leftImg.src = rootPrefix + members[left].image;
        if (leftName) leftName.innerHTML = members[left].name;

        if (rightImg) rightImg.src = rootPrefix + members[right].image;
        if (rightName) rightName.innerHTML = members[right].name;
    }

    const teamNextBtn = document.querySelector(".team-next");
    if (teamNextBtn) {
        teamNextBtn.onclick = () => {
            currentMemberIndex++;
            if (currentMemberIndex >= members.length) currentMemberIndex = 0;
            renderMember();
        };
    }

    const teamPrevBtn = document.querySelector(".team-prev");
    if (teamPrevBtn) {
        teamPrevBtn.onclick = () => {
            currentMemberIndex--;
            if (currentMemberIndex < 0) currentMemberIndex = members.length - 1;
            renderMember();
        };
    }

    const leftMemberEl = document.querySelector(".left-member");
    if (leftMemberEl) {
        leftMemberEl.onclick = () => {
            currentMemberIndex--;
            if (currentMemberIndex < 0) currentMemberIndex = members.length - 1;
            renderMember();
        };
    }

    const rightMemberEl = document.querySelector(".right-member");
    if (rightMemberEl) {
        rightMemberEl.onclick = () => {
            currentMemberIndex++;
            if (currentMemberIndex >= members.length) currentMemberIndex = 0;
            renderMember();
        };
    }

    // Initial render
    renderMember();
}

/* =====================================================
VISION, MISSION, VALUE HOVER (GIỚI THIỆU)
===================================================== */
function initVisionHover() {
    const images = {
        default: document.getElementById("imgDefault"),
        mission: document.getElementById("imgMission"),
        value: document.getElementById("imgValue")
    };

    const mission = document.querySelector(".mission");
    const value = document.querySelector(".value");

    function changeImage(name){
        Object.values(images).forEach(img => {
            if (img) img.classList.remove("active");
        });
        if (images[name]) images[name].classList.add("active");
    }

    function removeText(){
        if (mission) mission.classList.remove("active");
        if (value) value.classList.remove("active");
    }

    if (mission) {
        mission.addEventListener("mouseenter", () => {
            changeImage("mission");
            removeText();
            mission.classList.add("active");
        });

        mission.addEventListener("mouseleave", () => {
            changeImage("default");
            mission.classList.remove("active");
        });
    }

    if (value) {
        value.addEventListener("mouseenter", () => {
            changeImage("value");
            removeText();
            value.classList.add("active");
        });

        value.addEventListener("mouseleave", () => {
            changeImage("default");
            value.classList.remove("active");
        });
    }
}

/* =====================================================
BENEFIT SWIPER (GIỚI THIỆU)
===================================================== */
function initBenefitSwiper() {
    if (typeof Swiper !== 'undefined' && document.querySelector(".benefitSwiper")) {
        new Swiper(".benefitSwiper", {
            slidesPerView: 2.2,
            spaceBetween: 35,
            grabCursor: true,
            freeMode: true,
            mousewheel: true,
            speed: 800,
        });
    }
}

/* =====================================================
SERVICE DETAIL SLIDER (DỊCH VỤ)
===================================================== */
function initServiceDetailSlider() {
    const slides = document.querySelectorAll(".service-slide");
    const prevBtn = document.querySelector(".service-prev");
    const nextBtn = document.querySelector(".service-next");

    if (slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        if (slides[currentSlide]) slides[currentSlide].classList.add("active");
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            showSlide(currentSlide + 1);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            showSlide(currentSlide - 1);
        });
    }
}

/* =====================================================
REPORT TABS (QUAN HỆ CỔ ĐÔNG)
===================================================== */
function initReportTabs() {
    const tabs = document.querySelectorAll(".report-tabs button");
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
        }
    });
}

function initYearFilter() {
    const years = document.querySelectorAll(".year-filter button:not(.arrow)");
    years.forEach(year => {
        year.onclick = () => {
            years.forEach(y => y.classList.remove("active"));
            year.classList.add("active");
        }
    });
}

/* =====================================================
REPORT TABLE (QUAN HỆ CỔ ĐÔNG)
===================================================== */
function initReportTable() {
    const reports = {
        "2026": {
            title: "BÁO CÁO TÀI CHÍNH",
            rows: [
                ["Báo cáo hợp nhất Kiểm toán / Soát xét", "", "", "", ""],
                ["Báo cáo riêng Kiểm toán / Soát xét", "", "", "", ""],
                ["Báo cáo hợp nhất", '<a href="#">PDF</a><br>29/04/2026', "", "", ""],
                ["Báo cáo riêng", '<a href="#">PDF</a><br>29/04/2026', "", "", ""]
            ]
        },
        "2025": {
            title: "BÁO CÁO TÀI CHÍNH",
            rows: [
                ["Báo cáo hợp nhất Kiểm toán / Soát xét", "", "", "", ""],
                ["Báo cáo riêng Kiểm toán / Soát xét", "", "", "", ""],
                ["Báo cáo hợp nhất", "", '<a href="#">PDF</a><br>28/07/2025', "", ""],
                ["Báo cáo riêng", "", '<a href="#">PDF</a><br>28/07/2025', "", ""]
            ]
        },
        "2024": {
            title: "BÁO CÁO TÀI CHÍNH",
            rows: [
                ["Báo cáo hợp nhất", "", "", "", ""],
                ["Báo cáo riêng", "", "", "", ""],
                ["Báo cáo Quý 1", '<a href="#">PDF</a><br>15/04/2024', "", "", ""],
                ["Báo cáo Quý 2", "", '<a href="#">PDF</a><br>20/07/2024', "", ""]
            ]
        }
    };

    const reportBody = document.getElementById("reportBody");
    if (!reportBody) return;

    function renderTable(year) {
        const data = reports[year];
        if (!data) {
            reportBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;padding:40px;">
                        Chưa có dữ liệu năm ${year}
                    </td>
                </tr>
            `;
            return;
        }

        let html = `
            <tr class="section-title">
                <td>${data.title}</td>
                <td colspan="4"></td>
            </tr>
        `;

        data.rows.forEach(row => {
            html += `
                <tr>
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>${row[4]}</td>
                </tr>
            `;
        });

        reportBody.innerHTML = html;
    }

    const yearButtons = document.querySelectorAll(".year-filter button:not(.arrow)");
    yearButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            yearButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            renderTable(this.textContent.trim());
        });
    });

    renderTable("2026");
}

/* =====================================================
BACK TO TOP BUTTON
===================================================== */
function initBackToTop() {
    // Tạo nút và inject vào body
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Về đầu trang');
    btn.title = 'Về đầu trang';
    btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    document.body.appendChild(btn);

    // Hiện/ẩn nút theo vị trí cuộn
    function toggleVisibility() {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // Kiểm tra ngay lần đầu

    // Cuộn về đầu trang khi click
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* =====================================================
INITIALIZATION
===================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Tải toàn bộ các component HTML động
    await loadAllComponents();

    // 2. Cân chỉnh đường dẫn theo data-root và tô sáng link hiện tại
    adjustLinks();
    highlightActiveLink();

    // 3. Khởi tạo tất cả chức năng cho trang
    initHeaderScroll();
    initMobileNav();
    initSearchModal();
    initHeroSlider();
    initStatsCounter();
    initEcosystemSwiper();
    initLogoInteraction();
    initAbilityTabs();
    initProjectShowcase();
    initNewsSwiper();
    initPartnerSwiper();
    initHistoryTimeline();
    initTeamSlider();
    initVisionHover();
    initBenefitSwiper();
    initServiceDetailSlider();
    initReportTabs();
    initYearFilter();
    initReportTable();
    initBackToTop();
});