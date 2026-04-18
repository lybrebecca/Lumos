import { useState, useRef, useEffect } from 'react'
import HabitCard from '../components/HabitCard'
import PtsChip from '../components/PtsChip'
import MilestoneBanner from '../components/MilestoneBanner'
import AddHabitModal from '../components/AddHabitModal'
import EditHabitModal from '../components/EditHabitModal'
import { doCheckin, undoCheckin, getHabitColor } from '../utils/habitLogic'
import { loadHabits, saveHabits, loadPts, savePts, loadArchivedHabits, saveArchivedHabits } from '../utils/storage'
import { getDefaultHabits } from '../data/defaultHabits'
import { TAGLINES } from '../utils/constants'


function HomePage() {
  // ── 状态 ──────────────────────────────────────
  const [habits, setHabits] = useState(() => {
    return loadHabits() || getDefaultHabits()
  })

  const [pts, setPts] = useState(() => loadPts())

  const [milestone, setMilestone] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)

  const [editingHabit, setEditingHabit] = useState(null)

  const screenRef = useRef(null)
  const ptsChipRef = useRef(null)

  // ── 自动存档 ───────────────────────────────────
  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  useEffect(() => {
    savePts(pts)
  }, [pts])

  // ── 今日文案 ───────────────────────────────────
  const tagline = TAGLINES[new Date().getDay() % TAGLINES.length]

  // ── 今日日期显示 ───────────────────────────────
  function getTodayDisplay() {
    const d = new Date()
    const days = ['周日','周一','周二','周三','周四','周五','周六']
    const months = ['1月','2月','3月','4月','5月','6月',
                    '7月','8月','9月','10月','11月','12月']
    return `${days[d.getDay()]} · ${months[d.getMonth()]}${d.getDate()}日`
  }

  // ── 打卡 ───────────────────────────────────────
  function handleCheckin(habitId, cardRef) {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const { updatedHabit, pointsEarned, milestoneText, bonus } = doCheckin(habit)

    const newHabits = habits.map(h =>
      h.id === habitId ? updatedHabit : h
    )
    setHabits(newHabits)

    const newPts = {
      remain: pts.remain + pointsEarned,
      total: pts.total + pointsEarned,
    }
    setPts(newPts)

    if (cardRef?.triggerPop) cardRef.triggerPop()
    spawnFloatingHeart(cardRef)

    if (milestoneText) {
      setMilestone({ emoji: updatedHabit.emoji, text: milestoneText, bonus })
    }
  }

  // ── 撤销 ───────────────────────────────────────
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

  // ── 添加习惯 ───────────────────────────────────
  function handleAddHabit({ name, emoji }) {
    const colorIndex = habits.length
    const newHabit = {
      id: Date.now(),
      name,
      emoji,
      todayCount: 0,
      totalCount: 0,
      streak: 0,
      lastCheckinDate: null,
      logs: [],
      colorIndex,
      ...getHabitColor(colorIndex),
    }
    setHabits(prev => [...prev, newHabit])
  }

  // ── 编辑习惯 ───────────────────────────────────
  function handleEditSave(habitId, { name, emoji }) {
    const newHabits = habits.map(h =>
      h.id === habitId ? { ...h, name, emoji } : h
    )
    setHabits(newHabits)
  }

  // ── 删除习惯 ───────────────────────────────────
  // 归档习惯：从首页移除，但保留历史数据
function handleArchive(habitId) {
  const habit = habits.find(h => h.id === habitId)
  if (!habit) return

  // 加上归档时间
  const archivedHabit = {
    ...habit,
    archivedAt: new Date().toISOString(),
  }

  // 存入归档列表
  const existing = loadArchivedHabits()
  saveArchivedHabits([...existing, archivedHabit])

  // 从首页移除
  setHabits(prev => prev.filter(h => h.id !== habitId))
}

  // ── 飞心动画 ───────────────────────────────────
  function spawnFloatingHeart(cardRef) {
    const screen = screenRef.current
    const chip = ptsChipRef.current
    const card = cardRef?.current
    if (!screen || !chip || !card) return

    const sr = screen.getBoundingClientRect()
    const cr = card.getBoundingClientRect()
    const pr = chip.getBoundingClientRect()

    const heart = document.createElement('div')
    heart.textContent = '♡'
    heart.style.cssText = `
      position: absolute;
      font-size: 16px;
      color: rgba(180,130,210,0.9);
      pointer-events: none;
      z-index: 100;
      left: ${cr.left - sr.left + cr.width * 0.5}px;
      top: ${cr.top - sr.top + cr.height * 0.4}px;
      --tx: ${pr.left - sr.left + pr.width * 0.5 - (cr.left - sr.left + cr.width * 0.5)}px;
      --ty: ${pr.top - sr.top + pr.height * 0.5 - (cr.top - sr.top + cr.height * 0.4)}px;
      animation: floatHeart 0.75s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
    `
    screen.appendChild(heart)
    setTimeout(() => heart.remove(), 800)
  }

  // ── 渲染 ───────────────────────────────────────
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
      {/* 顶部：日期 + 积分 */}
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

      {/* 习惯卡片列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {habits.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onCheckin={handleCheckin}
            onUndo={handleUndo}
            onLongPress={(id) => setEditingHabit(habits.find(h => h.id === id))}
          />
        ))}
      </div>

      {/* 添加习惯按钮 */}
      {habits.length < 10 && (
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

      {/* 里程碑横幅 */}
      {milestone && (
        <MilestoneBanner
          emoji={milestone.emoji}
          text={milestone.text}
          bonus={milestone.bonus}
          onHide={() => setMilestone(null)}
        />
      )}

      {/* 添加习惯弹窗 */}
      {showAddModal && (
        <AddHabitModal
          onAdd={handleAddHabit}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* 编辑习惯弹窗 */}
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