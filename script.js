let projects = JSON.parse(localStorage.getItem('ti-me-data')) || {};
let wishList = JSON.parse(localStorage.getItem('ti-me-wish')) || [];
let compareLogs = JSON.parse(localStorage.getItem('ti-me-logs')) || [];
let deletedCands = JSON.parse(localStorage.getItem('ti-me-del-cands')) || [];

let currentId = null;
let draggedItem = null;
let isDragging = false;
let pendingProjectType = ''; 
let currentCompareTier = null; 
let currentRankTab = 'total'; 
let currentRankArr = [];

function saveData() { localStorage.setItem('ti-me-data', JSON.stringify(projects)); }
function saveWish() { localStorage.setItem('ti-me-wish', JSON.stringify(wishList)); }
function saveLogs() { localStorage.setItem('ti-me-logs', JSON.stringify(compareLogs)); }
function saveDeletedCands() { localStorage.setItem('ti-me-del-cands', JSON.stringify(deletedCands)); }

// 💡 홈 화면 위시리스트 관리
function addWishItem() {
  const input = document.getElementById('wish-input');
  if (!input.value.trim()) return;
  wishList.push({ id: Date.now(), name: input.value.trim() });
  input.value = ''; saveWish(); renderWishList();
}
function deleteWishItem(id) { wishList = wishList.filter(i => i.id !== id); saveWish(); renderWishList(); }
function renderWishList() {
  const container = document.getElementById('wish-list'); container.innerHTML = '';
  wishList.forEach(item => {
    container.innerHTML += `<div class="wish-item">${item.name} <button onclick="deleteWishItem(${item.id})">×</button></div>`;
  });
}

// 우사기 타이머
const usagi = document.getElementById('usagi');
setInterval(() => { if (!isDragging) { usagi.src = `usagi${Math.floor(Math.random() * 4) + 1}.gif`; } }, 10000);

const modal = document.getElementById('custom-modal');
const modalInput = document.getElementById('modal-input');
document.getElementById('btn-new-tier').addEventListener('click', () => openModal('tier'));
document.getElementById('btn-new-ranking').addEventListener('click', () => openModal('ranking'));

function openModal(type) { pendingProjectType = type; modalInput.value = ''; modal.style.display = 'flex'; modalInput.focus(); }
document.getElementById('modal-cancel').addEventListener('click', () => { modal.style.display = 'none'; });
document.getElementById('modal-confirm').addEventListener('click', () => {
  const title = modalInput.value.trim();
  if (title) { createProject(pendingProjectType, title); modal.style.display = 'none'; }
});

