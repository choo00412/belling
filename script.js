// ====================================================================
// 1. 초기 변수 세팅
// ====================================================================
let projects = {};
let wishList = [];
let scrapList = [];
let compareLogs = [];
let deletedCands = [];
let taggedWorksData = [];
let readWorksList = [];
let tagCategories = [];
let readingBooks = []; 
let timetableData = { weekly: {}, tendays: {} }; // 📅 시간표 데이터 추가
let webtoonGroups = {}

let currentId = null;
let draggedItem = null;
let draggedCatItem = null;
let isDragging = false;
let pendingProjectType = ''; 
let currentCompareTier = null; 
let currentRankArr = [];
let draggedReadWorkIndex = null;
let currentReadingBookId = null;
let currentTaggingWorkId = null; 

// 📅 시간표 초기 기본 데이터 
const initialTimetableData = {
  weekly: {
    mon: [ {id: 1, name: "신을 품는 방법", color: "tt-pink"}, {id: 2, name: "강건마", color: "tt-peach"}, {id: 3, name: "더블 다운", color: "tt-peach"} ],
    tue: [ {id: 4, name: "미혹의 경계", color: "tt-pink"}, {id: 5, name: "쥐덫", color: "tt-peach"}, {id: 6, name: "키스 미 이프 유 캔", color: "tt-peach"} ],
    wed: [ {id: 7, name: "당밤사", color: "tt-pink"}, {id: 8, name: "안 되는 사이", color: "tt-pink"}, {id: 9, name: "권태주의보", color: "tt-peach"}, {id: 10, name: "언슬립", color: "tt-peach"} ],
    thu: [ {id: 11, name: "짝사랑 필승법", color: "tt-pink"}, {id: 12, name: "배드 애플", color: "tt-pink"}, {id: 13, name: "선 넘는 사이", color: "tt-peach"} ],
    fri: [ {id: 14, name: "은총의 밤", color: "tt-peach"}, {id: 15, name: "시거나 떫거나", color: "tt-peach"}, {id: 16, name: "제물 남편", color: "tt-peach"}, {id: 17, name: "향의 경계", color: "tt-peach"}, {id: 18, name: "개구리 삶기", color: "tt-blue"}, {id: 19, name: "언로맨틱 오피스", color: "tt-blue"} ],
    sat: [ {id: 20, name: "힛미하드", color: "tt-peach"}, {id: 21, name: "캐오크", color: "tt-peach"}, {id: 22, name: "백련이 피는 온도", color: "tt-peach"} ],
    sun: [ {id: 23, name: "누군가 정해둔 것처럼", color: "tt-pink"}, {id: 24, name: "아기 삶", color: "tt-pink"}, {id: 25, name: "바라메 강림", color: "tt-peach"}, {id: 26, name: "뱀굴", color: "tt-peach"}, {id: 27, name: "소꿉친구와 감금", color: "tt-peach"}, {id: 28, name: "러브 오더", color: "tt-blue"} ]
  },
  tendays: {
    d1: [ {id: 29, name: "고양이 테라피", color: "tt-blue"} ],
    d3: [ {id: 30, name: "너는 나의 세상", color: "tt-pink"}, {id: 31, name: "징크스", color: "tt-peach"} ],
    d6: [ {id: 32, name: "해빙곡선", color: "tt-peach"}, {id: 33, name: "일간 알바", color: "tt-blue"} ],
    d8: [ {id: 34, name: "하이스쿨 솔티 하트", color: "tt-peach"} ],
    d10: [ {id: 35, name: "미혹의 경계", color: "tt-pink"}, {id: 36, name: "스테이지 비하인드", color: "tt-pink"}, {id: 37, name: "해피투게더", color: "tt-blue"} ]
  }
};

const initialWorksData = [
  {id: "w1", title: "징크스", top: "주재경", bottom: "김단", tags: { title: [], top: [], bottom: [] }},
  {id: "w2", title: "홍실 퀘스트", top: "이연", bottom: "홍기훈", tags: { title: [], top: [], bottom: [] }},
  {id: "w3", title: "물가의 밤", top: "여태주", bottom: "김의현", tags: { title: [], top: [], bottom: [] }},
  {id: "w4", title: "FlashLight", top: "애런", bottom: "유진 하트", tags: { title: [], top: [], bottom: [] }},
  {id: "w5", title: "일간 알바", top: "연태서", bottom: "주여민", tags: { title: [], top: [], bottom: [] }},
  {id: "w6", title: "야화첩", top: "윤승호", bottom: "백나겸", tags: { title: [], top: [], bottom: [] }}
];

