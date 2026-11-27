const fs = require('fs');

const projects = JSON.parse(fs.readFileSync('portal_data.json', 'utf8'));

// Generate README.md
let readmeContent = `# 南投國中 Antigravity 專案導覽總入口網 (Web Hub & Portal)

> 本站全面彙整 \`D:\\antigravity\` 與 \`yaoshuchin\` 組織中所有已發布至 GitHub Pages 之網站專案，提供一站式搜尋、篩選、QR Code 掃描與站內預覽導航服務。

---

## 🔐 門禁密碼防護

- **存取密碼**：\`nato\`
- **防護機制**：客戶端模態密碼鎖，支援連線工作階段記憶（Session Unlock）與一鍵重新鎖定。

---

## 📊 平台站點總覽統計 (共 ${projects.length} 個線上專案)

| 主題分類 | 收錄專案數 | 代表特色 |
|---|---|---|
| 🏫 投中校務與班級成果 | ${projects.filter(p => p.category === '投中校務與班級成果').length} | 隔宿露營、畢業旅行、社團點名、體班與藝材班評鑑、安全專頁、座位表 |
| 🤖 AI教學與行政賦能 | ${projects.filter(p => p.category === 'AI教學與行政賦能').length} | Gemini、Claude Code、Codex AI Agent、各校名師研習實戰工具箱 |
| 📚 創新教案與公開觀課 | ${projects.filter(p => p.category === '創新教案與公開觀課').length} | 英語資源班、生活科技、石伯華公開課、鳳鳴國中科技領域觀課 |
| 🗂️ 研習數位典藏與看板 | ${projects.filter(p => p.category === '研習數位典藏與看板').length} | 夢N、基隆AI工作坊、Padlet 100%鏡像、紅焰自動化備課 |
| 🎮 互動教材與數位工具 | ${projects.filter(p => p.category === '互動教材與數位工具').length} | 四年級數學/國語探索島、益智RPG、光環反應燈、QR萬用工具箱 |

---

## 📋 已發布網站完整清單

| # | 日期 | 專案分類 | 網站名稱 | GitHub Pages 線上網址 | GitHub 原始碼 |
|---|---|---|---|---|---|
`;

projects.forEach((p, idx) => {
  readmeContent += `| ${idx + 1} | \`${p.date}\` | ${p.category} | ${p.title.replace(/\|/g, '\\|')} | [開啟網站](${p.pagesUrl}) | [Repo](${p.repoUrl}) |\n`;
});

readmeContent += `
---

## 🚀 部署資訊

- **維護者**：yaoshuchin (南投國中)
- **總入口網址**：[https://yaoshuchin.github.io/1151127-antigravity-hub/](https://yaoshuchin.github.io/1151127-antigravity-hub/)
- **託管平台**：GitHub Pages
`;

fs.writeFileSync('README.md', readmeContent, 'utf8');
console.log('README.md generated successfully!');

// Generate index.html
const projectsJsonString = JSON.stringify(projects).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

const htmlContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>南投國中 Antigravity 專案導覽總入口網</title>
  <meta name="description" content="南投國中 Antigravity 專案導覽總入口網，彙整全校教學、AI賦能、研習典藏與數位工具等 108+ 線上專案。">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Font Awesome 6 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <!-- QRCode.js CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap');
    
    body {
      font-family: 'Noto Sans TC', 'Plus Jakarta Sans', sans-serif;
    }
    
    .glass-nav {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.9);
      transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .glass-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 25px -5px rgba(30, 58, 138, 0.08), 0 10px 10px -5px rgba(30, 58, 138, 0.04);
      border-color: #60a5fa;
    }
    
    .badge-campus { background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .badge-ai { background-color: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; }
    .badge-curriculum { background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .badge-archives { background-color: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; }
    .badge-tools { background-color: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

    .shake {
      animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-2px, 0, 0); }
      20%, 80% { transform: translate3d(4px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
      40%, 60% { transform: translate3d(6px, 0, 0); }
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  </style>
</head>
<body class="bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 min-h-screen text-slate-800 antialiased selection:bg-indigo-500 selection:text-white pb-20">

  <!-- 門禁密碼驗證模態 (NATO保護) -->
  <div id="passwordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md px-4 transition-all duration-300">
    <div id="modalBox" class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100 text-center relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"></div>
      
      <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl shadow-inner border border-indigo-100">
        <i class="fa-solid fa-shield-halved"></i>
      </div>
      
      <h2 class="text-2xl font-black text-slate-900 mb-2">南投國中專案導覽總入口</h2>
      <p class="text-slate-500 text-sm mb-6 leading-relaxed">
        本站彙整收錄 <code class="bg-slate-100 px-2 py-0.5 rounded text-indigo-600 font-mono text-xs">yaoshuchin</code> 旗下共 108+ 個已發布成果網站。<br>請輸入存取通行密碼以解鎖瀏覽。
      </p>

      <form id="pwdForm" onsubmit="handleUnlock(event); return false;" class="space-y-4">
        <div class="relative">
          <input 
            type="password" 
            id="pwdInput" 
            placeholder="請輸入存取密碼 (預設: nato)" 
            autocomplete="current-password"
            class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 text-center text-lg font-mono tracking-widest outline-none transition"
            required
            autofocus
          >
        </div>
        <p id="errorMsg" class="text-red-500 text-xs font-semibold hidden flex items-center justify-center gap-1">
          <i class="fa-solid fa-circle-exclamation"></i> 密碼錯誤，請重新輸入！
        </p>
        <button 
          type="submit" 
          id="unlockBtn"
          class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <i class="fa-solid fa-lock-open text-sm"></i> 驗證並解鎖入口網
        </button>
      </form>
      <div class="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
        <span>南投縣立南投國民中學</span>
        <span class="font-mono">SESSION-SECURED</span>
      </div>
    </div>
  </div>

  <!-- 頂部浮動導航列 -->
  <nav class="sticky top-0 z-40 glass-nav">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <!-- Logo 與標題 -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <i class="fa-solid fa-compass text-xl"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 bg-clip-text text-transparent">
                南投國中 Antigravity
              </span>
              <span class="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                Hub v2.0
              </span>
            </div>
            <p class="text-[11px] sm:text-xs text-slate-500 font-medium">全校雲端成果網站一站式導覽入口網</p>
          </div>
        </div>

        <!-- 導航列右側操作 -->
        <div class="flex items-center gap-2 sm:gap-3">
          <a 
            href="https://github.com/yaoshuchin/1151127-antigravity-hub" 
            target="_blank" 
            rel="noopener noreferrer"
            class="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1.5"
            title="查看本入口網 GitHub 儲存庫"
          >
            <i class="fa-brands fa-github text-base"></i>
            <span class="hidden sm:inline">儲存庫</span>
          </a>
          <button 
            onclick="lockSession()" 
            class="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition flex items-center gap-1.5"
            title="安全重新鎖定"
          >
            <i class="fa-solid fa-lock text-xs"></i>
            <span class="hidden sm:inline">重新鎖定</span>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- 主內容容器 -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

    <!-- 頂部橫幅 Hero Section -->
    <div class="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-10 shadow-xl shadow-indigo-950/20 mb-8 overflow-hidden">
      <!-- 裝飾背景光暈 -->
      <div class="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-16 -bottom-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-4 backdrop-blur-sm">
          <i class="fa-solid fa-circle-check text-emerald-400"></i>
          <span>108 個站點 100% 在線運行中</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
          南投國中數位成果與教學專案總目錄
        </h1>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          收錄校務行政、AI 教學工具、學科公開課、研習數位典藏鏡像及課堂互動教材，支援全站即時快搜、手機 QR Code 掃描與站內即時預覽。
        </p>
      </div>

      <!-- 統計數據卡片列 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/10">
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <div class="text-xs text-slate-300 font-medium mb-1 flex items-center gap-1.5">
            <i class="fa-solid fa-globe text-cyan-400"></i> 線上站點總數
          </div>
          <div class="text-2xl sm:text-3xl font-black text-white" id="statTotal">108</div>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <div class="text-xs text-slate-300 font-medium mb-1 flex items-center gap-1.5">
            <i class="fa-solid fa-layer-group text-indigo-400"></i> 主題分類
          </div>
          <div class="text-2xl sm:text-3xl font-black text-white">5 大領域</div>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <div class="text-xs text-slate-300 font-medium mb-1 flex items-center gap-1.5">
            <i class="fa-solid fa-star text-amber-400"></i> 我的最愛收藏
          </div>
          <div class="text-2xl sm:text-3xl font-black text-amber-300" id="statFavorites">0</div>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <div class="text-xs text-slate-300 font-medium mb-1 flex items-center gap-1.5">
            <i class="fa-solid fa-bolt text-emerald-400"></i> 服務可用率
          </div>
          <div class="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
        </div>
      </div>
    </div>

    <!-- 搜尋與控制工具列 -->
    <div class="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-6 space-y-4">
      <!-- 搜尋框與檢視切換 -->
      <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <!-- 搜尋列 -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <input 
            type="text" 
            id="searchInput" 
            oninput="handleSearch()"
            placeholder="搜尋站點名稱、簡介、代號或主題關鍵字 (例如: 露營、AI、數學、橘子老師)..." 
            class="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm font-medium transition outline-none"
          >
          <button 
            id="clearSearchBtn" 
            onclick="clearSearch()"
            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 hidden"
          >
            <i class="fa-solid fa-circle-xmark text-sm"></i>
          </button>
        </div>

        <!-- 排序方式與顯示切換 -->
        <div class="flex items-center gap-2">
          <!-- 排序選單 -->
          <div class="relative">
            <select 
              id="sortSelect" 
              onchange="handleSort()"
              class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-2xl pl-3.5 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="date-desc">發布日期 (最新優先)</option>
              <option value="date-asc">發布日期 (由舊到新)</option>
              <option value="name-asc">專案代號 (A - Z)</option>
              <option value="title-asc">專案標題排序</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <i class="fa-solid fa-chevron-down text-xs"></i>
            </div>
          </div>

          <!-- 檢視模式切換 (網格 / 清單) -->
          <div class="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button 
              id="viewGridBtn" 
              onclick="setViewMode('grid')" 
              class="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-indigo-700 shadow-sm transition"
              title="卡片網格檢視"
            >
              <i class="fa-solid fa-grip"></i>
            </button>
            <button 
              id="viewListBtn" 
              onclick="setViewMode('list')" 
              class="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
              title="條列清單檢視"
            >
              <i class="fa-solid fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 分類標籤頁切換列 Filter Chips -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs sm:text-sm font-semibold" id="categoryTabs">
        <!-- JS 動態渲染標籤 -->
      </div>
    </div>

    <!-- 即時狀態提示列 -->
    <div class="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium px-2 mb-4">
      <div>
        顯示 <span id="showingCount" class="font-bold text-slate-800">108</span> 個專案網站
        <span id="activeFilterBadge" class="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 hidden"></span>
      </div>
      <div class="text-xs text-slate-400">
        點擊 <i class="fa-regular fa-star text-amber-500"></i> 可加為常用最愛
      </div>
    </div>

    <!-- 網站展示容器 (網格視圖) -->
    <div id="gridContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <!-- JS 動態生成卡片 -->
    </div>

    <!-- 網站展示容器 (清單條列視圖) -->
    <div id="listContainer" class="hidden bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th class="py-3.5 px-4 w-12 text-center">#</th>
              <th class="py-3.5 px-4">網站名稱與簡介</th>
              <th class="py-3.5 px-4 w-40">分類</th>
              <th class="py-3.5 px-4 w-28">日期</th>
              <th class="py-3.5 px-4 w-48 text-right">功能操作</th>
            </tr>
          </thead>
          <tbody id="listTableBody" class="divide-y divide-slate-100 text-sm">
            <!-- JS 動態生成表格列 -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- 無搜尋結果提示 -->
    <div id="noResults" class="hidden py-16 text-center">
      <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl">
        <i class="fa-solid fa-folder-open"></i>
      </div>
      <h3 class="text-base font-bold text-slate-700 mb-1">找不到符合的專案網站</h3>
      <p class="text-slate-400 text-xs mb-4">請嘗試更換關鍵字或點擊下方按鈕重設篩選</p>
      <button 
        onclick="clearSearch(); setCategory('all');" 
        class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition"
      >
        重設所有搜尋條件
      </button>
    </div>

  </main>

  <!-- QR Code 彈窗 Modal -->
  <div id="qrModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 hidden transition-opacity duration-200">
    <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-100 relative">
      <button onclick="closeQrModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 transition">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">
        <i class="fa-solid fa-qrcode"></i>
      </div>
      <h3 id="qrModalTitle" class="text-base font-bold text-slate-900 mb-1 line-clamp-1">手機即時掃描</h3>
      <p class="text-xs text-slate-500 mb-4">使用相機或 LINE 掃描 QR 碼，即可以行動裝置體驗此網站</p>
      
      <div class="bg-slate-50 p-4 rounded-2xl inline-block border border-slate-200 mb-4 shadow-inner">
        <div id="qrcodeBox" class="flex items-center justify-center"></div>
      </div>
      
      <div class="flex gap-2">
        <a id="qrOpenBtn" href="#" target="_blank" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> 開啟網站
        </a>
        <button onclick="copyCurrentQrUrl()" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
          <i class="fa-regular fa-copy"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- 站內預覽彈窗 Modal (Iframe) -->
  <div id="previewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-6 hidden transition-opacity duration-200">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden border border-slate-200">
      <!-- 彈窗頂部工具列 -->
      <div class="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs shrink-0">
            <i class="fa-solid fa-display"></i>
          </div>
          <div class="overflow-hidden">
            <h4 id="previewModalTitle" class="text-sm font-bold truncate">站點預覽</h4>
            <p id="previewModalUrl" class="text-[11px] text-slate-400 font-mono truncate">url</p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <a id="previewOpenTabBtn" href="#" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition flex items-center gap-1">
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> 新分頁開啟
          </a>
          <button onclick="closePreviewModal()" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>
      <!-- Iframe 區域 -->
      <div class="flex-1 bg-slate-100 relative">
        <div id="previewLoading" class="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div class="text-center">
            <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p class="text-xs text-slate-500 font-medium">載入網站預覽中...</p>
          </div>
        </div>
        <iframe id="previewIframe" src="" class="w-full h-full border-0" onload="document.getElementById('previewLoading').classList.add('hidden');"></iframe>
      </div>
    </div>
  </div>

  <!-- Toast 通知提示 -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
    <div class="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-slate-800">
      <i id="toastIcon" class="fa-solid fa-circle-check text-emerald-400"></i>
      <span id="toastMsg">通知訊息</span>
    </div>
  </div>

  <!-- 回頂部按鈕 -->
  <button 
    id="backToTopBtn" 
    onclick="window.scrollTo({ top: 0, behavior: 'smooth' })"
    class="fixed bottom-6 left-6 z-30 w-11 h-11 bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center text-sm transition transform translate-y-20 opacity-0"
    title="回到頂部"
  >
    <i class="fa-solid fa-arrow-up"></i>
  </button>

  <!-- 資料載入與主腳本 -->
  <script>
    // 專案資料庫 (共 ${projects.length} 站點)
    const ALL_PROJECTS = ${projectsJsonString};

    // 系統狀態
    const STATE = {
      search: '',
      category: 'all',
      sort: 'date-desc',
      viewMode: 'grid',
      favorites: JSON.parse(localStorage.getItem('ntjh_hub_favs') || '[]'),
      currentQrUrl: ''
    };

    // 分類配置
    const CATEGORIES = [
      { key: 'all', name: '全部站點', icon: 'fa-globe', count: ALL_PROJECTS.length },
      { key: 'campus', name: '投中校務與班級', icon: 'fa-school', count: ALL_PROJECTS.filter(p => p.categoryKey === 'campus').length },
      { key: 'ai', name: 'AI教學與行政賦能', icon: 'fa-robot', count: ALL_PROJECTS.filter(p => p.categoryKey === 'ai').length },
      { key: 'curriculum', name: '創新教案與公開課', icon: 'fa-chalkboard-user', count: ALL_PROJECTS.filter(p => p.categoryKey === 'curriculum').length },
      { key: 'archives', name: '研習典藏與看板', icon: 'fa-box-archive', count: ALL_PROJECTS.filter(p => p.categoryKey === 'archives').length },
      { key: 'tools', name: '互動教材與數位工具', icon: 'fa-gamepad', count: ALL_PROJECTS.filter(p => p.categoryKey === 'tools').length },
      { key: 'favorites', name: '常用收藏', icon: 'fa-star', count: 0 }
    ];

    // 初始化執行
    document.addEventListener('DOMContentLoaded', () => {
      checkAuth();
      renderCategoryTabs();
      updateFavoriteCount();
      renderProjects();
      setupScrollListener();
    });

    // 1. 門禁驗證機制 (nato)
    function checkAuth() {
      const unlocked = sessionStorage.getItem('ntjh_hub_unlocked');
      const modal = document.getElementById('passwordModal');
      if (unlocked === 'true') {
        modal.classList.add('hidden');
      } else {
        modal.classList.remove('hidden');
        setTimeout(() => document.getElementById('pwdInput').focus(), 150);
      }
    }

    function handleUnlock(e) {
      if (e) e.preventDefault();
      const input = document.getElementById('pwdInput');
      const errorMsg = document.getElementById('errorMsg');
      const modalBox = document.getElementById('modalBox');

      if (input.value.trim().toLowerCase() === 'nato') {
        sessionStorage.setItem('ntjh_hub_unlocked', 'true');
        document.getElementById('passwordModal').classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          document.getElementById('passwordModal').classList.add('hidden');
        }, 300);
        showToast('門禁驗證成功，歡迎使用！', 'success');
      } else {
        errorMsg.classList.remove('hidden');
        modalBox.classList.add('shake');
        setTimeout(() => modalBox.classList.remove('shake'), 400);
        input.value = '';
        input.focus();
      }
    }

    function lockSession() {
      sessionStorage.removeItem('ntjh_hub_unlocked');
      location.reload();
    }

    // 2. 分類標籤切換
    function renderCategoryTabs() {
      const container = document.getElementById('categoryTabs');
      container.innerHTML = CATEGORIES.map(cat => {
        const isActive = STATE.category === cat.key;
        const activeClass = isActive 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200';
        return \`
          <button 
            onclick="setCategory('\${cat.key}')" 
            class="px-3.5 py-2 rounded-2xl flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer \${activeClass}"
          >
            <i class="fa-solid \${cat.icon} text-xs"></i>
            <span>\${cat.name}</span>
            <span class="text-[11px] px-1.5 py-0.2 rounded-full \${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}" id="cat-count-\${cat.key}">
              \${cat.count}
            </span>
          </button>
        \`;
      }).join('');
    }

    function setCategory(key) {
      STATE.category = key;
      renderCategoryTabs();
      renderProjects();
    }

    // 3. 搜尋與排序
    function handleSearch() {
      STATE.search = document.getElementById('searchInput').value.trim().toLowerCase();
      const clearBtn = document.getElementById('clearSearchBtn');
      if (STATE.search) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
      renderProjects();
    }

    function clearSearch() {
      document.getElementById('searchInput').value = '';
      STATE.search = '';
      document.getElementById('clearSearchBtn').classList.add('hidden');
      renderProjects();
    }

    function handleSort() {
      STATE.sort = document.getElementById('sortSelect').value;
      renderProjects();
    }

    function setViewMode(mode) {
      STATE.viewMode = mode;
      const gridBtn = document.getElementById('viewGridBtn');
      const listBtn = document.getElementById('viewListBtn');
      const gridContainer = document.getElementById('gridContainer');
      const listContainer = document.getElementById('listContainer');

      if (mode === 'grid') {
        gridBtn.className = 'px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-indigo-700 shadow-sm transition';
        listBtn.className = 'px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition';
        gridContainer.classList.remove('hidden');
        listContainer.classList.add('hidden');
      } else {
        listBtn.className = 'px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-indigo-700 shadow-sm transition';
        gridBtn.className = 'px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition';
        gridContainer.classList.add('hidden');
        listContainer.classList.remove('hidden');
      }
      renderProjects();
    }

    // 4. 收藏機制
    function toggleFavorite(id) {
      const idx = STATE.favorites.indexOf(id);
      if (idx > -1) {
        STATE.favorites.splice(idx, 1);
        showToast('已自收藏中移除', 'info');
      } else {
        STATE.favorites.push(id);
        showToast('已加入常用收藏！', 'success');
      }
      localStorage.setItem('ntjh_hub_favs', JSON.stringify(STATE.favorites));
      updateFavoriteCount();
      renderProjects();
    }

    function updateFavoriteCount() {
      const count = STATE.favorites.length;
      document.getElementById('statFavorites').textContent = count;
      const favCat = CATEGORIES.find(c => c.key === 'favorites');
      if (favCat) favCat.count = count;
      const favBadge = document.getElementById('cat-count-favorites');
      if (favBadge) favBadge.textContent = count;
    }

    // 5. 資料篩選與渲染
    function getFilteredProjects() {
      return ALL_PROJECTS.filter(p => {
        // 分類過濾
        if (STATE.category === 'favorites') {
          if (!STATE.favorites.includes(p.id)) return false;
        } else if (STATE.category !== 'all') {
          if (p.categoryKey !== STATE.category) return false;
        }

        // 搜尋關鍵字過濾
        if (STATE.search) {
          const matchTitle = p.title.toLowerCase().includes(STATE.search);
          const matchDesc = p.desc.toLowerCase().includes(STATE.search);
          const matchName = p.name.toLowerCase().includes(STATE.search);
          const matchDate = p.date.toLowerCase().includes(STATE.search);
          const matchCat = p.category.toLowerCase().includes(STATE.search);
          if (!matchTitle && !matchDesc && !matchName && !matchDate && !matchCat) {
            return false;
          }
        }

        return true;
      }).sort((a, b) => {
        if (STATE.sort === 'date-desc') return b.date.localeCompare(a.date, 'zh-Hant');
        if (STATE.sort === 'date-asc') return a.date.localeCompare(b.date, 'zh-Hant');
        if (STATE.sort === 'name-asc') return a.name.localeCompare(b.name, 'zh-Hant');
        if (STATE.sort === 'title-asc') return a.title.localeCompare(b.title, 'zh-Hant');
        return 0;
      });
    }

    function renderProjects() {
      const filtered = getFilteredProjects();
      const gridContainer = document.getElementById('gridContainer');
      const listTableBody = document.getElementById('listTableBody');
      const noResults = document.getElementById('noResults');
      const showingCount = document.getElementById('showingCount');

      showingCount.textContent = filtered.length;

      if (filtered.length === 0) {
        gridContainer.innerHTML = '';
        listTableBody.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
      }
      noResults.classList.add('hidden');

      // 渲染網格卡片
      gridContainer.innerHTML = filtered.map(p => {
        const isFav = STATE.favorites.includes(p.id);
        const badgeClass = 'badge-' + p.categoryKey;
        return \`
          <div class="glass-card rounded-3xl p-5 flex flex-col justify-between relative group">
            <div>
              <!-- 頂部資訊與收藏 -->
              <div class="flex items-center justify-between mb-3 text-xs">
                <span class="px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 \${badgeClass}">
                  <i class="fa-solid \${p.icon}"></i> \${p.category}
                </span>
                <div class="flex items-center gap-1">
                  <span class="text-slate-400 font-mono text-[11px]">\${p.date}</span>
                  <button 
                    onclick="toggleFavorite(\${p.id})" 
                    class="w-7 h-7 rounded-lg flex items-center justify-center transition \${isFav ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500'}"
                    title="\${isFav ? '取消收藏' : '加入收藏'}"
                  >
                    <i class="\${isFav ? 'fa-solid' : 'fa-regular'} fa-star text-sm"></i>
                  </button>
                </div>
              </div>

              <!-- 標題 -->
              <h3 class="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition duration-200 line-clamp-2 mb-2">
                \${p.title}
              </h3>

              <!-- 簡介摘要 -->
              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                \${p.desc}
              </p>
            </div>

            <!-- 底部動作工具列 -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <!-- 前往網站 -->
              <a 
                href="\${p.pagesUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1"
              >
                <span>開啟站點</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>

              <!-- 預覽 -->
              <button 
                onclick="openPreview('\${p.pagesUrl}', '\${escapeHtml(p.title)}')"
                class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center text-xs transition"
                title="站內即時預覽"
              >
                <i class="fa-solid fa-eye"></i>
              </button>

              <!-- QR Code -->
              <button 
                onclick="openQrModal('\${p.pagesUrl}', '\${escapeHtml(p.title)}')"
                class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center text-xs transition"
                title="產生行動 QR Code"
              >
                <i class="fa-solid fa-qrcode"></i>
              </button>

              <!-- 複製網址 -->
              <button 
                onclick="copyToClipboard('\${p.pagesUrl}')"
                class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition"
                title="複製網址"
              >
                <i class="fa-regular fa-copy"></i>
              </button>

              <!-- GitHub Repo -->
              <a 
                href="\${p.repoUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition"
                title="查看 GitHub 原始碼"
              >
                <i class="fa-brands fa-github text-sm"></i>
              </a>
            </div>
          </div>
        \`;
      }).join('');

      // 渲染條列表格
      listTableBody.innerHTML = filtered.map((p, idx) => {
        const isFav = STATE.favorites.includes(p.id);
        const badgeClass = 'badge-' + p.categoryKey;
        return \`
          <tr class="hover:bg-slate-50/80 transition">
            <td class="py-3 px-4 text-center text-xs text-slate-400 font-mono">\${idx + 1}</td>
            <td class="py-3 px-4">
              <div class="flex items-start gap-2">
                <button onclick="toggleFavorite(\${p.id})" class="mt-0.5 \${isFav ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'}">
                  <i class="\${isFav ? 'fa-solid' : 'fa-regular'} fa-star text-xs"></i>
                </button>
                <div>
                  <a href="\${p.pagesUrl}" target="_blank" class="font-bold text-slate-800 hover:text-indigo-600 transition text-sm">
                    \${p.title}
                  </a>
                  <p class="text-xs text-slate-400 font-mono mt-0.5">\${p.name}</p>
                </div>
              </div>
            </td>
            <td class="py-3 px-4">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold \${badgeClass}">
                <i class="fa-solid \${p.icon} text-[10px]"></i> \${p.category}
              </span>
            </td>
            <td class="py-3 px-4 text-xs font-mono text-slate-500">\${p.date}</td>
            <td class="py-3 px-4 text-right">
              <div class="inline-flex items-center gap-1.5">
                <a href="\${p.pagesUrl}" target="_blank" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition">
                  開啟
                </a>
                <button onclick="openPreview('\${p.pagesUrl}', '\${escapeHtml(p.title)}')" class="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-xs transition" title="預覽">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button onclick="openQrModal('\${p.pagesUrl}', '\${escapeHtml(p.title)}')" class="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-xs transition" title="QR Code">
                  <i class="fa-solid fa-qrcode"></i>
                </button>
                <a href="\${p.repoUrl}" target="_blank" class="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-xs transition" title="Repo">
                  <i class="fa-brands fa-github"></i>
                </a>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    // 6. QR Code 彈窗操作
    let qrInstance = null;
    function openQrModal(url, title) {
      STATE.currentQrUrl = url;
      document.getElementById('qrModalTitle').textContent = title;
      document.getElementById('qrOpenBtn').href = url;
      
      const box = document.getElementById('qrcodeBox');
      box.innerHTML = '';
      qrInstance = new QRCode(box, {
        text: url,
        width: 180,
        height: 180,
        colorDark: "#1e1b4b",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });

      document.getElementById('qrModal').classList.remove('hidden');
    }

    function closeQrModal() {
      document.getElementById('qrModal').classList.add('hidden');
    }

    function copyCurrentQrUrl() {
      if (STATE.currentQrUrl) {
        copyToClipboard(STATE.currentQrUrl);
      }
    }

    // 7. 站內預覽彈窗 (Iframe)
    function openPreview(url, title) {
      document.getElementById('previewModalTitle').textContent = title;
      document.getElementById('previewModalUrl').textContent = url;
      document.getElementById('previewOpenTabBtn').href = url;
      document.getElementById('previewLoading').classList.remove('hidden');
      document.getElementById('previewIframe').src = url;
      document.getElementById('previewModal').classList.remove('hidden');
    }

    function closePreviewModal() {
      document.getElementById('previewIframe').src = '';
      document.getElementById('previewModal').classList.add('hidden');
    }

    // 8. 複製與 Toast 提示
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('已複製網址到剪貼簿！', 'success');
      }).catch(() => {
        showToast('複製失敗，請手動複製', 'error');
      });
    }

    function showToast(msg, type = 'success') {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toastMsg');
      const toastIcon = document.getElementById('toastIcon');

      toastMsg.textContent = msg;
      if (type === 'success') {
        toastIcon.className = 'fa-solid fa-circle-check text-emerald-400';
      } else if (type === 'error') {
        toastIcon.className = 'fa-solid fa-circle-xmark text-rose-400';
      } else {
        toastIcon.className = 'fa-solid fa-circle-info text-sky-400';
      }

      toast.classList.remove('translate-y-20', 'opacity-0');
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 2500);
    }

    // 9. 回頂部按鈕監聽
    function setupScrollListener() {
      const btn = document.getElementById('backToTopBtn');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          btn.classList.remove('translate-y-20', 'opacity-0');
        } else {
          btn.classList.add('translate-y-20', 'opacity-0');
        }
      });
    }

    function escapeHtml(str) {
      return (str || '').replace(/'/g, "\\\\'");
    }
  </script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent, 'utf8');
console.log('index.html generated successfully!');
