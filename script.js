// ====================================================================
// 1. 초기 변수 세팅 (파이어베이스와 연동될 데이터들)
// ====================================================================
let projects = {};
let wishList = [];
let scrapList = [];
let compareLogs = [];
let deletedCands = [];

let currentId = null;
let draggedItem = null;
let draggedCatItem = null;
let isDragging = false;
let pendingProjectType = ''; 
let currentCompareTier = null; 
let currentRankArr = [];

const initialWorksData = [
  {id: "w1", title: "징크스", top: "주재경", bottom: "김단", tags: { title: [], top: [], bottom: [] }},
  {id: "w2", title: "홍실 퀘스트", top: "이연", bottom: "홍기훈", tags: { title: [], top: [], bottom: [] }},
  {id: "w3", title: "물가의 밤", top: "여태주", bottom: "김의현", tags: { title: [], top: [], bottom: [] }},
  {id: "w4", title: "FlashLight", top: "애런", bottom: "유진 하트", tags: { title: [], top: [], bottom: [] }},
  {id: "w5", title: "일간 알바", top: "연태서", bottom: "주여민", tags: { title: [], top: [], bottom: [] }},
  {id: "w6", title: "야화첩", top: "윤승호", bottom: "백나겸", tags: { title: [], top: [], bottom: [] }},
  {id: "w7", title: "힐링 패러독스", top: "키시베", bottom: "나오토", tags: { title: [], top: [], bottom: [] }},
  {id: "w8", title: "미혹의 경계", top: "목연", bottom: "난조", tags: { title: [], top: [], bottom: [] }},
  {id: "w9", title: "스테이지 비하인드", top: "권태영", bottom: "이진우", tags: { title: [], top: [], bottom: [] }},
  {id: "w10", title: "개구리 삶기", top: "제일로", bottom: "곽창혁", tags: { title: [], top: [], bottom: [] }},
  {id: "w11", title: "해피투게더", top: "재영", bottom: "승민", tags: { title: [], top: [], bottom: [] }},
  {id: "w12", title: "테라노 군과 쿠마자키 군", top: "테라노", bottom: "쿠마자키", tags: { title: [], top: [], bottom: [] }},
  {id: "w13", title: "상극", top: "이도재", bottom: "권은탁", tags: { title: [], top: [], bottom: [] }},
  {id: "w14", title: "제물 남편", top: "자헌", bottom: "무고", tags: { title: [], top: [], bottom: [] }},
  {id: "w15", title: "언슬립", top: "서채준", bottom: "이승현", tags: { title: [], top: [], bottom: [] }},
  {id: "w16", title: "소꿉친구와 감금당했다", top: "우태윤", bottom: "주도현", tags: { title: [], top: [], bottom: [] }},
  {id: "w17", title: "장미와 샴페인", top: "카이사르", bottom: "정이원", tags: { title: [], top: [], bottom: [] }},
  {id: "w18", title: "너는 나의 세상", top: "수아", bottom: "주혁", tags: { title: [], top: [], bottom: [] }},
  {id: "w19", title: "드라이버스 하이", top: "J.J", bottom: "리오", tags: { title: [], top: [], bottom: [] }},
  {id: "w20", title: "뱀굴", top: "에드윈", bottom: "레이", tags: { title: [], top: [], bottom: [] }},
  {id: "w21", title: "노 모럴", top: "강세헌", bottom: "도윤신", tags: { title: [], top: [], bottom: [] }},
  {id: "w22", title: "호식이 이야기", top: "이성연", bottom: "김호식", tags: { title: [], top: [], bottom: [] }},
  {id: "w23", title: "리미티드 런", top: "권제혁", bottom: "서연오", tags: { title: [], top: [], bottom: [] }},
  {id: "w24", title: "백라이트", top: "한서인", bottom: "백영운", tags: { title: [], top: [], bottom: [] }}
];

let taggedWorksData = JSON.parse(JSON.stringify(initialWorksData));
let tagCategories = [
  { type: 'genre', name: '장르/배경/세계관', colorClass: 'kw-genre', items: ["현대물", "시대물", "동양풍", "서양풍", "판타지", "SF", "아포칼립스", "디스토피아", "오메가버스", "가이드버스", "네임버스", "컬러버스", "피스틸버스", "캠퍼스물", "청춘물", "오피스물(리만물)", "연예계물", "스포츠물", "게임물", "인방물", "궁정로맨스", "조직/암흑가", "전문직물", "스릴러", "추리/미스터리", "회귀물", "빙의물", "환생물", "차원이동물"] },
  { type: 'top', name: '공 키워드', colorClass: 'kw-top', items: ["다정공", "순정공", "연하공", "대형견공", "집착공", "통제공", "후회공", "능글공", "재벌공", "광공", "무심공", "헌신공", "까칠공", "츤데레공", "냉혈공", "무뚝뚝공", "복흑/계략공", "짝사랑공", "상처공", "천재공", "여우공", "또라이공", "초딩공", "울보공", "귀염공", "연상공", "동갑공", "존댓말공", "반말공", "미남공", "미인공", "떡대공", "평범공", "황제공", "왕족/귀족공", "스폰서공", "조폭공", "연예인공", "일반인공"] },
  { type: 'bottom', name: '수 키워드', colorClass: 'kw-bottom', items: ["다정수", "단정수", "지랄수", "까칠수", "햇살수", "처연수", "굴림수", "무심수", "도망수", "헌신수", "츤데레수", "외유내강수", "강수", "잔망수", "명랑수", "적극수", "유혹수", "계략수", "순진수", "허당수", "호구수", "강단수", "짝사랑수", "상처수", "천재수", "얼빠수", "병약수", "임신수", "연상수", "연하수", "동갑수", "존댓말수", "반말수", "미인수", "미남수", "평범수", "떡대수", "재벌수", "가난수", "왕족/귀족수", "스폰서수", "연예인수", "일반인수"] },
  { type: 'plot', name: '관계성/전개', colorClass: 'kw-plot', items: ["배틀연애", "애증", "구원물", "하극상", "역키잡", "키잡", "소꿉친구", "친구>연인", "원수>연인", "첫사랑", "재회물", "계약연애", "정략결혼", "동거", "신분차이", "사건물", "일상물", "잔잔물", "피폐물", "달달물", "개그물", "찌통물", "힐링물", "쌍방삽질", "쌍방구원", "원나잇", "선섹후사", "일공일수", "다공일수", "일공다수", "서브공있음", "서브수있음", "메인공찾기"] }
];

