import { useState, useRef } from 'react'
import { loadHabits, loadArchivedHabits, saveArchivedHabits, saveHabits, loadPts, savePts } from '../utils/storage'

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

function habitExistsInMonth(habit, year, month) {
  const monthStart = new Date(year, month, 1).toISOString().split('T')[0]
  if (!habit.archivedAt) return true
  const archivedDate = habit.archivedAt.split('T')[0]
  return archivedDate >= monthStart
}

const CELL_SIZE = 26
const NAME_WIDTH = 120

function LongPressCell({ onLongPress, disabled }) {
  const timerRef = useRef(null)
  const movedRef = useRef(false)

  function handlePointerDown() {
    if (disabled) return
    movedRef.current = false
    timerRef.current = setTimeout(() => {
      if (!movedRef.current) onLongPress()
    }, 600)
  }

  function handlePointerMove() {
    movedRef.current = true
    clearTimeout(timerRef.current)
  }

  function handlePointerUp() {
    clearTimeout(timerRef.current)
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        cursor: disabled ? 'default' : 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation',
      }}
    />
  )
}

function AddLogModal({ habit, year, month, day, onConfirm, onClose }) {
  const dateLabel = `${month + 1}月${day}日`
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(60,40,90,0.3)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 400,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(240,235,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '24px 20px',
          width: '260px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '28px', marginBottom: '10px' }}>
          {habit.emoji}
        </div>
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'rgba(40,30,70,0.9)',
          marginBottom: '6px',
        }}>
          补记 {dateLabel}
        </div>
        <div style={{
          fontSize: '12px',
          color: 'rgba(40,30,70,0.5)',
          marginBottom: '20px',
        }}>
          为「{habit.name}」补记一次打卡，同时 +1 心愿值
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div
            onClick={onClose}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '12px',
              background: 'rgba(160,130,200,0.15)',
              textAlign: 'center',
              fontSize: '14px',
              color: 'rgba(100,80,140,0.7)',
              cursor: 'pointer',
            }}
          >
            取消
          </div>
          <div
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '12px',
              background: 'rgba(140,110,200,0.7)',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: 'rgba(255,255,255,0.95)',
              cursor: 'pointer',
            }}
          >
            确认补记
          </div>
        </div>
      </div>
    </div>
  )
}

