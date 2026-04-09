import { useRef } from 'react'
import { DOUBLE_CLICK_MS } from '../utils/constants'

function HabitCard({ habit, onCheckin, onUndo, screenRef }) {
  const lastClickTime = useRef(0)
  const clickTimer = useRef(null)

  function handleClick() {
    const now = Date.now()
    const timeSinceLast = now - lastClickTime.current

    if (timeSinceLast < DOUBLE_CLICK_MS) {
      // 双击：撤销
      clearTimeout(clickTimer.current)
      lastClickTime.current = 0
      onUndo(habit.id)
      return
    }

    // 单击：等待一下，确认不是双击再打卡
    lastClickTime.current = now
    clickTimer.current = setTimeout(() => {
      if (lastClickTime.current === now) {
        onCheckin(habit.id, cardRef)
      }
    }, 260)
  }

  const cardRef = useRef(null)

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

  // 把动画方法暴露给父组件调用
  cardRef.triggerPop = triggerPopAnim
  cardRef.triggerShake = triggerShakeAnim

  const { iconBg, btnBg } = habit

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
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

      {/* 右侧：打卡次数按钮 */}
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