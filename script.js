// site.js
// Only essentials. No SPA. No page hiding. No remote dependencies.

// Scroll to top button (optional, remove if not needed)
document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('backToTopBtn');
    if (btn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
        btn.onclick = function() {
            window.scrollTo({top: 0, behavior: 'smooth'});
        };
    }

    // Simple mobile menu (for nav if you implement a toggle)
    var navToggle = document.getElementById('nav-toggle');
    var navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });
    }
});

// Quiz logic (if you keep it as a static form)
function handleQuizSubmit(form, resultContainerId) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var data = new FormData(form);
        var score = 0;
        for (var value of data.values()) {
            score += parseInt(value, 10) || 0;
        }
        var resultMsg;
        if (score <= 4) {
            resultMsg = "You're at the beginning of your AI path. This is the perfect time to build a strong foundation.";
        } else if (score <= 7) {
            resultMsg = "You have a solid base! Now is the time to refine your strategy and accelerate adoption.";
        } else {
            resultMsg = "You're well on your way to AI fluency!";
        }
        var container = document.getElementById(resultContainerId);
        if (container) {
            container.innerHTML = '<p>' + resultMsg + '</p>';
            container.style.display = 'block';
        }
    });
}
// Example usage: handleQuizSubmit(document.getElementById('aiQuiz'), 'quiz-results');

// Fallback for JotForm iframe if blocked
document.addEventListener('DOMContentLoaded', function() {
    var jf = document.getElementById('JotFormIFrame-251755448879072');
    if (jf) {
        jf.onerror = function() {
            var parent = jf.parentNode;
            var fallback = document.createElement('div');
            fallback.innerHTML = '<p>Unable to load the contact form. Please email <a href="mailto:JimPerry@happyaipath.com">JimPerry@happyaipath.com</a>.</p>';
            parent.appendChild(fallback);
        };
    }
});