function MonthBlock({ habits, year, month, isFuture, onAddLog }) {
  const days = getDaysInMonth(year, month)
  const scrollRef = useRef(null)
  const dayNumbers = Array.from({ length: days }, (_, i) => i + 1)
  const visibleHabits = habits.filter(h => habitExistsInMonth(h, year, month))

  if (visibleHabits.length === 0) return null

  return (
    <div style={{
      background: 'rgba(255,255,255,0.35)',
      border: '0.5px solid rgba(255,255,255,0.55)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      marginBottom: '10px',
      opacity: isFuture ? 0.45 : 1,
      overflow: 'hidden',
    }}>
      {/* 月份标题 */}
      <div style={{
        fontSize: '12px',
        fontWeight: '500',
        color: 'rgba(60,40,90,0.6)',
        padding: '12px 14px 8px',
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

      {/* 整体布局：固定首列 + 横向滚动区域 */}
      <div style={{ display: 'flex', paddingBottom: '12px' }}>

        {/* 左侧固定列：习惯名字 */}
        <div style={{
          flexShrink: 0,
          width: NAME_WIDTH,
          paddingLeft: '14px',
        }}>
          {/* 日期行占位 */}
          <div style={{ height: '22px', marginBottom: '4px' }} />
          {/* 每个习惯名字 */}
          {visibleHabits.map((habit, index) => (
            <div
              key={habit.id}
              style={{
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '4px',
                background: index % 2 === 0
                  ? 'transparent'
                  : 'rgba(160,130,200,0.04)',
                borderRadius: '6px 0 0 6px',
              }}
            >
              <span style={{ fontSize: '13px' }}>{habit.emoji}</span>
              <span style={{
                fontSize: '10px',
                fontWeight: '500',
                color: 'rgba(40,30,70,0.7)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {habit.name}
              </span>
            </div>
          ))}
        </div>

        {/* 右侧横向滚动区域 */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div style={{ minWidth: days * CELL_SIZE }}>

            {/* 日期行 */}
            <div style={{
              display: 'flex',
              height: '22px',
              alignItems: 'center',
              marginBottom: '4px',
              borderBottom: '0.5px solid rgba(160,130,200,0.2)',
            }}>
              {dayNumbers.map(d => {
                const isFutureDay = !isFuture
                  && year === thisYear
                  && month === thisMonth
                  && d > todayDate
                const isToday = !isFuture
                  && year === thisYear
                  && month === thisMonth
                  && d === todayDate
                return (
                  <div
                    key={d}
                    style={{
                      width: CELL_SIZE,
                      flexShrink: 0,
                      textAlign: 'center',
                      fontSize: '9px',
                      fontWeight: isToday ? '600' : '400',
                      color: isToday
                        ? 'rgba(140,110,200,0.9)'
                        : isFutureDay
                          ? 'rgba(60,40,90,0.15)'
                          : 'rgba(60,40,90,0.35)',
                    }}
                  >
                    {d}
                  </div>
                )
              })}
            </div>

            {/* 每个习惯打卡行 */}
            {visibleHabits.map((habit, habitIndex) => (
              <div
                key={habit.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '28px',
                  marginBottom: '4px',
                  background: habitIndex % 2 === 0
                    ? 'transparent'
                    : 'rgba(160,130,200,0.04)',
                  borderRadius: '0 6px 6px 0',
                }}
              >
                {dayNumbers.map(d => {
                  const isFutureDay = !isFuture
                    && year === thisYear
                    && month === thisMonth
                    && d > todayDate
                  const isToday = !isFuture
                    && year === thisYear
                    && month === thisMonth
                    && d === todayDate
                  const count = (isFuture || isFutureDay)
                    ? 0
                    : getCheckinCountForDay(habit, year, month, d)

                  return (
                    <div
                      key={d}
                      style={{
                        width: CELL_SIZE,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        borderLeft: '0.5px solid rgba(160,130,200,0.1)',
                        background: isToday
                          ? 'rgba(140,110,200,0.06)'
                          : 'transparent',
                      }}
                    >
                      {count > 0 ? (
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'rgba(100,180,120,0.65)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '9px',
                          fontWeight: '500',
                          color: 'rgba(20,80,30,0.9)',
                        }}>
                          {count}
                        </div>
                      ) : (
                        <LongPressCell
                          disabled={isFutureDay || isFuture}
                          onLongPress={() => onAddLog(habit, year, month, d)}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  )
}

function StatsPage() {
  const habits = loadHabits() || []
  const archivedHabits = loadArchivedHabits()
  const allHabits = [...habits, ...archivedHabits]

  const [showYearView, setShowYearView] = useState(false)
  const [pendingLog, setPendingLog] = useState(null)

  function handleAddLog(habit, year, month, day) {
    setPendingLog({ habit, year, month, day })
  }

  function confirmAddLog() {
    if (!pendingLog) return
    const { habit, year, month, day } = pendingLog
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    const newLog = { date: dateStr, time: '补记' }

    // 补记同时 +1 积分
    const currentPts = loadPts()
    savePts({
      remain: currentPts.remain + 1,
      total: currentPts.total + 1,
    })

    const isArchived = archivedHabits.some(h => h.id === habit.id)

    if (isArchived) {
      const updated = archivedHabits.map(h =>
        h.id === habit.id
          ? { ...h, logs: [...(h.logs || []), newLog], totalCount: h.totalCount + 1 }
          : h
      )
      saveArchivedHabits(updated)
    } else {
      const updated = habits.map(h =>
        h.id === habit.id
          ? { ...h, logs: [...(h.logs || []), newLog], totalCount: h.totalCount + 1 }
          : h
      )
      saveHabits(updated)
    }

    setPendingLog(null)
  }

  if (allHabits.length === 0) {
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
        marginBottom: '4px',
      }}>
        数据
      </div>
      <div style={{
        fontSize: '11px',
        color: 'rgba(60,40,90,0.4)',
        marginBottom: '16px',
      }}>
        长按空格补记
      </div>

      {/* 当前月 */}
      <MonthBlock
        habits={allHabits}
        year={thisYear}
        month={thisMonth}
        isFuture={false}
        onAddLog={handleAddLog}
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
                habits={allHabits}
                year={thisYear}
                month={m}
                isFuture={m > thisMonth}
                onAddLog={handleAddLog}
              />
            )
          })}
        </div>
      )}

      {/* 补记确认弹窗 */}
      {pendingLog && (
        <AddLogModal
          habit={pendingLog.habit}
          year={pendingLog.year}
          month={pendingLog.month}
          day={pendingLog.day}
          onConfirm={confirmAddLog}
          onClose={() => setPendingLog(null)}
        />
      )}

    </div>
  )
}

export default StatsPage