const webtoonCategories = [
  { color: "bg-skyblue", zoneId: "pool-skyblue", list: ["일간알바", "코드네임 아나스타샤", "소꿉친구와 감금당했다", "공과 사는 구분해!", "그 가이드가 집착광공의 품에서 벗어나는 방법", "더 뮤즈", "쉬운 선배", "노 모럴", "러브 오더", "솔트 소사이어티", "녹색전상", "고양이 테라피", "텐(TEN)", "반칙", "죽어 마땅한 것들", "결혼하는 남자", "별주부전", " 그 공작가 노예의 음란한 속사정", "망종(亡種)", "비밀이 많은 XX", "아우토반 로맨스", "아늑한 집착", "모두에게 친절한 너는 왜", "갱생의 여지", "그림자의 영역", "늑대 신랑 ", "과수원의 사정", "알파 트라우마", "오메가 콤플렉스", "서킷 브레이커", "롤플레잉-경찰❤️파일럿", "친구새끼들한테 따먹혔습니다", "실연 중독", "성실한 채무자?", "형제애", "위험한 편의점", "럽미닥터!", "상극", "피자배달부와 골드팰리스", "패션(PASSION)", "실수로 잘못 고백했는데", "더러운 욕망", "XX하면 알 수 있지 않을까?", "테라노 군과 쿠마자키 군", "절대 BL이 되는 세계 VS 절대 BL이 되고 싶지 않은 남자", "페이크 팩트 립스", "소꿉친구로는 참을 수 없어", " 운명의 짝이 너라니", "오프 스테이지 러브 사이드", "테라피 게임", "나츠메 씨는 개발당하고 싶다", "가슴 지명", "드래그리스·섹스", "반하는 약을 먹은 완벽남이 위험합니다! 2권", "너무 야한 후카미군", "40까지 하고 싶은 10가지 일", "힐링 패러독스", "30살까지 동정이면 마법사가 될 수 있대", "독점! 마이 히어로", "개구리 삶기", "시맨틱 에러", "해피투게더"] },
  { color: "bg-red", zoneId: "pool-red", list: ["호식이 이야기", "강아지는 건드리지 마라", "슬립 업(Slip Up)", "가장 깊은 고백", "소꿉친구와 감금당했다", "키스 미 이프 유 캔(Kiss Me If You Can)", "드라이버스 하이 (Driver's high)", "해빙곡선", "장미와 샴페인", "리미티드 런", "FlashLight (플래시라이트)", "외사랑", "이리 사랑스러운 너", "스미르나 앤 카프리", "뱀 굴", "야화첩", "하이스쿨 솔티 하트", "조개소년 : 발화 / 조개소년", "징크스", "향의 경계", "선 넘는 사이", "언슬립", "알페가(Alphega)", "풀북", "멍멍한 관계", "백라이트", "내가 네 운명의 가이드는 아니지만", "녹색전상 : 몽리 / 녹색전상", "유원불변", "해와 달의 공생관계", "너드프로젝트", "시시포스의 개들", "뼈와 꽃잎", "박하사탕", "더블다운", "캐시 오어 크레딧", "남보다 못한 사이", "바라메 강림하여 주소서", "제물 남편", "시거나 떫거나", "은총의 밤", "가장 완벽한 도형", "백련이 피는 온도", "논제로섬", "아이돌 보러 간다며!"] },
  { color: "bg-yellow-light", zoneId: "pool-yellow", list: ["등쳐먹는 연애", "홍실퀘스트", "필 마이 베네핏", "작전명 마레오", "망돌 콤플렉스", "인 마이 배드(In My Bad)", "너는 나의 세상", "하절기", "짝사랑 필승법", "솔직하고 대담하게", "넌 내게 수치심을 줬어❤️", "환장의 가이딩", "신을 품는 방법", "꽃이 지는 연못", "원룸 조교님", "엎질러진 피", "코티지 가든(Cottage garden)", "럭키 다이스", "러브 올 플레이(LOVE ALL PLAY)", "구른 김에 왕까지", "월요일의 구원자", "엑시덴탈 베이비(Accidental baby)", "피앙세는 토마토", "유성이 내리는 우주", "스테이지 비하인드", "방문 판매 왔습니다!", "백야의 꽃길", "당신이 방심한 사이", "미혹의 경계", "아기 삶을 낳아줘, 나 미치는 꼴 보기 싫으면!", "그래서 누가 깔린건데?", "스쿠프", "해 뜨는 집", "물가의 밤", "파도의 해안", "누군가 정해둔 것처럼", "자두를 누르지 마시오", "감금당해 주세요!"] }
];

const cleanWebtoonList = [];
webtoonCategories.forEach(c => { c.list.forEach(name => { const cleanName = name.replace(/\[.*?\]|\(.*?\)/g, '').trim(); if(!cleanWebtoonList.includes(cleanName)) cleanWebtoonList.push(cleanName); }); });

const initialTagCategories = [
  { type: 'genre', name: '장르/배경/세계관', colorClass: 'kw-genre', items: ["현대물", "시대물", "동양풍", "서양풍", "판타지", "오메가버스", "캠퍼스물", "오피스물(리만물)", "연예계물", "빙의물", "환생물"] },
  { type: 'top', name: '공 키워드', colorClass: 'kw-top', items: ["다정공", "집착공", "후회공", "능글공", "광공", "무심공", "복흑/계략공", "연하공", "연상공", "미남공"] },
  { type: 'bottom', name: '수 키워드', colorClass: 'kw-bottom', items: ["다정수", "까칠수", "처연수", "굴림수", "도망수", "햇살수", "유혹수", "단정수", "미인수"] },
  { type: 'plot', name: '관계성/전개', colorClass: 'kw-plot', items: ["배틀연애", "애증", "구원물", "역키잡", "소꿉친구", "계약연애", "피폐물", "달달물"] }
];

