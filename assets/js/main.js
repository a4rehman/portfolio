// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });
}

// Hero entrance animation
const heroEntrance = document.querySelector('.hero-entrance');
if (!heroEntrance) {
    const heroWrapper = document.querySelector('.hero-wrapper-full');
    if (heroWrapper) heroWrapper.classList.add('hero-entrance');
}

// Simple mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle icon
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
}

// Counter Animation
const counters = document.querySelectorAll('.counter');

if (counters.length > 0) {
    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Function to Toggle Projects (Expand/Collapse)
function toggleProjects(button) {
    const section = button.closest('.project-category-section');
    const hiddenProjects = section.querySelectorAll('.hidden-project');
    const isExpanding = button.innerText.includes('More');

    if (isExpanding) {
        hiddenProjects.forEach(project => {
            project.style.display = 'flex';
            setTimeout(() => {
                project.classList.add('show');
            }, 10);
        });
        button.innerText = 'View Less';
    } else {
        hiddenProjects.forEach(project => {
            project.classList.remove('show');
            setTimeout(() => {
                project.style.display = 'none';
            }, 500); // Wait for CSS transition
        });
        button.innerText = 'View More';
        // Scroll back to category title
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Function to Toggle Certifications (Expand/Collapse)
function toggleCerts(button) {
    const section = button.closest('.cert-category-section');
    const hiddenCerts = section.querySelectorAll('.hidden-cert');
    const isExpanding = button.innerText.includes('More');

    if (isExpanding) {
        hiddenCerts.forEach(cert => {
            cert.style.display = 'flex';
            setTimeout(() => {
                cert.classList.add('show');
            }, 10);
        });
        button.innerText = 'View Less';
    } else {
        hiddenCerts.forEach(cert => {
            cert.classList.remove('show');
            setTimeout(() => {
                cert.style.display = 'none';
            }, 500); // Wait for CSS transition
        });
        button.innerText = 'View More';
        // Scroll back to category title
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
// Function to Trigger Resume Download (Robust Blob-based approach)
async function downloadResume(event) {
    if (event) event.preventDefault();

    const resumePath = 'assets/docs/resume.pdf';
    const fileName = 'Abdul_Rehman_AI_Engineer_Resume.pdf';

    // Optional: Notify on Resume Download
    // notifyEvent('Resume Downloaded');

    try {
        // Try fetching as a blob to force download dialog
        const response = await fetch(resumePath);
        if (!response.ok) throw new Error('Fetch failed');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);
    } catch (error) {
        // Fallback for local file:// protocol or fetch failures
        const a = document.createElement('a');
        a.href = resumePath;
        a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    return false;
}

/**
 * EMAILJS INTEGRATION
 * Public Key: __EMAILJS_PUBLIC_KEY__
 * Service ID: __EMAILJS_SERVICE_ID__
 * Contact Template: __EMAILJS_CONTACT_TEMPLATE__
 * Visit Template: __EMAILJS_VISIT_TEMPLATE__
 */

// 1. Visit Notification (Only once per session)
async function sendVisitNotification() {
    try {
        const serviceId = "__EMAILJS_SERVICE_ID__";
        const templateId = "__EMAILJS_VISIT_TEMPLATE__";

        // Only run if real EmailJS service credentials are configured and not placeholders
        if (!serviceId || serviceId.startsWith('__') || typeof emailjs === 'undefined') return;

        // Stop if already notified in this session
        if (sessionStorage.getItem('visit_notified')) return;

        const ipResponse = await fetch("https://ipapi.co/json/");
        if (!ipResponse.ok) throw new Error("IP API unreachable");
        const data = await ipResponse.json();

        await emailjs.send(serviceId, templateId, {
            visitor_ip: data.ip || "Unknown",
            visitor_city: data.city || "Unknown",
            visitor_country: data.country_name || "Unknown",
            visitor_region: data.region || "Unknown",
            visitor_org: data.org || "Unknown"
        });

        console.log("Visit alert sent!");
        sessionStorage.setItem('visit_notified', 'true');

    } catch (e) {
        console.warn('Visitor tracking skipped:', e.message || e);
    }
}

// 2. Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const status = document.getElementById('form-status');
        const btn = contactForm.querySelector('button');

        if (status) {
            status.style.display = 'block';
            status.innerHTML = '<span style="color: #38bdf8;">Sending...</span>';
        }
        btn.disabled = true;

        try {
            // Send main contact form FIRST so it definitely goes through
            await emailjs.sendForm("__EMAILJS_SERVICE_ID__", "__EMAILJS_CONTACT_TEMPLATE__", this);

            // Fetch IP data in the background (don't let failure here block the success message)
            try {
                const ipData = await fetch("https://ipapi.co/json/");
                const data = await ipData.json();

                // Send secondary tracking notification
                await emailjs.send("__EMAILJS_SERVICE_ID__", "__EMAILJS_VISIT_TEMPLATE__", {
                    visitor_ip: data.ip,
                    visitor_city: data.city,
                    visitor_country: data.country_name,
                    visitor_name: contactForm.querySelector('[name="user_name"]').value
                });
            } catch (ipErr) {
                console.warn("IP Tracking failed, but message was sent.", ipErr);
            }

            if (status) {
                status.innerHTML = '<span style="color: #10b981;">Message sent successfully!</span>';
            } else {
                alert("Message Sent Successfully");
            }
            contactForm.reset();
        } catch (err) {
            console.error("EmailJS Error details:", err);
            if (status) {
                const errorMsg = err.text || err.message || "Please check your EmailJS dashboard settings.";
                status.innerHTML = `<span style="color: #ef4444;">Error: ${errorMsg}</span>`;
            }
        } finally {
            btn.disabled = false;
            if (status) {
                setTimeout(() => { status.style.display = 'none'; }, 5000);
            }
        }
    });
}

// Initialize on load
window.addEventListener('load', sendVisitNotification);

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

// Observe all reveal elements
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
});

// Auto-add reveal class to sections for animation
function initScrollAnimations() {
    const sections = document.querySelectorAll(
        '.impact-section, .capabilities-section, .case-study-section, ' +
        '.project-category-section, .project-editorial, ' +
        '.experience-grid, .cert-grid, .skills-grid, ' +
        '.contact-info-grid, .education-resume-container, ' +
        '.blog-grid, .blog-list, .footer'
    );

    sections.forEach(section => {
        if (!section.classList.contains('reveal') && !section.querySelector('.reveal')) {
            section.classList.add('reveal');
            revealObserver.observe(section);
        }
    });

    // Stagger children in grids
    const grids = document.querySelectorAll('.impact-grid, .capabilities-grid, .case-study-flow, .grid-container');
    grids.forEach(grid => {
        grid.classList.add('stagger-children');
        grid.querySelectorAll(':scope > *').forEach(child => {
            if (!child.classList.contains('reveal')) {
                child.classList.add('reveal');
                revealObserver.observe(child);
            }
        });
    });
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}
