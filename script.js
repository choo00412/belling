let projects = {};
let wishList = [];
let scrapList = [];
let compareLogs = [];
let deletedCands = [];
let taggedWorksData = [];
let readWorksList = [];
let tagCategories = [];
let readingBooks = []; 

let currentId = null;
let draggedItem = null;
let draggedCatItem = null;
let isDragging = false;
let pendingProjectType = ''; 
let currentCompareTier = null; 
let currentRankArr = [];
let draggedReadWorkIndex = null;
let currentReadingBookId = null;

const initialWorksData = [
  {id: "w1", title: "징크스", top: "주재경", bottom: "김단", tags: { title: [], top: [], bottom: [] }},
  {id: "w2", title: "홍실 퀘스트", top: "이연", bottom: "홍기훈", tags: { title: [], top: [], bottom: [] }},
  {id: "w3", title: "물가의 밤", top: "여태주", bottom: "김의현", tags: { title: [], top: [], bottom: [] }}
];

const webtoonCategories = [
  { color: "bg-skyblue", zoneId: "pool-skyblue", list: ["코드네임 아나스타샤", "시맨틱 에러", "해피투게더", "패션", "반칙"] },
  { color: "bg-red", zoneId: "pool-red", list: ["야화첩", "장미와 샴페인", "징크스", "외사랑", "너드프로젝트"] },
  { color: "bg-yellow-light", zoneId: "pool-yellow", list: ["물가의 밤", "홍실퀘스트", "귀태", "페이백", "엔네아드"] }
];

const initialTagCategories = [
  { type: 'genre', name: '장르/배경/세계관', colorClass: 'kw-genre', items: ["현대물", "시대물", "동양풍", "서양풍", "판타지", "오메가버스", "캠퍼스물", "오피스물(리만물)"] },
  { type: 'top', name: '공 키워드', colorClass: 'kw-top', items: ["다정공", "집착공", "후회공", "능글공", "광공", "무심공", "복흑/계략공", "연하공"] },
  { type: 'bottom', name: '수 키워드', colorClass: 'kw-bottom', items: ["다정수", "까칠수", "처연수", "굴림수", "도망수", "햇살수", "유혹수", "단정수"] },
  { type: 'plot', name: '관계성/전개', colorClass: 'kw-plot', items: ["배틀연애", "애증", "구원물", "역키잡", "소꿉친구", "계약연애", "피폐물", "달달물"] }
];

const heartRankData = ["징크스", "물가의 밤", "야화첩", "장미와 샴페인", "패션", "시맨틱 에러"];

function getDynamicWebtoonList() {
    return readWorksList.map(w => w.name);
}

async function initApp() {
  if (!window.db) { setTimeout(initApp, 100); return; }
  try {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js");
    const dbRef = doc(window.db, "ti_me_data", "my_shared_data"); 
    const snap = await getDoc(dbRef);
    if (snap.exists()) {
      const data = snap.data(); projects = data.projects || {}; wishList = data.wishList || []; scrapList = data.scrapList || []; compareLogs = data.compareLogs || []; deletedCands = data.deletedCands || []; taggedWorksData = data.taggedWorksData || JSON.parse(JSON.stringify(initialWorksData)); tagCategories = data.tagCategories || initialTagCategories; readWorksList = data.readWorksList || []; readingBooks = data.readingBooks || [];
    } else { taggedWorksData = JSON.parse(JSON.stringify(initialWorksData)); tagCategories = initialTagCategories; }
  } catch (e) { console.error("로드 실패:", e); taggedWorksData = JSON.parse(JSON.stringify(initialWorksData)); tagCategories = initialTagCategories; }
  initReadWorksList(); renderHome();
  if(document.getElementById('work-grid-view')) renderTaggingGrid();
  if(document.getElementById('read-works-grid')) renderReadWorks();
  if(document.getElementById('reading-book-grid')) renderReadingBooks();
}
initApp();

window.saveAllData = async function() {
  if (!window.db) return;
  try {
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js");
    const dbRef = doc(window.db, "ti_me_data", "my_shared_data");
    await setDoc(dbRef, { projects, wishList, scrapList, compareLogs, deletedCands, taggedWorksData, tagCategories, readWorksList, readingBooks });
  } catch (error) { console.error("저장 실패:", error); }
}

function saveData() { saveAllData(); } function saveWish() { saveAllData(); } function saveScraps() { saveAllData(); } function saveLogs() { saveAllData(); } function saveDeletedCands() { saveAllData(); } function saveTaggingData() { saveAllData(); } function saveReadWorks() { saveAllData(); } function saveReadingLogData() { saveAllData(); }

const modal = document.getElementById('custom-modal'); const modalInput = document.getElementById('modal-input');
document.getElementById('btn-new-tier').addEventListener('click', () => openModal('tier')); document.getElementById('btn-new-ranking').addEventListener('click', () => openModal('ranking'));
function openModal(type) { pendingProjectType = type; modalInput.value = ''; modal.style.display = 'flex'; modalInput.focus(); }
document.getElementById('modal-cancel').addEventListener('click', () => { modal.style.display = 'none'; });
document.getElementById('modal-confirm').addEventListener('click', () => { const title = modalInput.value.trim(); if (title) { createProject(pendingProjectType, title); modal.style.display = 'none'; } });

function getNextTitle(baseTitle) {
  const existingTitles = Object.values(projects).map(p => p.title); if (!existingTitles.includes(baseTitle)) return baseTitle;
  let count = 2; while (existingTitles.includes(`${baseTitle} ${count}`)) count++; return `${baseTitle} ${count}`;
}

document.getElementById('btn-auto-webtoon-tier').addEventListener('click', () => createAutoProject('tier'));
document.getElementById('btn-auto-webtoon-ranking').addEventListener('click', () => createAutoProject('ranking'));
document.getElementById('btn-auto-keyword-tier').addEventListener('click', () => {
  const id = Date.now().toString(); projects[id] = { id, title: getNextTitle('🔑 내 취향 키워드 랭킹'), type: 'tier', subType: 'keyword', items: [] }; let itemIndex = 0;
  tagCategories.forEach(category => { category.items.forEach(name => { projects[id].items.push({ itemId: id + '-kw-' + (itemIndex++), name: name, memo: '', img: null, zone: category.type === 'genre' ? 'pool-genre' : (category.type === 'top' ? 'pool-top' : (category.type === 'bottom' ? 'pool-bottom' : 'pool-plot')), color: category.colorClass.replace('kw-', 'bg-') }); }); });
  saveData(); renderHome(); openProject(id);
});

