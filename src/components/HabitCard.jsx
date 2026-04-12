import { useRef } from 'react'
import { DOUBLE_CLICK_MS } from '../utils/constants'

function HabitCard({ habit, onCheckin, onUndo, onLongPress }) {
  const lastClickTime = useRef(0)
  const clickTimer = useRef(null)
  const longPressTimer = useRef(null)
  const isLongPress = useRef(false)
  const cardRef = useRef(null)

  // ── 长按检测 ──────────────────────────────────
  function handlePointerDown() {
    isLongPress.current = false
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true
      onLongPress(habit.id)
    }, 600)
  }

  function handlePointerUp() {
    clearTimeout(longPressTimer.current)
  }

  // ── 单击 / 双击 ───────────────────────────────
  function handleClick() {
    if (isLongPress.current) return

    const now = Date.now()
    const timeSinceLast = now - lastClickTime.current

    if (timeSinceLast < DOUBLE_CLICK_MS) {
      clearTimeout(clickTimer.current)
      lastClickTime.current = 0
      triggerShakeAnim()
      onUndo(habit.id)
      return
    }

    lastClickTime.current = now
    clickTimer.current = setTimeout(() => {
      if (lastClickTime.current === now) {
        triggerPopAnim()
        onCheckin(habit.id, cardRef)
      }
    }, 260)
  }

  // ── 动画 ──────────────────────────────────────
  function triggerPopAnim() {
    const el = cardRef.current
    if (!el) return
    el.style.animation = 'none'
    void el.offsetWidth
    el.style.animation = 'cardPop 0.4s ease'
    setTimeout(() => { el.style.animation = '' }, 450)
  }

  function triggerShakeAnim() {
    const el = cardRef.current
    if (!el) return
    el.style.animation = 'none'
    void el.offsetWidth
    el.style.animation = 'shake 0.35s ease'
    setTimeout(() => { el.style.animation = '' }, 400)
  }

  cardRef.triggerPop = triggerPopAnim
  cardRef.triggerShake = triggerShakeAnim

  const { iconBg, btnBg } = habit

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        background: 'rgba(255,255,255,0.35)',
        border: '0.5px solid rgba(255,255,255,0.55)',
        backdropFilter: 'blur(12px)',
        borderRadius: '18px',
        padding: '13px 14px',
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* 左侧：emoji + 文字 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          flexShrink: 0,
        }}>
          {habit.emoji}
        </div>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'rgba(40,30,70,0.9)',
          }}>
            {habit.name}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(40,30,70,0.45)',
            marginTop: '2px',
          }}>
            今日 {habit.todayCount} 次
            · 累计 {habit.totalCount} 次
            {habit.streak > 0 && ` · ${habit.streak} 天连击`}
          </div>
        </div>
      </div>

      {/* 右侧按钮 */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '10px',
        background: btnBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '500',
        color: 'rgba(255,255,255,0.95)',
        flexShrink: 0,
      }}>
        {habit.todayCount > 0 ? habit.todayCount : '+'}
      </div>
    </div>
  )
}

export default HabitCard