const heartRankData = [
  "징크스", "홍실퀘스트", "물가의 밤", "FlashLight", "일간알바", "야화첩", "힐링 패러독스", "미혹의 경계", "스테이지 비하인드", "개구리 삶기", "해피투게더", "테라노 군과 쿠마자키 군", "드래그리스·섹스", "상극", "제물 남편", "언슬립", "소꿉친구와 감금당했다", "장미와 샴페인", "너는 나의 세상", "드라이버스 하이", "뱀 굴", "노 모럴", "호식이 이야기", "리미티드 런", "백라이트", "스케치", "고양이 테라피", "너무 야한 후카미군", "하이스쿨 솔티 하트", "30살까지 동정이면 마법사가 될 수 있대", "패션", "외사랑", "신을 품는 방법", "걷지않는다리", "아기 삶을 낳아줘, 나 미치는 꼴 보기 싫으면!", "남보다 못한 사이", "시거나 떫거나", "향의 경계", "그래서 누가 깔린건데?", "논제로섬", "백련이 피는 온도", "가장 완벽한 도형", "강아지는 건드리지 마라", "키스 미 이프 유 캔", "필 마이 베네핏", "너드프로젝트", "피자배달부와 골드팰리스", "독점! 마이 히어로", "짝사랑 필승법", "비밀이 많은 XX", "공과 사는 구분해!", "러브 오더", "망종", "솔트 소사이어티", "오메가 콤플렉스", "친구새끼들한테 따먹혔습니다", "페이크 팩트 립스", "알파 트라우마", "운명의 짝이 너라니", "내가 네 운명의 가이드는 아니지만", "그 공작가 노예의 음란한 속사정", "아이돌 보러 간다며!", "스미르나 앤 카프리", "망돌 콤플렉스", "40까지 하고 싶은 10가지 일", "은총의 밤", "자두를 누르지 마시오", "선 넘는 사이", "실연 중독", "바라메 강림하여 주소서", "박하사탕", "풀북", "테라피 게임", "캐시 오어 크레딧", "더블다운", "뼈와 꽃잎", "누군가 정해둔 것처럼", "소꿉친구로는 참을 수 없어", "백야의 꽃길", "감금당해 주세요!", "엑시덴탈 베이비", "코드네임 아나스타샤", "해빙곡선", "원룸 조교님", "시시포스의 개들", "유원불변", "방문 판매 왔습니다!", "일요일의 구원자", "가장 깊은 고백", "엎질러진 피", "녹색전상", "위험한 편의점", "형제애", "알페가", "시맨틱 에러", "슬립 업", "등쳐먹는 연애", "이리 사랑스러운 너", "넌 내게 수치심을 줬어❤️", "유성이 내리는 우주", "럭키 다이스", "피앙세는 토마토", "환장의 가이딩", "코티지 가든", "솔직하고 대담하게", "XX하면 알 수 있지 않을까?", "당신이 방심한 사이", "가슴 지명", "갱생의 여지", "나츠메 씨는 개발당하고 싶다", "럽미닥터!", "녹색전상 : 몽리 / 녹색전상", "파도의 해안", "해 뜨는 집", "멍멍한 관계", "조개소년 : 발화 / 조개소년", "해와 달의 공생관계", "아우토반 로맨스", "반하는 약을 먹은 완벽남이 위험합니다! 2권", "절대 BL이 되는 세계 VS 절대 BL이 되고 싶지 않은 남자", "하절기", "인 마이 배드", "꽃이 지는 연못", "구른 김에 왕까지", "러브 올 플레이", "스쿠프", "작전명 마레오"
];

function getDynamicWebtoonList() { return readWorksList.map(w => w.name); }

// ====================================================================
// 2. 파이어베이스 데이터 로드 및 저장
// ====================================================================
async function initApp() {
  if (!window.db) { setTimeout(initApp, 100); return; }
  try {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js");
    const dbRef = doc(window.db, "ti_me_data", "my_shared_data"); 
    const snap = await getDoc(dbRef);
    if (snap.exists()) {
      const data = snap.data(); 
      projects = data.projects || {}; wishList = data.wishList || []; scrapList = data.scrapList || []; compareLogs = data.compareLogs || []; deletedCands = data.deletedCands || []; taggedWorksData = data.taggedWorksData || JSON.parse(JSON.stringify(initialWorksData)); tagCategories = data.tagCategories || initialTagCategories; readWorksList = data.readWorksList || []; readingBooks = data.readingBooks || [];
      timetableData = data.timetableData || initialTimetableData; // 📅 추가
      webtoonGroups = data.webtoonGroups || {}; // 🗂️ 요기 추가! (데이터 불러오기)
    } else { 
        taggedWorksData = JSON.parse(JSON.stringify(initialWorksData)); tagCategories = initialTagCategories; timetableData = initialTimetableData;
        webtoonGroups = {}; // 🗂️ 요기도 추가! (처음 빈 데이터일 때)
    }
  } catch (e) { 
      console.error("로드 실패:", e); taggedWorksData = JSON.parse(JSON.stringify(initialWorksData)); tagCategories = initialTagCategories; timetableData = initialTimetableData;
      webtoonGroups = {}; // 🗂️ 요기도 추가! (에러 났을 때 방어)
  }
  
  // (아래에 initReadWorksList() 등 기존 코드들은 그대로 두시면 됩니다!)
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
    await setDoc(dbRef, { projects, wishList, scrapList, compareLogs, deletedCands, taggedWorksData, tagCategories, readWorksList, readingBooks, timetableData, webtoonGroups });
  } catch (error) { console.error("저장 실패:", error); }
}