function createAutoProject(type) {
  const id = Date.now().toString(); projects[id] = { id, title: getNextTitle('웹툰 취향 리스트'), type: type, subType: 'webtoon', items: [] }; let itemIndex = 0;
  readWorksList.forEach(work => { projects[id].items.push({ itemId: id + '-' + (itemIndex++), name: work.name, memo: '', img: null, zone: work.colorClass === 'bg-skyblue' ? 'pool-skyblue' : (work.colorClass === 'bg-red' ? 'pool-red' : 'pool-yellow'), color: work.colorClass }); });
  saveData(); renderHome(); openProject(id);
}

function createProject(type, title) { const id = Date.now().toString(); projects[id] = { id, title, type, subType: 'custom', items: [] }; saveData(); renderHome(); openProject(id); }

function renderHome() {
  const list = document.getElementById('project-list'); list.innerHTML = '';
  Object.values(projects).forEach(p => {
    const card = document.createElement('div'); card.className = 'project-card';
    card.innerHTML = `<div onclick="openProject('${p.id}')" style="width:100%; height:100%; padding:25px; box-sizing:border-box;"><span style="font-size:12px; color:#888; font-weight:600; margin-bottom:6px; display:block;">${p.subType === 'keyword' ? '키워드 모드' : (p.type === 'tier' ? '티어 모드' : '랭킹 모드')}</span><h3>${p.title}</h3></div><div class="project-actions"><button onclick="event.stopPropagation(); deleteProject('${p.id}')" class="del-btn">✕</button></div>`;
    list.appendChild(card);
  });
}
window.deleteProject = function(id) { if (confirm("정말 삭제하시겠습니까?")) { delete projects[id]; saveData(); renderHome(); } }

function hideAllScreens() { ['home-screen', 'workspace-screen', 'worldcup-screen', 'compare-screen', 'wishlist-screen', 'scrap-screen', 'category-rank-screen', 'tagging-screen', 'read-works-screen', 'reading-log-screen', 'reading-detail-screen'].forEach(id => { const el = document.getElementById(id); if(el) el.style.display = 'none'; }); }

document.querySelectorAll('.go-home-btn').forEach(btn => {
  btn.addEventListener('click', (e) => { hideAllScreens(); if(e.target.id === 'comp-back-btn' && currentCompareTier) { document.getElementById('workspace-screen').style.display = 'block'; currentCompareTier = null; } else { document.getElementById('home-screen').style.display = 'block'; renderHome(); } });
});
document.querySelectorAll('.go-workspace-btn').forEach(btn => { btn.addEventListener('click', () => { hideAllScreens(); document.getElementById('workspace-screen').style.display = 'block'; }); });

// ✅ 이름 수정 클릭 이벤트 추가
document.getElementById('current-project-title').addEventListener('click', () => {
    if (!currentId) return;
    const newTitle = prompt("새로운 프로젝트 이름을 입력하세요:", projects[currentId].title);
    if (newTitle && newTitle.trim()) { projects[currentId].title = newTitle.trim(); document.getElementById('current-project-title').innerText = projects[currentId].title; saveData(); renderHome(); }
});

window.openProject = function(id) {
  currentId = id; const p = projects[id]; document.getElementById('current-project-title').innerText = p.title;
  ['tier-mode', 'ranking-mode', 'keyword-mode'].forEach(i => { const el = document.getElementById(i); if(el) el.style.display = 'none'; });
  if (p.subType === 'keyword') { document.getElementById('webtoon-pools').style.display = 'none'; document.getElementById('keyword-pools').style.display = 'block'; const kwMode = document.getElementById('keyword-mode'); if(kwMode) kwMode.style.display = 'flex'; } 
  else { document.getElementById('webtoon-pools').style.display = 'block'; document.getElementById('keyword-pools').style.display = 'none'; document.getElementById('tier-mode').style.display = p.type === 'tier' ? 'block' : 'none'; document.getElementById('ranking-mode').style.display = p.type === 'ranking' ? 'block' : 'none'; }
  hideAllScreens(); document.getElementById('workspace-screen').style.display = 'block'; renderItems();
}

function renderItems() {
  document.querySelectorAll('.tier-items, .pool, .ranking-list').forEach(el => { if(!el.classList.contains('cat-list')) el.innerHTML = ''; });
  projects[currentId].items.forEach(item => {
    const itemEl = document.createElement('div'); itemEl.className = 'item'; if (item.color) itemEl.classList.add(item.color); itemEl.draggable = true; itemEl.id = item.itemId;
    itemEl.innerHTML = `<div class="name-tag">${item.name}</div><button class="item-del-btn">✕</button>`;
    if (item.img) itemEl.style.backgroundImage = `url(${item.img})`;
    itemEl.querySelector('.item-del-btn').addEventListener('click', (e) => { e.stopPropagation(); if(confirm(`'${item.name}' 후보를 삭제할까요?`)) { projects[currentId].items = projects[currentId].items.filter(i => i.itemId !== item.itemId); saveData(); renderItems(); } });
    itemEl.addEventListener('dragstart', function(e) { draggedItem = item; itemEl.classList.add('dragging'); isDragging = true; });
    itemEl.addEventListener('dragend', function() {
      itemEl.classList.remove('dragging'); isDragging = false; 
      const newItems = []; document.querySelectorAll('#workspace-screen .item').forEach(el => { const found = projects[currentId].items.find(i => i.itemId === el.id); if (found) { found.zone = el.parentElement.getAttribute('data-zone'); newItems.push(found); } });
      projects[currentId].items = newItems; saveData(); renderItems(); 
    });
    const dropZone = document.querySelector(`#workspace-screen [data-zone="${item.zone}"]`); if(dropZone) dropZone.appendChild(itemEl);
  });
  updateRanking();
}

