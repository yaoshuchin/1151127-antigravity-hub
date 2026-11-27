const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = 'D:\\antigravity';
const entries = fs.readdirSync(baseDir, { withFileTypes: true });

// Get all yaoshuchin repos via gh
let ghRepos = [];
try {
  const ghOut = execSync('gh repo list yaoshuchin --limit 200 --json name,url,description', { encoding: 'utf8' });
  ghRepos = JSON.parse(ghOut);
} catch (e) {
  console.error('Error fetching gh repos:', e);
}

const detailedList = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const folderName = entry.name;
  if (folderName === '.agents' || folderName === 'skill' || folderName === '1151127豎琴-投中訓育桌機') continue;

  const folderPath = path.join(baseDir, folderName);
  let repoUrl = null;
  let pagesUrl = null;
  let pageTitle = null;
  let gitRemote = null;

  // 1. check git config
  const gitConfigPath = path.join(folderPath, '.git', 'config');
  if (fs.existsSync(gitConfigPath)) {
    try {
      const cfg = fs.readFileSync(gitConfigPath, 'utf8');
      const m = cfg.match(/url\s*=\s*(?:https:\/\/github\.com\/|git@github\.com:)([^\/\s]+)\/([^\/\s\.]+)/);
      if (m) {
        const owner = m[1];
        const repo = m[2];
        gitRemote = `https://github.com/${owner}/${repo}`;
        repoUrl = gitRemote;
        pagesUrl = `https://${owner}.github.io/${repo}/`;
      }
    } catch (e) {}
  }

  // 2. check files in folder for mentions of github.io
  const files = fs.readdirSync(folderPath);
  for (const f of files) {
    if (f.endsWith('.md') || f.endsWith('.html') || f.endsWith('.json') || f.endsWith('.txt')) {
      try {
        const content = fs.readFileSync(path.join(folderPath, f), 'utf8');
        const pm = content.match(/https:\/\/[a-zA-Z0-9_\-]+\.github\.io\/[a-zA-Z0-9_\-\./]+/);
        if (pm) {
          let url = pm[0].replace(/[\.\)\]"'>`]+$/, '');
          if (!url.endsWith('/')) url += '/';
          // Prefer explicit url
          pagesUrl = url;
          break;
        }
      } catch (e) {}
    }
  }

  // 3. check title from index.html or README.md
  const indexPath = path.join(folderPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    try {
      const html = fs.readFileSync(indexPath, 'utf8');
      const tm = html.match(/<title>([^<]+)<\/title>/i);
      if (tm) {
        pageTitle = tm[1].trim();
      }
    } catch (e) {}
  }

  const readmePath = path.join(folderPath, 'README.md');
  if (!pageTitle && fs.existsSync(readmePath)) {
    try {
      const rm = fs.readFileSync(readmePath, 'utf8');
      const hm = rm.match(/^#\s+(.+)$/m);
      if (hm) {
        pageTitle = hm[1].trim();
      }
    } catch (e) {}
  }

  // If no git config, check if any ghRepo matches folder name or date prefix
  if (!pagesUrl) {
    const matchRepo = ghRepos.find(r => {
      const cleanFolderName = folderName.replace(/^[0-9]+/, '');
      return r.name.toLowerCase().includes(folderName.toLowerCase()) || 
             (cleanFolderName.length > 3 && r.name.includes(cleanFolderName));
    });
    if (matchRepo) {
      console.log(`Potential match for ${folderName}: ${matchRepo.name}`);
    }
  }

  if (pagesUrl || gitRemote) {
    detailedList.push({
      folderName,
      pagesUrl,
      repoUrl,
      title: pageTitle || folderName
    });
  }
}

console.log(`Total matched folders: ${detailedList.length}`);
fs.writeFileSync('matched_repos.json', JSON.stringify(detailedList, null, 2), 'utf8');
console.log('Saved to matched_repos.json');
