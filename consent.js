(() => {
    const GA_ID = 'G-T4QRVGGY9L';
    const STORAGE_KEY = 'happy_ai_path_cookie_consent';
    const GPC_CHOICE = 'global_privacy_control';

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };

    window.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
    });

    const safeStorage = {
        get(key) {
            try {
                return window.localStorage.getItem(key);
            } catch (error) {
                return null;
            }
        },
        set(key, value) {
            try {
                window.localStorage.setItem(key, value);
            } catch (error) {
                return false;
            }
            return true;
        }
    };

    const hasGlobalPrivacyControl = () => window.navigator.globalPrivacyControl === true;

    const loadGoogleAnalytics = () => {
        if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)) {
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script);

        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
    };

    const updateConsent = (choice) => {
        const granted = choice === 'accepted' && !hasGlobalPrivacyControl();
        window.gtag('consent', 'update', {
            ad_storage: granted ? 'granted' : 'denied',
            ad_user_data: granted ? 'granted' : 'denied',
            ad_personalization: granted ? 'granted' : 'denied',
            analytics_storage: granted ? 'granted' : 'denied'
        });

        if (granted) {
            loadGoogleAnalytics();
        }
    };

    const ensureBanner = () => {
        let banner = document.getElementById('cookie-banner');
        if (banner) return banner;

        banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-inner">
                <p class="text-sm">We use optional Google Analytics cookies only if you accept them. Reject keeps analytics off. <a href="privacy.html">Privacy notice</a></p>
                <div class="cookie-banner-actions">
                    <button id="cookie-accept" class="cookie-button cookie-button-accept" type="button">Accept</button>
                    <button id="cookie-reject" class="cookie-button cookie-button-reject" type="button">Reject</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
        return banner;
    };

    const showBanner = () => {
        const banner = ensureBanner();
        const acceptButton = document.getElementById('cookie-accept');
        const rejectButton = document.getElementById('cookie-reject');

        if (hasGlobalPrivacyControl()) {
            safeStorage.set(STORAGE_KEY, GPC_CHOICE);
            updateConsent(GPC_CHOICE);
            banner.querySelector('.text-sm').innerHTML = 'Your browser is sending a Global Privacy Control opt-out signal, so optional analytics remains off. <a href="privacy.html">Privacy notice</a>';
            banner.classList.add('show');
            acceptButton?.setAttribute('disabled', 'disabled');
            rejectButton?.addEventListener('click', () => banner.classList.remove('show'), { once: true });
            return;
        }

        acceptButton?.removeAttribute('disabled');
        banner.classList.add('show');

        const handleChoice = (choice) => {
            safeStorage.set(STORAGE_KEY, choice);
            updateConsent(choice);
            banner.classList.remove('show');
        };

        acceptButton?.addEventListener('click', () => handleChoice('accepted'), { once: true });
        rejectButton?.addEventListener('click', () => handleChoice('rejected'), { once: true });
    };

    const setupBanner = () => {
        document.addEventListener('click', (event) => {
            if (event.target.closest('[data-privacy-choices]')) {
                event.preventDefault();
                showBanner();
            }
        });

        if (hasGlobalPrivacyControl()) {
            safeStorage.set(STORAGE_KEY, GPC_CHOICE);
            updateConsent(GPC_CHOICE);
            return;
        }

        const savedChoice = safeStorage.get(STORAGE_KEY);
        if (savedChoice === 'accepted' || savedChoice === 'rejected' || savedChoice === GPC_CHOICE) {
            updateConsent(savedChoice);
            return;
        }

        showBanner();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupBanner, { once: true });
    } else {
        setupBanner();
    }
})();