let readWorksList = [];
const heartRankData = [
  "징크스", "홍실퀘스트", "물가의 밤", "FlashLight", "일간알바", "야화첩", "힐링 패러독스",
  "미혹의 경계", "스테이지 비하인드", "개구리 삶기", "해피투게더", "테라노 군과 쿠마자키 군", "드래그리스·섹스", "상극", "제물 남편", "언슬립", "소꿉친구와 감금당했다", "장미와 샴페인", "너는 나의 세상", "드라이버스 하이", "뱀 굴", "노 모럴", "호식이 이야기", "리미티드 런", "백라이트",
  "스케치", "고양이 테라피", "너무 야한 후카미군", "하이스쿨 솔티 하트", "30살까지 동정이면 마법사가 될 수 있대", "패션", "외사랑", "신을 품는 방법", "걷지않는다리", "아기 삶을 낳아줘, 나 미치는 꼴 보기 싫으면!", "남보다 못한 사이", "시거나 떫거나", "향의 경계", "그래서 누가 깔린건데?", "논제로섬", "백련이 피는 온도", "가장 완벽한 도형", "강아지는 건드리지 마라", "키스 미 이프 유 캔", "필 마이 베네핏", "너드프로젝트", "피자배달부와 골드팰리스",
  "독점! 마이 히어로", "짝사랑 필승법", "비밀이 많은 XX", "공과 사는 구분해!", "러브 오더", "망종", "솔트 소사이어티", "오메가 콤플렉스", "친구새끼들한테 따먹혔습니다", "페이크 팩트 립스", "알파 트라우마", "운명의 짝이 너라니", "내가 네 운명의 가이드는 아니지만", "그 공작가 노예의 음란한 속사정", "아이돌 보러 간다며!", "스미르나 앤 카프리", "망돌 콤플렉스", "40까지 하고 싶은 10가지 일", "은총의 밤", "자두를 누르지 마시오", "선 넘는 사이", "실연 중독", "바라메 강림하여 주소서", "박하사탕", "풀북", "테라피 게임", "캐시 오어 크레딧", "더블다운", "뼈와 꽃잎", "누군가 정해둔 것처럼", "소꿉친구로는 참을 수 없어", "백야의 꽃길", "감금당해 주세요!", "엑시덴탈 베이비", "코드네임 아나스타샤", "해빙곡선", "원룸 조교님", "시시포스의 개들", "유원불변", "방문 판매 왔습니다!", "일요일의 구원자", "가장 깊은 고백",
  "엎질러진 피", "녹색전상", "위험한 편의점", "형제애", "알페가", "시맨틱 에러", "슬립 업", "등쳐먹는 연애", "이리 사랑스러운 너", "넌 내게 수치심을 줬어❤️", "유성이 내리는 우주", "럭키 다이스", "피앙세는 토마토", "환장의 가이딩", "코티지 가든", "솔직하고 대담하게", "XX하면 알 수 있지 않을까?", "당신이 방심한 사이", "가슴 지명", "갱생의 여지", "나츠메 씨는 개발당하고 싶다", "럽미닥터!", "녹색전상 : 몽리 / 녹색전상", "파도의 해안", "해 뜨는 집", "멍멍한 관계", "조개소년 : 발화 / 조개소년", "해와 달의 공생관계",
  "아우토반 로맨스", "반하는 약을 먹은 완벽남이 위험합니다! 2권", "절대 BL이 되는 세계 VS 절대 BL이 되고 싶지 않은 남자", "하절기", "인 마이 배드", "꽃이 지는 연못", "구른 김에 왕까지", "러브 올 플레이", "스쿠프", "작전명 마레오"
];

