import { useState } from 'react'

const EMOJI_OPTIONS = [
  '🍽️', '🎬', '✈️', '👟', '🎮', '📖', '🛍️', '🧴',
  '🎵', '🏖️', '🍰', '💆', '🎁', '🌸', '🍵', '🛋️',
]

function AddWishModal({ onAdd, onClose, existingWish }) {
  const [name, setName] = useState(existingWish?.name || '')
  const [emoji, setEmoji] = useState(existingWish?.emoji || '🎁')
  const [cost, setCost] = useState(existingWish?.cost || '')
  const [repeatable, setRepeatable] = useState(existingWish?.repeatable || false)

  function handleSave() {
    if (!name.trim() || !cost || Number(cost) <= 0) return
    onAdd({ name: name.trim(), emoji, cost: Number(cost), repeatable })
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
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          background: 'rgba(240,235,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '24px 20px',
        }}
      >
        {/* 标题 */}
        <div style={{
          fontSize: '16px',
          fontWeight: '500',
          color: 'rgba(40,30,70,0.9)',
          marginBottom: '20px',
        }}>
          {existingWish ? '编辑心愿' : '添加心愿'}
        </div>

        {/* 名字输入 */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            fontSize: '12px',
            color: 'rgba(40,30,70,0.5)',
            marginBottom: '6px',
          }}>
            心愿名称
          </div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="比如：看一场电影、买双新鞋..."
            maxLength={20}
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

        {/* 所需积分 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '12px',
            color: 'rgba(40,30,70,0.5)',
            marginBottom: '6px',
          }}>
            需要多少心愿值
          </div>
          <input
            type="number"
            value={cost}
            onChange={e => setCost(e.target.value)}
            placeholder="比如：50"
            min="1"
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
        {/* 可重复开关 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          padding: '12px 14px',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '12px',
          border: '0.5px solid rgba(180,160,220,0.3)',
        }}>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: 'rgba(40,30,70,0.85)',
            }}>
              可重复兑换
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(40,30,70,0.4)',
              marginTop: '2px',
            }}>
              开启后每次兑换扣分，不进入已实现
            </div>
          </div>
          <div
            onClick={() => setRepeatable(v => !v)}
            style={{
              width: '44px',
              height: '26px',
              borderRadius: '13px',
              background: repeatable
                ? 'rgba(140,110,200,0.7)'
                : 'rgba(180,160,220,0.25)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute',
              top: '3px',
              left: repeatable ? '21px' : '3px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }} />
          </div>
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
            gap: '6px',
          }}>
            {EMOJI_OPTIONS.map(e => (
              <div
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  width: '100%',
                  aspectRatio: '1',
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
            background: (name.trim() && cost && Number(cost) > 0)
              ? 'rgba(140,110,200,0.7)'
              : 'rgba(140,110,200,0.3)',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.95)',
            cursor: (name.trim() && cost) ? 'pointer' : 'default',
          }}
        >
          {existingWish ? '保存修改' : '添加'}
        </div>
      </div>
    </div>
  )
}

export default AddWishModal