function saveData() { saveAllData(); } function saveWish() { saveAllData(); } function saveScraps() { saveAllData(); } function saveLogs() { saveAllData(); } function saveDeletedCands() { saveAllData(); } function saveTaggingData() { saveAllData(); } function saveReadWorks() { saveAllData(); } function saveReadingLogData() { saveAllData(); }

// ====================================================================
// 💡 화면 전환 및 메인 로직
// ====================================================================
const modal = document.getElementById('custom-modal'); const modalInput = document.getElementById('modal-input');
document.getElementById('btn-new-tier').addEventListener('click', () => openModal('tier'));
document.getElementById('btn-new-ranking').addEventListener('click', () => openModal('ranking'));

function openModal(type) { pendingProjectType = type; modalInput.value = ''; modal.style.display = 'flex'; modalInput.focus(); }
document.getElementById('modal-cancel').addEventListener('click', () => { modal.style.display = 'none'; });
document.getElementById('modal-confirm').addEventListener('click', () => { const title = modalInput.value.trim(); if (title) { createProject(pendingProjectType, title); modal.style.display = 'none'; } });

function getNextTitle(baseTitle) {
  const existingTitles = Object.values(projects).map(p => p.title); if (!existingTitles.includes(baseTitle)) return baseTitle;
  let count = 2; while (existingTitles.includes(`${baseTitle} ${count}`)) { count++; } return `${baseTitle} ${count}`;
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
  webtoonCategories.forEach(category => { category.list.forEach(name => { projects[id].items.push({ itemId: id + '-' + (itemIndex++), name: name.replace(/\[.*?\]|\(.*?\)/g, '').trim(), memo: '', img: null, zone: category.zoneId, color: category.color }); }); });
  saveData(); renderHome(); openProject(id);
}
function createProject(type, title) { const id = Date.now().toString(); projects[id] = { id, title, type, subType: 'custom', items: [] }; saveData(); renderHome(); openProject(id); }

// 💡 저장된 프로젝트 렌더링 (예전 크기 빵빵하게 복구 + x버튼 유지)
function renderHome() {
  const list = document.getElementById('project-list'); 
  list.innerHTML = '';
  
  Object.values(projects).forEach(p => {
    const card = document.createElement('div'); 
    card.className = 'project-card';
    
    // 카드 전체 영역을 누르면 프로젝트가 열리도록 설정
    card.onclick = () => openProject(p.id);
    
    card.innerHTML = `
      <span style="font-size:12px; color:#888; font-weight:600; margin-bottom:6px; display:block;">
          ${p.subType === 'keyword' ? '키워드 모드' : (p.type === 'tier' ? '티어 모드' : '랭킹 모드')}
      </span>
      <h3>${p.title}</h3>
      <button onclick="event.stopPropagation(); deleteProject('${p.id}')" style="position:absolute; top:20px; right:20px; background:transparent; color:#ef4444; border:none; font-size:18px; font-weight:900; cursor:pointer; padding:0; outline:none; box-shadow:none;">✕</button>
    `;
    list.appendChild(card);
  });
}

window.deleteProject = function(id) { if (confirm("정말 삭제하시겠습니까?")) { delete projects[id]; saveData(); renderHome(); } }

function hideAllScreens() { ['home-screen', 'workspace-screen', 'worldcup-screen', 'compare-screen', 'wishlist-screen', 'scrap-screen', 'category-rank-screen', 'tagging-screen', 'read-works-screen', 'reading-log-screen', 'reading-detail-screen', 'timetable-screen', 'group-screen'].forEach(id => { const el = document.getElementById(id); if(el) el.style.display = 'none'; }); }

document.querySelectorAll('.go-home-btn').forEach(btn => {
  btn.addEventListener('click', (e) => { hideAllScreens(); if(e.target.id === 'comp-back-btn' && currentCompareTier) { document.getElementById('workspace-screen').style.display = 'block'; currentCompareTier = null; } else { document.getElementById('home-screen').style.display = 'block'; renderHome(); } });
});
document.querySelectorAll('.go-workspace-btn').forEach(btn => { btn.addEventListener('click', () => { hideAllScreens(); document.getElementById('workspace-screen').style.display = 'block'; }); });

// 📅 시간표 화면 열기 & 동적 렌더링
document.getElementById('btn-open-timetable').addEventListener('click', () => {
    hideAllScreens();
    document.getElementById('timetable-screen').style.display = 'block';
    renderTimetable();
});

window.renderTimetable = function() {
    if(!timetableData.weekly) timetableData.weekly = {mon:[], tue:[], wed:[], thu:[], fri:[], sat:[], sun:[]};
    if(!timetableData.tendays) timetableData.tendays = {d1:[], d3:[], d6:[], d8:[], d10:[]};

    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(day => {
        const td = document.getElementById(`tt-${day}`);
        if(td) {
            td.innerHTML = timetableData.weekly[day].map(item => `
                <div class="tt-item ${item.color}">
                    ${item.name}
                    <button class="tt-item-del" onclick="deleteTimetableItem('weekly', '${day}', ${item.id})">✕</button>
                </div>
            `).join('');
        }
    });

    ['d1', 'd3', 'd6', 'd8', 'd10'].forEach(day => {
        const td = document.getElementById(`tt-${day}`);
        if(td) {
            td.innerHTML = timetableData.tendays[day].map(item => `
                <div class="tt-item ${item.color}">
                    ${item.name}
                    <button class="tt-item-del" onclick="deleteTimetableItem('tendays', '${day}', ${item.id})">✕</button>
                </div>
            `).join('');
        }
    });
}

