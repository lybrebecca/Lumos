import { useState } from 'react'

const EMOJI_OPTIONS = [
  '🏃','📚','🧘','✏️','🥗','💪','🎨','🎵',
  '🌿','💧','😴','🧹','📝','🎯','🌅','🍎',
]

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '12px',
  border: '0.5px solid rgba(180,160,220,0.4)',
  background: 'rgba(255,255,255,0.6)',
  fontSize: '14px',
  color: 'rgba(40,30,70,0.9)',
  outline: 'none',
  fontFamily: 'inherit',
}

const labelStyle = {
  fontSize: '12px',
  color: 'rgba(40,30,70,0.5)',
  marginBottom: '6px',
}

function AddHabitModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🏃')
  const [pointsPerCheckin, setPointsPerCheckin] = useState(1)
  const [ptsInput, setPtsInput] = useState('1')

  function handleAdd() {
    if (!name.trim()) return
    onAdd({ name: name.trim(), emoji, pointsPerCheckin })
    onClose()
  }

  function handleEmojiInput(e) {
    const val = e.target.value
    // grab the last grapheme cluster (emoji or char) typed
    const chars = [...val]
    if (chars.length > 0) setEmoji(chars[chars.length - 1])
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
        <div style={{
          fontSize: '16px',
          fontWeight: '500',
          color: 'rgba(40,30,70,0.9)',
          marginBottom: '20px',
        }}>
          添加新习惯
        </div>

        {/* 名字输入 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={labelStyle}>习惯名称</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="比如：喝水、散步、拉伸..."
            maxLength={15}
            style={inputStyle}
          />
        </div>

        {/* Emoji 选择 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={labelStyle}>选择图标</div>

          {/* 自定义输入 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(160,130,210,0.2)',
              border: '1.5px solid rgba(160,130,210,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
            }}>
              {emoji}
            </div>
            <input
              type="text"
              placeholder="或输入任意 emoji"
              onChange={handleEmojiInput}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>

          {/* 预设网格 */}
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

        {/* 每次得分 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={labelStyle}>每次得分</div>
          <input
            type="number"
            value={ptsInput}
            min={1}
            onChange={(e) => setPtsInput(e.target.value)}
            onBlur={() => {
              const n = Math.max(1, parseInt(ptsInput) || 1)
              setPtsInput(String(n))
              setPointsPerCheckin(n)
            }}
            style={{ ...inputStyle, width: '100px' }}
          />
        </div>

        {/* 确认按钮 */}
        <div
          onClick={handleAdd}
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
            color: name.trim()
              ? 'rgba(255,255,255,0.95)'
              : 'rgba(255,255,255,0.5)',
            cursor: name.trim() ? 'pointer' : 'default',
          }}
        >
          添加
        </div>
      </div>
    </div>
  )
}

export default AddHabitModal
