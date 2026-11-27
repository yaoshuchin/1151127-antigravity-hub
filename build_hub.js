const fs = require('fs');

const rawList = JSON.parse(fs.readFileSync('enriched_live_pages.json', 'utf8'));

// Categorization helper
function categorize(item) {
  const n = (item.name || '').toLowerCase();
  const t = (item.pageTitle || '').toLowerCase();
  const d = (item.desc || '').toLowerCase();
  const all = `${n} ${t} ${d}`;

  // 1. 投中校務與班級成果 (Nantou Junior High & Classes)
  if (
    all.includes('南投國中') ||
    all.includes('投中') ||
    all.includes('nantou-jh') ||
    all.includes('115-nantou') ||
    all.includes('隔宿露營') ||
    all.includes('尖山埤') ||
    all.includes('畢業旅行') ||
    all.includes('社團點名') ||
    all.includes('導師會報') ||
    all.includes('校園安全') ||
    all.includes('親師手冊') ||
    all.includes('評量教師') ||
    all.includes('藝材班') ||
    all.includes('美術班評鑑') ||
    all.includes('體育班評鑑') ||
    all.includes('教師座位') ||
    all.includes('董勳遠') ||
    all.includes('tung-principal') ||
    all.includes('獎懲') ||
    all.includes('行事曆') ||
    all.includes('116學年度國中教育會考') ||
    all.includes('304 班') ||
    all.includes('304-flowchart')
  ) {
    return {
      category: '投中校務與班級成果',
      categoryKey: 'campus',
      badgeColor: 'blue',
      icon: 'fa-school'
    };
  }

  // 2. 創新教案與公開觀課 (Curriculum & Open Class)
  if (
    all.includes('公開課') ||
    all.includes('觀議課') ||
    all.includes('教案') ||
    all.includes('簡怡芳') ||
    all.includes('石伯華') ||
    all.includes('鳳鳴國中') ||
    all.includes('微型椅子') ||
    all.includes('living-technology') ||
    all.includes('永生花') ||
    all.includes('放數學一馬') ||
    all.includes('wang-math-ai') ||
    all.includes('簡子惠') ||
    all.includes('差異化教學') ||
    all.includes('差異化教學') ||
    all.includes('生命教育') ||
    all.includes('neuro-calm') ||
    all.includes('自然科學博物館') ||
    all.includes('九族文化村') ||
    all.includes('facv-outdoor') ||
    all.includes('math4-') ||
    all.includes('chinese4-')
  ) {
    // If it's pure 4th grade math/chinese mini games/tools, could also be learning
    if (all.includes('math4-') || all.includes('chinese4-')) {
      return {
        category: '互動教材與數位工具',
        categoryKey: 'tools',
        badgeColor: 'amber',
        icon: 'fa-gamepad'
      };
    }
    return {
      category: '創新教案與公開觀課',
      categoryKey: 'curriculum',
      badgeColor: 'emerald',
      icon: 'fa-chalkboard-user'
    };
  }

  // 3. 研習數位典藏與看板 (Workshops & Padlet Mirrors)
  if (
    all.includes('padlet') ||
    all.includes('夢n') ||
    all.includes('dream-n') ||
    all.includes('基隆市') ||
    all.includes('keelung') ||
    all.includes('紅焰') ||
    all.includes('prepareautoflow') ||
    all.includes('數位典藏') ||
    all.includes('種子教師') ||
    all.includes('ai-literacy') ||
    all.includes('研習') ||
    all.includes('奕鈞老師')
  ) {
    return {
      category: '研習數位典藏與看板',
      categoryKey: 'archives',
      badgeColor: 'purple',
      icon: 'fa-box-archive'
    };
  }

  // 4. 互動教材與數位工具 (Interactive Tools & Games)
  if (
    all.includes('game') ||
    all.includes('遊戲') ||
    all.includes('qrcode') ||
    all.includes('工具箱') ||
    all.includes('反應機') ||
    all.includes('小宮燈') ||
    all.includes('生態 live') ||
    all.includes('wild-moments') ||
    all.includes('meanwhile') ||
    all.includes('halloween') ||
    all.includes('法蘭斯') ||
    all.includes('載具') ||
    all.includes('3d') ||
    all.includes('campus-tour') ||
    all.includes('島主') ||
    all.includes('island-master') ||
    all.includes('classtool') ||
    all.includes('剛好學') ||
    all.includes('stop-iq') ||
    all.includes('scam-game') ||
    all.includes('rpg')
  ) {
    return {
      category: '互動教材與數位工具',
      categoryKey: 'tools',
      badgeColor: 'amber',
      icon: 'fa-gamepad'
    };
  }

  // 5. AI 教學與行政賦能 (AI Empowerment & Teaching)
  return {
    category: 'AI教學與行政賦能',
    categoryKey: 'ai',
    badgeColor: 'indigo',
    icon: 'fa-robot'
  };
}

// Format date helper
function extractDate(name, updatedAt) {
  const m = name.match(/^(115\d{4})/);
  if (m) {
    const s = m[1];
    return `115.${s.slice(3, 5)}.${s.slice(5, 7)}`;
  }
  const m2 = name.match(/(2026\d{4})/);
  if (m2) {
    const s = m2[1];
    return `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)}`;
  }
  if (updatedAt) {
    return updatedAt.slice(0, 10);
  }
  return '115學年度';
}

// Clean title helper
function formatTitle(item) {
  let t = item.pageTitle ? item.pageTitle.trim() : '';
  if (!t || t === 'Document' || t.toLowerCase() === 'index' || t.length < 2) {
    if (item.desc) {
      t = item.desc.split(/[·|｜\n]/)[0].trim();
    } else {
      t = item.name;
    }
  }
  // Remove trailing site suffixes like " | GitHub Pages" etc
  t = t.replace(/\s*\|\s*GitHub Pages$/i, '');
  return t;
}

// Clean description
function formatDesc(item, title) {
  let d = item.desc ? item.desc.trim() : '';
  if (!d || d === title) {
    d = `南投國中及教育創新成果專案：${item.name}。提供線上即時瀏覽與教育資源整合。`;
  }
  return d;
}

const processed = rawList.map((item, idx) => {
  const meta = categorize(item);
  const title = formatTitle(item);
  const desc = formatDesc(item, title);
  const date = extractDate(item.name, item.updatedAt);
  const repoUrl = `https://github.com/yaoshuchin/${item.name}`;

  return {
    id: idx + 1,
    name: item.name,
    title,
    desc,
    pagesUrl: item.url,
    repoUrl,
    date,
    category: meta.category,
    categoryKey: meta.categoryKey,
    badgeColor: meta.badgeColor,
    icon: meta.icon
  };
});

// Sort: newest dates first, then by name
processed.sort((a, b) => {
  if (b.date !== a.date) {
    return b.date.localeCompare(a.date, 'zh-Hant');
  }
  return a.name.localeCompare(b.name, 'zh-Hant');
});

// Re-index
processed.forEach((item, i) => item.id = i + 1);

// Calculate Category Stats
const stats = {};
processed.forEach(item => {
  stats[item.category] = (stats[item.category] || 0) + 1;
});

console.log('Category breakdown:');
console.log(stats);
console.log(`Total projects: ${processed.length}`);

fs.writeFileSync('portal_data.json', JSON.stringify(processed, null, 2), 'utf8');
console.log('Saved portal_data.json successfully!');
