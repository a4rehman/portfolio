/**
 * Build script: Injects environment variables into static HTML/JS files.
 * Replaces __PLACEHOLDERS__ with actual values from Vercel env vars.
 */
const fs = require('fs');
const path = require('path');

// Files are in the same directory as this script (portfolio/)
const DIR = __dirname;

// Env vars to inject
const replacements = {
    '__EMAILJS_PUBLIC_KEY__': process.env.EMAILJS_PUBLIC_KEY || '',
    '__EMAILJS_SERVICE_ID__': process.env.EMAILJS_SERVICE_ID || '',
    '__EMAILJS_CONTACT_TEMPLATE__': process.env.EMAILJS_CONTACT_TEMPLATE || '',
    '__EMAILJS_VISIT_TEMPLATE__': process.env.EMAILJS_VISIT_TEMPLATE || '',
    '__GA_MEASUREMENT_ID__': process.env.GA_MEASUREMENT_ID || '',
};

console.log('Build: Injecting environment variables...');
for (const [key, val] of Object.entries(replacements)) {
    console.log(`  ${key}: ${val ? 'SET (' + val.substring(0, 15) + '...)' : 'MISSING!'}`);
}

// Files to process
const files = [
    'index.html', 'contact.html', 'projects.html', 'expertise.html',
    'blog.html', 'resume.html', 'apps.html',
    'assets/js/main.js'
];

let total = 0;

for (const file of files) {
    const filePath = path.join(DIR, file);
    if (!fs.existsSync(filePath)) {
        console.log(`  SKIP: ${file}`);
        continue;
    }
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Replace all placeholders with env var values
    for (const [placeholder, value] of Object.entries(replacements)) {
        if (value) {
            const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            content = content.split(placeholder).join(value);
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  OK: ${file}`);
        total++;
    }
}

console.log(`\nDone: ${total} files updated.`);