window.openTimetableModal = function() {
    document.getElementById('tt-modal-title').value = '';
    document.getElementById('timetable-modal').style.display = 'flex';
}

window.closeTimetableModal = function() {
    document.getElementById('timetable-modal').style.display = 'none';
}

window.saveTimetableItem = function() {
    const title = document.getElementById('tt-modal-title').value.trim();
    const dayValue = document.getElementById('tt-modal-day').value;
    const color = document.getElementById('tt-modal-color').value;

    if(!title) return alert("작품명을 입력해주세요!");

    const type = dayValue.startsWith('d') ? 'tendays' : 'weekly';
    const newItem = { id: Date.now(), name: title, color: color };

    if(!timetableData[type][dayValue]) timetableData[type][dayValue] = [];
    timetableData[type][dayValue].push(newItem);

    saveAllData();
    renderTimetable();
    closeTimetableModal();
}

window.deleteTimetableItem = function(type, day, id) {
    if(confirm("이 일정을 삭제할까요?")) {
        timetableData[type][day] = timetableData[type][day].filter(item => item.id !== id);
        saveAllData();
        renderTimetable();
    }
}

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
    const itemEl = document.createElement('div'); itemEl.className = 'item'; if (item.color) { itemEl.classList.add(item.color); } itemEl.draggable = true; itemEl.id = item.itemId;
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
  zone.addEventListener('dragover', (e) => { e.preventDefault(); const afterElement = getDragAfterElement(zone, e.clientX, e.clientY); const dragging = document.querySelector('.dragging'); if (dragging) { if (afterElement == null) { zone.appendChild(dragging); } else { zone.insertBefore(dragging, afterElement); } } });
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
  return draggableElements.reduce((closest, child) => { const box = child.getBoundingClientRect(); const offset = container.classList.contains('ranking-list') ? y - box.top - box.height / 2 : x - box.left - box.width / 2; if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } else { return closest; } }, { offset: Number.NEGATIVE_INFINITY }).element;
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
document.getElementById('btn-open-groups').addEventListener('click', () => { hideAllScreens(); document.getElementById('group-screen').style.display = 'block'; renderGroupManager(); });
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
  let activeList = cleanWebtoonList.filter(name => !deletedCands.includes(name));
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
document.getElementById('btn-compare').addEventListener('click', () => { currentCompareTier = null; document.getElementById('btn-apply-rank').style.display = 'none'; document.getElementById('comp-title').innerText = "전체 1:1 집중 비교소"; openCompareMode([...cleanWebtoonList].sort()); });

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

// ====================================================================
// 🚀 작품 키워드 서재
// ====================================================================
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
    document.getElementById('tagging-grid-container').style.display = 'none'; document.getElementById('work-detail-view').style.display = 'block';
    document.getElementById('detail-work-title').innerText = `📖 ${work.title}`; document.getElementById('detail-top-name').innerText = `공: ${work.top}`; document.getElementById('detail-bottom-name').innerText = `수: ${work.bottom}`;
    document.getElementById('dz-title').setAttribute('data-work-id', work.id); document.getElementById('dz-top').setAttribute('data-work-id', work.id); document.getElementById('dz-bottom').setAttribute('data-work-id', work.id);
    renderDetailTags(); setupDropZones();
  }
}
window.closeWorkDetail = function() { currentTaggingWorkId = null; document.getElementById('work-detail-view').style.display = 'none'; document.getElementById('tagging-grid-container').style.display = 'block'; renderTaggingGrid(); }
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
    section.innerHTML = `<div class="pool-header"><h4>${cat.name}</h4><button class="btn-add-kw" onclick="addNewKeyword(${catIndex})">＋</button></div>`;
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
  if (newWord && newWord.trim() !== "") { if(tagCategories[catIndex].items.includes(newWord.trim())) { return alert("이미 존재하는 키워드입니다!"); } tagCategories[catIndex].items.push(newWord.trim()); saveTaggingData(); renderKeywordPool(); }
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
        if (work) { if (!work.tags[target].find(t => t.name === payload.name)) { work.tags[target].push(payload); saveTaggingData(); renderDetailTags(); } }
      } catch (err) { console.error(err); }
    });
  });
}

function initReadWorksList() {
  if (readWorksList && readWorksList.length > 0) return; let rId = 0;
  webtoonCategories.forEach(cat => { let platform = cat.color === 'bg-skyblue' ? '리디' : (cat.color === 'bg-red' ? '레진' : '봄툰'); cat.list.forEach(name => { let cleanName = name.replace(/\[.*?\]|\(.*?\)/g, '').trim(); if(!readWorksList.find(w => w.name === cleanName)) { readWorksList.push({ id: 'rw_'+(rId++), name: cleanName, platform: platform, colorClass: cat.color }); } }); });
  saveReadWorks();
}