// ====================================================================
// 2. 파이어베이스 데이터 로드 및 저장 함수
// ====================================================================
async function initApp() {
  if (!window.db) {
    setTimeout(initApp, 100);
    return;
  }
  
  try {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js");
    const dbRef = doc(window.db, "ti_me_data", "my_shared_data");
    const snap = await getDoc(dbRef);
    if (snap.exists()) {
      const data = snap.data();
      projects = data.projects || {};
      wishList = data.wishList || [];
      scrapList = data.scrapList || [];
      compareLogs = data.compareLogs || [];
      deletedCands = data.deletedCands || [];
      taggedWorksData = data.taggedWorksData || JSON.parse(JSON.stringify(initialWorksData));
      tagCategories = data.tagCategories || tagCategories;
      readWorksList = data.readWorksList || [];
    } else {
      console.log("데이터 없음 - 초기값 사용");
      taggedWorksData = JSON.parse(JSON.stringify(initialWorksData));
    }
  } catch (e) {
    console.error("데이터 로드 실패:", e);
    taggedWorksData = JSON.parse(JSON.stringify(initialWorksData));
  }

  // 초기화 및 화면 그리기
  initReadWorksList();
  renderHome();
  if(document.getElementById('work-grid-view')) renderTaggingGrid();
  if(document.getElementById('read-works-grid')) renderReadWorks();
}
initApp();

async function saveAllData() {
  if (!window.db) return;
  try {
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js");
    const dbRef = doc(window.db, "ti_me_data", "my_shared_data");
    await setDoc(dbRef, { projects, wishList, scrapList, compareLogs, deletedCands, taggedWorksData, tagCategories, readWorksList });
  } catch (error) {
    console.error("데이터 저장 실패:", error);
  }
}

// 통합 저장 함수 호출
function saveData() { saveAllData(); }
function saveWish() { saveAllData(); }
function saveScraps() { saveAllData(); }
function saveLogs() { saveAllData(); }
function saveDeletedCands() { saveAllData(); }
function saveTaggingData() { saveAllData(); }

// ====================================================================
// 💡 기본 UI 로직
// ====================================================================
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

function getNextTitle(baseTitle) {
  const existingTitles = Object.values(projects).map(p => p.title);
  if (!existingTitles.includes(baseTitle)) return baseTitle;
  let count = 2; while (existingTitles.includes(`${baseTitle} ${count}`)) { count++; } return `${baseTitle} ${count}`;
}

// ====================================================================
// 💡 웹툰 티어 및 키워드 랭킹 자동 생성
// ====================================================================
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
  projects[id] = { id, title: getNextTitle('웹툰 취향 리스트'), type: type, subType: 'webtoon', items: [] };
  let itemIndex = 0;
  webtoonCategories.forEach(category => {
    category.list.forEach(name => {
      projects[id].items.push({ itemId: id + '-' + (itemIndex++), name: name.replace(/\[.*?\]|\(.*?\)/g, '').trim(), memo: '', img: null, zone: category.zoneId, color: category.color });
    });
  });
  saveData(); renderHome(); openProject(id);
}

document.getElementById('btn-auto-keyword-tier').addEventListener('click', () => {
  const id = Date.now().toString();
  projects[id] = { id, title: getNextTitle('🔑 내 취향 키워드 랭킹'), type: 'tier', subType: 'keyword', items: [] };
  let itemIndex = 0;
  tagCategories.forEach(category => {
    category.items.forEach(name => {
      projects[id].items.push({ itemId: id + '-kw-' + (itemIndex++), name: name, memo: '', img: null, zone: category.colorClass === 'kw-genre' ? 'pool-genre' : (category.colorClass === 'kw-top' ? 'pool-top' : (category.colorClass === 'kw-bottom' ? 'pool-bottom' : 'pool-plot')), color: category.colorClass.replace('kw-', 'bg-') });
    });
  });
  saveData(); renderHome(); openProject(id);
});

// ====================================================================
// 💡 화면 전환 및 렌더링 로직
// ====================================================================
function createProject(type, title) {
  const id = Date.now().toString();
  projects[id] = { id, title, type, subType: 'custom', items: [] }; saveData(); renderHome(); openProject(id);
}

function renderHome() {
  const list = document.getElementById('project-list'); list.innerHTML = '';
  Object.values(projects).forEach(p => {
    const card = document.createElement('div'); card.className = 'project-card';
    card.innerHTML = `<div><span style="font-size:12px; color:#888; font-weight:600; margin-bottom:6px; display:block;">${p.subType === 'keyword' ? '키워드 모드' : (p.type === 'tier' ? '티어 모드' : '랭킹 모드')}</span><h3>${p.title}</h3></div><div class="project-actions"><button onclick="openProject('${p.id}')">열기</button><button onclick="deleteProject('${p.id}')" class="del-btn">삭제</button></div>`;
    list.appendChild(card);
  });
}
window.deleteProject = function(id) { if (confirm("정말 삭제하시겠습니까?")) { delete projects[id]; saveData(); renderHome(); } }

