import { useState } from 'react'
import { loadHabits } from '../utils/storage'
import { getTodayStr } from '../utils/habitLogic'

const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const today = new Date()
const thisYear = today.getFullYear()
const thisMonth = today.getMonth()
const todayDate = today.getDate()

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getCheckinCountForDay(habit, year, month, day) {
  const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  if (!habit.logs) return 0
  return habit.logs.filter(log => log.date === dateStr).length
}

function MonthRow({ habit, year, month }) {
  const days = getDaysInMonth(year, month)
  const isFutureMonth = year === thisYear && month > thisMonth
  const cells = []

  for (let d = 1; d <= days; d++) {
    const isFutureDay = year === thisYear && month === thisMonth && d > todayDate
    const count = (!isFutureMonth && !isFutureDay)
      ? getCheckinCountForDay(habit, year, month, d)
      : 0

    cells.push(
      <div
        key={d}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '8px',
          flexShrink: 0,
          background: isFutureMonth || isFutureDay
            ? 'transparent'
            : count > 0
              ? 'rgba(100,180,120,0.65)'
              : 'transparent',
          color: count > 0 ? 'rgba(20,80,30,0.9)' : 'transparent',
          fontWeight: '500',
        }}
      >
        {count > 0 ? count : ''}
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '8px',
    }}>
      <div style={{
        width: '56px',
        fontSize: '11px',
        fontWeight: '500',
        color: 'rgba(40,30,70,0.7)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        <span style={{ fontSize: '13px' }}>{habit.emoji}</span>
        <span style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {habit.name}
        </span>
      </div>
      <div style={{
        display: 'flex',
        gap: '2px',
        overflowX: 'auto',
        flex: 1,
      }}>
        {cells}
      </div>
    </div>
  )
}

function MonthBlock({ habits, year, month, isFuture }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.35)',
      border: '0.5px solid rgba(255,255,255,0.55)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '12px 14px',
      marginBottom: '10px',
      opacity: isFuture ? 0.4 : 1,
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: '500',
        color: 'rgba(60,40,90,0.6)',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>{MONTH_NAMES[month]}</span>
        {isFuture && (
          <span style={{
            fontSize: '10px',
            color: 'rgba(60,40,90,0.3)',
          }}>
            未到来
          </span>
        )}
      </div>
      {habits.map(habit => (
        <MonthRow
          key={habit.id}
          habit={habit}
          year={year}
          month={month}
        />
      ))}
    </div>
  )
}

function StatsPage() {
  const habits = loadHabits() || []
  const [showYearView, setShowYearView] = useState(false)

  if (habits.length === 0) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: 'rgba(60,40,90,0.4)',
        fontSize: '14px',
      }}>
        还没有习惯记录，去首页添加吧
      </div>
    )
  }

  return (
    <div style={{ padding: '20px 16px 16px' }}>

      {/* 标题 */}
      <div style={{
        fontSize: '18px',
        fontWeight: '500',
        color: 'rgba(40,30,70,0.9)',
        marginBottom: '16px',
      }}>
        数据
      </div>

      {/* 当前月 */}
      <MonthBlock
        habits={habits}
        year={thisYear}
        month={thisMonth}
        isFuture={false}
      />

      {/* 年历按钮 */}
      <button
        onClick={() => setShowYearView(v => !v)}
        style={{
          width: '100%',
          padding: '11px',
          borderRadius: '12px',
          border: '0.5px solid rgba(160,130,200,0.4)',
          background: 'rgba(255,255,255,0.2)',
          color: 'rgba(100,80,140,0.6)',
          fontSize: '13px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: '10px',
        }}
      >
        {showYearView ? '收起年历 ▴' : '查看年历 ▾'}
      </button>

      {/* 年历：1月到12月 */}
      {showYearView && (
        <div>
          {Array.from({ length: 12 }, (_, m) => {
            if (m === thisMonth) return null
            const isFuture = m > thisMonth
            return (
              <MonthBlock
                key={m}
                habits={habits}
                year={thisYear}
                month={m}
                isFuture={isFuture}
              />
            )
          })}
        </div>
      )}

    </div>
  )
}

export default StatsPage