document.getElementById('btn-open-read-works').addEventListener('click', () => { hideAllScreens(); document.getElementById('read-works-screen').style.display = 'block'; renderReadWorks(); });
window.saveReadWorksManual = function() { saveAllData(); alert("현재 리스트 순서가 완벽하게 저장되었습니다!"); }
window.sortReadWorksList = function(type) {
  if (type === 'abc') { readWorksList.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR')); } else if (type === 'heart') { readWorksList.sort((a, b) => { let idxA = heartRankData.indexOf(a.name); let idxB = heartRankData.indexOf(b.name); if(idxA === -1) idxA = 9999; if(idxB === -1) idxB = 9999; return idxA - idxB; }); } else if (type === 'latest') { readWorksList.sort((a, b) => { const idA = parseInt(a.id.replace('rw_', '')) || 0; const idB = parseInt(b.id.replace('rw_', '')) || 0; return idB - idA; }); }
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
    if (work.colorClass === 'bg-white' || work.platform === '봄툰 등' || !work.colorClass) {
      work.colorClass = 'bg-yellow-light'; work.platform = '봄툰';
      webtoonCategories.forEach(cat => { const cleanList = cat.list.map(n => n.replace(/\[.*?\]|\(.*?\)/g, '').trim()); if (cleanList.includes(work.name)) { work.colorClass = cat.color; work.platform = cat.color === 'bg-skyblue' ? '리디' : (cat.color === 'bg-red' ? '레진' : '봄툰'); } });
    }
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
  const resultDiv = document.getElementById('random-result'); resultDiv.innerHTML = `<span style="font-size:16px;">오늘의 정주행 픽은..</span><br>✨ <span style="color:#111;">${pickedWork.name} (${pickedWork.platform})</span> ✨`;
}

window.previewImage = function(event, previewId) {
  const file = event.target.files[0];
  if (file) { const reader = new FileReader(); reader.onload = function(e) { document.getElementById(previewId).innerHTML = `<img src="${e.target.result}" style="width:100%; border-radius:6px; object-fit:cover;">`; }
    reader.readAsDataURL(file); }
}

document.getElementById('btn-open-reading-log').addEventListener('click', () => { hideAllScreens(); document.getElementById('reading-log-screen').style.display = 'block'; renderReadingBooks(); });

window.openBookModal = function(id = null) {
  const titleEl = document.getElementById('book-title'); const previewEl = document.getElementById('book-image-preview'); document.getElementById('book-id').value = id || '';
  if (id) { const book = readingBooks.find(b => b.id == id); document.getElementById('book-modal-title').innerText = "책 정보 수정"; titleEl.value = book.title; previewEl.innerHTML = book.coverImg ? `<img src="${book.coverImg}" style="width:100%; border-radius:6px; object-fit:cover;">` : ''; } else { document.getElementById('book-modal-title').innerText = "새로운 책 만들기"; titleEl.value = ''; previewEl.innerHTML = ''; document.getElementById('book-image').value = ''; }
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
    const card = document.createElement('div'); card.className = 'book-card'; card.onclick = () => openBookDetail(book.id);
    const entriesCount = book.entries ? book.entries.length : 0;
    card.innerHTML = `<div class="book-actions"><button class="btn-book-edit" onclick="event.stopPropagation(); openBookModal(${book.id})" title="수정">✏️</button><button class="btn-book-del" onclick="event.stopPropagation(); deleteReadingBook(${book.id})" title="삭제">✕</button></div>${book.coverImg ? `<img src="${book.coverImg}" class="book-img">` : `<div class="book-img" style="display:flex; align-items:center; justify-content:center; color:#ccc; font-size:40px;">📖</div>`}<div class="book-content"><div class="book-title">${book.title}</div><div class="book-date">기록 ${entriesCount}개</div></div>`;
    container.appendChild(card);
  });
}

window.openBookDetail = function(bookId) {
  currentReadingBookId = bookId; const book = readingBooks.find(b => b.id == bookId); document.getElementById('reading-log-screen').style.display = 'none'; document.getElementById('reading-detail-screen').style.display = 'block'; document.getElementById('detail-book-title').innerText = `📖 ${book.title}`; renderReadingEntries();
}
window.goBackToBooks = function() { document.getElementById('reading-detail-screen').style.display = 'none'; document.getElementById('reading-log-screen').style.display = 'block'; currentReadingBookId = null; renderReadingBooks(); }

window.openEntryModal = function(entryId = null) {
  const contentEl = document.getElementById('entry-content'); const previewEl = document.getElementById('entry-image-preview'); document.getElementById('entry-id').value = entryId || '';
  if (entryId) { const book = readingBooks.find(b => b.id == currentReadingBookId); const entry = book.entries.find(e => e.id == entryId); contentEl.value = entry.content; previewEl.innerHTML = entry.img ? `<img src="${entry.img}" style="width:100%; border-radius:6px; object-fit:cover;">` : ''; } else { contentEl.value = ''; previewEl.innerHTML = ''; document.getElementById('entry-image').value = ''; }
  document.getElementById('entry-modal').style.display = 'flex';
}
window.closeEntryModal = function() { document.getElementById('entry-modal').style.display = 'none'; }

window.saveReadingEntry = function() {
  const entryId = document.getElementById('entry-id').value; const content = document.getElementById('entry-content').value.trim(); const previewImg = document.getElementById('entry-image-preview').querySelector('img'); const imgData = previewImg ? previewImg.src : null;
  if(!content && !imgData) return alert("내용이나 사진을 추가해주세요!");
  const book = readingBooks.find(b => b.id == currentReadingBookId); if (!book.entries) book.entries = [];
  if (entryId) { const entry = book.entries.find(e => e.id == entryId); entry.content = content; entry.img = imgData; } else { book.entries.push({ id: Date.now(), content, img: imgData, date: new Date().toISOString() }); }
  saveReadingLogData(); closeEntryModal(); renderReadingEntries();
}
window.deleteReadingEntry = function(id) { if(confirm("이 글을 삭제하시겠습니까?")) { const book = readingBooks.find(b => b.id == currentReadingBookId); book.entries = book.entries.filter(e => e.id != id); saveReadingLogData(); renderReadingEntries(); } }
window.sortReadingEntries = function(order) { document.getElementById('sort-reading-entries').dataset.order = order; renderReadingEntries(); }

