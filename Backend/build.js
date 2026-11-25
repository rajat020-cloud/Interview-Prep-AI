const fs = require('fs');
const path = require('path');

// Ensure dist directory exists for Vercel
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy entrypoint files into dist so Vercel finds them immediately
fs.copyFileSync(path.join(__dirname, 'server.js'), path.join(distDir, 'server.js'));
fs.copyFileSync(path.join(__dirname, 'server.js'), path.join(distDir, 'index.js'));
fs.copyFileSync(path.join(__dirname, 'server.js'), path.join(distDir, 'app.js'));

const srcDir = path.join(__dirname, 'src');
const distSrcDir = path.join(distDir, 'src');
if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, distSrcDir, { recursive: true });
}

console.log('✅ Build successful: Entrypoints placed in dist/ for Vercel.');
