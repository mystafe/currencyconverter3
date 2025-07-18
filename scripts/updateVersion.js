const fs = require('fs');
const path = require('path');

function getVersion() {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${month}.${day}.${hours}${minutes}`;
}

const version = getVersion();

const root = path.join(__dirname, '..');
const pkgPath = path.join(root, 'package.json');
const pkgLockPath = path.join(root, 'package-lock.json');
const footerPath = path.join(root, 'src', 'compononents', 'Footer.js');

function updateJSON(filePath, handler) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  handler(data);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

updateJSON(pkgPath, (data) => { data.version = version; });
updateJSON(pkgLockPath, (data) => {
  data.version = version;
  if (data.packages && data.packages['']) {
    data.packages[''].version = version;
  }
});

let footerContent = fs.readFileSync(footerPath, 'utf8');
footerContent = footerContent.replace(/v\d+\.\d+\.\d+/g, `v${version}`);
fs.writeFileSync(footerPath, footerContent);

console.log(`Version updated to ${version}`);