window.renderReadingEntries = function() {
  const container = document.getElementById('reading-entry-list'); container.innerHTML = '';
  const book = readingBooks.find(b => b.id == currentReadingBookId); 
  if (!book || !book.entries || book.entries.length === 0) { container.innerHTML = '<div style="text-align:center; padding:50px; color:#9ca3af;">첫 독서록을 작성해 보세요! ✍️</div>'; return; }
  const order = document.getElementById('sort-reading-entries').dataset.order || 'oldest'; let sortedEntries = [...book.entries];
  if (order === 'latest') { sortedEntries.sort((a, b) => b.id - a.id); } else { sortedEntries.sort((a, b) => a.id - b.id); }
  sortedEntries.forEach(entry => {
    const dateStr = new Date(entry.date).toLocaleString('ko-KR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
    const el = document.createElement('div'); el.className = 'entry-card';
    el.innerHTML = `<div class="entry-actions"><button onclick="openEntryModal(${entry.id})">수정</button><button onclick="deleteReadingEntry(${entry.id})" style="color:#ef4444;">삭제</button></div><div class="entry-date">${dateStr}</div>${entry.content ? `<div class="entry-content">${entry.content}</div>` : ''}${entry.img ? `<img src="${entry.img}" class="entry-img">` : ''}`;
    container.appendChild(el);
  });
}

// ====================================================================
// 📸 시간표 이미지로 다운로드 기능 (모바일 잘림 현상 완벽 해결!)
// ====================================================================
window.downloadTimetable = function() {
    const targetElement = document.querySelector('.timetable-container');
    if (!targetElement) return;

    // 1. 캡처하기 직전, 모바일 화면에서 숨겨진(스크롤된) 부분까지 다 나오게 박스를 쫙 늘립니다.
    const originalOverflow = targetElement.style.overflow;
    const originalWidth = targetElement.style.width;
    
    targetElement.style.overflow = 'visible';
    targetElement.style.width = targetElement.scrollWidth + 'px'; // 숨겨진 실제 표 길이만큼 강제 확장!

    // 2. 전체가 펼쳐진 상태로 찰칵! 캡처합니다.
    html2canvas(targetElement, {
        scale: 2, // 2배 화질
        backgroundColor: "#ffffff" // 시간표 배경색 (흰색)
    }).then(canvas => {
        // 3. 사진을 다 찍었으면 유저가 눈치채기 전에 다시 원래 스크롤되던 모바일 크기로 되돌려 놓습니다.
        targetElement.style.overflow = originalOverflow;
        targetElement.style.width = originalWidth;

        // 4. 저장 (다운로드)
        const link = document.createElement('a');
        link.download = '나의_웹툰_시간표.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}// ====================================================================
// 🗂️ 웹툰 그룹 분류 관리 및 워크스페이스 동적 연동 로직
// ====================================================================

// 1. 메인 그룹 관리자 렌더링
window.createWebtoonGroup = function() {
  const input = document.getElementById('new-group-name');
  const name = input.value.trim();
  if(!name) return alert("그룹 이름을 입력해주세요!");
  const groupId = 'group_' + Date.now();
  webtoonGroups[groupId] = { id: groupId, name: name, works: [] };
  input.value = '';
  saveAllData();
  renderGroupManager();
}

window.deleteWebtoonGroup = function(groupId) {
  if(confirm("이 그룹을 삭제할까요? (그룹 안의 작품 데이터는 안전합니다)")) {
    delete webtoonGroups[groupId];
    saveAllData();
    renderGroupManager();
  }
}

window.toggleWorkInGroup = function(groupId, workName) {
  const group = webtoonGroups[groupId];
  if(!group.works) group.works = [];
  if(group.works.includes(workName)) {
    group.works = group.works.filter(w => w !== workName);
  } else {
    group.works.push(workName);
  }
  saveAllData();
}

window.renderGroupManager = function() {
  const container = document.getElementById('group-management-area');
  container.innerHTML = '';
  const allWorks = readWorksList.map(w => w.name); 
  
  if(Object.keys(webtoonGroups).length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#9ca3af; font-weight:bold;">생성된 그룹이 없습니다. 새로운 취향 그룹을 만들어보세요!</div>';
    return;
  }

  Object.values(webtoonGroups).forEach(group => {
    const card = document.createElement('div');
    card.className = 'group-container-card';
    
    // ✏️ 체크박스 대신 태그(Chip) 형태의 HTML로 변경!
    let worksCheckboxesHTML = allWorks.map(workName => {
      const isChecked = group.works && group.works.includes(workName) ? 'checked' : '';
      return `
        <label class="group-work-label">
          <input type="checkbox" onchange="toggleWorkInGroup('${group.id}', '${workName}')" ${isChecked}>
          <span class="group-work-chip">${workName}</span>
        </label>
      `;
    }).join('');

    card.innerHTML = `
      <div class="group-card-header">
        <h3>📁 ${group.name} <span style="font-size:13px; color:#F59E0B; margin-left:5px;">(${group.works ? group.works.length : 0}개 작품)</span></h3>
        <button onclick="deleteWebtoonGroup('${group.id}')" style="background:none; color:#ef4444; font-weight:bold; font-size:14px; cursor:pointer;">그룹 삭제</button>
      </div>
      <div class="group-works-grid">
        ${worksCheckboxesHTML || '<span style="color:#9ca3af; font-size:13px;">컬렉션에 등록된 웹툰이 없습니다.</span>'}
      </div>
    `;
    container.appendChild(card);
  });
}

// 2. 랭킹/티어 워크스페이스 열릴 때 상단 필터 동적 주입 및 동기화 수술
// 기존 openProject 함수 내부를 가로채서 필터를 보여줍니다.
const originalOpenProject = window.openProject;
window.openProject = function(id) {
  originalOpenProject(id);
  const p = projects[id];
  const filterArea = document.getElementById('workspace-group-filters');
  const cbContainer = document.getElementById('ws-group-checkboxes');
  
  if(p.subType === 'webtoon' || p.subType === 'custom') {
    filterArea.style.display = 'flex';
    cbContainer.innerHTML = '';
    
    if(!p.activeGroups) p.activeGroups = [];

    if(Object.keys(webtoonGroups).length === 0) {
      cbContainer.innerHTML = '<span style="color:#9ca3af; font-size:13px;">생성된 그룹이 없습니다. 메인화면의 [그룹 분류 관리]에서 그룹을 먼저 만들어보세요!</span>';
      return;
    }

    Object.values(webtoonGroups).forEach(group => {
      const isChecked = p.activeGroups.includes(group.id) ? 'checked' : '';
      const lbl = document.createElement('label');
      lbl.className = 'group-work-item';
      lbl.innerHTML = `<input type="checkbox" data-group-id="${group.id}" onchange="syncWorkspaceGroups()" ${isChecked}> ${group.name}`;
      cbContainer.appendChild(lbl);
    });
    
    // 메인에서 바뀐 그룹 데이터를 현재 랭킹 페이지 풀에 실시간 자동 주입
    syncWorkspaceGroups(true); 
  } else {
    filterArea.style.display = 'none';
  }
}

// 체크박스를 누르거나, 페이지가 켜질 때 후보군 풀을 동적으로 필터링 및 주입하는 마법 함수
window.syncWorkspaceGroups = function(isFirstLoad = false) {
  const p = projects[currentId];
  if(!p) return;

  // 1. 어떤 체크박스들이 켜져있는지 수집
  const checkedBoxes = document.querySelectorAll('#ws-group-checkboxes input[type="checkbox"]:checked');
  const activeGroupIds = Array.from(checkedBoxes).map(cb => cb.getAttribute('data-group-id'));
  p.activeGroups = activeGroupIds;
  if(!isFirstLoad) saveAllData();

  // 2. 만약 하나라도 체크되어 있다면 -> '체크된 그룹들의 작품 목록'을 총동원
  if(activeGroupIds.length > 0) {
    let allowedWorkNames = [];
    activeGroupIds.forEach(gId => {
      if(webtoonGroups[gId] && webtoonGroups[gId].works) {
        webtoonGroups[gId].works.forEach(wName => {
          if(!allowedWorkNames.includes(wName)) allowedWorkNames.push(wName);
        });
      }
    });

    // 메인에서 새롭게 추가된 작품이 있다면 랭킹 후보군 풀에 '자동 장전'
    allowedWorkNames.forEach(wName => {
      const exists = p.items.some(item => item.name === wName);
      if(!exists) {
        // 원래 어떤 플랫폼 색상이었는지 찾기
        let targetColor = 'bg-skyblue';
        let targetZone = 'pool-skyblue';
        webtoonCategories.forEach(cat => {
          const cleanList = cat.list.map(n => n.replace(/\[.*?\]|\(.*?\)/g, '').trim());
          if(cleanList.includes(wName)) { targetColor = cat.color; targetZone = cat.zoneId; }
        });
        // 새 후보 아이템 밀어넣기
        p.items.push({ itemId: currentId + '-' + Date.now() + Math.random().toString(36).substr(2,4), name: wName, memo: '', img: null, zone: targetZone, color: targetColor });
      }
    });

    // 화면 렌더링할 때 후보군 풀(.pool) 안에 있는 애들 중 '체크 안 된 그룹의 작품'은 눈에서 숨기기
    // (단, 사용자가 이미 SSR, SR 등 티어 보드에 공들여 올려놓은 랭킹 아이템은 절대 안 건드리고 보존함!)
    document.querySelectorAll('#workspace-screen .item').forEach(itemEl => {
      const itemData = p.items.find(i => i.itemId === itemEl.id);
      if(itemData && itemData.zone.startsWith('pool-')) {
        if(allowedWorkNames.includes(itemData.name)) {
          itemEl.style.display = 'flex';
        } else {
          itemEl.style.display = 'none';
        }
      }
    });
  } else {
    // 아무것도 체크 안 했을 때는 기본적으로 모든 작품 후보군 다 보여주기 (기본 상태)
    document.querySelectorAll('#workspace-screen .item').forEach(itemEl => {
      itemEl.style.display = 'flex';
    });
  }
}
