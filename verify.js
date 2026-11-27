const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');

const list = JSON.parse(fs.readFileSync('matched_repos.json', 'utf8'));

list.forEach(item => {
  const m = item.repoUrl ? item.repoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/) : null;
  if (m) {
    const owner = m[1];
    const repo = m[2];
    item.owner = owner;
    item.repo = repo;
    item.pagesUrl = `https://${owner}.github.io/${repo}/`;
  }
});

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const req = https.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
        resolve(res.statusCode);
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
}

async function run() {
  console.log(`Checking ${list.length} repositories...`);
  for (const item of list) {
    const status = await checkUrl(item.pagesUrl);
    item.httpStatus = status;
    console.log(`[${status || 'ERR'}] ${item.folderName} -> ${item.pagesUrl}`);
  }
  fs.writeFileSync('verified_repos.json', JSON.stringify(list, null, 2), 'utf8');
  console.log('Saved to verified_repos.json');
}

run();
