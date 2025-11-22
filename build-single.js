import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

// Read files
const html = readFileSync('index.html', 'utf-8');
const bundle = readFileSync('dist/bundle.js', 'utf-8');

// Updated importmap with jsx-runtime
const newImportMap = `<script type="importmap">
{
  "imports": {
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react/jsx-runtime": "https://aistudiocdn.com/react@^19.2.0/jsx-runtime",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "lucide-react": "https://aistudiocdn.com/lucide-react@^0.554.0"
  }
}
</script>`;

// Replace old importmap
let output = html.replace(/<script type="importmap">[\s\S]*?<\/script>/, newImportMap);

// Add the bundled script before </body>
const inlineScript = `<script type="module">\n${bundle}\n</script>`;
output = output.replace('</body>', `${inlineScript}\n</body>`);

// Ensure dist directory exists
if (!existsSync('dist')) {
  mkdirSync('dist');
}

// Write output
writeFileSync('dist/index.html', output);
console.log('✅ Single HTML file generated: dist/index.html');
console.log(`📦 Size: ${(Buffer.byteLength(output, 'utf-8') / 1024).toFixed(1)} KB`);
