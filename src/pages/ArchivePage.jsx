import { useState } from 'react'
import { loadArchivedHabits, saveArchivedHabits, loadHabits, saveHabits } from '../utils/storage'
import { getHabitColor } from '../utils/habitLogic'

function ArchivePage() {
  const [archived, setArchived] = useState(() => loadArchivedHabits())

  function handleRestore(habitId) {
    const habit = archived.find(h => h.id === habitId)
    if (!habit) return

    // 恢复到习惯列表
    const current = loadHabits() || []
    const colorIndex = current.length
    const restored = {
      ...habit,
      colorIndex,
      ...getHabitColor(colorIndex),
      archivedAt: undefined,
    }
    saveHabits([...current, restored])

    // 从归档移除
    const newArchived = archived.filter(h => h.id !== habitId)
    saveArchivedHabits(newArchived)
    setArchived(newArchived)
  }

  function handleDelete(habitId) {
    const newArchived = archived.filter(h => h.id !== habitId)
    saveArchivedHabits(newArchived)
    setArchived(newArchived)
  }

  return (
    <div style={{ padding: '20px 16px 16px' }}>
      <div style={{
        fontSize: '16px',
        fontWeight: '500',
        color: 'rgba(40,30,70,0.8)',
        marginBottom: '4px',
      }}>
        归档习惯
      </div>
      <div style={{
        fontSize: '12px',
        color: 'rgba(40,30,70,0.4)',
        marginBottom: '20px',
      }}>
        {archived.length === 0 ? '暂无归档习惯' : `共 ${archived.length} 个`}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {archived.map(habit => (
          <ArchivedCard
            key={habit.id}
            habit={habit}
            onRestore={handleRestore}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}

function ArchivedCard({ habit, onRestore, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { iconBg, btnBg } = getHabitColor(habit.colorIndex ?? 0)

  const archivedDate = habit.archivedAt
    ? new Date(habit.archivedAt).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
    : ''

  return (
    <div style={{
      background: 'rgba(255,255,255,0.3)',
      border: '0.5px solid rgba(255,255,255,0.5)',
      backdropFilter: 'blur(12px)',
      borderRadius: '18px',
      padding: '13px 14px',
    }}>
      {/* 上方：习惯信息 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
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
          opacity: 0.7,
        }}>
          {habit.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'rgba(40,30,70,0.7)',
          }}>
            {habit.name}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(40,30,70,0.4)',
            marginTop: '2px',
          }}>
            累计 {habit.totalCount} 次
            {habit.streak > 0 && ` · 最长 ${habit.streak} 天连击`}
            {archivedDate && ` · ${archivedDate}归档`}
          </div>
        </div>
      </div>

      {/* 下方：操作按钮 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div
          onClick={() => onRestore(habit.id)}
          style={{
            flex: 1,
            padding: '9px',
            borderRadius: '12px',
            background: btnBg,
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.95)',
            cursor: 'pointer',
          }}
        >
          恢复到首页
        </div>
        <div
          onClick={() => {
            if (!confirmDelete) { setConfirmDelete(true); return }
            onDelete(habit.id)
          }}
          style={{
            flex: 1,
            padding: '9px',
            borderRadius: '12px',
            background: confirmDelete
              ? 'rgba(220,80,80,0.65)'
              : 'rgba(220,80,80,0.12)',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '500',
            color: confirmDelete
              ? 'rgba(255,255,255,0.95)'
              : 'rgba(180,60,60,0.7)',
            cursor: 'pointer',
          }}
        >
          {confirmDelete ? '确认删除' : '永久删除'}
        </div>
      </div>
    </div>
  )
}

export default ArchivePage
