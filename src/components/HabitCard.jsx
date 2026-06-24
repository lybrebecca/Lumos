import { useRef, useState } from 'react'

const UNDO_WIDTH = 76

function HabitCard({ habit, onCheckin, onUndo, onLongPress }) {
  const [offset, setOffset] = useState(0)
  const [animating, setAnimating] = useState(false)

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const offsetAtTouchStart = useRef(0)
  const isSwiping = useRef(false)
  const isLongPress = useRef(false)
  const longPressTimer = useRef(null)
  const cardRef = useRef(null)
  const wrapRef = useRef(null)

  // ── 长按检测 ──────────────────────────────────
  function startLongPress() {
    isLongPress.current = false
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true
      onLongPress(habit.id)
    }, 5000)
  }

  function cancelLongPress() {
    clearTimeout(longPressTimer.current)
  }

  // ── 触摸滑动 ──────────────────────────────────
  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    offsetAtTouchStart.current = offset
    isSwiping.current = false
    setAnimating(false)
    startLongPress()
  }

  function handleTouchMove(e) {
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current

    if (!isSwiping.current && Math.abs(dx) > 8) {
      cancelLongPress()
      isSwiping.current = true
    }

    if (!isSwiping.current) return

    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault()
    }

    const newOffset = Math.max(-UNDO_WIDTH, Math.min(0, offsetAtTouchStart.current + dx))
    setOffset(newOffset)
  }

  function handleTouchEnd() {
    cancelLongPress()
    if (!isSwiping.current) return

    setAnimating(true)
    if (offset < -UNDO_WIDTH / 2) {
      setOffset(-UNDO_WIDTH)
    } else {
      setOffset(0)
    }
  }

  // ── 点击卡片 ──────────────────────────────────
  function handleClick() {
    if (isLongPress.current) return

    // 如果撤销面板打开，点卡片关闭
    if (offset !== 0) {
      setAnimating(true)
      setOffset(0)
      return
    }

    triggerPopAnim()
    onCheckin(habit.id, cardRef)
  }

  // ── 撤销按钮 ──────────────────────────────────
  function handleUndoClick(e) {
    e.stopPropagation()
    setAnimating(true)
    setOffset(0)
    onUndo(habit.id)
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

  cardRef.triggerPop = triggerPopAnim

  const { iconBg, btnBg } = habit

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden' }}
    >
      {/* 红色撤销按钮（底层） */}
      <div
        onClick={handleUndoClick}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: `${UNDO_WIDTH}px`,
          background: 'rgba(220,60,60,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '18px',
        }}
      >
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: '18px' }}>↩</div>
          <div style={{ fontSize: '11px', marginTop: '2px' }}>撤销</div>
        </div>
      </div>

      {/* 卡片主体（上层，可左滑） */}
      <div
        ref={cardRef}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          background: 'rgba(255,255,255,0.35)',
          border: '0.5px solid rgba(255,255,255,0.55)',
          backdropFilter: 'blur(12px)',
          borderRadius: '18px',
          padding: '13px 14px',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          touchAction: 'pan-y',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transform: `translateX(${offset}px)`,
          transition: animating ? 'transform 0.25s ease' : 'none',
          position: 'relative',
          zIndex: 1,
        }}
        onTransitionEnd={() => setAnimating(false)}
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
    </div>
  )
}

export default HabitCard
