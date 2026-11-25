const fs = require('fs');
const path = require('path');

// Ensure dist directory exists for Vercel
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy full src/ into dist/
const srcDir = path.join(__dirname, 'src');
const distSrcDir = path.join(distDir, 'src');
if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, distSrcDir, { recursive: true });
}

// Create clean serverless entrypoints that export Express app without blocking port listeners
const entryContent = `const app = require("./src/app");\nmodule.exports = app;\n`;
fs.writeFileSync(path.join(distDir, 'index.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'server.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'app.js'), entryContent);

// Also create dist/api/index.js for /api rewrites
const distApiDir = path.join(distDir, 'api');
if (!fs.existsSync(distApiDir)) {
    fs.mkdirSync(distApiDir, { recursive: true });
}
fs.writeFileSync(
    path.join(distApiDir, 'index.js'),
    `const app = require("../src/app");\nmodule.exports = app;\n`
);

console.log('✅ Build successful: All serverless entrypoints generated in dist/');