document.querySelectorAll('.tier-items, .pool, .ranking-list').forEach(zone => {
  if(zone.classList.contains('cat-list')) return; 
  zone.addEventListener('dragover', (e) => { e.preventDefault(); const afterElement = getDragAfterElement(zone, e.clientX, e.clientY); const dragging = document.querySelector('.dragging'); if (dragging) { if (afterElement == null) zone.appendChild(dragging); else zone.insertBefore(dragging, afterElement); } });
});

function updateRanking() {
  const items = document.querySelectorAll('#ranking-list .item, .kw-rank-zone .item, .tier-row .ranking-list .item');
  items.forEach((item) => { 
    let parentZone = item.closest('.ranking-list'); if (!parentZone) return;
    let zoneItems = Array.from(parentZone.querySelectorAll('.item')); let localIndex = zoneItems.indexOf(item);
    let numSpan = item.querySelector('.ranking-number'); if (!numSpan) { numSpan = document.createElement('div'); numSpan.className = 'ranking-number'; item.prepend(numSpan); } numSpan.innerText = (localIndex + 1); 
  });
}
function getDragAfterElement(container, x, y, itemClass = '.item') {
  const draggableElements = [...container.querySelectorAll(`${itemClass}:not(.dragging)`)];
  return draggableElements.reduce((closest, child) => { const box = child.getBoundingClientRect(); const offset = container.classList.contains('ranking-list') ? y - box.top - box.height / 2 : x - box.left - box.width / 2; if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; else return closest; }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.getElementById('btn-open-wishlist').addEventListener('click', () => { hideAllScreens(); document.getElementById('wishlist-screen').style.display = 'block'; renderWishList(); });
window.addWishItem = function() { const input = document.getElementById('wish-input'); if (!input.value.trim()) return; wishList.push({ id: Date.now(), name: input.value.trim(), checked: false }); input.value = ''; saveWish(); renderWishList(); }
window.deleteWishItem = function(id) { wishList = wishList.filter(i => i.id !== id); saveWish(); renderWishList(); }
window.toggleWishItem = function(id) { const item = wishList.find(i => i.id === id); if(item) { item.checked = !item.checked; saveWish(); renderWishList(); } }
function renderWishList() {
  const container = document.getElementById('wish-list'); container.innerHTML = '';
  wishList.forEach(item => { const isChecked = item.checked ? 'checked' : ''; const lineThrough = item.checked ? 'text-decoration: line-through; color: #999;' : ''; container.innerHTML += `<div class="wish-item"><label><input type="checkbox" onchange="toggleWishItem(${item.id})" ${isChecked}><span style="${lineThrough}">${item.name}</span></label><button onclick="deleteWishItem(${item.id})">✕</button></div>`; });
}

document.getElementById('btn-open-scrap').addEventListener('click', () => { hideAllScreens(); document.getElementById('scrap-screen').style.display = 'block'; renderScrapList(); });
window.addScrapItem = function() {
  const url = document.getElementById('scrap-url').value.trim(); const comment = document.getElementById('scrap-comment').value.trim(); const file = document.getElementById('scrap-image').files[0];
  if(!url && !comment && !file) return alert("내용을 입력해주세요!");
  const newScrap = { id: Date.now(), url, comment, img: null };
  if(file) { const reader = new FileReader(); reader.onload = (e) => { newScrap.img = e.target.result; scrapList.unshift(newScrap); saveScraps(); renderScrapList(); }; reader.readAsDataURL(file); } else { scrapList.unshift(newScrap); saveScraps(); renderScrapList(); }
  document.getElementById('scrap-url').value = ''; document.getElementById('scrap-comment').value = ''; document.getElementById('scrap-image').value = '';
}
function renderScrapList() {
  const container = document.getElementById('scrap-list'); container.innerHTML = '';
  scrapList.forEach(s => { const card = document.createElement('div'); card.className = 'scrap-card'; card.innerHTML = `${s.img ? `<img src="${s.img}" class="card-img">` : ''} <button class="scrap-del-btn" onclick="deleteScrap(${s.id})">✕</button> <div class="card-content"> ${s.url ? `<a href="${s.url}" target="_blank" class="card-url">🔗 ${s.url}</a>` : ''} <div class="card-comment">${s.comment}</div> </div>`; container.appendChild(card); });
}
window.deleteScrap = function(id) { if(confirm("이 스크랩을 지울까요?")) { scrapList = scrapList.filter(s => s.id !== id); saveScraps(); renderScrapList(); } }

window.openCategoryRank = function(tierId) {
  const tierItems = projects[currentId].items.filter(i => i.zone === tierId); if(tierItems.length < 2) return alert("작품이 2개 이상 있어야 합니다!");
  hideAllScreens(); document.getElementById('category-rank-screen').style.display = 'block'; document.getElementById('cat-rank-title').innerText = `[${tierId}] 세부 순위`;
  ['art', 'story', 'scene'].forEach(cat => {
    const container = document.getElementById(`cat-${cat}-list`); container.innerHTML = ''; let savedOrder = (projects[currentId].categoryRanks && projects[currentId].categoryRanks[tierId] && projects[currentId].categoryRanks[tierId][cat]) || []; let sortedItems = [...tierItems].sort((a, b) => { let idxA = savedOrder.indexOf(a.itemId); let idxB = savedOrder.indexOf(b.itemId); return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB); });
    sortedItems.forEach(item => {
      const el = document.createElement('div'); el.className = `item ${item.color || ''} cat-sort-item`; el.draggable = true; el.dataset.itemId = item.itemId; el.dataset.cat = cat; el.innerHTML = `<div class="name-tag">${item.name}</div>`;
      el.ondragstart = (e) => { draggedCatItem = el; el.classList.add('dragging'); isDragging = true; }; el.ondragend = () => { el.classList.remove('dragging'); isDragging = false; saveCategoryRanks(tierId); }; container.appendChild(el);
    });
  });
}
function saveCategoryRanks(tierId) { if(!projects[currentId].categoryRanks) projects[currentId].categoryRanks = {}; if(!projects[currentId].categoryRanks[tierId]) projects[currentId].categoryRanks[tierId] = {}; ['art', 'story', 'scene'].forEach(cat => { const zone = document.getElementById(`cat-${cat}-list`); const items = [...zone.querySelectorAll('.cat-sort-item')]; projects[currentId].categoryRanks[tierId][cat] = items.map(el => el.dataset.itemId); }); saveData(); }

let wcCurrentRound = [], wcNextRound = [], wcMatchIndex = 0, wcRankings = [], wcLosersThisRound = [];
document.getElementById('btn-worldcup').addEventListener('click', () => {
  hideAllScreens(); document.getElementById('worldcup-screen').style.display = 'block'; document.getElementById('wc-play-area').style.display = 'flex'; document.getElementById('wc-result-area').style.display = 'none';
  let activeList = getDynamicWebtoonList().filter(name => !deletedCands.includes(name));
  if (activeList.length < 2) { alert("내가 본 웹툰 컬렉션에 작품이 2개 이상 있어야 합니다!"); document.getElementById('home-screen').style.display = 'block'; document.getElementById('worldcup-screen').style.display = 'none'; return; }
  wcCurrentRound = [...activeList].sort(() => Math.random() - 0.5); wcNextRound = []; wcMatchIndex = 0; wcRankings = []; wcLosersThisRound = []; updateWcUI();
});
function updateWcUI() {
  if (wcCurrentRound.length === 1) {
    document.getElementById('wc-play-area').style.display = 'none'; document.getElementById('wc-result-area').style.display = 'block'; document.getElementById('wc-round-text').innerText = "결과 발표";
    const rankList = document.getElementById('wc-ranking-list'); rankList.innerHTML = `<div class="wc-rank-item"><span class="wc-medal">🥇</span> <span style="color:#E11D48;">${wcCurrentRound[0]}</span></div>`;
    let rankCounter = 2; wcRankings.forEach(losers => { losers.forEach(loser => { let medal = rankCounter === 2 ? '🥈' : (rankCounter === 3 ? '🥉' : `${rankCounter}위`); rankList.innerHTML += `<div class="wc-rank-item"><span class="wc-medal" style="font-size:16px;">${medal}</span> ${loser}</div>`; rankCounter++; }); }); return;
  }
  if (wcMatchIndex >= wcCurrentRound.length - 1) { wcNextRound.push(wcCurrentRound[wcMatchIndex]); wcRankings.unshift([...wcLosersThisRound]); wcLosersThisRound = []; wcCurrentRound = wcNextRound; wcNextRound = []; wcMatchIndex = 0; return updateWcUI(); }
  const roundName = wcCurrentRound.length === 2 ? "결승전" : (wcCurrentRound.length === 4 ? "준결승" : `${wcCurrentRound.length}강`); const matchNum = (wcMatchIndex / 2) + 1; const totalMatches = Math.floor(wcCurrentRound.length / 2);
  document.getElementById('wc-round-text').innerText = `${roundName} (${matchNum}/${totalMatches})`; document.getElementById('wc-left').innerText = wcCurrentRound[wcMatchIndex]; document.getElementById('wc-right').innerText = wcCurrentRound[wcMatchIndex + 1];
}
window.selectWcItem = function(side) {
  if(wcCurrentRound.length <= 1) return; let winner = side === 'left' ? wcCurrentRound[wcMatchIndex] : wcCurrentRound[wcMatchIndex + 1]; let loser = side === 'left' ? wcCurrentRound[wcMatchIndex + 1] : wcCurrentRound[wcMatchIndex];
  wcNextRound.push(winner); wcLosersThisRound.push(loser); wcMatchIndex += 2; 
  if (wcMatchIndex >= wcCurrentRound.length) { wcRankings.unshift([...wcLosersThisRound]); wcLosersThisRound = []; wcCurrentRound = wcNextRound; wcNextRound = []; wcMatchIndex = 0; } updateWcUI();
}

window.openTierCompare = function(tierId) {
  const tierItems = projects[currentId].items.filter(i => i.zone === tierId).map(i => i.name); if(tierItems.length < 2) return alert("비교할 작품이 2개 이상 없습니다!");
  currentCompareTier = tierId; document.getElementById('btn-apply-rank').style.display = 'block'; document.getElementById('comp-title').innerText = `[${tierId}] 티어 1:1 비교소`; compareLogs = []; saveLogs(); openCompareMode(tierItems.sort());
}
window.openKeywordCompare = function(targetZone, poolZone, titleLabel) {
  const items = projects[currentId].items.filter(i => i.zone === targetZone || i.zone === poolZone).map(i => i.name); if(items.length < 2) return alert("비교할 키워드가 2개 이상 없습니다!");
  currentCompareTier = targetZone; document.getElementById('btn-apply-rank').style.display = 'block'; document.getElementById('comp-title').innerText = `[${titleLabel}] 1:1 집중 비교소`; compareLogs = []; saveLogs(); openCompareMode(items.sort());
}
document.getElementById('btn-compare').addEventListener('click', () => { currentCompareTier = null; document.getElementById('btn-apply-rank').style.display = 'none'; document.getElementById('comp-title').innerText = "전체 1:1 집중 비교소"; openCompareMode([...getDynamicWebtoonList()].sort()); });

function openCompareMode(itemList) {
  hideAllScreens(); document.getElementById('compare-screen').style.display = 'block';
  document.getElementById('comp-fixed').innerHTML = '우클릭 하세요'; document.getElementById('comp-fixed').classList.add('empty'); document.getElementById('comp-target').innerHTML = '좌클릭 하세요'; document.getElementById('comp-target').classList.add('empty');
  renderLogs(); const listArea = document.getElementById('comp-list'); listArea.innerHTML = '';
  itemList.forEach(name => {
    if(deletedCands.includes(name)) return; 
    const wrapper = document.createElement('div'); wrapper.className = 'cand-wrapper';
    const btn = document.createElement('button'); btn.className = 'comp-item-btn'; btn.innerText = name;
    btn.onclick = () => { document.getElementById('comp-target').innerText = name; document.getElementById('comp-target').classList.remove('empty'); };
    btn.oncontextmenu = (e) => { e.preventDefault(); document.getElementById('comp-fixed').innerText = name; document.getElementById('comp-fixed').classList.remove('empty'); };
    const delBtn = document.createElement('button'); delBtn.className = 'cand-del-btn'; delBtn.innerText = '✕';
    delBtn.onclick = () => { if(confirm(`영구 삭제할까요?`)) { deletedCands.push(name); saveDeletedCands(); wrapper.remove(); } };
    wrapper.appendChild(btn); wrapper.appendChild(delBtn); listArea.appendChild(wrapper);
  });
}

window.recordCompare = function(side) {
  const fixed = document.getElementById('comp-fixed').innerText; const target = document.getElementById('comp-target').innerText;
  if(fixed.includes('클릭') || target.includes('클릭')) return alert("작품을 선택해주세요!");
  let winner = (side === 'fixed') ? fixed : target; let loser = (side === 'fixed') ? target : fixed;
  compareLogs.unshift({ id: Date.now(), html: `<span style="color:#4F46E5; font-weight:800;">[승리]</span> ${winner} 🏆 vs ${loser}`, winner: winner, loser: loser }); saveLogs(); renderLogs();
}

function renderLogs() {
  const logArea = document.getElementById('comp-log'); 
  if (compareLogs.length === 0) { logArea.innerHTML = '<span style="color:#999;">기록이 없습니다.</span>'; } else {
    logArea.innerHTML = ''; compareLogs.forEach(log => {
      const p = document.createElement('div'); p.style.padding = "8px 0"; p.style.borderBottom = "1px solid #f0f0f0"; p.style.display = "flex"; p.style.justifyContent = "space-between"; p.style.alignItems = "center";
      p.innerHTML = `<div>${log.html}</div><button onclick="deleteLog(${log.id})" style="border:none; background:none; cursor:pointer; color:#ef4444; font-weight:bold; font-size:16px;">✕</button>`; logArea.appendChild(p);
    });
  } renderAnalysis(); 
}

function renderAnalysis() {
  const analysisArea = document.getElementById('comp-analysis'); 
  if (compareLogs.length === 0) { analysisArea.innerHTML = '<span style="color:#999;">기록을 쌓으면 엘로(Elo) 랭킹이 분석됩니다.</span>'; currentRankArr = []; return; }
  let eloStats = {}; const K = 32; function getElo(name) { if (!eloStats[name]) eloStats[name] = { rating: 1000, wins: 0, losses: 0 }; return eloStats[name]; }
  [...compareLogs].reverse().forEach(log => {
    if(log.winner && log.loser) {
      let pWinner = getElo(log.winner); let pLoser = getElo(log.loser);
      let expectedWinRateWinner = 1 / (1 + Math.pow(10, (pLoser.rating - pWinner.rating) / 400)); let expectedWinRateLoser = 1 / (1 + Math.pow(10, (pWinner.rating - pLoser.rating) / 400));
      pWinner.rating = pWinner.rating + K * (1 - expectedWinRateWinner); pLoser.rating = pLoser.rating + K * (0 - expectedWinRateLoser); pWinner.wins++; pLoser.losses++;
    }
  });
  let rankArr = Object.keys(eloStats).map(name => { return { name: name, rating: Math.round(eloStats[name].rating), wins: eloStats[name].wins, losses: eloStats[name].losses }; });
  rankArr.sort((a, b) => b.rating - a.rating); currentRankArr = rankArr; analysisArea.innerHTML = '';
  rankArr.forEach((item, idx) => { let medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `${idx+1}위`)); analysisArea.innerHTML += `<div class="rank-bar"><div class="rank-name-box"><span class="rank-medal">${medal}</span> <span>${item.name}</span></div><div class="rank-stats" style="color:#4F46E5; font-weight:700;">${item.rating}점 <span style="font-weight:normal; color:#888; font-size:12px;">(${item.wins}승 ${item.losses}패)</span></div></div>`; });
}
window.deleteLog = function(id) { compareLogs = compareLogs.filter(l => l.id !== id); saveLogs(); renderLogs(); }
window.clearLogs = function() { if(confirm("삭제하시겠습니까?")) { compareLogs = []; saveLogs(); renderLogs(); } }