function hideAllScreens() {
  ['home-screen', 'workspace-screen', 'worldcup-screen', 'compare-screen', 'wishlist-screen', 'scrap-screen', 'category-rank-screen', 'tagging-screen', 'read-works-screen'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
}

window.openProject = function(id) {
  currentId = id; const p = projects[id];
  document.getElementById('current-project-title').innerText = p.title;
  ['tier-mode', 'ranking-mode'].forEach(i => document.getElementById(i).style.display = 'none');
  if(document.getElementById('keyword-mode')) document.getElementById('keyword-mode').style.display = 'none';
  
  if (p.subType === 'keyword') {
    document.getElementById('webtoon-pools').style.display = 'none'; document.getElementById('keyword-pools').style.display = 'block';
    if(document.getElementById('keyword-mode')) document.getElementById('keyword-mode').style.display = 'flex';
  } else {
    document.getElementById('webtoon-pools').style.display = 'block'; document.getElementById('keyword-pools').style.display = 'none';
    document.getElementById('tier-mode').style.display = p.type === 'tier' ? 'block' : 'none'; document.getElementById('ranking-mode').style.display = p.type === 'ranking' ? 'block' : 'none';
  }
  hideAllScreens(); document.getElementById('workspace-screen').style.display = 'block'; renderItems();
}

document.querySelectorAll('.go-home-btn').forEach(btn => {
  btn.addEventListener('click', (e) => { 
    hideAllScreens(); 
    if(e.target.id === 'comp-back-btn' && currentCompareTier) { document.getElementById('workspace-screen').style.display = 'block'; currentCompareTier = null;
    } else { document.getElementById('home-screen').style.display = 'block'; renderHome(); }
  });
});
document.querySelectorAll('.go-workspace-btn').forEach(btn => { btn.addEventListener('click', () => { hideAllScreens(); document.getElementById('workspace-screen').style.display = 'block'; }); });

// ====================================================================
// 💡 스크랩 보드 및 위시리스트 (+체크 기능 포함)
// ====================================================================
document.getElementById('btn-open-scrap').addEventListener('click', () => { hideAllScreens(); document.getElementById('scrap-screen').style.display = 'block'; renderScrapList(); });
window.addScrapItem = function() {
  const url = document.getElementById('scrap-url').value.trim(); const comment = document.getElementById('scrap-comment').value.trim(); const file = document.getElementById('scrap-image').files[0];
  if(!url && !comment && !file) return alert("링크나 내용, 이미지를 입력해주세요!");
  const newScrap = { id: Date.now(), url, comment, img: null };
  if(file) { const reader = new FileReader(); reader.onload = (e) => { newScrap.img = e.target.result; scrapList.unshift(newScrap); saveScraps(); renderScrapList(); }; reader.readAsDataURL(file);
  } else { scrapList.unshift(newScrap); saveScraps(); renderScrapList(); }
  document.getElementById('scrap-url').value = ''; document.getElementById('scrap-comment').value = ''; document.getElementById('scrap-image').value = '';
}
function renderScrapList() {
  const container = document.getElementById('scrap-list'); container.innerHTML = '';
  scrapList.forEach(s => {
    const card = document.createElement('div'); card.className = 'scrap-card';
    card.innerHTML = `${s.img ? `<img src="${s.img}" class="card-img">` : ''} <button class="scrap-del-btn" onclick="deleteScrap(${s.id})">×</button> <div class="card-content"> ${s.url ? `<a href="${s.url}" target="_blank" class="card-url">🔗 ${s.url}</a>` : ''} <div class="card-comment">${s.comment}</div> </div>`; container.appendChild(card);
  });
}
window.deleteScrap = function(id) { if(confirm("이 스크랩을 지울까요?")) { scrapList = scrapList.filter(s => s.id !== id); saveScraps(); renderScrapList(); } }

document.getElementById('btn-open-wishlist').addEventListener('click', () => { hideAllScreens(); document.getElementById('wishlist-screen').style.display = 'block'; renderWishList(); });
window.addWishItem = function() {
  const input = document.getElementById('wish-input'); if (!input.value.trim()) return;
  wishList.push({ id: Date.now(), name: input.value.trim(), checked: false }); input.value = ''; saveWish(); renderWishList();
}
window.deleteWishItem = function(id) { wishList = wishList.filter(i => i.id !== id); saveWish(); renderWishList(); }
window.toggleWishItem = function(id) {
  const item = wishList.find(i => i.id === id); if(item) { item.checked = !item.checked; saveWish(); renderWishList(); }
}
function renderWishList() {
  const container = document.getElementById('wish-list'); container.innerHTML = '';
  wishList.forEach(item => { 
    const isChecked = item.checked ? 'checked' : '';
    const lineThrough = item.checked ? 'text-decoration: line-through; color: #999;' : '';
    container.innerHTML += `<div class="wish-item"><label><input type="checkbox" onchange="toggleWishItem(${item.id})" ${isChecked}><span style="${lineThrough}">${item.name}</span></label><button onclick="deleteWishItem(${item.id})">×</button></div>`; 
  });
}

// ====================================================================
// 💡 세부 순위 (작화/스토리/씬) 드래그 및 월드컵
// ====================================================================
window.openCategoryRank = function(tierId) {
  const tierItems = projects[currentId].items.filter(i => i.zone === tierId);
  if(tierItems.length < 2) return alert("작품이 2개 이상 있어야 줄을 세울 수 있어요!");
  hideAllScreens(); document.getElementById('category-rank-screen').style.display = 'block'; document.getElementById('cat-rank-title').innerText = `[${tierId}] 세부 순위 (드래그 정렬)`;
  ['art', 'story', 'scene'].forEach(cat => {
    const container = document.getElementById(`cat-${cat}-list`); container.innerHTML = '';
    let savedOrder = (projects[currentId].categoryRanks && projects[currentId].categoryRanks[tierId] && projects[currentId].categoryRanks[tierId][cat]) || [];
    let sortedItems = [...tierItems].sort((a, b) => { let idxA = savedOrder.indexOf(a.itemId); let idxB = savedOrder.indexOf(b.itemId); return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB); });
    sortedItems.forEach(item => {
      const el = document.createElement('div'); el.className = `item ${item.color || ''} cat-sort-item`; el.draggable = true; el.dataset.itemId = item.itemId; el.dataset.cat = cat; el.innerHTML = `<div class="name-tag">${item.name}</div>`;
      el.ondragstart = (e) => { draggedCatItem = el; el.classList.add('dragging'); isDragging = true; }; el.ondragend = () => { el.classList.remove('dragging'); isDragging = false; saveCategoryRanks(tierId); };
      container.appendChild(el);
    });
  });
}
function saveCategoryRanks(tierId) {
  if(!projects[currentId].categoryRanks) projects[currentId].categoryRanks = {}; if(!projects[currentId].categoryRanks[tierId]) projects[currentId].categoryRanks[tierId] = {};
  ['art', 'story', 'scene'].forEach(cat => { const zone = document.getElementById(`cat-${cat}-list`); const items = [...zone.querySelectorAll('.cat-sort-item')]; projects[currentId].categoryRanks[tierId][cat] = items.map(el => el.dataset.itemId); }); saveData();
}
['art', 'story', 'scene'].forEach(cat => {
  const zone = document.getElementById(`cat-${cat}-list`);
  zone.addEventListener('dragover', (e) => {
    e.preventDefault(); if(!draggedCatItem || draggedCatItem.dataset.cat !== cat) return; 
    const afterElement = getDragAfterElement(zone, e.clientX, e.clientY, '.cat-sort-item'); if (afterElement == null) { zone.appendChild(draggedCatItem); } else { zone.insertBefore(draggedCatItem, afterElement); }
  });
});

