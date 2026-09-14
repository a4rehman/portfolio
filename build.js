/**
 * Build script: Injects environment variables into static HTML/JS files.
 * Run during Vercel build to replace __PLACEHOLDERS__ with actual values.
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'portfolio');

// Env vars to inject (Vercel sets these at build time)
const replacements = {
    '__EMAILJS_PUBLIC_KEY__': process.env.EMAILJS_PUBLIC_KEY || '',
    '__EMAILJS_SERVICE_ID__': process.env.EMAILJS_SERVICE_ID || '',
    '__EMAILJS_CONTACT_TEMPLATE__': process.env.EMAILJS_CONTACT_TEMPLATE || '',
    '__EMAILJS_VISIT_TEMPLATE__': process.env.EMAILJS_VISIT_TEMPLATE || '',
    '__GA_MEASUREMENT_ID__': process.env.GA_MEASUREMENT_ID || '',
};

console.log('Build: Injecting environment variables...');
console.log('  EMAILJS_PUBLIC_KEY:', replacements['__EMAILJS_PUBLIC_KEY__'] ? 'SET' : 'MISSING');
console.log('  EMAILJS_SERVICE_ID:', replacements['__EMAILJS_SERVICE_ID__'] ? 'SET' : 'MISSING');
console.log('  GA_MEASUREMENT_ID:', replacements['__GA_MEASUREMENT_ID__'] ? 'SET' : 'MISSING');

// Files to process
const htmlFiles = ['index.html', 'contact.html', 'projects.html', 'expertise.html', 'blog.html', 'resume.html', 'apps.html'];
const jsFiles = ['assets/js/main.js'];

let totalReplacements = 0;

// Process HTML files
for (const file of htmlFiles) {
    const filePath = path.join(DIR, file);
    if (!fs.existsSync(filePath)) {
        console.log(`  SKIP: ${file} (not found)`);
        continue;
    }
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Replace EmailJS public key
    content = content.replace(/emailjs\.init\("E9IkrYo8s2nqwsS7R"\)/g,
        `emailjs.init("${replacements['__EMAILJS_PUBLIC_KEY__']}")`);

    // Replace GA measurement ID
    content = content.replace(/G-TSTJWPN9S7/g, replacements['__GA_MEASUREMENT_ID__']);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        const count = (content.match(new RegExp(replacements['__EMAILJS_PUBLIC_KEY__'], 'g')) || []).length;
        console.log(`  UPDATED: ${file}`);
        totalReplacements++;
    }
}

// Process JS files
for (const file of jsFiles) {
    const filePath = path.join(DIR, file);
    if (!fs.existsSync(filePath)) {
        console.log(`  SKIP: ${file} (not found)`);
        continue;
    }
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Replace service ID
    content = content.replace(/service_y4r1pxo/g, replacements['__EMAILJS_SERVICE_ID__']);

    // Replace template IDs
    content = content.replace(/template_zgz0g1c/g, replacements['__EMAILJS_CONTACT_TEMPLATE__']);
    content = content.replace(/template_gp8y77k/g, replacements['__EMAILJS_VISIT_TEMPLATE__']);

    // Remove hardcoded comment with secrets
    content = content.replace(/\* Public Key: E9IkrYo8s2nqwsS7R/, '* Public Key: [ENV]');
    content = content.replace(/\* Service ID: service_y4r1pxo/, '* Service ID: [ENV]');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  UPDATED: ${file}`);
        totalReplacements++;
    }
}

console.log(`\nBuild complete: ${totalReplacements} files updated.`);