window.applyRankingToTier = function() {
  if(!currentCompareTier) return; if(currentRankArr.length === 0) return alert("승리 버튼을 눌러 순위를 정해주세요!");
  let sortedNames = currentRankArr.map(r => r.name); projects[currentId].items.forEach(i => { if(sortedNames.includes(i.name)) i.zone = currentCompareTier; });
  let tierItems = projects[currentId].items.filter(i => i.zone === currentCompareTier); let otherItems = projects[currentId].items.filter(i => i.zone !== currentCompareTier);
  tierItems.sort((a, b) => { let idxA = sortedNames.indexOf(a.name); let idxB = sortedNames.indexOf(b.name); return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB); });
  projects[currentId].items = [...otherItems, ...tierItems]; saveData(); renderItems(); alert(`결과 박스 안에 1위부터 자동 정렬되었습니다!`); document.getElementById('comp-back-btn').click(); 
}

document.getElementById('btn-open-tagging').addEventListener('click', () => { hideAllScreens(); document.getElementById('tagging-screen').style.display = 'block'; closeWorkDetail(); renderKeywordPool(); });
document.getElementById('btn-show-add-work').addEventListener('click', () => { document.getElementById('add-work-form').style.display = 'block'; });

document.getElementById('btn-confirm-add-work').addEventListener('click', () => {
  const title = document.getElementById('new-work-title').value.trim(); const top = document.getElementById('new-work-top').value.trim(); const bottom = document.getElementById('new-work-bottom').value.trim();
  if(!title) return alert("작품명은 꼭 입력해주세요!");
  const newWork = { id: "w_custom_" + Date.now(), title: title, top: top || "미정", bottom: bottom || "미정", tags: { title: [], top: [], bottom: [] } };
  taggedWorksData.unshift(newWork); saveTaggingData(); renderTaggingGrid(); 
  document.getElementById('new-work-title').value = ''; document.getElementById('new-work-top').value = ''; document.getElementById('new-work-bottom').value = ''; document.getElementById('add-work-form').style.display = 'none';
});