let wcCurrentRound = []; let wcNextRound = []; let wcMatchIndex = 0; let wcRankings = []; let wcLosersThisRound = [];
document.getElementById('btn-worldcup').addEventListener('click', () => {
  hideAllScreens(); document.getElementById('worldcup-screen').style.display = 'block'; document.getElementById('wc-play-area').style.display = 'flex'; document.getElementById('wc-result-area').style.display = 'none';
  let activeList = cleanWebtoonList.filter(name => !deletedCands.includes(name));
  wcCurrentRound = [...activeList].sort(() => Math.random() - 0.5); wcNextRound = []; wcMatchIndex = 0; wcRankings = []; wcLosersThisRound = []; updateWcUI();
});
function updateWcUI() {
  if (wcCurrentRound.length === 1) {
    document.getElementById('wc-play-area').style.display = 'none'; document.getElementById('wc-result-area').style.display = 'block'; document.getElementById('wc-round-text').innerText = "결과 발표";
    const rankList = document.getElementById('wc-ranking-list'); rankList.innerHTML = `<div class="wc-rank-item"><span class="wc-medal">🥇</span> <span style="color:#E11D48;">${wcCurrentRound[0]}</span></div>`;
    let rankCounter = 2; wcRankings.forEach(losers => { losers.forEach(loser => { let medal = rankCounter === 2 ? '🥈' : (rankCounter === 3 ? '🥉' : `${rankCounter}위`); rankList.innerHTML += `<div class="wc-rank-item"><span class="wc-medal" style="font-size:16px;">${medal}</span> ${loser}</div>`; rankCounter++; }); }); return;
  }
  if (wcMatchIndex >= wcCurrentRound.length - 1) { wcNextRound.push(wcCurrentRound[wcMatchIndex]); wcRankings.unshift([...wcLosersThisRound]); wcLosersThisRound = []; wcCurrentRound = wcNextRound; wcNextRound = []; wcMatchIndex = 0; return updateWcUI(); }
  const roundName = wcCurrentRound.length === 2 ? "결승전" : (wcCurrentRound.length === 4 ? "준결승" : `${wcCurrentRound.length}강`);
  const matchNum = (wcMatchIndex / 2) + 1; const totalMatches = Math.floor(wcCurrentRound.length / 2);
  document.getElementById('wc-round-text').innerText = `${roundName} (${matchNum}/${totalMatches})`; document.getElementById('wc-left').innerText = wcCurrentRound[wcMatchIndex]; document.getElementById('wc-right').innerText = wcCurrentRound[wcMatchIndex + 1];
}
window.selectWcItem = function(side) {
  if(wcCurrentRound.length <= 1) return; let winner = side === 'left' ? wcCurrentRound[wcMatchIndex] : wcCurrentRound[wcMatchIndex + 1]; let loser = side === 'left' ? wcCurrentRound[wcMatchIndex + 1] : wcCurrentRound[wcMatchIndex];
  wcNextRound.push(winner); wcLosersThisRound.push(loser); wcMatchIndex += 2; 
  if (wcMatchIndex >= wcCurrentRound.length) { wcRankings.unshift([...wcLosersThisRound]); wcLosersThisRound = []; wcCurrentRound = wcNextRound; wcNextRound = []; wcMatchIndex = 0; } updateWcUI();
}

