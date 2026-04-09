// localStorage 里存数据用的 key 名字
const KEYS = {
    habits: 'lumos_habits',
    pts: 'lumos_pts',
    wishes: 'lumos_wishes',
  };
  
  // ── 习惯 ──────────────────────────────────────
  
  // 读取所有习惯
  export function loadHabits() {
    const raw = localStorage.getItem(KEYS.habits);
    return raw ? JSON.parse(raw) : null;
  }
  
  // 保存所有习惯
  export function saveHabits(habits) {
    localStorage.setItem(KEYS.habits, JSON.stringify(habits));
  }
  
  // ── 积分 ──────────────────────────────────────
  
  // 读取积分，默认 { remain: 0, total: 0 }
  export function loadPts() {
    const raw = localStorage.getItem(KEYS.pts);
    return raw ? JSON.parse(raw) : { remain: 0, total: 0 };
  }
  
  // 保存积分
  export function savePts(pts) {
    localStorage.setItem(KEYS.pts, JSON.stringify(pts));
  }
  
  // ── 心愿 ──────────────────────────────────────
  
  // 读取心愿列表
  export function loadWishes() {
    const raw = localStorage.getItem(KEYS.wishes);
    return raw ? JSON.parse(raw) : null;
  }
  
  // 保存心愿列表
  export function saveWishes(wishes) {
    localStorage.setItem(KEYS.wishes, JSON.stringify(wishes));
  }