window.deleteTaggingWork = function() {
  if(!currentTaggingWorkId) return; const work = taggedWorksData.find(w => w.id === currentTaggingWorkId);
  if(confirm(`'${work.title}' 작품을 서재에서 완전히 삭제할까요?`)) { taggedWorksData = taggedWorksData.filter(w => w.id !== currentTaggingWorkId); saveTaggingData(); closeWorkDetail(); }
}

function renderTaggingGrid() {
  const container = document.getElementById('work-grid-view'); container.innerHTML = '';
  taggedWorksData.forEach(work => {
    const square = document.createElement('div'); square.className = 'work-square'; const totalTags = work.tags.title.length + work.tags.top.length + work.tags.bottom.length;
    square.innerHTML = `<button class="del-tag" onclick="event.stopPropagation(); deleteTaggingWorkGrid('${work.id}')">✕</button><div class="work-square-title">${work.title}</div><div class="work-square-desc">${work.top} x ${work.bottom}</div><div style="margin-top: 10px; font-size: 11px; color:#EC4899; background:#FCE7F3; padding:2px 8px; border-radius:10px;">태그 ${totalTags}개</div>`;
    square.onclick = () => openWorkDetail(work.id); container.appendChild(square);
  });
}
window.deleteTaggingWorkGrid = function(workId) { const work = taggedWorksData.find(w => w.id === workId); if(confirm(`'${work.title}' 작품을 서재에서 완전히 삭제할까요?`)) { taggedWorksData = taggedWorksData.filter(w => w.id !== workId); saveTaggingData(); renderTaggingGrid(); } }