const webtoonCategories = [
  { color: "bg-skyblue", zoneId: "pool-skyblue", list: ["일간알바", "코드네임 아나스타샤", "소꿉친구와 감금당했다", "공과 사는 구분해!", "그 가이드가 집착광공의 품에서 벗어나는 방법", "더 뮤즈", "쉬운 선배", "노 모럴", "러브 오더", "솔트 소사이어티", "녹색전상", "고양이 테라피", "텐(TEN)", "반칙", "죽어 마땅한 것들", "결혼하는 남자", "별주부전", " 그 공작가 노예의 음란한 속사정", "망종(亡種)", "비밀이 많은 XX", "아우토반 로맨스", "아늑한 집착", "모두에게 친절한 너는 왜", "갱생의 여지", "그림자의 영역", "늑대 신랑 ", "과수원의 사정", "알파 트라우마", "오메가 콤플렉스", "서킷 브레이커", "롤플레잉-경찰❤️파일럿", "친구새끼들한테 따먹혔습니다", "실연 중독", "성실한 채무자?", "형제애", "위험한 편의점", "럽미닥터!", "상극", "피자배달부와 골드팰리스", "패션(PASSION)", "실수로 잘못 고백했는데", "더러운 욕망", "XX하면 알 수 있지 않을까?", "테라노 군과 쿠마자키 군", "절대 BL이 되는 세계 VS 절대 BL이 되고 싶지 않은 남자", "페이크 팩트 립스", "소꿉친구로는 참을 수 없어", " 운명의 짝이 너라니", "오프 스테이지 러브 사이드", "테라피 게임", "나츠메 씨는 개발당하고 싶다", "가슴 지명", "드래그리스·섹스", "반하는 약을 먹은 완벽남이 위험합니다! 2권", "너무 야한 후카미군", "40까지 하고 싶은 10가지 일", "힐링 패러독스", "30살까지 동정이면 마법사가 될 수 있대", "독점! 마이 히어로", "개구리 삶기", "시맨틱 에러", "해피투게더"] },
  { color: "bg-red", zoneId: "pool-red", list: ["호식이 이야기", "강아지는 건드리지 마라", "슬립 업(Slip Up)", "가장 깊은 고백", "소꿉친구와 감금당했다", "키스 미 이프 유 캔(Kiss Me If You Can)", "드라이버스 하이 (Driver's high)", "해빙곡선", "장미와 샴페인", "리미티드 런", "FlashLight (플래시라이트)", "외사랑", "이리 사랑스러운 너", "스미르나 앤 카프리", "뱀 굴", "야화첩", "하이스쿨 솔티 하트", "조개소년 : 발화 / 조개소년", "징크스", "향의 경계", "선 넘는 사이", "언슬립", "알페가(Alphega)", "풀북", "멍멍한 관계", "백라이트", "내가 네 운명의 가이드는 아니지만", "녹색전상 : 몽리 / 녹색전상", "유원불변", "해와 달의 공생관계", "너드프로젝트", "시시포스의 개들", "뼈와 꽃잎", "박하사탕", "더블다운", "캐시 오어 크레딧", "남보다 못한 사이", "바라메 강림하여 주소서", "제물 남편", "시거나 떫거나", "은총의 밤", "가장 완벽한 도형", "백련이 피는 온도", "논제로섬", "아이돌 보러 간다며!"] },
  { color: "bg-white", zoneId: "pool-white", list: ["등쳐먹는 연애", "홍실퀘스트", "필 마이 베네핏", "작전명 마레오", "망돌 콤플렉스", "인 마이 배드(In My Bad)", "너는 나의 세상", "하절기", "짝사랑 필승법", "솔직하고 대담하게", "넌 내게 수치심을 줬어❤️", "환장의 가이딩", "신을 품는 방법", "꽃이 지는 연못", "원룸 조교님", "엎질러진 피", "코티지 가든(Cottage garden)", "럭키 다이스", "러브 올 플레이(LOVE ALL PLAY)", "구른 김에 왕까지", "월요일의 구원자", "엑시덴탈 베이비(Accidental baby)", "피앙세는 토마토", "유성이 내리는 우주", "스테이지 비하인드", "방문 판매 왔습니다!", "백야의 꽃길", "당신이 방심한 사이", "미혹의 경계", "아기 삶을 낳아줘, 나 미치는 꼴 보기 싫으면!", "그래서 누가 깔린건데?", "스쿠프", "해 뜨는 집", "물가의 밤", "파도의 해안", "누군가 정해둔 것처럼", "자두를 누르지 마시오", "감금당해 주세요!"] }
];

const cleanWebtoonList = [];
webtoonCategories.forEach(c => c.list.forEach(name => {
  const cleanName = name.replace(/\[.*?\]|\(.*?\)/g, '').trim();
  if(!cleanWebtoonList.includes(cleanName)) cleanWebtoonList.push(cleanName);
}));

document.getElementById('btn-auto-webtoon-tier').addEventListener('click', () => createAutoProject('tier'));
document.getElementById('btn-auto-webtoon-ranking').addEventListener('click', () => createAutoProject('ranking'));

