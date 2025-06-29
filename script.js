// script.js
// Minimal, non-SPA logic for a static site

// Back to top button logic
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

    // Quiz logic
    var form = document.getElementById('aiQuiz');
    var results = document.getElementById('quiz-results');
    if (form && results) {
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
            results.innerHTML = '<p>' + resultMsg + '</p>';
            results.style.display = 'block';
        });
    }

    // JotForm fallback if iframe fails
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