window.openWorkDetail = function(workId) {
  currentTaggingWorkId = workId; const work = taggedWorksData.find(w => w.id === workId);
  if(work) {
    document.getElementById('work-grid-view').style.display = 'none'; document.getElementById('work-detail-view').style.display = 'block';
    document.getElementById('detail-work-title').innerText = `📖 ${work.title}`; document.getElementById('detail-top-name').innerText = `공: ${work.top}`; document.getElementById('detail-bottom-name').innerText = `수: ${work.bottom}`;
    document.getElementById('dz-title').setAttribute('data-work-id', work.id); document.getElementById('dz-top').setAttribute('data-work-id', work.id); document.getElementById('dz-bottom').setAttribute('data-work-id', work.id);
    renderDetailTags(); setupDropZones();
  }
}
window.closeWorkDetail = function() { currentTaggingWorkId = null; document.getElementById('work-detail-view').style.display = 'none'; document.getElementById('work-grid-view').style.display = 'grid'; renderTaggingGrid(); }

function renderDetailTags() {
  const work = taggedWorksData.find(w => w.id === currentTaggingWorkId); if(!work) return;
  document.getElementById('dz-title').innerHTML = renderTagsHTML(work.tags.title, work.id, 'title'); document.getElementById('dz-top').innerHTML = renderTagsHTML(work.tags.top, work.id, 'top'); document.getElementById('dz-bottom').innerHTML = renderTagsHTML(work.tags.bottom, work.id, 'bottom');
}
function renderTagsHTML(tagsArray, workId, target) { return tagsArray.map((tag, index) => `<div class="tag-badge ${tag.colorClass}">${tag.name} <button class="del-tag" onclick="removeTag('${workId}', '${target}', ${index})">✕</button></div>`).join(''); }
window.removeTag = function(workId, target, index) { const work = taggedWorksData.find(w => w.id === workId); if (work) { work.tags[target].splice(index, 1); saveTaggingData(); renderDetailTags(); } }

function renderKeywordPool() {
  const container = document.getElementById('keyword-pool-container'); container.innerHTML = '';
  tagCategories.forEach((cat, catIndex) => {
    const section = document.createElement('div'); section.className = 'pool-section';
    section.innerHTML = `<div class="pool-header"><h4>${cat.name}</h4><button class="btn-add-kw" onclick="addNewKeyword(${catIndex})" style="background:transparent; border:none; color:#3B82F6; font-weight:bold; font-size:18px;">＋</button></div>`;
    const tagsContainer = document.createElement('div'); tagsContainer.className = 'pool-tags';
    cat.items.forEach((keyword, kwIndex) => {
      const badge = document.createElement('div'); badge.className = `tag-badge ${cat.colorClass}`; badge.draggable = true;
      badge.innerHTML = `${keyword} <button class="del-tag" onclick="deleteKeywordFromPool(${catIndex}, ${kwIndex})">✕</button>`;
      badge.addEventListener('dragstart', (e) => { const payload = { name: keyword, colorClass: cat.colorClass }; e.dataTransfer.setData('text/plain', JSON.stringify(payload)); });
      tagsContainer.appendChild(badge);
    });
    section.appendChild(tagsContainer); container.appendChild(section);
  });
}
window.addNewKeyword = function(catIndex) {
  const newWord = prompt("새롭게 추가할 키워드를 입력하세요!");
  if (newWord && newWord.trim() !== "") { if(tagCategories[catIndex].items.includes(newWord.trim())) return alert("이미 존재하는 키워드입니다!"); tagCategories[catIndex].items.push(newWord.trim()); saveTaggingData(); renderKeywordPool(); }
}
window.deleteKeywordFromPool = function(catIndex, kwIndex) {
  const targetWord = tagCategories[catIndex].items[kwIndex]; if(confirm(`'${targetWord}' 키워드를 삭제할까요?`)) { tagCategories[catIndex].items.splice(kwIndex, 1); saveTaggingData(); renderKeywordPool(); }
}

