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
    const nameInput = contactForm.querySelector('[name="user_name"]');
    const emailInput = contactForm.querySelector('[name="user_email"]');
    const messageInput = contactForm.querySelector('[name="message"]');
    const status = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const inputs = [nameInput, emailInput, messageInput].filter(Boolean);

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setStatus(message, type) {
        if (!status) return;
        status.textContent = message;
        status.className = 'form-status' + (type ? ' ' + type : '');
    }

    function validateField(field) {
        const value = (field.value || '').trim();
        const group = field.closest('.form-group');
        let valid = true;

        if (field.name === 'user_name') {
            valid = value.length >= 2;
        } else if (field.name === 'user_email') {
            valid = EMAIL_RE.test(value);
        } else if (field.name === 'message') {
            valid = value.length >= 10;
        }

        if (group) group.classList.toggle('invalid', !valid);
        return valid;
    }

    // Live validation feedback
    inputs.forEach(field => {
        field.addEventListener('input', () => {
            const group = field.closest('.form-group');
            if (group) group.classList.remove('invalid');
            if (status && status.className === 'form-status error') setStatus('');
        });
        field.addEventListener('blur', () => validateField(field));
    });

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        setStatus('');

        // Validate every field before submitting
        let firstInvalid = null;
        inputs.forEach(field => {
            const valid = validateField(field);
            if (!valid && !firstInvalid) firstInvalid = field;
        });

        if (firstInvalid) {
            setStatus('Please correct the highlighted fields and try again.', 'error');
            firstInvalid.focus();
            return;
        }

        // Only send if EmailJS service credentials are configured (build-time placeholders)
        const serviceId = "__EMAILJS_SERVICE_ID__";
        const templateId = "__EMAILJS_CONTACT_TEMPLATE__";
        const configured = serviceId && !serviceId.startsWith('__') &&
            templateId && !templateId.startsWith('__') &&
            typeof emailjs !== 'undefined';

        if (!configured) {
            setStatus('The contact service is not connected yet. Please email me directly at a4rehman.ai@gmail.com.', 'error');
            return;
        }

        if (submitBtn) submitBtn.disabled = true;
        setStatus('Sending your message...', 'sending');

        try {
            // Send the message first so it definitely goes through
            await emailjs.sendForm(serviceId, templateId, contactForm);

            // Fetch IP data in the background (failure here never blocks the success message)
            try {
                const ipData = await fetch("https://ipapi.co/json/");
                const data = await ipData.json();

                await emailjs.send("__EMAILJS_SERVICE_ID__", "__EMAILJS_VISIT_TEMPLATE__", {
                    visitor_ip: data.ip,
                    visitor_city: data.city,
                    visitor_country: data.country_name,
                    visitor_name: nameInput ? nameInput.value.trim() : ''
                });
            } catch (ipErr) {
                console.warn("IP tracking failed, but the message was sent.", ipErr);
            }

            setStatus('Message sent successfully! I\u2019ll get back to you within 24 hours.', 'success');
            contactForm.reset();
            inputs.forEach(field => {
                const group = field.closest('.form-group');
                if (group) group.classList.remove('invalid');
            });
        } catch (err) {
            console.error("EmailJS Error details:", err);
            const detail = (err && (err.text || err.message)) || 'Something went wrong. Please try again.';
            setStatus('Failed to send your message. ' + detail, 'error');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
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
