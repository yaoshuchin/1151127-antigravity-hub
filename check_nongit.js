const fs = require('fs');
const path = require('path');

const nonGit = [
  '0南投國中照片', '1151007畢旅', '1151015二年級參加學生', '1151015投中二年級隔宿-帳棚野炊', 
  '1151016總務', '1151018投中三年級畢旅', '1151019三年級畢旅', '1151020全國教師網', 
  '1151020陳國益AI講義', '1151021隔宿學生保險', '1151105掃瞄', '1151106投中教室布置', 
  '1151106投中教室布置0back', '1151106投中整潔秩序', '1151112科技團公開課', '1151112董主人個人網站', 
  '1151113投中嘉獎資料', '1151118MV', '1151122檔妹比較', '1151125國防抽獎', '1151125教學app'
];

for (const name of nonGit) {
  const p = path.join('D:\\antigravity', name);
  if (!fs.existsSync(p)) continue;
  const list = fs.readdirSync(p);
  const gitFiles = list.filter(f => f.includes('.git') || f.endsWith('.html') || f.endsWith('.md'));
  console.log(`${name}: ${list.length} files -> interesting: ${gitFiles.join(', ')}`);
}