function createAutoProject(type) {
  const id = Date.now().toString();
  const title = (Object.values(projects).some(p => p.title === '웹툰 취향 리스트')) ? `웹툰 취향 리스트 ${Object.values(projects).length + 1}` : '웹툰 취향 리스트';
  projects[id] = { id, title, type, items: [] };
  let itemIndex = 0;
  webtoonCategories.forEach(category => {
    category.list.forEach(name => {
      projects[id].items.push({ itemId: id + '-' + (itemIndex++), name: name.replace(/\[.*?\]|\(.*?\)/g, '').trim(), memo: '', img: null, zone: category.zoneId, color: category.color });
    });
  });
  saveData(); renderHome(); openProject(id);
}

function createProject(type, title) {
  const id = Date.now().toString(); projects[id] = { id, title, type, items: [] }; saveData(); renderHome(); openProject(id);
}

function renderHome() {
  const list = document.getElementById('project-list'); list.innerHTML = '';
  Object.values(projects).forEach(p => {
    const card = document.createElement('div'); card.className = 'project-card';
    card.innerHTML = `<div><span style="font-size:12px; color:#888; font-weight:600;">${p.type === 'tier' ? '티어' : '랭킹'}</span><h3>${p.title}</h3></div><div class="project-actions"><button onclick="openProject('${p.id}')">열기</button><button onclick="deleteProject('${p.id}')" class="del-btn">삭제</button></div>`;
    list.appendChild(card);
  });
  renderWishList();
}

window.deleteProject = function(id) { if (confirm("정말 삭제하시겠습니까?")) { delete projects[id]; saveData(); renderHome(); } }

function hideAllScreens() {
  document.getElementById('home-screen').style.display = 'none'; document.getElementById('workspace-screen').style.display = 'none';
  document.getElementById('worldcup-screen').style.display = 'none'; document.getElementById('compare-screen').style.display = 'none';
}

window.openProject = function(id) {
  currentId = id; const p = projects[id]; document.getElementById('current-project-title').innerText = p.title;
  document.getElementById('tier-mode').style.display = p.type === 'tier' ? 'block' : 'none'; document.getElementById('ranking-mode').style.display = p.type === 'ranking' ? 'block' : 'none';
  hideAllScreens(); document.getElementById('workspace-screen').style.display = 'block'; renderItems();
}

document.querySelectorAll('.go-home-btn').forEach(btn => {
  btn.addEventListener('click', (e) => { 
    hideAllScreens(); 
    if(e.target.id === 'comp-back-btn' && currentCompareTier) { document.getElementById('workspace-screen').style.display = 'block'; currentCompareTier = null; } 
    else { document.getElementById('home-screen').style.display = 'block'; renderHome(); }
  });
});

/* ====================================================================
   💡 부문별 1:1 비교 로직 (Elo Rating & 탭 메뉴)
==================================================================== */
function changeRankTab(tab, btn) {
  currentRankTab = tab;
  document.querySelectorAll('.rank-tab').forEach(el => el.classList.remove('active'));
  btn.classList.add('active');
  renderAnalysis();
}

window.openTierCompare = function(tierId) {
  const tierItems = projects[currentId].items.filter(i => i.zone === tierId).map(i => i.name);
  if(tierItems.length < 2) return alert("비교할 작품이 2개 이상 없습니다!");
  currentCompareTier = tierId;
  document.getElementById('btn-apply-rank').style.display = 'block';
  document.getElementById('comp-title').innerText = `[${tierId}] 부문별 정밀 비교`;
  compareLogs = []; saveLogs(); 
  openCompareMode(tierItems.sort());
}

document.getElementById('btn-compare').addEventListener('click', () => {
  currentCompareTier = null; document.getElementById('btn-apply-rank').style.display = 'none';
  document.getElementById('comp-title').innerText = "전체 1:1 집중 비교소";
  openCompareMode([...cleanWebtoonList].sort());
});

