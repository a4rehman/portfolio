// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Simple mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.right = '20px';
            navLinks.style.background = 'var(--bg-navy)';
            navLinks.style.padding = '20px';
            navLinks.style.borderRadius = '10px';
            navLinks.style.border = '1px solid #333';
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
 * Public Key: E9IkrYo8s2nqwsS7R
 * Service ID: service_y4r1pxo
 * Contact Template: template_zgz0g1c
 * Visit Template: template_gp8y77k
 */

// 1. Visit Notification (Only once per session)
async function sendVisitNotification() {
    try {
        // Stop if already notified in this session
        if (sessionStorage.getItem('visit_notified')) return;

        const ipResponse = await fetch("https://ipapi.co/json/");
        if (!ipResponse.ok) throw new Error("IP API unreachable");
        const data = await ipResponse.json();

        await emailjs.send("service_y4r1pxo", "template_gp8y77k", {
            visitor_ip: data.ip || "Unknown",
            visitor_city: data.city || "Unknown",
            visitor_country: data.country_name || "Unknown",
            visitor_region: data.region || "Unknown",
            visitor_org: data.org || "Unknown"
        });

        console.log("Visit alert sent!");
        sessionStorage.setItem('visit_notified', 'true');

    } catch (e) {
        console.error('Tracking system error:', e);
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
            await emailjs.sendForm("service_y4r1pxo", "template_zgz0g1c", this);

            // Fetch IP data in the background (don't let failure here block the success message)
            try {
                const ipData = await fetch("https://ipapi.co/json/");
                const data = await ipData.json();

                // Send secondary tracking notification
                await emailjs.send("service_y4r1pxo", "template_gp8y77k", {
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
