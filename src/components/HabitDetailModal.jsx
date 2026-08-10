function withOpacity(btnBg, opacity) {
  return btnBg.replace(/[\d.]+\)$/, opacity + ')')
}

function HabitDetailModal({ habit, onClose }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayDate = today.getDate()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Monday-first offset
  const offset = (new Date(year, month, 1).getDay() + 6) % 7

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthName = `${year}年${month + 1}月`

  function countForDay(d) {
    const dateStr = `${monthPrefix}-${String(d).padStart(2, '0')}`
    return (habit.logs || []).filter(l => l.date === dateStr).length
  }

  const weekLabels = ['一', '二', '三', '四', '五', '六', '日']

  // stats
  const monthTotal = (habit.logs || []).filter(l => l.date.startsWith(monthPrefix)).length
  const daysElapsed = todayDate
  const completionPct = Math.round(monthTotal / daysElapsed * 100)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(60,40,90,0.3)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 300,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'rgba(240,235,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px 40px',
        }}
      >
        {/* 标题 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ fontSize: '24px' }}>{habit.emoji}</span>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(40,30,70,0.9)' }}>
              {habit.name}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(40,30,70,0.4)', marginTop: '1px' }}>
              {monthName}
            </div>
          </div>
        </div>

        {/* 月历 */}
        <div style={{
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '16px',
          padding: '14px',
          margin: '16px 0 12px',
        }}>
          {/* 星期标题 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '6px' }}>
            {weekLabels.map(l => (
              <div key={l} style={{ textAlign: 'center', fontSize: '10px', color: 'rgba(40,30,70,0.35)' }}>
                {l}
              </div>
            ))}
          </div>

          {/* 日期格子 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {/* 空格占位 */}
            {Array.from({ length: offset }).map((_, i) => (
              <div key={'e' + i} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
              const count = countForDay(d)
              const isFuture = d > todayDate
              const isToday = d === todayDate

              let bg, textColor
              if (isToday) {
                bg = 'rgba(140,110,200,0.75)'
                textColor = 'rgba(255,255,255,0.95)'
              } else if (isFuture) {
                bg = 'rgba(220,215,240,0.25)'
                textColor = 'rgba(40,30,70,0.2)'
              } else if (count >= 2) {
                bg = withOpacity(habit.btnBg, '0.85')
                textColor = 'rgba(255,255,255,0.95)'
              } else if (count === 1) {
                bg = withOpacity(habit.btnBg, '0.45')
                textColor = 'rgba(40,30,70,0.7)'
              } else {
                bg = 'rgba(255,255,255,0.45)'
                textColor = 'rgba(40,30,70,0.35)'
              }

              return (
                <div
                  key={d}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: isToday ? '600' : '400',
                    color: textColor,
                  }}
                >
                  {d}
                </div>
              )
            })}
          </div>

          <div style={{ fontSize: '9px', color: 'rgba(40,30,70,0.35)', marginTop: '8px' }}>
            深色 = 多次打卡 · 浅色 = 1次 · 空 = 未打
          </div>
        </div>

        {/* 数据摘要 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { num: habit.streak, label: '连击天' },
            { num: `${Math.min(completionPct, 100)}%`, label: '本月完成' },
            { num: habit.totalCount, label: '累计次数' },
          ].map(({ num, label }) => (
            <div key={label} style={{
              flex: 1,
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '12px',
              padding: '10px 8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(80,60,120,0.9)' }}>{num}</div>
              <div style={{ fontSize: '9px', color: 'rgba(40,30,70,0.4)', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HabitDetailModal