function setupDropZones() {
  const dropZones = document.querySelectorAll('.tag-drop-zone');
  dropZones.forEach(zone => {
    const newZone = zone.cloneNode(true); zone.parentNode.replaceChild(newZone, zone);
    newZone.addEventListener('dragover', (e) => { e.preventDefault(); newZone.classList.add('dragover'); });
    newZone.addEventListener('dragleave', () => { newZone.classList.remove('dragover'); });
    newZone.addEventListener('drop', (e) => {
      e.preventDefault(); newZone.classList.remove('dragover'); const payloadStr = e.dataTransfer.getData('text/plain'); if (!payloadStr) return;
      try {
        const payload = JSON.parse(payloadStr); const workId = newZone.getAttribute('data-work-id'); const target = newZone.getAttribute('data-target'); const work = taggedWorksData.find(w => w.id === workId);
        if (work && !work.tags[target].find(t => t.name === payload.name)) { work.tags[target].push(payload); saveTaggingData(); renderDetailTags(); }
      } catch (err) { console.error(err); }
    });
  });
}

function initReadWorksList() {
  if (readWorksList && readWorksList.length > 0) return; let rId = 0;
  webtoonCategories.forEach(cat => { let platform = cat.color === 'bg-skyblue' ? '리디' : (cat.color === 'bg-red' ? '레진' : '봄툰'); cat.list.forEach(name => { let cleanName = name.replace(/\[.*?\]|\(.*?\)/g, '').trim(); if(!readWorksList.find(w => w.name === cleanName)) readWorksList.push({ id: 'rw_'+(rId++), name: cleanName, platform: platform, colorClass: cat.color }); }); });
  saveReadWorks();
}

document.getElementById('btn-open-read-works').addEventListener('click', () => { hideAllScreens(); document.getElementById('read-works-screen').style.display = 'block'; renderReadWorks(); });
window.saveReadWorksManual = function() { saveAllData(); alert("현재 리스트 순서가 완벽하게 저장되었습니다!"); }
window.sortReadWorksList = function(type) {
  if (type === 'abc') readWorksList.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
  else if (type === 'heart') readWorksList.sort((a, b) => { let idxA = heartRankData.indexOf(a.name); let idxB = heartRankData.indexOf(b.name); return (idxA === -1 ? 9999 : idxA) - (idxB === -1 ? 9999 : idxB); });
  else if (type === 'latest') readWorksList.sort((a, b) => (parseInt(b.id.replace('rw_', '')) || 0) - (parseInt(a.id.replace('rw_', '')) || 0));
  renderReadWorks(); 
}

window.addReadWork = function() {
  const name = document.getElementById('new-read-work-title').value.trim(); const colorClass = document.getElementById('new-read-work-platform').value; let platform = colorClass === 'bg-skyblue' ? '리디' : (colorClass === 'bg-red' ? '레진' : '봄툰');
  if(!name) return alert("작품명을 입력해주세요!"); readWorksList.unshift({ id: 'rw_'+Date.now(), name: name, platform: platform, colorClass: colorClass }); saveReadWorks(); renderReadWorks(); document.getElementById('new-read-work-title').value = '';
}
window.deleteReadWork = function(index) { if(confirm("이 작품을 지울까요?")) { readWorksList.splice(index, 1); saveReadWorks(); renderReadWorks(); } }

function renderReadWorks() {
  const container = document.getElementById('read-works-grid'); container.innerHTML = '';
  readWorksList.forEach((work, index) => {
    const el = document.createElement('div'); el.className = 'work-table-row'; el.draggable = true; el.dataset.index = index;
    let badgeBg = work.colorClass === 'bg-skyblue' ? '#E0F2FE' : (work.colorClass === 'bg-red' ? '#FFE4E6' : '#FEF9C3'); let badgeText = work.colorClass === 'bg-skyblue' ? '#0284C7' : (work.colorClass === 'bg-red' ? '#E11D48' : '#A16207');
    el.innerHTML = `<div class="work-col-drag" title="드래그해서 순서 변경">≡</div><div class="work-col-platform" style="background:${badgeBg}; color:${badgeText};">${work.platform}</div><div class="work-col-title">${work.name}</div><div class="work-col-actions"><button onclick="event.stopPropagation(); deleteReadWork(${index})">삭제</button></div>`;
    el.addEventListener('dragstart', (e) => { draggedReadWorkIndex = index; el.classList.add('dragging'); document.getElementById('sort-read-works').value = 'custom'; });
    el.addEventListener('dragend', () => { el.classList.remove('dragging'); draggedReadWorkIndex = null; });
    el.addEventListener('dragover', (e) => { e.preventDefault(); el.style.borderTop = "2px solid #6366F1"; });
    el.addEventListener('dragleave', () => { el.style.borderTop = ""; });
    el.addEventListener('drop', (e) => { e.preventDefault(); el.style.borderTop = ""; const targetIndex = index; if(draggedReadWorkIndex === targetIndex) return; const item = readWorksList.splice(draggedReadWorkIndex, 1)[0]; readWorksList.splice(targetIndex, 0, item); renderReadWorks(); });
    container.appendChild(el);
  });
}

window.pickRandomWebtoon = function() {
  if (!readWorksList || readWorksList.length === 0) return alert("내가 본 웹툰 컬렉션에 먼저 작품을 추가해주세요!");
  const randomIndex = Math.floor(Math.random() * readWorksList.length); const pickedWork = readWorksList[randomIndex];
  const resultDiv = document.getElementById('random-result'); resultDiv.innerHTML = `<span style="font-size:16px;">오늘의 정주행 픽은..</span><br>✨ <span style="color:#FFF;">${pickedWork.name}</span> ✨`;
}

window.previewImage = function(event, previewId) {
  const file = event.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = function(e) { document.getElementById(previewId).innerHTML = `<img src="${e.target.result}" style="width:100%; border-radius:6px; object-fit:cover;">`; }; reader.readAsDataURL(file); }
}

document.getElementById('btn-open-reading-log').addEventListener('click', () => { hideAllScreens(); document.getElementById('reading-log-screen').style.display = 'block'; renderReadingBooks(); });

