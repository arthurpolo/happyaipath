<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2575.6">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; min-height: 14.0px}
  </style>
</head>
<body>
<p class="p1">document.addEventListener('DOMContentLoaded', () =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">    </span>// --- Caching DOM Elements ---</p>
<p class="p1"><span class="Apple-converted-space">    </span>const pages = document.querySelectorAll('.page');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const mobileMenu = document.getElementById('mobile-menu');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const quizForm = document.getElementById('aiQuiz');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const quizResultsContainer = document.getElementById('quiz-results');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const backToTopBtn = document.getElementById('backToTopBtn');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const cookieBanner = document.getElementById('cookie-banner');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const moreDropdown = document.getElementById('more-dropdown');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const moreDropdownMenu = document.getElementById('more-dropdown-menu');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const siteWrapper = document.getElementById('site-wrapper');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const splashScreen = document.getElementById('splash-screen');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const guideLinks = document.querySelectorAll('.guide-content a[href^="#"]');</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>// --- Page Navigation Logic ---</p>
<p class="p1"><span class="Apple-converted-space">    </span>const showPage = (pageId) =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">        </span>pages.forEach(page =&gt; page.classList.remove('active'));</p>
<p class="p1"><span class="Apple-converted-space">        </span>const targetPage = document.getElementById(pageId);</p>
<p class="p1"><span class="Apple-converted-space">        </span>if (targetPage) {</p>
<p class="p1"><span class="Apple-converted-space">            </span>targetPage.classList.add('active');</p>
<p class="p1"><span class="Apple-converted-space">        </span>}</p>
<p class="p1"><span class="Apple-converted-space">        </span>window.scrollTo(0, 0);</p>
<p class="p1"><span class="Apple-converted-space">    </span>};</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>const closeMobileMenu = () =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">        </span>if (!mobileMenu.classList.contains('hidden')) {</p>
<p class="p1"><span class="Apple-converted-space">            </span>mobileMenu.classList.add('hidden');</p>
<p class="p1"><span class="Apple-converted-space">        </span>}</p>
<p class="p1"><span class="Apple-converted-space">    </span>};</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>// --- Event Delegation for Clicks ---</p>
<p class="p1"><span class="Apple-converted-space">    </span>document.body.addEventListener('click', (e) =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">        </span>const target = e.target;</p>
<p class="p1"><span class="Apple-converted-space">        </span>const link = target.closest('a');</p>
<p class="p1"><span class="Apple-converted-space">        </span>const button = target.closest('button');</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>// Handle Page-Switching Links &amp; Buttons with data-page attribute</p>
<p class="p1"><span class="Apple-converted-space">        </span>const pageTarget = target.closest('[data-page]');</p>
<p class="p1"><span class="Apple-converted-space">        </span>if (pageTarget) {</p>
<p class="p1"><span class="Apple-converted-space">            </span>e.preventDefault();</p>
<p class="p1"><span class="Apple-converted-space">            </span>showPage(pageTarget.dataset.page);</p>
<p class="p1"><span class="Apple-converted-space">            </span>closeMobileMenu();</p>
<p class="p1"><span class="Apple-converted-space">            </span>return; // Stop further execution</p>
<p class="p1"><span class="Apple-converted-space">        </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>// Handle In-Page Anchor Links (nav-link)</p>
<p class="p1"><span class="Apple-converted-space">        </span>if (link &amp;&amp; link.classList.contains('nav-link')) {</p>
<p class="p1"><span class="Apple-converted-space">            </span>e.preventDefault();</p>
<p class="p1"><span class="Apple-converted-space">            </span>showPage('home');</p>
<p class="p1"><span class="Apple-converted-space">            </span>setTimeout(() =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">                </span>const targetSection = document.querySelector(link.getAttribute('href'));</p>
<p class="p1"><span class="Apple-converted-space">                </span>if (targetSection) {</p>
<p class="p1"><span class="Apple-converted-space">                    </span>targetSection.scrollIntoView({ behavior: 'smooth' });</p>
<p class="p1"><span class="Apple-converted-space">                </span>}</p>
<p class="p1"><span class="Apple-converted-space">                </span>closeMobileMenu();</p>
<p class="p1"><span class="Apple-converted-space">            </span>}, 0);</p>
<p class="p1"><span class="Apple-converted-space">            </span>return;</p>
<p class="p1"><span class="Apple-converted-space">        </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>// Handle Guide Page Internal Links</p>
<p class="p1"><span class="Apple-converted-space">        </span>if (link &amp;&amp; guideLinks) {</p>
<p class="p1"><span class="Apple-converted-space">             </span>const href = link.getAttribute('href');</p>
<p class="p1"><span class="Apple-converted-space">             </span>if (href &amp;&amp; href.startsWith('#')) {</p>
<p class="p1"><span class="Apple-converted-space">                 </span>const parentGuide = link.closest('.guide-content');</p>
<p class="p1"><span class="Apple-converted-space">                 </span>if(parentGuide){</p>
<p class="p1"><span class="Apple-converted-space">                    </span>e.preventDefault();</p>
<p class="p1"><span class="Apple-converted-space">                    </span>const targetElement = document.getElementById(href.substring(1));</p>
<p class="p1"><span class="Apple-converted-space">                    </span>if (targetElement) {</p>
<p class="p1"><span class="Apple-converted-space">                        </span>targetElement.scrollIntoView({ behavior: 'smooth' });</p>
<p class="p1"><span class="Apple-converted-space">                    </span>}</p>
<p class="p1"><span class="Apple-converted-space">                 </span>}</p>
<p class="p1"><span class="Apple-converted-space">             </span>}</p>
<p class="p1"><span class="Apple-converted-space">        </span>}</p>
<p class="p2"><span class="Apple-converted-space">        </span></p>
<p class="p1"><span class="Apple-converted-space">        </span>// Handle Buttons by ID</p>
<p class="p1"><span class="Apple-converted-space">        </span>if (button) {</p>
<p class="p1"><span class="Apple-converted-space">            </span>switch (button.id) {</p>
<p class="p1"><span class="Apple-converted-space">                </span>case 'mobile-menu-button':</p>
<p class="p1"><span class="Apple-converted-space">                    </span>mobileMenu.classList.toggle('hidden');</p>
<p class="p1"><span class="Apple-converted-space">                    </span>break;</p>
<p class="p1"><span class="Apple-converted-space">                </span>case 'backToTopBtn':</p>
<p class="p1"><span class="Apple-converted-space">                     </span>window.scrollTo({top: 0, behavior: 'smooth'});</p>
<p class="p1"><span class="Apple-converted-space">                    </span>break;</p>
<p class="p1"><span class="Apple-converted-space">                </span>case 'cookie-accept':</p>
<p class="p1"><span class="Apple-converted-space">                    </span>handleCookieConsent(true);</p>
<p class="p1"><span class="Apple-converted-space">                    </span>break;</p>
<p class="p1"><span class="Apple-converted-space">                </span>case 'cookie-reject':</p>
<p class="p1"><span class="Apple-converted-space">                    </span>handleCookieConsent(false);</p>
<p class="p1"><span class="Apple-converted-space">                    </span>break;</p>
<p class="p1"><span class="Apple-converted-space">            </span>}</p>
<p class="p1"><span class="Apple-converted-space">        </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>// Handle Dropdown Menu</p>
<p class="p1"><span class="Apple-converted-space">        </span>if (moreDropdown &amp;&amp; moreDropdown.contains(target)) {</p>
<p class="p1"><span class="Apple-converted-space">            </span>moreDropdownMenu.classList.toggle('hidden');</p>
<p class="p1"><span class="Apple-converted-space">        </span>} else if(moreDropdownMenu &amp;&amp; !moreDropdownMenu.classList.contains('hidden')) {</p>
<p class="p1"><span class="Apple-converted-space">            </span>moreDropdownMenu.classList.add('hidden');</p>
<p class="p1"><span class="Apple-converted-space">        </span>}</p>
<p class="p1"><span class="Apple-converted-space">    </span>});</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>// --- Quiz Logic ---</p>
<p class="p1"><span class="Apple-converted-space">    </span>if (quizForm) {</p>
<p class="p1"><span class="Apple-converted-space">        </span>quizForm.addEventListener('submit', (e) =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">            </span>e.preventDefault();</p>
<p class="p1"><span class="Apple-converted-space">            </span>const formData = new FormData(quizForm);</p>
<p class="p1"><span class="Apple-converted-space">            </span>let score = 0;</p>
<p class="p1"><span class="Apple-converted-space">            </span>for (const value of formData.values()) {</p>
<p class="p1"><span class="Apple-converted-space">                </span>score += parseInt(value, 10) || 0;</p>
<p class="p1"><span class="Apple-converted-space">            </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">            </span>let resultMessage = '';</p>
<p class="p1"><span class="Apple-converted-space">            </span>if (score &lt;= 4) {</p>
<p class="p1"><span class="Apple-converted-space">                </span>resultMessage = "You're at the beginning of your AI path. This is the perfect time to build a strong foundation. My coaching can help chart your course.";</p>
<p class="p1"><span class="Apple-converted-space">            </span>} else if (score &lt;= 7) {</p>
<p class="p1"><span class="Apple-converted-space">                </span>resultMessage = "You have a solid base! Now is the time to refine your strategy and accelerate adoption. My training and coaching can provide the targeted guidance you need.";</p>
<p class="p1"><span class="Apple-converted-space">            </span>} else {</p>
<p class="p1"><span class="Apple-converted-space">                </span>resultMessage = "You're well on your way to AI fluency! My executive coaching can help you optimize your strategy and lead your team to the next level of innovation.";</p>
<p class="p1"><span class="Apple-converted-space">            </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">            </span>quizResultsContainer.innerHTML = `&lt;p class="text-lg text-gray-800"&gt;${resultMessage}&lt;/p&gt; &lt;a href="#contact" class="nav-link mt-4 inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg text-base cta-button"&gt;Schedule a Consultation&lt;/a&gt;`;</p>
<p class="p1"><span class="Apple-converted-space">            </span>quizResultsContainer.classList.remove('hidden');</p>
<p class="p1"><span class="Apple-converted-space">        </span>});</p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>// --- Back to Top Button Scroll Listener ---</p>
<p class="p1"><span class="Apple-converted-space">    </span>window.addEventListener('scroll', () =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">        </span>if (document.body.scrollTop &gt; 100 || document.documentElement.scrollTop &gt; 100) {</p>
<p class="p1"><span class="Apple-converted-space">            </span>backToTopBtn.style.display = "block";</p>
<p class="p1"><span class="Apple-converted-space">        </span>} else {</p>
<p class="p1"><span class="Apple-converted-space">            </span>backToTopBtn.style.display = "none";</p>
<p class="p1"><span class="Apple-converted-space">        </span>}</p>
<p class="p1"><span class="Apple-converted-space">    </span>});</p>
<p class="p2"><span class="Apple-converted-space">    </span></p>
<p class="p1"><span class="Apple-converted-space">    </span>// --- Scroll Animation Logic ---</p>
<p class="p1"><span class="Apple-converted-space">    </span>const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');</p>
<p class="p1"><span class="Apple-converted-space">    </span>const observer = new IntersectionObserver((entries) =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">        </span>entries.forEach(entry =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">            </span>if (entry.isIntersecting) {</p>
<p class="p1"><span class="Apple-converted-space">                </span>entry.target.classList.add('is-visible');</p>
<p class="p1"><span class="Apple-converted-space">            </span>}</p>
<p class="p1"><span class="Apple-converted-space">        </span>});</p>
<p class="p1"><span class="Apple-converted-space">    </span>}, { threshold: 0.1 });</p>
<p class="p1"><span class="Apple-converted-space">    </span>sectionsToAnimate.forEach(section =&gt; observer.observe(section));</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>// --- Cookie Banner Logic ---</p>
<p class="p1"><span class="Apple-converted-space">    </span>const handleCookieConsent = (consent) =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">        </span>localStorage.setItem('cookie_consent', consent.toString());</p>
<p class="p1"><span class="Apple-converted-space">        </span>cookieBanner.classList.remove('show');</p>
<p class="p1"><span class="Apple-converted-space">    </span>};</p>
<p class="p1"><span class="Apple-converted-space">    </span>if (!localStorage.getItem('cookie_consent')) {</p>
<p class="p1"><span class="Apple-converted-space">        </span>cookieBanner.classList.add('show');</p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>// --- Universal Splash Screen Logic ---</p>
<p class="p1"><span class="Apple-converted-space">    </span>const showSiteContent = () =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">        </span>splashScreen.style.display = 'none';</p>
<p class="p1"><span class="Apple-converted-space">        </span>siteWrapper.style.display = 'block';</p>
<p class="p1"><span class="Apple-converted-space">        </span>showPage('home');</p>
<p class="p1"><span class="Apple-converted-space">    </span>};</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>// Set a timer to show the content regardless of browser environment</p>
<p class="p1"><span class="Apple-converted-space">    </span>setTimeout(showSiteContent, 2500); // Guarantees the site will load after 2.5 seconds</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>// --- Initial Setup ---</p>
<p class="p1"><span class="Apple-converted-space">    </span>showPage('home');</p>
<p class="p1">});</p>
</body>
</html>
