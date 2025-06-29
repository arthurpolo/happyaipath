document.addEventListener('DOMContentLoaded', () => {
    // --- Caching DOM Elements ---
    const pages = document.querySelectorAll('.page');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const quizForm = document.getElementById('aiQuiz');
    const quizResultsContainer = document.getElementById('quiz-results');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const cookieBanner = document.getElementById('cookie-banner');
    const moreDropdown = document.getElementById('more-dropdown');
    const moreDropdownMenu = document.getElementById('more-dropdown-menu');
    const siteWrapper = document.getElementById('site-wrapper');
    const splashScreen = document.getElementById('splash-screen');
    const guideLinks = document.querySelectorAll('.guide-content a[href^="#"]');

    // --- Page Navigation Logic ---
    const showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        window.scrollTo(0, 0);
    };

    const closeMobileMenu = () => {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    };

    // --- Event Delegation for Clicks ---
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        const link = target.closest('a');
        const button = target.closest('button');

        // Handle Page-Switching Links & Buttons with data-page attribute
        const pageTarget = target.closest('[data-page]');
        if (pageTarget) {
            e.preventDefault();
            showPage(pageTarget.dataset.page);
            closeMobileMenu();
            return; // Stop further execution
        }

        // Handle In-Page Anchor Links (nav-link)
        if (link && link.classList.contains('nav-link')) {
            e.preventDefault();
            showPage('home');
            setTimeout(() => {
                const targetSection = document.querySelector(link.getAttribute('href'));
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
                closeMobileMenu();
            }, 0);
            return;
        }

        // Handle Guide Page Internal Links
        if (link && guideLinks) {
             const href = link.getAttribute('href');
             if (href && href.startsWith('#')) {
                 const parentGuide = link.closest('.guide-content');
                 if(parentGuide){
                     e.preventDefault();
                     const targetElement = document.getElementById(href.substring(1));
                     if (targetElement) {
                         targetElement.scrollIntoView({ behavior: 'smooth' });
                     }
                 }
             }
        }
        
        // Handle Buttons by ID
        if (button) {
            switch (button.id) {
                case 'mobile-menu-button':
                    mobileMenu.classList.toggle('hidden');
                    break;
                case 'backToTopBtn':
                     window.scrollTo({top: 0, behavior: 'smooth'});
                    break;
                case 'cookie-accept':
                    handleCookieConsent(true);
                    break;
                case 'cookie-reject':
                    handleCookieConsent(false);
                    break;
            }
        }

        // Handle Dropdown Menu
        if (moreDropdown && moreDropdown.contains(target)) {
            moreDropdownMenu.classList.toggle('hidden');
        } else if(moreDropdownMenu && !moreDropdownMenu.classList.contains('hidden')) {
            moreDropdownMenu.classList.add('hidden');
        }
    });

    // --- Quiz Logic ---
    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(quizForm);
            let score = 0;
            for (const value of formData.values()) {
                score += parseInt(value, 10) || 0;
            }

            let resultMessage = '';
            if (score <= 4) {
                resultMessage = "You're at the beginning of your AI path. This is the perfect time to build a strong foundation. My coaching can help chart your course.";
            } else if (score <= 7) {
                resultMessage = "You have a solid base! Now is the time to refine your strategy and accelerate adoption. My training and coaching can provide the targeted guidance you need.";
            } else {
                resultMessage = "You're well on your way to AI fluency! My executive coaching can help you optimize your strategy and lead your team to the next level of innovation.";
            }

            quizResultsContainer.innerHTML = `<p class="text-lg text-gray-800">${resultMessage}</p> <a href="#contact" class="nav-link mt-4 inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg text-base cta-button">Schedule a Consultation</a>`;
            quizResultsContainer.classList.remove('hidden');
        });
    }

    // --- Back to Top Button Scroll Listener ---
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });
    
    // --- Scroll Animation Logic ---
    const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    sectionsToAnimate.forEach(section => observer.observe(section));

    // --- Cookie Banner Logic ---
    const handleCookieConsent = (consent) => {
        localStorage.setItem('cookie_consent', consent.toString());
        cookieBanner.classList.remove('show');
    };
    if (!localStorage.getItem('cookie_consent')) {
        cookieBanner.classList.add('show');
    }

    // --- Splash Screen Logic ---
    const isWebView = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        const webViewKeywords = ['linkedin', 'fbav', 'fban', 'twitter', 'wv'];
        return webViewKeywords.some(keyword => userAgent.includes(keyword));
    };

    if (isWebView()) {
        splashScreen.style.display = 'none';
        siteWrapper.style.visibility = 'visible';
    } else {
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            siteWrapper.style.visibility = 'visible';
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 1000); 
        }, 2000);
    }

    // --- Initial Setup ---
    showPage('home');
});