window.openBookModal = function(id = null) {
  const titleEl = document.getElementById('book-title'); const previewEl = document.getElementById('book-image-preview'); document.getElementById('book-id').value = id || '';
  if (id) { const book = readingBooks.find(b => b.id == id); document.getElementById('book-modal-title').innerText = "책 정보 수정"; titleEl.value = book.title; previewEl.innerHTML = book.coverImg ? `<img src="${book.coverImg}" style="width:100%; border-radius:6px; object-fit:cover;">` : ''; } 
  else { document.getElementById('book-modal-title').innerText = "새로운 책 만들기"; titleEl.value = ''; previewEl.innerHTML = ''; document.getElementById('book-image').value = ''; }
  document.getElementById('book-modal').style.display = 'flex';
}
window.closeBookModal = function() { document.getElementById('book-modal').style.display = 'none'; }

window.saveReadingBook = function() {
  const id = document.getElementById('book-id').value; const title = document.getElementById('book-title').value.trim(); const previewImg = document.getElementById('book-image-preview').querySelector('img'); const coverImg = previewImg ? previewImg.src : null;
  if (!title) return alert("작품명을 입력해주세요!");
  if (id) { const book = readingBooks.find(b => b.id == id); book.title = title; book.coverImg = coverImg; } else { readingBooks.push({ id: Date.now(), title, coverImg, entries: [] }); }
  saveReadingLogData(); closeBookModal(); renderReadingBooks();
}
window.deleteReadingBook = function(id) { if(confirm("이 책과 안의 기록들을 모두 삭제하시겠습니까?")) { readingBooks = readingBooks.filter(b => b.id != id); saveReadingLogData(); renderReadingBooks(); } }

window.renderReadingBooks = function() {
  const container = document.getElementById('reading-book-grid'); container.innerHTML = '';
  readingBooks.forEach(book => {
    const card = document.createElement('div'); card.className = 'book-card'; card.onclick = () => openBookDetail(book.id); const entriesCount = book.entries ? book.entries.length : 0;
    card.innerHTML = `<div class="book-actions"><button onclick="event.stopPropagation(); openBookModal(${book.id})" title="수정">✏️</button><button onclick="event.stopPropagation(); deleteReadingBook(${book.id})" title="삭제" style="color:red; font-weight:bold;">✕</button></div>${book.coverImg ? `<img src="${book.coverImg}" class="book-img">` : `<div class="book-img" style="display:flex; align-items:center; justify-content:center; color:#ccc; font-size:40px;">📖</div>`}<div class="book-content"><div class="book-title">${book.title}</div><div style="font-size:12px; color:#666; margin-top:5px;">기록 ${entriesCount}개</div></div>`;
    container.appendChild(card);
  });
}

window.openBookDetail = function(bookId) {
  currentReadingBookId = bookId; const book = readingBooks.find(b => b.id == bookId); document.getElementById('reading-log-screen').style.display = 'none'; document.getElementById('reading-detail-screen').style.display = 'block'; document.getElementById('detail-book-title').innerText = `📖 ${book.title}`; renderReadingEntries();
}
window.goBackToBooks = function() { document.getElementById('reading-detail-screen').style.display = 'none'; document.getElementById('reading-log-screen').style.display = 'block'; currentReadingBookId = null; renderReadingBooks(); }

window.openEntryModal = function(entryId = null) {
  const contentEl = document.getElementById('entry-content'); const previewEl = document.getElementById('entry-image-preview'); document.getElementById('entry-id').value = entryId || '';
  if (entryId) { const book = readingBooks.find(b => b.id == currentReadingBookId); const entry = book.entries.find(e => e.id == entryId); contentEl.value = entry.content; previewEl.innerHTML = entry.img ? `<img src="${entry.img}" style="width:100%; border-radius:6px; object-fit:cover;">` : ''; } 
  else { contentEl.value = ''; previewEl.innerHTML = ''; document.getElementById('entry-image').value = ''; }
  document.getElementById('entry-modal').style.display = 'flex';
}
window.closeEntryModal = function() { document.getElementById('entry-modal').style.display = 'none'; }

window.saveReadingEntry = function() {
  const entryId = document.getElementById('entry-id').value; const content = document.getElementById('entry-content').value.trim(); const previewImg = document.getElementById('entry-image-preview').querySelector('img'); const imgData = previewImg ? previewImg.src : null;
  if(!content && !imgData) return alert("내용이나 사진을 추가해주세요!"); const book = readingBooks.find(b => b.id == currentReadingBookId); if (!book.entries) book.entries = [];
  if (entryId) { const entry = book.entries.find(e => e.id == entryId); entry.content = content; entry.img = imgData; } else { book.entries.push({ id: Date.now(), content, img: imgData, date: new Date().toISOString() }); }
  saveReadingLogData(); closeEntryModal(); renderReadingEntries();
}
window.deleteReadingEntry = function(id) { if(confirm("이 글을 삭제하시겠습니까?")) { const book = readingBooks.find(b => b.id == currentReadingBookId); book.entries = book.entries.filter(e => e.id != id); saveReadingLogData(); renderReadingEntries(); } }
window.sortReadingEntries = function(order) { document.getElementById('sort-reading-entries').dataset.order = order; renderReadingEntries(); }

window.renderReadingEntries = function() {
  const container = document.getElementById('reading-entry-list'); container.innerHTML = ''; const book = readingBooks.find(b => b.id == currentReadingBookId); 
  if (!book || !book.entries || book.entries.length === 0) { container.innerHTML = '<div style="text-align:center; padding:50px; color:#9ca3af;">첫 독서록을 작성해 보세요! ✍️</div>'; return; }
  const order = document.getElementById('sort-reading-entries').dataset.order || 'oldest'; let sortedEntries = [...book.entries];
  if (order === 'latest') sortedEntries.sort((a, b) => b.id - a.id); else sortedEntries.sort((a, b) => a.id - b.id); 
  sortedEntries.forEach(entry => {
    const dateStr = new Date(entry.date).toLocaleString('ko-KR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }); const el = document.createElement('div'); el.className = 'entry-card';
    el.innerHTML = `<div class="entry-date">${dateStr}</div>${entry.content ? `<div class="entry-content">${entry.content}</div>` : ''}${entry.img ? `<img src="${entry.img}" class="entry-img">` : ''}<div class="entry-actions"><button onclick="openEntryModal(${entry.id})">수정</button><button onclick="deleteReadingEntry(${entry.id})">삭제</button></div>`;
    container.appendChild(el);
  });
}