function openCompareMode(itemList) {
  hideAllScreens(); document.getElementById('compare-screen').style.display = 'block';
  document.getElementById('comp-fixed').innerHTML = '우클릭 하세요'; document.getElementById('comp-fixed').classList.add('empty');
  document.getElementById('comp-target').innerHTML = '좌클릭 하세요'; document.getElementById('comp-target').classList.add('empty');
  renderLogs();
  const listArea = document.getElementById('comp-list'); listArea.innerHTML = '';
  itemList.forEach(name => {
    if(deletedCands.includes(name)) return;
    const wrapper = document.createElement('div'); wrapper.className = 'cand-wrapper';
    const btn = document.createElement('button'); btn.className = 'comp-item-btn'; btn.innerText = name;
    btn.onclick = () => { document.getElementById('comp-target').innerText = name; document.getElementById('comp-target').classList.remove('empty'); };
    btn.oncontextmenu = (e) => { e.preventDefault(); document.getElementById('comp-fixed').innerText = name; document.getElementById('comp-fixed').classList.remove('empty'); };
    const delBtn = document.createElement('button'); delBtn.className = 'cand-del-btn'; delBtn.innerText = '×';
    delBtn.onclick = () => { if(confirm(`${name}을 삭제할까요?`)) { deletedCands.push(name); saveDeletedCands(); wrapper.remove(); } }
    wrapper.appendChild(btn); wrapper.appendChild(delBtn); listArea.appendChild(wrapper);
  });
}

// 💡 부문별 승리 기록
window.recordCategoryWin = function(category, side) {
  const fixed = document.getElementById('comp-fixed').innerText;
  const target = document.getElementById('comp-target').innerText;
  if(fixed.includes('클릭') || target.includes('클릭')) return alert("작품을 선택해주세요!");
  const winner = (side === 'fixed') ? fixed : target;
  const loser = (side === 'fixed') ? target : fixed;
  const catNames = { art: '🎨작화', story: '📖스토리', scene: '🔥씬' };
  compareLogs.unshift({ id: Date.now(), html: `[${catNames[category]}] <b>${winner}</b> 승`, winner, loser, category });
  saveLogs(); renderLogs();
}

// 💡 종합 승리 기록
window.recordCompare = function(side) {
  const fixed = document.getElementById('comp-fixed').innerText;
  const target = document.getElementById('comp-target').innerText;
  if(fixed.includes('클릭') || target.includes('클릭')) return alert("작품을 선택해주세요!");
  const winner = (side === 'fixed') ? fixed : target;
  const loser = (side === 'fixed') ? target : fixed;
  compareLogs.unshift({ id: Date.now(), html: `<span style="color:#4F46E5">[종합]</span> <b>${winner}</b> 승`, winner, loser, category: 'total' });
  saveLogs(); renderLogs();
}

function renderLogs() {
  const area = document.getElementById('comp-log'); area.innerHTML = compareLogs.length ? '' : '기록이 없습니다.';
  compareLogs.forEach(l => {
    area.innerHTML += `<div style="padding:8px 0; border-bottom:1px solid #eee; display:flex; justify-content:space-between;"><div>${l.html}</div><button onclick="deleteLog(${l.id})" style="border:none; background:none; color:red; cursor:pointer;">×</button></div>`;
  });
  renderAnalysis();
}
window.deleteLog = (id) => { compareLogs = compareLogs.filter(l => l.id !== id); saveLogs(); renderLogs(); };
window.clearLogs = () => { if(confirm("초기화할까요?")) { compareLogs = []; saveLogs(); renderLogs(); } };

