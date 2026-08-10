import { useState } from 'react'
import { loadHabits, loadArchivedHabits } from '../utils/storage'
import HabitDetailModal from '../components/HabitDetailModal'

function getLastSevenDays() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
    days.push({ dateStr, label: i === 0 ? '今' : dayOfWeek, isToday: i === 0 })
  }
  return days
}

function getMonthTotal(habit) {
  const d = new Date()
  const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  return (habit.logs || []).filter(l => l.date.startsWith(prefix)).length
}

function getCountForDate(habit, dateStr) {
  return (habit.logs || []).filter(l => l.date === dateStr).length
}

function withOpacity(btnBg, opacity) {
  return btnBg.replace(/[\d.]+\)$/, opacity + ')')
}

function StatsPage() {
  const habits = loadHabits() || []
  const [selectedHabit, setSelectedHabit] = useState(null)

  const days = getLastSevenDays()

  const now = new Date()
  const monthLabel = `${now.getMonth() + 1}月`

  if (habits.length === 0) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: 'rgba(60,40,90,0.4)',
        fontSize: '14px',
      }}>
        还没有习惯，去首页添加吧
      </div>
    )
  }

  const maxMonthTotal = Math.max(...habits.map(getMonthTotal), 1)

  return (
    <div style={{ padding: '20px 16px 16px' }}>
      <div style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(40,30,70,0.9)', marginBottom: '2px' }}>
        数据
      </div>
      <div style={{ fontSize: '11px', color: 'rgba(40,30,70,0.4)', marginBottom: '16px' }}>
        点击习惯查看月历
      </div>

      {/* 近7天 */}
      <div style={{
        background: 'rgba(255,255,255,0.35)',
        border: '0.5px solid rgba(255,255,255,0.55)',
        backdropFilter: 'blur(12px)',
        borderRadius: '18px',
        padding: '14px',
        marginBottom: '10px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(40,30,70,0.6)', marginBottom: '10px' }}>
          近 7 天
        </div>

        {/* 日期表头 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            {days.map(day => (
              <div key={day.dateStr} style={{
                width: '26px',
                textAlign: 'center',
                fontSize: '9px',
                fontWeight: day.isToday ? '600' : '400',
                color: day.isToday ? 'rgba(140,110,200,0.9)' : 'rgba(40,30,70,0.35)',
              }}>
                {day.label}
              </div>
            ))}
          </div>
        </div>

        {/* 每个习惯行 */}
        {habits.map(habit => (
          <div
            key={habit.id}
            onClick={() => setSelectedHabit(habit)}
            style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', cursor: 'pointer' }}
          >
            <div style={{
              flex: 1,
              fontSize: '12px',
              color: 'rgba(40,30,70,0.75)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              overflow: 'hidden',
            }}>
              <span>{habit.emoji}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {habit.name}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {days.map(day => {
                const count = getCountForDate(habit, day.dateStr)
                let bg, border, textColor
                if (count > 0) {
                  bg = day.isToday
                    ? withOpacity(habit.btnBg, '0.9')
                    : withOpacity(habit.btnBg, '0.65')
                  border = 'none'
                  textColor = 'rgba(255,255,255,0.95)'
                } else if (day.isToday) {
                  bg = 'rgba(255,255,255,0.4)'
                  border = '1.5px solid rgba(140,110,200,0.5)'
                  textColor = 'transparent'
                } else {
                  bg = 'rgba(255,255,255,0.4)'
                  border = '0.5px solid rgba(160,130,200,0.2)'
                  textColor = 'transparent'
                }
                return (
                  <div key={day.dateStr} style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: bg,
                    border,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '500',
                    color: textColor,
                    flexShrink: 0,
                  }}>
                    {count > 0 ? count : ''}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 本月横向柱状图 */}
      <div style={{
        background: 'rgba(255,255,255,0.35)',
        border: '0.5px solid rgba(255,255,255,0.55)',
        backdropFilter: 'blur(12px)',
        borderRadius: '18px',
        padding: '14px',
        marginBottom: '10px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(40,30,70,0.6)', marginBottom: '12px' }}>
          {monthLabel}打卡次数
        </div>

        {habits.map(habit => {
          const total = getMonthTotal(habit)
          const pct = Math.round(total / maxMonthTotal * 100)
          return (
            <div
              key={habit.id}
              onClick={() => setSelectedHabit(habit)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}
            >
              <div style={{
                fontSize: '11px',
                color: 'rgba(40,30,70,0.7)',
                width: '64px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                overflow: 'hidden',
              }}>
                <span>{habit.emoji}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {habit.name}
                </span>
              </div>
              <div style={{
                flex: 1,
                height: '14px',
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '7px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  borderRadius: '7px',
                  background: withOpacity(habit.btnBg, '0.75'),
                  minWidth: total > 0 ? '6px' : '0',
                }} />
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: '500',
                color: 'rgba(80,60,120,0.8)',
                width: '20px',
                textAlign: 'right',
                flexShrink: 0,
              }}>
                {total}
              </div>
            </div>
          )
        })}
      </div>

      {/* 月历弹窗 */}
      {selectedHabit && (
        <HabitDetailModal
          habit={selectedHabit}
          onClose={() => setSelectedHabit(null)}
        />
      )}
    </div>
  )
}

export default StatsPage
