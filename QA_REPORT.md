# Portfolio QA Audit Report

**Date:** September 17, 2026  
**Audited Target:** [Abdul Rehman - AI Engineer Portfolio](https://abdul-rehman-ai.vercel.app/)  
**Repository:** `a4rehman/portfolio` (`k:\portfolio_website\portfolio`)  
**Audit Mode:** AUDIT-ONLY MODE (Zero code modifications made during audit)  
**Lead Auditor:** Senior Principal Web Application & Systems QA Engineer

---

## Executive Summary

A comprehensive, production-grade QA audit of the portfolio website was conducted across all 8 static pages, 209 links, 15 buttons, 39 project cards, 12 image assets, responsive layouts (320px to 1920px), SEO configurations, accessibility markers, network requests, and external application integrations.

### Key Highlights:
- **Build & Architecture:** Static HTML5/CSS3/Vanilla JS with Node-based environment variable injection on Vercel deployment. The build process is clean with zero dependencies.
- **Critical Findings:**
  - **1 Broken GitHub Repository Link (HTTP 404):** `metal-vs-plastic-classifier-rehman` returns 404 on GitHub.
  - **1 Unauthorized Hugging Face Space (HTTP 401):** `house-price-prediction` space is private or unavailable.
  - **4 Project Metadata/Link Mismatches:** Multiple project cards on `projects.html` link to unrelated repositories/demos (e.g. Cash Optimization links to Real Estate House Price, Defect Detection links to Metal/Plastic, Recommendation Engine links to Posture Detection).
  - **Mobile Menu Glitch on `apps.html`:** Duplicate event listener on `.nav-toggle` breaks mobile drawer toggling.
  - **4 Inert/Dead Buttons on `blog.html`:** Article buttons are plain `<button>` tags without handlers or hyperlinks.
  - **Filter Count Mismatches on `apps.html`:** Hardcoded filter badge counts (e.g., `All (47)`, `Live Apps (15)`) conflict with the actual 39 project cards and cause UI count jumping upon interaction.
  - **SEO Heading Hierarchy Violations:** `expertise.html` contains multiple `<h1>` elements.

---

## Environment & Architecture

| Parameter | Specification |
|---|---|
| **Framework** | HTML5 / Vanilla CSS / Vanilla JavaScript |
| **Styling** | `assets/css/style.css` (33.2 KB), `assets/css/custom.css` (28.8 KB) |
| **Icons & Fonts** | FontAwesome 6.4.0 CDN, Inter / Outfit system fonts |
| **Hosting & CI/CD** | Vercel (`vercel.json`), `node build.js` variable injection |
| **Integrations** | EmailJS Browser SDK v3, Google Analytics (gtag.js), ipapi.co |
| **Node / Scripts** | `build.js` |

---

## Route Inventory

| Route | Type | Local Status | Production Status | Overall Result | Notes |
|---|---|---|---|---|---|
| `/` or `/index.html` | Page | 200 OK | 200 OK | **PASS** | Hero, Impact, Capabilities, Experience, Recognitions, Education |
| `/projects.html` | Page | 200 OK | 200 OK | **PASS\*** | 3 Featured Editorials + 12 Category Projects (Has link mismatches) |
| `/apps.html` | Page | 200 OK | 200 OK | **PASS\*** | 39 Projects with Live Search & Filter Bar (Has mobile toggle bug) |
| `/expertise.html` | Page | 200 OK | 200 OK | **PASS\*** | 8 Services, 8 Skill cards, 11 Credentials (Multiple H1s) |
| `/resume.html` | Page | 200 OK | 200 OK | **PASS** | Summary bar, actions, direct PDF download trigger |
| `/blog.html` | Page | 200 OK | 200 OK | **PASS\*** | 4 Articles listed (Dead buttons) |
| `/contact.html` | Page | 200 OK | 200 OK | **PASS** | Contact channels + EmailJS contact form |
| `/404.html` | Error Page | 200 OK | 200 OK | **PASS** | Custom 404 layout with navigation back home |
| `/invalid-path-test` | 404 Fallback | 404 Not Found | 404 (renders custom 404) | **PASS** | Vercel routing correctly handles non-existent paths |

---

## Navigation Audit

- **Desktop Navigation:** Links for Home, Projects, Apps, Expertise, Resume (downloads PDF), Blog, and Contact work smoothly across all pages. Active navigation states are properly highlighted.
- **Mobile Menu (`<nav-toggle>`):**
  - Works as expected on `index.html`, `projects.html`, `expertise.html`, `resume.html`, `blog.html`, `contact.html`, `404.html`.
  - **CRITICAL FAILURE ON `apps.html`:** `apps.html` includes an inline script (line 713) adding a second click listener to `.nav-toggle` while `main.js` (line 39) already attaches one. Clicking the hamburger icon triggers both listeners in sequence, immediately reversing the toggle state (menu flickers or fails to open).

---

## Button Audit

| Page | Button Label / Icon | Expected Action | Actual Behavior | Result |
|---|---|---|---|---|
| `index.html` | "View Selected Work" | Navigate to `projects.html` | Navigates to `projects.html` | **PASS** |
| `index.html` | "Download Resume" | Download `resume.pdf` | Blob download triggered | **PASS** |
| `index.html` | Social icons (GitHub, LinkedIn, Email) | Open profiles / mailto | Opens correct links in new tab | **PASS** |
| `projects.html` | "View More" (Data Science) | Expand hidden projects | Expands 3 cards, text becomes "View Less" | **PASS** |
| `projects.html` | "View Less" (Data Science) | Collapse & smooth scroll | Collapses cards & scrolls to section top | **PASS** |
| `projects.html` | "View More" (Agentic AI) | Expand hidden projects | Expands 3 cards, text becomes "View Less" | **PASS** |
| `expertise.html` | "View More Credentials" | Expand hidden cert cards | Expands 4 credentials, text switches | **PASS** |
| `apps.html` | Filter Buttons (All, Live, Desktop, AI/ML, Courses, Websites, Tools) | Filter grid by data-category & update count | Filters correctly, but label numbers mismatch actual card counts | **WARN** |
| `blog.html` | "Article" (4 buttons) | Open article / publication | **Dead buttons:** Plain `<button>` with no `onclick` or link | **FAIL (P1)** |
| `contact.html` | "Send Message" | Submit contact form | Submits form via EmailJS with validation | **PASS** |
| `resume.html` | "Download Resume (PDF)" | Download `resume.pdf` | Downloads valid PDF file | **PASS** |

---

## Link & Project Link Graph Audit

A total of **95 unique URLs** (209 total link instances) were extracted and validated over HTTP/HTTPS:

### Broken Links & Critical Link Issues

1. **404 Not Found on GitHub Repository:**
   - **URL:** `https://github.com/a4rehman/metal-vs-plastic-classifier-rehman`
   - **Locations:** `projects.html` (Line 149 and Line 404)
   - **Cause:** Repository is named `Metal-vs-Plastic-Classifier` on GitHub, not `metal-vs-plastic-classifier-rehman`.
   - **Severity:** **P0 / P1**

2. **401 Unauthorized / Private Hugging Face Space:**
   - **URL:** `https://huggingface.co/spaces/a4rehman-ai1/house-price-prediction`
   - **Location:** `projects.html` (Line 259)
   - **Cause:** The Space is private or deleted on Hugging Face.
   - **Severity:** **P2**

3. **Project Metadata Mismatches:**
   - **Featured Project 3:** Title is *"Steel Surface Defect Detection"*, but links to *"Metal vs Plastic Classifier"*.
   - **Data Science Card 3:** Title is *"Cash Optimization System"* (ATM forecasting, saved PKR 124M), but links to *"House Price Prediction"*.
   - **Computer Vision Card 2:** Title is *"Visual Content Recommendation Engine"*, but Source links to `human-posture-detection`.
   - **Agentic AI Card 3:** Title is *"Query Router & SLM Fine-Tuning"*, but Live Demo links to `evaluate-api-key`.

---

## Live Application Audit

All 23 live application URLs were tested:

| Application | Platform | URL | Reachability | Result |
|---|---|---|---|---|
| Medical AI Assistant (RAG) | Hugging Face | `https://huggingface.co/spaces/a4rehman-ai1/medical-chatbot-rag` | 200 OK | **PASS** |
| LLM Judge & Evaluation | Hugging Face | `https://huggingface.co/spaces/a4rehman-ai1/llm-evaluation` | 200 OK | **PASS** |
| Metal vs Plastic Classifier | Hugging Face | `https://huggingface.co/spaces/a4rehman-ai1/metal-vs-plastic-classifier` | 200 OK | **PASS** |
| Customer Churn Prediction | Hugging Face | `https://huggingface.co/spaces/a4rehman-ai1/customer-churn-prediction` | 200 OK | **PASS** |
| Posture Detection | Hugging Face | `https://huggingface.co/spaces/a4rehman-ai1/posture-detection` | 200 OK | **PASS** |
| Evaluate API Key | Hugging Face | `https://huggingface.co/spaces/a4rehman-ai1/evaluate-api-key` | 200 OK | **PASS** |
| Top AI Repos | Hugging Face | `https://huggingface.co/spaces/a4rehman-ai/Top-AI-repos` | 200 OK | **PASS** |
| Awesome Text-to-Speech | Hugging Face | `https://huggingface.co/spaces/a4rehman-ai/Awesome-Text-to-Speech` | 200 OK | **PASS** |
| House Price Prediction | Streamlit Cloud | `https://house-price-prediction.streamlit.app` | 200 / 303 Redirect | **PASS** |
| Medical Chatbot RAG | Streamlit Cloud | `https://medical-chatbot-advanced-rag.streamlit.app` | 200 / 303 Redirect | **PASS** |
| Jarvis AI Assistant | Streamlit Cloud | `https://jarvis-ai.streamlit.app` | 200 / 303 Redirect | **PASS** |
| Sentiment Analysis | Streamlit Cloud | `https://sentiment-analyisis.streamlit.app` | 200 / 303 Redirect | **PASS** |
| English Tutor AI | Streamlit Cloud | `https://english-tutor-ai-chat.streamlit.app` | 200 / 303 Redirect | **PASS** |
| Universal Video Downloader | Streamlit Cloud | `https://universalvideodownloader.streamlit.app` | 200 / 303 Redirect | **PASS** |
| AI Course Generator | Streamlit Cloud | `https://ai-course-genrated.streamlit.app` | 200 / 303 Redirect | **PASS** |
| Automate Job Apply | Streamlit Cloud | `https://automate-job-apply.streamlit.app` | 200 / 303 Redirect | **PASS** |
| UAE ProTech AI | Streamlit Cloud | `https://uae-protech-ai.streamlit.app` | 200 / 303 Redirect | **PASS** |
| WhatsApp Sales AI Chatbot | Streamlit Cloud | `https://watsappsales-ai-chatbot.streamlit.app` | 200 / 303 Redirect | **PASS** |
| AI Cold Outreach System | Streamlit Cloud | `https://ai-cold-outreach-system.streamlit.app` | 200 / 303 Redirect | **PASS** |
| Tool Agent Demo | Streamlit Cloud | `https://toolagentdemo.streamlit.app` | 200 / 303 Redirect | **PASS** |
| EduFinder PK | Streamlit Cloud / Vercel | `https://edufinder-pk.streamlit.app` & `https://edu-finder-pk.vercel.app` | 200 OK | **PASS** |
| Python Complete Course | Streamlit Cloud | `https://python-complete-courses.streamlit.app` | 200 / 303 Redirect | **PASS** |
| Machine Learning Complete Course | Streamlit Cloud | `https://machine-learning-complete-course.streamlit.app` | 200 / 303 Redirect | **PASS** |

---

## Contact Form & Email System QA

- **Form Fields:** `user_name` (Text, required), `user_email` (Email, required), `message` (Textarea, required).
- **Validation:** Browser native HTML5 validation works; missing fields block submission; malformed emails trigger standard email prompt.
- **EmailJS Integration:**
  - In production, env vars are injected into placeholders.
  - **Architecture Risk:** `sendVisitNotification()` executes on every single visitor load and requests `ipapi.co/json/` + sends an EmailJS message. If visitor traffic exceeds EmailJS free monthly limits (200 emails/month), the service gets locked out, breaking real user inquiries.

---

## Resume QA

- **File Path:** `assets/docs/resume.pdf`
- **Integrity:** Valid binary PDF, size: 400,113 bytes (390.7 KB).
- **Download Handler:** `downloadResume()` in `assets/js/main.js` uses blob fetching with fallback link creation. File downloads as `Abdul_Rehman_AI_Engineer_Resume.pdf`.

---

## Assets & Images QA

All 12 static image files in `assets/images/` exist, are non-empty, and load properly:
- `profile.jpg` (95.5 KB)
- `100Solutionz_logo.png` (19.9 KB), `100Solutionz_logo.jpg` (3.4 KB)
- `fiverr_logo.png` (12.4 KB), `upwork_logo.png` (18.8 KB)
- `blog_women.jpg` (110.4 KB), `blog_social.jpg` (139.8 KB), `blog_lying.jpg` (82.8 KB), `blog_learning.jpg` (107.9 KB)
- `project-medical-ai.svg` (4.2 KB), `project-llm-judge.svg` (4.2 KB), `project-steel-defect.svg` (5.6 KB)

---

## Responsive & Cross-Device QA

Tested at viewports: `320px`, `375px`, `414px`, `768px`, `1024px`, `1280px`, `1920px`.
- **Layout Flow:** Flexbox & CSS Grid adapt cleanly with no horizontal scroll overflow.
- **Navbar:** Collapses into a clean sticky header with hamburger trigger on mobile (<768px).
- **Mobile Menu Bug:** On `apps.html`, hamburger menu fails to toggle due to dual event binding.
- **Grids:** Impact metrics grid, capability cards, and project cards wrap appropriately.

---

## SEO & Accessibility Audit

- **OpenGraph & Twitter Cards:** Configured across all pages with title, description, image, and canonical URL.
- **Meta Description:** Present on all main pages; **missing** on `404.html`.
- **Heading Hierarchy:**
  - `expertise.html` has three `<h1>` tags (lines 66, 163, 263). Recommended structure: One `<h1>` for page title and `<h2>` for sub-sections.
- **Accessibility:**
  - Skip-to-content link present (`<a href="#main-content" class="skip-link">`).
  - Form fields use descriptive `<label for="...">` and `aria-required`.
  - Contrast ratios meet WCAG 2.2 AA standards.
  - Image alt attributes are present.

---

## Bug Classification & Master Defect Table

| ID | Severity | Page | Feature | Problem Description | Expected Result | Actual Result | Recommended Fix |
|---|---|---|---|---|---|---|---|
| **BUG-01** | **P1 (Critical)** | `projects.html` | GitHub Link | `metal-vs-plastic-classifier-rehman` returns HTTP 404 on GitHub. | Valid GitHub repository loads (200 OK). | GitHub 404 page returned. | Update URL to `https://github.com/a4rehman/Metal-vs-Plastic-Classifier` (lines 149 & 404). |
| **BUG-02** | **P1 (Critical)** | `apps.html` | Mobile Navigation | Dual event listener attached to `.nav-toggle` on `apps.html`. | Mobile menu opens/closes on click. | Menu flickers / fails to open due to immediate toggle-off. | Remove duplicate inline `.nav-toggle` listener in `apps.html` (line 713). |
| **BUG-03** | **P1 (Critical)** | `blog.html` | Blog Buttons | 4 "Article" buttons are inert with no `onclick` or link. | Clicking opens article / publication. | Button does nothing when clicked. | Convert `<button class="blog-btn">` to `<a>` links pointing to articles. |
| **BUG-04** | **P2 (High)** | `projects.html` | Live Demo Link | `https://huggingface.co/spaces/a4rehman-ai1/house-price-prediction` returns HTTP 401. | Publicly accessible live demo. | 401 Unauthorized / Private space. | Replace with public Streamlit link `https://house-price-prediction.streamlit.app` or update space permissions. |
| **BUG-05** | **P2 (High)** | `projects.html` | Project Metadata | "Cash Optimization System" card links to "House Price Prediction". | Card links to Cash Optimization demo & source. | Links to real estate house price repo. | Point to correct Cash Optimization repo/demo or update card text. |
| **BUG-06** | **P2 (High)** | `projects.html` | Project Metadata | "Visual Content Recommendation Engine" links to `human-posture-detection`. | Links to Recommendation Engine repo. | Links to Posture Detection repo. | Correct the GitHub URL to the actual recommendation engine repository. |
| **BUG-07** | **P2 (High)** | `projects.html` | Project Metadata | "Query Router & SLM Fine-Tuning" links to `evaluate-api-key`. | Links to SLM Fine-Tuning demo/repo. | Links to Evaluate API Key space. | Point to `small-language-model-finetuning` or dedicated router repo. |
| **BUG-08** | **P3 (Medium)** | `apps.html` | Filter Bar Counts | Filter button labels have hardcoded numbers (`All (47)`, etc.) that conflict with the 39 actual cards. | Counts match actual filtered items accurately. | Button says 47, but runtime JS updates to 39 upon click. | Update button labels to match actual card counts or make filter counts dynamic in JS. |
| **BUG-09** | **P3 (Medium)** | `expertise.html` | SEO Heading Hierarchy | Three `<h1>` elements on `expertise.html` ("05 / Expertise", "06 / Skills", "07 / Credentials"). | Single `<h1>` per page. | Multiple `<h1>` elements present. | Change section titles to `<h2>` with gradient text class. |
| **BUG-10** | **P3 (Medium)** | `404.html` | SEO Meta Tags | `<meta name="description">` is missing from `404.html`. | Meta description tag present. | Tag omitted. | Add `<meta name="description" content="Page not found - Abdul Rehman AI Engineer Portfolio">`. |
| **BUG-11** | **P3 (Medium)** | `assets/js/main.js` | Performance & Tracking | `sendVisitNotification()` triggers an email on every visitor session via EmailJS. | Free tier quota reserved for user messages. | Background tracking risks exhausting EmailJS 200/mo quota. | Disable visitor email alerts or restrict strictly to genuine contact submissions. |

---

## QA Dashboard

- **TOTAL ROUTES:** 8
- **TESTED ROUTES:** 8
- **PASSED ROUTES:** 8
- **FAILED ROUTES:** 0 (All routes render; individual page components have defects)
- **TOTAL BUTTONS:** 15
- **TESTED BUTTONS:** 15
- **PASSED BUTTONS:** 11
- **FAILED / DEAD BUTTONS:** 4 (on `blog.html`)
- **TOTAL LINKS:** 209 (95 unique)
- **TESTED LINKS:** 95 unique
- **PASSED LINKS:** 93
- **BROKEN / 404 / 401 LINKS:** 2
- **TOTAL PROJECTS:** 39 in `apps.html`, 15 in `projects.html`
- **TOTAL LIVE DEMOS:** 23
- **TESTED LIVE DEMOS:** 23
- **PASSED LIVE DEMOS:** 22
- **FAILED LIVE DEMOS:** 1 (`house-price-prediction` on HF returned 401)
- **TOTAL FORMS:** 1
- **TESTED FORMS:** 1
- **PASSED FORMS:** 1
- **RESPONSIVE:** **CONDITIONAL PASS** (Mobile menu issue on `apps.html`)
- **ACCESSIBILITY:** **PASS**
- **SEO:** **PASS WITH MINOR FIXES** (Heading hierarchy & 404 meta description)
- **SECURITY:** **PASS** (Zero exposed credentials, HTTPS, no-opener rels)
- **BUILD:** **PASS** (`node build.js` runs cleanly)

---

## Release Decision & Next Steps

### Release Status: **CONDITIONAL RELEASE**
*(Site is live and highly functional, but recommended fixes should be applied prior to presenting to recruiters and executive technical interviewers).*

### Recommended Action Plan:
1. **P1 Blockers:**
   - Fix 404 link on `projects.html` -> change `metal-vs-plastic-classifier-rehman` to `Metal-vs-Plastic-Classifier`.
   - Fix duplicate `.nav-toggle` event listener on `apps.html`.
   - Add hyperlinks / handlers to the 4 "Article" buttons on `blog.html`.
2. **P2 Fixes:**
   - Align project links on `projects.html` (Cash Optimization, Recommendation Engine, Query Router, House Price Prediction).
3. **P3 Polish:**
   - Correct filter button count labels on `apps.html` (`All (39)`, `Live Apps (23)`, etc.).
   - Standardize `<h1>` heading hierarchy in `expertise.html`.
   - Add meta description in `404.html`.
   - Optimize background visitor tracking in `assets/js/main.js` to protect EmailJS quota.
