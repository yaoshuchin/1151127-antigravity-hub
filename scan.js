const fs = require('fs');
const path = require('path');

const baseDir = 'D:\\antigravity';
const entries = fs.readdirSync(baseDir, { withFileTypes: true });

const results = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const folderName = entry.name;
  if (folderName === '.agents' || folderName === 'skill' || folderName === '1151127豎琴-投中訓育桌機') continue;

  const folderPath = path.join(baseDir, folderName);
  let repoUrl = null;
  let pagesUrl = null;
  let title = null;
  let hasGit = false;
  let hasIndex = false;

  const gitConfigPath = path.join(folderPath, '.git', 'config');
  if (fs.existsSync(gitConfigPath)) {
    hasGit = true;
    try {
      const gitConfig = fs.readFileSync(gitConfigPath, 'utf8');
      const m = gitConfig.match(/url\s*=\s*(?:https:\/\/github\.com\/|git@github\.com:)([^\/\s]+)\/([^\/\s\.]+)/);
      if (m) {
        const owner = m[1];
        const repo = m[2];
        repoUrl = `https://github.com/${owner}/${repo}`;
        pagesUrl = `https://${owner}.github.io/${repo}/`;
      }
    } catch (e) {}
  }

  const indexPath = path.join(folderPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    hasIndex = true;
    try {
      const html = fs.readFileSync(indexPath, 'utf8');
      const tm = html.match(/<title>([^<]+)<\/title>/i);
      if (tm) {
        title = tm[1].trim();
      }
    } catch (e) {}
  }

  const readmePath = path.join(folderPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    try {
      const readme = fs.readFileSync(readmePath, 'utf8');
      const pm = readme.match(/https:\/\/[a-zA-Z0-9_\-]+\.github\.io\/[^\s\)\]\"'<>]+/);
      if (pm) {
        pagesUrl = pm[0].replace(/[\.\)\]"'>]+$/, '');
        if (!pagesUrl.endsWith('/')) pagesUrl += '/';
      }
      if (!title) {
        const hm = readme.match(/^#\s+(.+)$/m);
        if (hm) {
          title = hm[1].trim();
        }
      }
    } catch (e) {}
  }

  results.push({
    folder: folderName,
    hasGit,
    hasIndex,
    repoUrl,
    pagesUrl,
    title: title || folderName
  });
}

// Filter to those with pagesUrl or hasIndex
const withPages = results.filter(r => r.pagesUrl || (r.hasIndex && r.repoUrl));
console.log(JSON.stringify(withPages, null, 2));

const withoutGitOrPages = results.filter(r => !r.pagesUrl && !r.repoUrl);
console.log('--- Folders without git remote: ---');
console.log(JSON.stringify(withoutGitOrPages, null, 2));
