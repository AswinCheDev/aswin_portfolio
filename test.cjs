const fs = require('fs');
const content = fs.readFileSync('node_modules/tech-stack-icons/dist/index.js', 'utf8');
const regex = /"([^"]+)":\{svg:/g;
let match;
const keys = [];
while ((match = regex.exec(content)) !== null) {
  keys.push(match[1]);
}
console.log("Found keys:", keys.length);
fs.writeFileSync('keys.txt', keys.join(', '));