// ====================================================================
// 💡 1:1 비교소 & 엘로 랭킹
// ====================================================================
window.openTierCompare = function(tierId) {
  const tierItems = projects[currentId].items.filter(i => i.zone === tierId).map(i => i.name);
  if(tierItems.length < 2) return alert("비교할 작품이 2개 이상 없습니다!");
  currentCompareTier = tierId; document.getElementById('btn-apply-rank').style.display = 'block'; document.getElementById('comp-title').innerText = `[${tierId}] 티어 1:1 비교소`;
  compareLogs = []; saveLogs(); openCompareMode(tierItems.sort());
}
window.openKeywordCompare = function(targetZone, poolZone, titleLabel) {
  const items = projects[currentId].items.filter(i => i.zone === targetZone || i.zone === poolZone).map(i => i.name);
  if(items.length < 2) return alert("비교할 키워드가 2개 이상 없습니다!");
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
    const delBtn = document.createElement('button'); delBtn.className = 'cand-del-btn'; delBtn.innerText = '×';
    delBtn.onclick = () => { if(confirm(`영구 삭제할까요?`)) { deletedCands.push(name); saveDeletedCands(); wrapper.remove(); } }
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
  if (compareLogs.length === 0) { logArea.innerHTML = '<span style="color:#999;">기록이 없습니다.</span>'; } 
  else {
    logArea.innerHTML = ''; compareLogs.forEach(log => {
      const p = document.createElement('div'); p.style.padding = "8px 0"; p.style.borderBottom = "1px solid #f0f0f0"; p.style.display = "flex"; p.style.justifyContent = "space-between"; p.style.alignItems = "center";
      p.innerHTML = `<div>${log.html}</div><button onclick="deleteLog(${log.id})" style="border:none; background:none; cursor:pointer; color:#ef4444; font-weight:bold; font-size:16px;">×</button>`; logArea.appendChild(p);
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
  rankArr.forEach((item, idx) => {
    let medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `${idx+1}위`));
    analysisArea.innerHTML += `<div class="rank-bar"><div class="rank-name-box"><span class="rank-medal">${medal}</span> <span>${item.name}</span></div><div class="rank-stats" style="color:#4F46E5; font-weight:700;">${item.rating}점 <span style="font-weight:normal; color:#888; font-size:12px;">(${item.wins}승 ${item.losses}패)</span></div></div>`;
  });
}
window.deleteLog = function(id) { compareLogs = compareLogs.filter(l => l.id !== id); saveLogs(); renderLogs(); }
window.clearLogs = function() { if(confirm("삭제하시겠습니까?")) { compareLogs = []; saveLogs(); renderLogs(); } }

window.applyRankingToTier = function() {
  if(!currentCompareTier) return; if(currentRankArr.length === 0) return alert("승리 버튼을 눌러 순위를 정해주세요!");
  let sortedNames = currentRankArr.map(r => r.name); 
  projects[currentId].items.forEach(i => { if(sortedNames.includes(i.name)) i.zone = currentCompareTier; });
  let tierItems = projects[currentId].items.filter(i => i.zone === currentCompareTier); let otherItems = projects[currentId].items.filter(i => i.zone !== currentCompareTier);
  tierItems.sort((a, b) => { let idxA = sortedNames.indexOf(a.name); let idxB = sortedNames.indexOf(b.name); return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB); });
  projects[currentId].items = [...otherItems, ...tierItems]; saveData(); renderItems(); alert(`결과 박스 안에 1위부터 자동 정렬되었습니다!`); document.getElementById('comp-back-btn').click(); 
}

// ====================================================================
// 💡 메인 드래그 앤 드롭 아이템 렌더링
// ====================================================================
document.getElementById('add-item-btn').addEventListener('click', () => {
  const name = document.getElementById('item-name').value; const memo = document.getElementById('item-memo').value;
  if (!name) return alert("이름을 입력하세요!");
  const newItem = { itemId: Date.now().toString(), name: name, memo: memo, img: null, zone: 'pool-skyblue' }; const fileInput = document.getElementById('item-image');
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader(); reader.onload = function(e) { newItem.img = e.target.result; projects[currentId].items.push(newItem); saveData(); renderItems(); }; reader.readAsDataURL(fileInput.files[0]);
  } else { projects[currentId].items.push(newItem); saveData(); renderItems(); }
  document.getElementById('item-name').value = ''; document.getElementById('item-memo').value = ''; fileInput.value = '';
});

function getDragAfterElement(container, x, y, itemClass = '.item') {
  const draggableElements = [...container.querySelectorAll(`${itemClass}:not(.dragging)`)];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect(); const offset = container.classList.contains('ranking-list') ? y - box.top - box.height / 2 : x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } else { return closest; }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function renderItems() {
  document.querySelectorAll('.tier-items, .pool, .ranking-list').forEach(el => { if(!el.classList.contains('cat-list')) el.innerHTML = ''; });
  projects[currentId].items.forEach(item => {
    const itemEl = document.createElement('div'); itemEl.className = 'item'; if (item.color) { itemEl.classList.add(item.color); } itemEl.draggable = true; itemEl.id = item.itemId;
    itemEl.innerHTML = `<div class="name-tag">${item.name}</div>${item.memo ? `<div class="item-memo-tooltip">${item.memo}</div>` : ''}<button class="item-del-btn">×</button>`;
    if (item.img) itemEl.style.backgroundImage = `url(${item.img})`;
    itemEl.querySelector('.item-del-btn').addEventListener('click', (e) => { e.stopPropagation(); if(confirm(`'${item.name}' 후보를 삭제할까요?`)) { projects[currentId].items = projects[currentId].items.filter(i => i.itemId !== item.itemId); saveData(); renderItems(); } });
    itemEl.addEventListener('dragstart', function(e) { draggedItem = item; itemEl.classList.add('dragging'); isDragging = true; usagi.src = 'usagi2.gif'; });
    itemEl.addEventListener('dragend', function() {
      itemEl.classList.remove('dragging'); isDragging = false; usagi.src = 'usagi1.gif'; const newItems = [];
      document.querySelectorAll('#workspace-screen .item').forEach(el => { const found = projects[currentId].items.find(i => i.itemId === el.id); if (found) { found.zone = el.parentElement.getAttribute('data-zone'); newItems.push(found); } });
      projects[currentId].items = newItems; saveData(); renderItems(); 
    });
    const dropZone = document.querySelector(`#workspace-screen [data-zone="${item.zone}"]`); if(dropZone) dropZone.appendChild(itemEl);
  });
  updateRanking();
}

