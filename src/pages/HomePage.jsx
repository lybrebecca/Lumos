import { useState, useRef, useEffect } from 'react'
import HabitCard from '../components/HabitCard'
import PtsChip from '../components/PtsChip'
import MilestoneBanner from '../components/MilestoneBanner'
import AddHabitModal from '../components/AddHabitModal'
import EditHabitModal from '../components/EditHabitModal'
import { doCheckin, undoCheckin, doBackdatedCheckin, getHabitColor, getYesterdayStr, computeCleanStreak } from '../utils/habitLogic'
import { loadHabits, saveHabits, loadPts, savePts, loadArchivedHabits, saveArchivedHabits } from '../utils/storage'
import { getDefaultHabits } from '../data/defaultHabits'
import { TAGLINES, MAX_HABITS } from '../utils/constants'
import { getTodayStr } from '../utils/habitLogic'

const CLEAN_MILESTONES = { 3: 1, 5: 5, 7: 10 }

function resetTodayCountIfNeeded(habits) {
  const today = getTodayStr()
  const yesterday = getYesterdayStr()
  let changed = false
  let bonusPts = 0

  const updated = habits.map(h => {
    let result = h

    if (h.lastCheckinDate !== today && h.todayCount !== 0) {
      changed = true
      result = { ...result, todayCount: 0 }
    }

    if (h.type === 'bad' && h.lastCleanCheckDate !== today) {
      changed = true
      result = { ...result, lastCleanCheckDate: today }
      const wasCleanYesterday = !(h.logs || []).some(l => l.date === yesterday)
      if (wasCleanYesterday) {
        const streak = computeCleanStreak({ ...h })
        const mult = CLEAN_MILESTONES[streak]
        if (mult) bonusPts += Math.abs(h.pointsPerCheckin ?? 1) * mult
      }
    }

    return result
  })

  return { updated, changed, bonusPts }
}

function HomePage() {
  const [habits, setHabits] = useState(() => {
    const loaded = loadHabits() || getDefaultHabits()
    const { updated, changed, bonusPts } = resetTodayCountIfNeeded(loaded)
    if (changed) saveHabits(updated)
    if (bonusPts > 0) {
      const cur = loadPts()
      savePts({ remain: cur.remain + bonusPts, total: cur.total + bonusPts })
    }
    return updated
  })

  const [pts, setPts] = useState(() => loadPts())
  const [milestone, setMilestone] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)

  const screenRef = useRef(null)
  const ptsChipRef = useRef(null)

  // 定时检测：如果过了凌晨12点，重置今日计数
