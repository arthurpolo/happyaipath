document.addEventListener('DOMContentLoaded', () => {

    // --- Force page to top on reload, overriding browser's jump-to-hash behavior ---
    // This is the key fix for the issue you discovered.
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- Caching DOM Elements ---
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const cookieBanner = document.getElementById('cookie-banner');
    const siteWrapper = document.getElementById('site-wrapper');
    const splashScreen = document.getElementById('splash-screen');
    const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const navLinks = document.querySelectorAll('.nav-link');
    const moreDropdownButton = document.getElementById('more-dropdown-button');
    const moreDropdownMenu = document.getElementById('more-dropdown-menu');
    const quizForm = document.getElementById('aiQuiz');
    const quizResultsContainer = document.getElementById('quiz-results');

    // --- Splash Screen & Initial Load Logic ---
    const showSiteContent = () => {
        if (splashScreen) {
            splashScreen.style.opacity = '0';
            // Wait for fade out animation to finish
            setTimeout(() => {
                splashScreen.style.display = 'none';
                if (siteWrapper) {
                    siteWrapper.classList.remove('hidden');
                }
                // After splash screen, check for a hash in the URL and smoothly scroll to it.
                const hash = window.location.hash;
                if (hash) {
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100); // Short delay to ensure the page layout is stable.
                    }
                }
            }, 750);
        }
    };
    // Set a timer to show the content
    setTimeout(showSiteContent, 2500);

    // --- Mobile Menu ---
    const closeMobileMenu = () => {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    };

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Smooth Scrolling for Nav Links ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Update URL hash without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
            closeMobileMenu();
        });
    });

    // --- Dropdown Menu Logic ---
    if (moreDropdownButton) {
        moreDropdownButton.addEventListener('click', (event) => {
            event.stopPropagation();
            moreDropdownMenu.classList.toggle('hidden');
        });
    }

    // --- Hide dropdown if clicking outside ---
    window.addEventListener('click', (event) => {
        if (moreDropdownMenu && !moreDropdownMenu.classList.contains('hidden')) {
            if (!moreDropdownButton.contains(event.target)) {
                moreDropdownMenu.classList.add('hidden');
            }
        }
    });

    // --- Back to Top Button ---
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Scroll Animation Logic (Intersection Observer) ---
    if (sectionsToAnimate.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        sectionsToAnimate.forEach(section => observer.observe(section));
    }

    // --- Cookie Banner Logic ---
    const handleCookieConsent = (consent) => {
        localStorage.setItem('cookie_consent', consent.toString());
        if (cookieBanner) cookieBanner.classList.remove('show');
    };

    if (cookieBanner) {
        if (!localStorage.getItem('cookie_consent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 3000);
        }
        document.getElementById('cookie-accept')?.addEventListener('click', () => handleCookieConsent(true));
        document.getElementById('cookie-reject')?.addEventListener('click', () => handleCookieConsent(false));
    }

    // --- AI Quiz Logic ---
    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(quizForm);
            let score = 0;
            if (formData.has('q1') && formData.has('q2') && formData.has('q3')) {
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
                if (quizResultsContainer) {
                    quizResultsContainer.innerHTML = `<p class="text-lg text-gray-900">${resultMessage}</p> <a href="#contact" class="nav-link mt-4 inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg text-base cta-button">Schedule a Consultation</a>`;
                    quizResultsContainer.classList.remove('hidden');
                    quizResultsContainer.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                if (quizResultsContainer) {
                    quizResultsContainer.innerHTML = `<p class="text-lg text-red-700 font-semibold">Please answer all questions to see your results.</p>`;
                    quizResultsContainer.classList.remove('hidden');
                }
            }
        });
    }
});