document.querySelectorAll('.tier-items, .pool, .ranking-list').forEach(zone => {
  if(zone.classList.contains('cat-list')) return; 
  zone.addEventListener('dragover', (e) => {
    e.preventDefault(); const afterElement = getDragAfterElement(zone, e.clientX, e.clientY); const dragging = document.querySelector('.dragging');
    if (dragging) { if (afterElement == null) { zone.appendChild(dragging); } else { zone.insertBefore(dragging, afterElement); } }
  });
});

function updateRanking() {
  const items = document.querySelectorAll('#ranking-list .item, .kw-rank-zone .item, .tier-row .ranking-list .item');
  items.forEach((item) => { 
    let parentZone = item.closest('.ranking-list'); if (!parentZone) return;
    let zoneItems = Array.from(parentZone.querySelectorAll('.item')); let localIndex = zoneItems.indexOf(item);
    let numSpan = item.querySelector('.ranking-number'); 
    if (!numSpan) { numSpan = document.createElement('div'); numSpan.className = 'ranking-number'; item.prepend(numSpan); } 
    numSpan.innerText = (localIndex + 1); 
  });
}

// ====================================================================
// 🚀 작품 키워드 서재 (작품 추가/삭제 & 태깅 완벽판) 
// ====================================================================
let currentTaggingWorkId = null;
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
    const square = document.createElement('div'); square.className = 'work-square';
    const totalTags = work.tags.title.length + work.tags.top.length + work.tags.bottom.length;
    square.innerHTML = `<button class="del-tag" onclick="event.stopPropagation(); deleteTaggingWorkGrid('${work.id}')" title="삭제">✕</button><div class="work-square-title">${work.title}</div><div class="work-square-desc">${work.top} x ${work.bottom}</div><div style="margin-top: 10px; font-size: 11px; color:#EC4899; background:#FCE7F3; padding:2px 8px; border-radius:10px;">태그 ${totalTags}개</div>`;
    square.onclick = () => openWorkDetail(work.id); container.appendChild(square);
  });
}
window.deleteTaggingWorkGrid = function(workId) {
  const work = taggedWorksData.find(w => w.id === workId);
  if(confirm(`'${work.title}' 작품을 서재에서 완전히 삭제할까요?`)) { taggedWorksData = taggedWorksData.filter(w => w.id !== workId); saveTaggingData(); renderTaggingGrid(); }
}

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
  document.getElementById('dz-title').innerHTML = renderTagsHTML(work.tags.title, work.id, 'title');
  document.getElementById('dz-top').innerHTML = renderTagsHTML(work.tags.top, work.id, 'top');
  document.getElementById('dz-bottom').innerHTML = renderTagsHTML(work.tags.bottom, work.id, 'bottom');
}

function renderTagsHTML(tagsArray, workId, target) { return tagsArray.map((tag, index) => `<div class="tag-badge ${tag.colorClass}">${tag.name} <button class="del-tag" onclick="removeTag('${workId}', '${target}', ${index})">✕</button></div>`).join(''); }

window.removeTag = function(workId, target, index) {
  const work = taggedWorksData.find(w => w.id === workId); if (work) { work.tags[target].splice(index, 1); saveTaggingData(); renderDetailTags(); }
}

