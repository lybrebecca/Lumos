const KEYS = {
  habits: 'lumos_habits',
  archivedHabits: 'lumos_archived_habits',
  pts: 'lumos_pts',
  wishes: 'lumos_wishes',
}

// ── 习惯 ──────────────────────────────────────

export function loadHabits() {
  const raw = localStorage.getItem(KEYS.habits)
  return raw ? JSON.parse(raw) : null
}

export function saveHabits(habits) {
  localStorage.setItem(KEYS.habits, JSON.stringify(habits))
}

// ── 归档习惯 ───────────────────────────────────

export function loadArchivedHabits() {
  const raw = localStorage.getItem(KEYS.archivedHabits)
  return raw ? JSON.parse(raw) : []
}

export function saveArchivedHabits(habits) {
  localStorage.setItem(KEYS.archivedHabits, JSON.stringify(habits))
}

// ── 积分 ──────────────────────────────────────

export function loadPts() {
  const raw = localStorage.getItem(KEYS.pts)
  return raw ? JSON.parse(raw) : { remain: 0, total: 0 }
}

export function savePts(pts) {
  localStorage.setItem(KEYS.pts, JSON.stringify(pts))
}

// ── 心愿 ──────────────────────────────────────

export function loadWishes() {
  const raw = localStorage.getItem(KEYS.wishes)
  return raw ? JSON.parse(raw) : null
}

export function saveWishes(wishes) {
  localStorage.setItem(KEYS.wishes, JSON.stringify(wishes))
}