// 💡 부문별 엘로 레이팅 분석 엔진
function renderAnalysis() {
  const area = document.getElementById('comp-analysis');
  const filtered = compareLogs.filter(l => l.category === currentRankTab);
  if(!filtered.length) { area.innerHTML = "해당 부문 데이터가 부족합니다."; return; }
  let elo = {}; const K = 32;
  [...filtered].reverse().forEach(l => {
    if(!elo[l.winner]) elo[l.winner] = 1000; if(!elo[l.loser]) elo[l.loser] = 1000;
    let expW = 1 / (1 + Math.pow(10, (elo[l.loser] - elo[l.winner]) / 400));
    elo[l.winner] += K * (1 - expW); elo[l.loser] += K * (0 - (1-expW));
  });
  let arr = Object.keys(elo).map(k => ({ name: k, score: Math.round(elo[k]) })).sort((a,b) => b.score - a.score);
  currentRankArr = arr; area.innerHTML = '';
  arr.forEach((item, i) => {
    area.innerHTML += `<div class="rank-bar"><div class="rank-name-box"><span class="rank-medal">${i+1}위</span><span>${item.name}</span></div><div class="rank-stats" style="color:#4F46E5;">${item.score}점</div></div>`;
  });
}

window.applyRankingToTier = function() {
  if(currentRankTab !== 'total') return alert("종합 탭의 순위로만 적용 가능합니다!");
  if(!currentRankArr.length) return alert("데이터가 없습니다!");
  let sortedNames = currentRankArr.map(r => r.name);
  let tierItems = projects[currentId].items.filter(i => i.zone === currentCompareTier);
  let otherItems = projects[currentId].items.filter(i => i.zone !== currentCompareTier);
  tierItems.sort((a, b) => {
    let idxA = sortedNames.indexOf(a.name); let idxB = sortedNames.indexOf(b.name);
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  });
  projects[currentId].items = [...otherItems, ...tierItems]; saveData(); 
  alert("티어 내 순위가 적용되었습니다!"); document.getElementById('comp-back-btn').click();
}

/* ====================================================================
   💡 기존 드래그 앤 드롭 & 월드컵 로직 (유지)
==================================================================== */
function renderItems() {
  document.querySelectorAll('.tier-items, .pool').forEach(el => el.innerHTML = '');
  projects[currentId].items.forEach(item => {
    const itemEl = document.createElement('div'); itemEl.className = `item ${item.color || ''}`;
    itemEl.draggable = true; itemEl.id = item.itemId;
    itemEl.innerHTML = `<div class="name-tag">${item.name}</div>${item.memo ? `<div class="item-memo-tooltip">${item.memo}</div>`:''}<button class="item-del-btn">×</button>`;
    itemEl.querySelector('.item-del-btn').onclick = (e) => { e.stopPropagation(); if(confirm('삭제?')) { projects[currentId].items = projects[currentId].items.filter(i=>i.itemId !== item.itemId); saveData(); renderItems(); } };
    itemEl.ondragstart = (e) => { draggedItem = item; itemEl.classList.add('dragging'); isDragging = true; };
    itemEl.ondragend = () => { 
      itemEl.classList.remove('dragging'); isDragging = false;
      const newItems = [];
      document.querySelectorAll('.item').forEach(el => {
        const found = projects[currentId].items.find(i => i.itemId === el.id);
        if (found) { found.zone = el.parentElement.getAttribute('data-zone'); newItems.push(found); }
      });
      projects[currentId].items = newItems; saveData(); renderItems();
    };
    const dropZone = document.querySelector(`[data-zone="${item.zone}"]`); if(dropZone) dropZone.appendChild(itemEl);
  });
  updateRanking();
}

