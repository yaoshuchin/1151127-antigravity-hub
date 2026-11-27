const fs = require('fs');

const repos = JSON.parse(fs.readFileSync('verified_repos.json', 'utf8'));

// Categorize items
function getCategory(item) {
  const f = item.folderName;
  const t = item.title;
  if (f.includes('AI') || f.includes('科技') || f.includes('反應燈') || f.includes('微型椅子') || f.includes('流程圖') || f.includes('汪憶') || f.includes('程瑋昱') || f.includes('史君潔') || f.includes('生活科技')) {
    return { name: 'AI與科技創新', color: 'indigo', icon: 'cpu' };
  }
  if (f.includes('露營') || f.includes('校園安全') || f.includes('環境教育') || f.includes('畢旅') || f.includes('生命教育')) {
    return { name: '校園活動與安全', color: 'emerald', icon: 'shield-check' };
  }
  if (f.includes('公開課') || f.includes('觀課') || f.includes('評鑑') || f.includes('訪視') || f.includes('教案') || f.includes('藝材班')) {
    return { name: '公開觀課與評鑑', color: 'amber', icon: 'graduation-cap' };
  }
  return { name: '校務行政與規章', color: 'blue', icon: 'building' };
}

// Enhance repo data
const enhanced = repos.map((item, idx) => {
  const cat = getCategory(item);
  let date = '115學年度';
  const dm = item.folderName.match(/^(115\d{4})/);
  if (dm) {
    const raw = dm[1];
    date = `115.${raw.slice(3, 5)}.${raw.slice(5, 7)}`;
  }
  return {
    id: idx + 1,
    folderName: item.folderName,
    title: item.title,
    pagesUrl: item.pagesUrl,
    repoUrl: item.repoUrl,
    date,
    category: cat.name,
    color: cat.color
  };
});

// Sort by date descending, or keep logical order
enhanced.sort((a, b) => b.folderName.localeCompare(a.folderName, 'zh-Hant'));

const htmlContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>南投國中 Antigravity 專案導覽總入口</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap');
    body {
      font-family: 'Noto Sans TC', 'Plus Jakarta Sans', sans-serif;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.8);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .glass-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
      border-color: #93c5fd;
    }
    .shake {
      animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-2px, 0, 0); }
      20%, 80% { transform: translate3d(4px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
      40%, 60% { transform: translate3d(6px, 0, 0); }
    }
  </style>
</head>
<body class="bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 min-h-screen text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">

  <!-- 密碼驗證模態框 (NATO門禁) -->
  <div id="passwordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md px-4 transition-all duration-300">
    <div id="modalBox" class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100 text-center relative overflow-hidden">
      <!-- 頂部裝飾條 -->
      <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"></div>
      
      <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl shadow-inner border border-indigo-100">
        <i class="fa-solid fa-shield-halved"></i>
      </div>
      
      <h2 class="text-2xl font-black text-slate-900 mb-2">南投國中專案導航網</h2>
      <p class="text-slate-500 text-sm mb-6 leading-relaxed">
        此站點整合本地 <code class="bg-slate-100 px-2 py-0.5 rounded text-indigo-600 font-mono text-xs">D:\\antigravity</code> 已發布之 GitHub 專案。<br>請輸入存取密碼以繼續瀏覽。
      </p>

      <form id="pwdForm" onsubmit="handleUnlock(event); return false;" class="space-y-4">
        <div class="relative">
          <input 
            type="password" 
            id="pwdInput" 
            placeholder="請輸入通關密碼" 
            autocomplete="off"
            class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg tracking-widest font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            required
            autofocus
          >
          <button 
            type="button" 
            onclick="togglePasswordVisibility()" 
            class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
          >
            <i id="eyeIcon" class="fa-regular fa-eye"></i>
          </button>
        </div>

        <div id="errorMsg" class="text-rose-500 text-xs font-semibold hidden flex items-center justify-center gap-1.5">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>密碼不正確，請重新輸入</span>
        </div>

        <button 
          type="button" 
          onclick="handleUnlock(event)" 
          class="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>驗證並進入</span>
          <i class="fa-solid fa-arrow-right text-sm"></i>
        </button>
      </form>

      <div class="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-center gap-1">
        <i class="fa-solid fa-lock text-[10px]"></i>
        <span>密碼防護已啟用 · 投中資訊工作小組</span>
      </div>
    </div>
  </div>

  <!-- 主內容容器 (預設鎖定隱藏) -->
  <div id="mainContent" class="opacity-0 pointer-events-none transition-opacity duration-500 pb-20">
    
    <!-- 頂部導航列 -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20">
            <i class="fa-solid fa-compass"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-slate-900 text-lg tracking-tight">南投國中 Antigravity 專案導覽總入口</span>
              <span class="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">已同步 23 個網站</span>
            </div>
            <p class="text-xs text-slate-500">來源目錄：<code>D:\\antigravity</code> · 實時 GitHub Pages 狀態檢核通過</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a 
            href="https://github.com/yaoshuchin" 
            target="_blank" 
            class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <i class="fa-brands fa-github text-sm"></i>
            <span>GitHub Profile</span>
          </a>
          <button 
            onclick="lockSession()" 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
            title="重新鎖定此頁面"
          >
            <i class="fa-solid fa-lock text-xs"></i>
            <span>重新鎖定</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 主區塊 Hero -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      <!-- 統計資訊板 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-globe"></i>
          </div>
          <div>
            <div class="text-2xl font-black text-slate-900 leading-tight" id="countTotal">23</div>
            <div class="text-xs font-medium text-slate-500">GitHub 發布網站</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <div class="text-2xl font-black text-emerald-600 leading-tight">100%</div>
            <div class="text-xs font-medium text-slate-500">連線檢核 (HTTP 200)</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-folder-tree"></i>
          </div>
          <div>
            <div class="text-2xl font-black text-slate-900 leading-tight">4 大類</div>
            <div class="text-xs font-medium text-slate-500">涵蓋領域</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-key"></i>
          </div>
          <div>
            <div class="text-2xl font-black text-amber-600 leading-tight">NATO</div>
            <div class="text-xs font-medium text-slate-500">專案存取認證機制</div>
          </div>
        </div>
      </div>

      <!-- 搜尋與篩選列 -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-8 space-y-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              type="text" 
              id="searchInput" 
              oninput="renderCards()" 
              placeholder="搜尋資料夾名稱、網站標題、網址關鍵字 (例如: 隔宿、會考、AI、公開課)..." 
              class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            >
          </div>

          <div class="flex items-center gap-2">
            <select 
              id="sortSelect" 
              onchange="renderCards()" 
              class="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-600"
            >
              <option value="date-desc">資料夾日期：由新到舊</option>
              <option value="date-asc">資料夾日期：由舊到新</option>
              <option value="title-asc">網站名稱排序</option>
            </select>

            <button 
              id="viewToggleBtn"
              onclick="toggleViewMode()" 
              class="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              title="切換檢視模式"
            >
              <i id="viewIcon" class="fa-solid fa-table-cells-large"></i>
              <span id="viewText">卡片檢視</span>
            </button>
          </div>
        </div>

        <!-- 類別標籤按鈕 -->
        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100" id="categoryTabs">
          <button 
            onclick="setCategory('全部')" 
            data-cat="全部"
            class="cat-pill active px-3.5 py-1.5 rounded-lg text-xs font-bold transition bg-indigo-600 text-white shadow-sm"
          >
            全部 (23)
          </button>
          <button 
            onclick="setCategory('AI與科技創新')" 
            data-cat="AI與科技創新"
            class="cat-pill px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            🤖 AI與科技創新
          </button>
          <button 
            onclick="setCategory('校務行政與規章')" 
            data-cat="校務行政與規章"
            class="cat-pill px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            🏫 校務行政與規章
          </button>
          <button 
            onclick="setCategory('公開觀課與評鑑')" 
            data-cat="公開觀課與評鑑"
            class="cat-pill px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            📑 公開觀課與評鑑
          </button>
          <button 
            onclick="setCategory('校園活動與安全')" 
            data-cat="校園活動與安全"
            class="cat-pill px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            ⛺ 校園活動與安全
          </button>
        </div>
      </div>

      <!-- 搜尋結果統計 -->
      <div class="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
        <span>顯示 <strong id="visibleCount" class="text-indigo-600 font-bold">23</strong> 個網站專案</span>
        <span class="text-slate-400">點擊卡片連結可直接開啟對應 GitHub Pages</span>
      </div>

      <!-- 卡片網格檢視容器 -->
      <div id="cardsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>

      <!-- 表格檢視容器 (預設隱藏) -->
      <div id="tableView" class="hidden bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th class="px-5 py-3.5">#</th>
                <th class="px-5 py-3.5">本地資料夾名稱</th>
                <th class="px-5 py-3.5">網站標題與類型</th>
                <th class="px-5 py-3.5">GitHub Pages 網址</th>
                <th class="px-5 py-3.5 text-center">狀態</th>
                <th class="px-5 py-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody id="tableBody" class="divide-y divide-slate-100"></tbody>
          </table>
        </div>
      </div>

      <!-- 無結果狀態 -->
      <div id="noResults" class="hidden py-16 text-center">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
          <i class="fa-solid fa-folder-open"></i>
        </div>
        <p class="text-slate-700 font-semibold mb-1">找不到相符的網站專案</p>
        <p class="text-slate-400 text-xs">請嘗試更換搜尋關鍵字或分類標籤</p>
      </div>

    </main>

    <!-- 頁尾 -->
    <footer class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
      <p class="mb-2 font-medium text-slate-500">南投縣立南投國民中學 · 資訊環境建設與專案導航入口</p>
      <p>資料夾路徑：<code>D:\\antigravity</code> · 密碼防護鎖：<code>nato</code> · 本站託管於 GitHub Pages</p>
    </footer>

  </div>

  <!-- 吐司通知提示 -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 transform translate-y-16 opacity-0 transition-all duration-300 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2">
    <i class="fa-solid fa-circle-check text-emerald-400"></i>
    <span id="toastMsg">已複製網址到剪貼簿</span>
  </div>

  <script>
    // 專案原始資料 (23項全檢核)
    const projects = ${JSON.stringify(enhanced, null, 2)};

    let currentCategory = '全部';
    let isTableView = false;

    // 密碼驗證邏輯 (通關密碼: nato)
    function handleUnlock(e) {
      if (e && e.preventDefault) e.preventDefault();
      const input = document.getElementById('pwdInput').value.trim();
      if (input.toLowerCase() === 'nato') {
        sessionStorage.setItem('nantou_portal_auth', 'unlocked');
        unlockUI();
      } else {
        const box = document.getElementById('modalBox');
        box.classList.remove('shake');
        void box.offsetWidth;
        box.classList.add('shake');
        document.getElementById('errorMsg').classList.remove('hidden');
        document.getElementById('pwdInput').select();
      }
    }

    function unlockUI() {
      const modal = document.getElementById('passwordModal');
      const content = document.getElementById('mainContent');
      modal.classList.add('opacity-0', 'pointer-events-none');
      content.classList.remove('opacity-0', 'pointer-events-none');
      renderCards();
    }

    function lockSession() {
      sessionStorage.removeItem('nantou_portal_auth');
      window.location.reload();
    }

    function togglePasswordVisibility() {
      const input = document.getElementById('pwdInput');
      const icon = document.getElementById('eyeIcon');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    }

    // 初始化狀態檢測
    window.addEventListener('DOMContentLoaded', () => {
      if (sessionStorage.getItem('nantou_portal_auth') === 'unlocked') {
        unlockUI();
      }
    });

    // 篩選與排序邏輯
    function setCategory(cat) {
      currentCategory = cat;
      document.querySelectorAll('.cat-pill').forEach(btn => {
        if (btn.getAttribute('data-cat') === cat) {
          btn.className = 'cat-pill active px-3.5 py-1.5 rounded-lg text-xs font-bold transition bg-indigo-600 text-white shadow-sm';
        } else {
          btn.className = 'cat-pill px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition';
        }
      });
      renderCards();
    }

    function toggleViewMode() {
      isTableView = !isTableView;
      const cardsGrid = document.getElementById('cardsGrid');
      const tableView = document.getElementById('tableView');
      const viewIcon = document.getElementById('viewIcon');
      const viewText = document.getElementById('viewText');

      if (isTableView) {
        cardsGrid.classList.add('hidden');
        tableView.classList.remove('hidden');
        viewIcon.className = 'fa-solid fa-list';
        viewText.innerText = '清單檢視';
      } else {
        cardsGrid.classList.remove('hidden');
        tableView.classList.add('hidden');
        viewIcon.className = 'fa-solid fa-table-cells-large';
        viewText.innerText = '卡片檢視';
      }
      renderCards();
    }

    function getFilteredProjects() {
      const q = document.getElementById('searchInput').value.trim().toLowerCase();
      const sort = document.getElementById('sortSelect').value;

      let list = projects.filter(p => {
        const matchCat = (currentCategory === '全部' || p.category === currentCategory);
        const matchQuery = !q || 
          p.folderName.toLowerCase().includes(q) || 
          p.title.toLowerCase().includes(q) || 
          p.pagesUrl.toLowerCase().includes(q);
        return matchCat && matchQuery;
      });

      if (sort === 'date-desc') {
        list.sort((a, b) => b.folderName.localeCompare(a.folderName, 'zh-Hant'));
      } else if (sort === 'date-asc') {
        list.sort((a, b) => a.folderName.localeCompare(b.folderName, 'zh-Hant'));
      } else if (sort === 'title-asc') {
        list.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'));
      }

      return list;
    }

    function copyToClipboard(url, name) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('已複製「' + name + '」網址！');
      }).catch(() => {
        showToast('網址：' + url);
      });
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toastMsg');
      toastMsg.innerText = msg;
      toast.classList.remove('translate-y-16', 'opacity-0');
      setTimeout(() => {
        toast.classList.add('translate-y-16', 'opacity-0');
      }, 2500);
    }

    function renderCards() {
      const list = getFilteredProjects();
      const visibleCount = document.getElementById('visibleCount');
      const noResults = document.getElementById('noResults');
      const grid = document.getElementById('cardsGrid');
      const tableBody = document.getElementById('tableBody');

      visibleCount.innerText = list.length;

      if (list.length === 0) {
        noResults.classList.remove('hidden');
        grid.innerHTML = '';
        tableBody.innerHTML = '';
        return;
      } else {
        noResults.classList.add('hidden');
      }

      // 卡片渲染
      grid.innerHTML = list.map(item => {
        const catColorClass = item.color === 'indigo' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              item.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              item.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-blue-50 text-blue-700 border-blue-200';
        return \`
          <div class="glass-card rounded-2xl p-6 flex flex-col justify-between group">
            <div>
              <!-- 頂部標籤 -->
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border \${catColorClass}">
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  \${item.category}
                </span>
                <span class="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  \${item.date}
                </span>
              </div>

              <!-- 資料夾名稱 (使用者特別強調) -->
              <div class="mb-2 flex items-start gap-2">
                <i class="fa-regular fa-folder text-amber-500 mt-0.5 text-sm shrink-0"></i>
                <div class="font-mono text-xs font-bold text-slate-500 break-all bg-slate-50 px-2 py-1 rounded border border-slate-200/60 w-full">
                  \${item.folderName}
                </div>
              </div>

              <!-- 網站標題 -->
              <h3 class="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition mb-3 line-clamp-2 leading-snug">
                <a href="\${item.pagesUrl}" target="_blank" rel="noopener noreferrer">
                  \${item.title}
                </a>
              </h3>

              <!-- 網址顯示框 -->
              <div class="mb-4">
                <div class="text-[11px] text-slate-400 font-medium mb-1">GitHub Pages 網址：</div>
                <a 
                  href="\${item.pagesUrl}" 
                  target="_blank" 
                  class="block text-xs font-mono text-blue-600 hover:text-blue-800 break-all bg-blue-50/50 hover:bg-blue-50 px-2.5 py-1.5 rounded border border-blue-100 transition"
                >
                  \${item.pagesUrl}
                </a>
              </div>
            </div>

            <!-- 底部動作按鈕 -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <a 
                href="\${item.pagesUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="flex-1 py-2 px-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
              >
                <span>開啟網站</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>

              <button 
                onclick="copyToClipboard('\${item.pagesUrl}', '\${item.folderName}')" 
                class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition border border-slate-200" 
                title="複製 GitHub Pages 網址"
              >
                <i class="fa-regular fa-copy text-sm"></i>
              </button>

              <a 
                href="\${item.repoUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition border border-slate-200" 
                title="檢視 GitHub 原始碼庫"
              >
                <i class="fa-brands fa-github text-sm"></i>
              </a>
            </div>
          </div>
        \`;
      }).join('');

      // 表格渲染
      tableBody.innerHTML = list.map((item, index) => \`
        <tr class="hover:bg-slate-50 transition">
          <td class="px-5 py-4 font-mono text-slate-400">\${index + 1}</td>
          <td class="px-5 py-4 font-mono font-bold text-slate-700 text-xs">\${item.folderName}</td>
          <td class="px-5 py-4">
            <div class="font-bold text-slate-900">\${item.title}</div>
            <span class="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">\${item.category}</span>
          </td>
          <td class="px-5 py-4 font-mono">
            <a href="\${item.pagesUrl}" target="_blank" class="text-indigo-600 hover:underline break-all">\${item.pagesUrl}</a>
          </td>
          <td class="px-5 py-4 text-center">
            <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              200 OK
            </span>
          </td>
          <td class="px-5 py-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-2">
              <a href="\${item.pagesUrl}" target="_blank" class="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700">開啟</a>
              <button onclick="copyToClipboard('\${item.pagesUrl}', '\${item.folderName}')" class="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"><i class="fa-regular fa-copy"></i></button>
            </div>
          </td>
        </tr>
      \`).join('');
    }
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', htmlContent, 'utf8');
console.log('Successfully generated index.html!');