function renderKeywordPool() {
  const container = document.getElementById('keyword-pool-container'); container.innerHTML = '';
  tagCategories.forEach((cat, catIndex) => {
    const section = document.createElement('div'); section.className = 'pool-section';
    section.innerHTML = `<div class="pool-header"><h4>${cat.name}</h4><button class="btn-add-kw" onclick="addNewKeyword(${catIndex})">＋</button></div>`;
    const tagsContainer = document.createElement('div'); tagsContainer.className = 'pool-tags';
    cat.items.forEach((keyword, kwIndex) => {
      const badge = document.createElement('div'); badge.className = `tag-badge ${cat.colorClass}`; badge.draggable = true;
      badge.innerHTML = `${keyword} <button class="del-tag" onclick="deleteKeywordFromPool(${catIndex}, ${kwIndex})" title="풀에서 삭제">✕</button>`;
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
  const targetWord = tagCategories[catIndex].items[kwIndex]; if(confirm(`'${targetWord}' 키워드를 목록에서 완전히 지울까요?`)) { tagCategories[catIndex].items.splice(kwIndex, 1); saveTaggingData(); renderKeywordPool(); }
}

function setupDropZones() {
  const dropZones = document.querySelectorAll('.tag-drop-zone');
  dropZones.forEach(zone => {
    const newZone = zone.cloneNode(true); zone.parentNode.replaceChild(newZone, zone);
    newZone.addEventListener('dragover', (e) => { e.preventDefault(); newZone.classList.add('dragover'); });
    newZone.addEventListener('dragleave', () => { newZone.classList.remove('dragover'); });
    newZone.addEventListener('drop', (e) => {
      e.preventDefault(); newZone.classList.remove('dragover');
      const payloadStr = e.dataTransfer.getData('text/plain'); if (!payloadStr) return;
      try {
        const payload = JSON.parse(payloadStr); const workId = newZone.getAttribute('data-work-id'); const target = newZone.getAttribute('data-target'); 
        const work = taggedWorksData.find(w => w.id === workId);
        if (work) { if (!work.tags[target].find(t => t.name === payload.name)) { work.tags[target].push(payload); saveTaggingData(); renderDetailTags(); } }
      } catch (err) { console.error(err); }
    });
  });
}

// ====================================================================
// 🚀🚀🚀 내가 본 작품 컬렉션 (수동 저장 적용 완료) 🚀🚀🚀
// ====================================================================
function initReadWorksList() {
  if (readWorksList && readWorksList.length > 0) return;
  let rId = 0;
  webtoonCategories.forEach(cat => {
    let platform = cat.color === 'bg-skyblue' ? '리디' : (cat.color === 'bg-red' ? '레진' : '봄툰');
    cat.list.forEach(name => {
      let cleanName = name.replace(/\[.*?\]|\(.*?\)/g, '').trim();
      if(!readWorksList.find(w => w.name === cleanName)) {
        readWorksList.push({ id: 'rw_'+(rId++), name: cleanName, platform: platform, colorClass: cat.color });
      }
    });
  });
  saveReadWorks();
}

document.getElementById('btn-open-read-works').addEventListener('click', () => {
  hideAllScreens(); document.getElementById('read-works-screen').style.display = 'block'; renderReadWorks();
});

let draggedReadWorkIndex = null;

// 💡 1. 수동 저장 버튼 함수
window.saveReadWorksManual = function() {
  saveAllData();
  alert("현재 순서가 저장되었습니다!");
}

window.sortReadWorksList = function(type) {
  if (type === 'abc') {
    readWorksList.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
  } else if (type === 'heart') {
    readWorksList.sort((a, b) => {
      let idxA = heartRankData.indexOf(a.name); let idxB = heartRankData.indexOf(b.name);
      if(idxA === -1) idxA = 9999; if(idxB === -1) idxB = 9999;
      return idxA - idxB;
    });
  }
  renderReadWorks(); // 정렬 후 화면만 갱신 (저장 버튼 누르기 전엔 반영 안 됨)
}

function renderReadWorks() {
  const container = document.getElementById('read-works-grid'); container.innerHTML = '';
  readWorksList.forEach((work, index) => {
    const el = document.createElement('div');
    el.className = `work-square ${work.colorClass}`; 
    el.draggable = true; el.dataset.index = index;
    
    el.innerHTML = `
      <button class="del-tag" onclick="event.stopPropagation(); deleteReadWork(${index})" title="삭제">✕</button>
      <div style="font-size:11px; font-weight:bold; margin-bottom:3px; opacity:0.7;">${work.platform}</div>
      <div class="work-square-title">${work.name}</div>
    `;
    
    el.addEventListener('dragstart', (e) => { 
      draggedReadWorkIndex = index; el.classList.add('dragging'); 
      document.getElementById('sort-read-works').value = 'custom';
    });
    el.addEventListener('dragend', () => { el.classList.remove('dragging'); draggedReadWorkIndex = null; });
    el.addEventListener('dragover', (e) => { e.preventDefault(); el.style.border = "2px solid #6366F1"; });
    el.addEventListener('dragleave', () => { el.style.border = ""; });
    
    // 💡 2. 드롭할 때 서버 자동 저장 제거됨! (화면만 변경)
    el.addEventListener('drop', (e) => {
      e.preventDefault(); el.style.border = "";
      const targetIndex = index; if(draggedReadWorkIndex === targetIndex) return;
      const item = readWorksList.splice(draggedReadWorkIndex, 1)[0];
      readWorksList.splice(targetIndex, 0, item);
      renderReadWorks(); 
    });
    
    container.appendChild(el);
  });
}

window.addReadWork = function() {
  const name = document.getElementById('new-read-work-title').value.trim();
  const colorClass = document.getElementById('new-read-work-platform').value;
  let platform = colorClass === 'bg-skyblue' ? '리디' : (colorClass === 'bg-red' ? '레진' : '봄툰 등');
  
  if(!name) return alert("작품명을 입력해주세요!");
  readWorksList.unshift({ id: 'rw_'+Date.now(), name: name, platform: platform, colorClass: colorClass });
  saveReadWorks(); renderReadWorks();
  document.getElementById('new-read-work-title').value = '';
}

window.deleteReadWork = function(index) {
  if(confirm("이 작품을 컬렉션에서 지울까요?")) {
    readWorksList.splice(index, 1); saveReadWorks(); renderReadWorks();
  }
}