useEffect(() => {
  function checkMidnight() {
    const { updated, changed, bonusPts } = resetTodayCountIfNeeded(
      loadHabits() || []
    )
    if (changed) {
      setHabits(updated)
      saveHabits(updated)
    }
    if (bonusPts > 0) {
      setPts(prev => {
        const next = { remain: prev.remain + bonusPts, total: prev.total + bonusPts }
        savePts(next)
        return next
      })
    }
  }

  // 每分钟检查一次
  const interval = setInterval(checkMidnight, 60 * 1000)
  return () => clearInterval(interval)
}, [])

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  useEffect(() => {
    savePts(pts)
  }, [pts])

  const tagline = TAGLINES[new Date().getDay() % TAGLINES.length]

  function getTodayDisplay() {
    const d = new Date()
    const days = ['周日','周一','周二','周三','周四','周五','周六']
    const months = ['1月','2月','3月','4月','5月','6月',
                    '7月','8月','9月','10月','11月','12月']
    return `${days[d.getDay()]} · ${months[d.getMonth()]}${d.getDate()}日`
  }

  function handleCheckin(habitId, cardRef) {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const { updatedHabit, pointsEarned, milestoneText, bonus } = doCheckin(habit)

    const newHabits = habits.map(h =>
      h.id === habitId ? updatedHabit : h
    )
    setHabits(newHabits)

    const newPts = {
      remain: Math.max(0, pts.remain + pointsEarned),
      total: Math.max(0, pts.total + pointsEarned),
    }
    setPts(newPts)

    if (cardRef?.triggerPop) cardRef.triggerPop()
    if (habit.type !== 'bad') spawnFloatingHeart(cardRef)

    if (milestoneText && habit.type !== 'bad') {
      setMilestone({ emoji: updatedHabit.emoji, text: milestoneText, bonus })
    }
  }

  function handleUndo(habitId) {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const result = undoCheckin(habit)
    if (!result) return

    const { updatedHabit, pointsLost } = result

    const newHabits = habits.map(h =>
      h.id === habitId ? updatedHabit : h
    )
    setHabits(newHabits)

    setPts(prev => ({
      remain: Math.max(0, prev.remain - pointsLost),
      total: Math.max(0, prev.total - pointsLost),
    }))
  }

  function handleYesterdayCheckin(habitId) {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const yesterday = getYesterdayStr()
    const alreadyDone = (habit.logs || []).filter(l => l.date === yesterday).length

    // 允许多次补打，没有上限
    const { updatedHabit, pointsEarned } = doBackdatedCheckin(habit, yesterday)
    setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h))
    setPts(prev => ({
      remain: prev.remain + pointsEarned,
      total: prev.total + pointsEarned,
    }))
  }

  const BAD_COLORS = { btnBg: 'rgba(210,80,80,0.85)', iconBg: 'rgba(210,80,80,0.15)' }

  function handleAddHabit({ name, emoji, pointsPerCheckin, type }) {
    const colorIndex = habits.length
    const colors = type === 'bad' ? BAD_COLORS : getHabitColor(colorIndex)
    const newHabit = {
      id: Date.now(),
      name,
      emoji,
      type: type ?? 'good',
      pointsPerCheckin: pointsPerCheckin ?? 1,
      todayCount: 0,
      totalCount: 0,
      streak: 0,
      lastCheckinDate: null,
      logs: [],
      colorIndex,
      ...colors,
    }
    setHabits(prev => [...prev, newHabit])
  }

  function handleEditSave(habitId, { name, emoji, pointsPerCheckin, type }) {
    const newHabits = habits.map(h => {
      if (h.id !== habitId) return h
      const newType = type ?? 'good'
      let colors = {}
      if (newType === 'bad') colors = BAD_COLORS
      else if (h.type === 'bad') colors = getHabitColor(h.colorIndex)
      return { ...h, name, emoji, pointsPerCheckin: pointsPerCheckin ?? 1, type: newType, ...colors }
    })
    setHabits(newHabits)
  }

  function handleDelete(habitId) {
    setHabits(prev => prev.filter(h => h.id !== habitId))
  }

  function handleArchive(habitId) {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const archivedHabit = {
      ...habit,
      archivedAt: new Date().toISOString(),
    }

    const existing = loadArchivedHabits()
    saveArchivedHabits([...existing, archivedHabit])
    setHabits(prev => prev.filter(h => h.id !== habitId))
  }

  function spawnFloatingHeart(cardRef) {
    const screen = screenRef.current
    const chip = ptsChipRef.current
    const card = cardRef?.current
    if (!screen || !chip || !card) return

    const sr = screen.getBoundingClientRect()
    const cr = card.getBoundingClientRect()
    const pr = chip.getBoundingClientRect()

    const heart = document.createElement('div')
    heart.textContent = '❤️'
    heart.style.cssText = `
      position: absolute;
      font-size: 36px;
      pointer-events: none;
      z-index: 100;
      left: ${cr.left - sr.left + cr.width * 0.5 - 18}px;
      top: ${cr.top - sr.top + cr.height * 0.3}px;
      --tx: ${pr.left - sr.left + pr.width * 0.5 - (cr.left - sr.left + cr.width * 0.5)}px;
      --ty: ${pr.top - sr.top + pr.height * 0.5 - (cr.top - sr.top + cr.height * 0.3)}px;
      animation: floatHeart 1s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
    `
    screen.appendChild(heart)
    setTimeout(() => heart.remove(), 1100)
  }

  return (
    <div
      ref={screenRef}
      style={{
        flex: 1,
        padding: '20px 16px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '4px',
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(60,40,90,0.5)',
          }}>
            {getTodayDisplay()}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(60,40,90,0.5)',
            marginTop: '3px',
            marginBottom: '14px',
          }}>
            {tagline}
          </div>
        </div>
        <div ref={ptsChipRef}>
          <PtsChip remain={pts.remain} total={pts.total} />
        </div>
      </div>

      {(() => {
        const goodHabits = habits.filter(h => h.type !== 'bad')
        const badHabits = habits.filter(h => h.type === 'bad')
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {goodHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onCheckin={handleCheckin}
                onUndo={handleUndo}
                onYesterdayCheckin={handleYesterdayCheckin}
                onLongPress={(id) => setEditingHabit(habits.find(h => h.id === id))}
              />
            ))}
            {badHabits.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 0' }}>
                  <div style={{ flex: 1, height: '0.5px', background: 'rgba(200,80,80,0.2)' }} />
                  <div style={{ fontSize: '10px', color: 'rgba(180,60,60,0.5)', fontWeight: '500' }}>坏习惯</div>
                  <div style={{ flex: 1, height: '0.5px', background: 'rgba(200,80,80,0.2)' }} />
                </div>
                {badHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onCheckin={handleCheckin}
                    onUndo={handleUndo}
                    onYesterdayCheckin={handleYesterdayCheckin}
                    onLongPress={(id) => setEditingHabit(habits.find(h => h.id === id))}
                  />
                ))}
              </>
            )}
          </div>
        )
      })()}

      {habits.length < MAX_HABITS && (
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '12px',
            borderRadius: '14px',
            border: '0.5px dashed rgba(160,130,200,0.4)',
            background: 'rgba(255,255,255,0.2)',
            color: 'rgba(100,80,140,0.5)',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          + 添加习惯
        </button>
      )}

      {milestone && (
        <MilestoneBanner
          emoji={milestone.emoji}
          text={milestone.text}
          bonus={milestone.bonus}
          onHide={() => setMilestone(null)}
        />
      )}

      {showAddModal && (
        <AddHabitModal
          onAdd={handleAddHabit}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onSave={handleEditSave}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onClose={() => setEditingHabit(null)}
        />
      )}
    </div>
  )
}

export default HomePage