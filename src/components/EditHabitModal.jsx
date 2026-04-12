import { useState } from 'react'

const EMOJI_OPTIONS = [
  '🏃','📚','🧘','✏️','🥗','💪','🎨','🎵',
  '🌿','💧','😴','🧹','📝','🎯','🌅','🍎',
]

function EditHabitModal({ habit, onSave, onDelete, onClose }) {
  const [name, setName] = useState(habit.name)
  const [emoji, setEmoji] = useState(habit.emoji)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleSave() {
    if (!name.trim()) return
    onSave(habit.id, { name: name.trim(), emoji })
    onClose()
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(habit.id)
    onClose()
  }

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
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'rgba(240,235,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px 36px',
        }}
      >
        {/* 标题 */}
        <div style={{
          fontSize: '16px',
          fontWeight: '500',
          color: 'rgba(40,30,70,0.9)',
          marginBottom: '20px',
        }}>
          编辑习惯
        </div>

        {/* 名字输入 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '12px',
            color: 'rgba(40,30,70,0.5)',
            marginBottom: '6px',
          }}>
            习惯名称
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={15}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '0.5px solid rgba(180,160,220,0.4)',
              background: 'rgba(255,255,255,0.6)',
              fontSize: '14px',
              color: 'rgba(40,30,70,0.9)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Emoji 选择 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '12px',
            color: 'rgba(40,30,70,0.5)',
            marginBottom: '8px',
          }}>
            选择图标
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '8px',
          }}>
            {EMOJI_OPTIONS.map((e) => (
              <div
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  cursor: 'pointer',
                  background: emoji === e
                    ? 'rgba(160,130,210,0.35)'
                    : 'rgba(255,255,255,0.5)',
                  border: emoji === e
                    ? '1.5px solid rgba(160,130,210,0.6)'
                    : '0.5px solid rgba(255,255,255,0.6)',
                }}
              >
                {e}
              </div>
            ))}
          </div>
        </div>

        {/* 保存按钮 */}
        <div
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '14px',
            background: name.trim()
              ? 'rgba(140,110,200,0.7)'
              : 'rgba(140,110,200,0.3)',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.95)',
            cursor: name.trim() ? 'pointer' : 'default',
            marginBottom: '10px',
          }}
        >
          保存
        </div>

        {/* 删除按钮 */}
        <div
          onClick={handleDelete}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '14px',
            background: confirmDelete
              ? 'rgba(220,80,80,0.65)'
              : 'rgba(220,80,80,0.15)',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            color: confirmDelete
              ? 'rgba(255,255,255,0.95)'
              : 'rgba(180,60,60,0.7)',
            cursor: 'pointer',
          }}
        >
          {confirmDelete ? '确认删除（不可恢复）' : '删除这个习惯'}
        </div>
      </div>
    </div>
  )
}

export default EditHabitModal