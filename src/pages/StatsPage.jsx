import { useState, useRef } from 'react'
import { loadHabits } from '../utils/storage'

const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月',
                     '7月','8月','9月','10月','11月','12月']
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

const CELL_W = 26  // 每个日期格子的宽度px
const CELL_GAP = 3 // 格子间距px
const NAME_W = 60  // 左侧习惯名字栏宽度px

function MonthBlock({ habits, year, month, isFuture }) {
  const days = getDaysInMonth(year, month)
  const scrollRef = useRef(null)

  // 每个格子宽度固定，整块一起横向滚动
  const totalGridW = days * (CELL_W + CELL_GAP)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.35)',
      border: '0.5px solid rgba(255,255,255,0.55)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '12px 14px',
      marginBottom: '10px',
      opacity: isFuture ? 0.45 : 1,
    }}>

      {/* 月份标题 */}
      <div style={{
        fontSize: '12px',
        fontWeight: '500',
        color: 'rgba(60,40,90,0.6)',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>{MONTH_NAMES[month]}</span>
        {isFuture && (
          <span style={{ fontSize: '10px', color: 'rgba(60,40,90,0.3)' }}>
            未到来
          </span>
        )}
      </div>

      {/* 整块可横向滚动的区域 */}
      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* 内容最小宽度 = 名字栏 + 格子总宽 */}
        <div style={{ minWidth: NAME_W + totalGridW + 'px' }}>

          {/* 日期行 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '6px',
          }}>
            {/* 名字栏占位 */}
            <div style={{ width: NAME_W + 'px', flexShrink: 0 }} />
            {/* 日期数字 */}
            <div style={{ display: 'flex', gap: CELL_GAP + 'px' }}>
              {Array.from({ length: days }, (_, i) => {
                const d = i + 1
                const isFutureDay = !isFuture
                  && year === thisYear
                  && month === thisMonth
                  && d > todayDate
                return (
                  <div
                    key={d}
                    style={{
                      width: CELL_W + 'px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      color: isFutureDay
                        ? 'rgba(60,40,90,0.2)'
                        : 'rgba(60,40,90,0.35)',
                      flexShrink: 0,
                    }}
                  >
                    {d}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 每个习惯一行 */}
          {habits.map(habit => (
            <div
              key={habit.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '7px',
              }}
            >
              {/* 习惯名字 */}
              <div style={{
                width: NAME_W + 'px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: '500',
                color: 'rgba(40,30,70,0.7)',
              }}>
                <span style={{ fontSize: '13px' }}>{habit.emoji}</span>
                <span style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '40px',
                }}>
                  {habit.name}
                </span>
              </div>

              {/* 打卡格子 */}
              <div style={{ display: 'flex', gap: CELL_GAP + 'px' }}>
                {Array.from({ length: days }, (_, i) => {
                  const d = i + 1
                  const isFutureDay = !isFuture
                    && year === thisYear
                    && month === thisMonth
                    && d > todayDate
                  const count = (isFuture || isFutureDay)
                    ? 0
                    : getCheckinCountForDay(habit, year, month, d)

                  return (
                    <div
                      key={d}
                      style={{
                        width: CELL_W + 'px',
                        height: CELL_W + 'px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: '500',
                        flexShrink: 0,
                        background: count > 0
                          ? 'rgba(100,180,120,0.65)'
                          : 'transparent',
                        color: count > 0
                          ? 'rgba(20,80,30,0.9)'
                          : 'transparent',
                      }}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

        </div>
      </div>
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

      {/* 年历 */}
      {showYearView && (
        <div>
          {Array.from({ length: 12 }, (_, m) => {
            if (m === thisMonth) return null
            return (
              <MonthBlock
                key={m}
                habits={habits}
                year={thisYear}
                month={m}
                isFuture={m > thisMonth}
              />
            )
          })}
        </div>
      )}

    </div>
  )
}

export default StatsPage