function getDragAfterElement(container, x, y) {
  const elements = [...container.querySelectorAll('.item:not(.dragging)')];
  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = container.classList.contains('ranking-list') ? y - box.top - box.height/2 : x - box.left - box.width/2;
    if (offset < 0 && offset > closest.offset) return { offset, element: child }; else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.querySelectorAll('.tier-items, .pool, .ranking-list').forEach(zone => {
  zone.ondragover = (e) => {
    e.preventDefault(); const after = getDragAfterElement(zone, e.clientX, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (after == null) zone.appendChild(dragging); else zone.insertBefore(dragging, after);
  };
});

function updateRanking() {
  const items = document.querySelectorAll('#ranking-list .item');
  items.forEach((item, i) => {
    let num = item.querySelector('.ranking-number') || document.createElement('div');
    num.className = 'ranking-number'; num.innerText = i + 1;
    if(!item.querySelector('.ranking-number')) item.prepend(num);
  });
}

/* 월드컵 로직 */
let wcCurrentRound = []; let wcNextRound = []; let wcMatchIndex = 0; let wcRankings = []; let wcLosersThisRound = [];
document.getElementById('btn-worldcup').onclick = () => {
  hideAllScreens(); document.getElementById('worldcup-screen').style.display = 'block';
  document.getElementById('wc-play-area').style.display = 'flex'; document.getElementById('wc-result-area').style.display = 'none';
  let active = cleanWebtoonList.filter(n => !deletedCands.includes(n));
  wcCurrentRound = [...active].sort(() => Math.random() - 0.5);
  wcNextRound = []; wcMatchIndex = 0; wcRankings = []; wcLosersThisRound = [];
  updateWcUI();
};
function updateWcUI() {
  if (wcCurrentRound.length === 1) {
    document.getElementById('wc-play-area').style.display = 'none'; document.getElementById('wc-result-area').style.display = 'block';
    const rankList = document.getElementById('wc-ranking-list'); rankList.innerHTML = `<div class="wc-rank-item">🥇 ${wcCurrentRound[0]}</div>`;
    let count = 2; wcRankings.forEach(losers => { losers.forEach(l => { rankList.innerHTML += `<div class="wc-rank-item">${count++}위: ${l}</div>`; }); });
    return;
  }
  if (wcMatchIndex >= wcCurrentRound.length - 1) {
    wcNextRound.push(wcCurrentRound[wcMatchIndex]); wcRankings.unshift([...wcLosersThisRound]); wcLosersThisRound = [];
    wcCurrentRound = wcNextRound; wcNextRound = []; wcMatchIndex = 0; return updateWcUI();
  }
  document.getElementById('wc-round-text').innerText = `${wcCurrentRound.length}강 (${wcMatchIndex/2 + 1}/${wcCurrentRound.length/2})`;
  document.getElementById('wc-left').innerText = wcCurrentRound[wcMatchIndex];
  document.getElementById('wc-right').innerText = wcCurrentRound[wcMatchIndex+1];
}
window.selectWcItem = (side) => {
  let win = (side==='left') ? wcCurrentRound[wcMatchIndex] : wcCurrentRound[wcMatchIndex+1];
  let lose = (side==='left') ? wcCurrentRound[wcMatchIndex+1] : wcCurrentRound[wcMatchIndex];
  wcNextRound.push(win); wcLosersThisRound.push(lose); wcMatchIndex += 2;
  if(wcMatchIndex >= wcCurrentRound.length) { wcRankings.unshift([...wcLosersThisRound]); wcLosersThisRound=[]; wcCurrentRound=wcNextRound; wcNextRound=[]; wcMatchIndex=0; }
  updateWcUI();
};

document.getElementById('add-item-btn').onclick = () => {
  const name = document.getElementById('item-name').value;
  if (!name) return alert("이름!");
  const newItem = { itemId: Date.now().toString(), name, memo: document.getElementById('item-memo').value, img: null, zone: 'pool-skyblue' };
  const file = document.getElementById('item-image').files[0];
  if(file) {
    const r = new FileReader(); r.onload = (e) => { newItem.img = e.target.result; projects[currentId].items.push(newItem); saveData(); renderItems(); }; r.readAsDataURL(file);
  } else { projects[currentId].items.push(newItem); saveData(); renderItems(); }
  document.getElementById('item-name').value=''; document.getElementById('item-memo').value='';
};

renderHome();