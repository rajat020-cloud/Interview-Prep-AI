const fs = require('fs');
const path = require('path');

// Ensure dist directory exists for environments expecting an outputDirectory
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

// Copy package.json to dist so package resolution works in dist
const pkgPath = path.join(__dirname, 'package.json');
if (fs.existsSync(pkgPath)) {
    fs.copyFileSync(pkgPath, path.join(distDir, 'package.json'));
}

// Copy vercel.json if exists
const vercelPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelPath)) {
    fs.copyFileSync(vercelPath, path.join(distDir, 'vercel.json'));
}

// Serverless entrypoints
const entryContent = `require("dotenv").config();\nconst app = require("./src/app");\nmodule.exports = app;\n`;
fs.writeFileSync(path.join(distDir, 'index.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'server.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'app.js'), entryContent);

// Dist API folder
const distApiDir = path.join(distDir, 'api');
if (!fs.existsSync(distApiDir)) {
    fs.mkdirSync(distApiDir, { recursive: true });
}
fs.writeFileSync(
    path.join(distApiDir, 'index.js'),
    `require("dotenv").config();\nconst app = require("../src/app");\nmodule.exports = app;\n`
);

console.log('✅ Build successful: Serverless entrypoints generated.');
