import { useState } from 'react'
import { loadWishes, saveWishes, loadPts, savePts } from '../utils/storage'
import AddWishModal from '../components/AddWishModal'

const DEFAULT_WISH = {
  id: 'default-1',
  name: '奖励一顿大餐',
  emoji: '🍽️',
  cost: 30,
  isDefault: true,
}

function WishPage() {
  const [wishes, setWishes] = useState(() => {
    const saved = loadWishes()
    if (saved) return saved
    return [DEFAULT_WISH]
  })

  const [pts, setPts] = useState(() => loadPts())
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingWish, setEditingWish] = useState(null)
  const [confirmRedeem, setConfirmRedeem] = useState(null)

  function saveAll(newWishes, newPts) {
    setWishes(newWishes)
    saveWishes(newWishes)
    if (newPts !== undefined) {
      setPts(newPts)
      savePts(newPts)
    }
  }

  function handleAdd({ name, emoji, cost }) {
    const newWish = {
      id: Date.now(),
      name,
      emoji,
      cost,
      isDefault: false,
    }
    saveAll([...wishes, newWish])
  }

  function handleEdit({ name, emoji, cost }) {
    const newWishes = wishes.map(w =>
      w.id === editingWish.id ? { ...w, name, emoji, cost } : w
    )
    saveAll(newWishes)
    setEditingWish(null)
  }

  function handleDelete(id) {
    saveAll(wishes.filter(w => w.id !== id))
  }

  function handleRedeem(wish) {
    if (pts.remain < wish.cost) return
    const newPts = {
      remain: pts.remain - wish.cost,
      total: pts.total,
    }
    const doneWish = {
      ...wish,
      isDone: true,
      doneAt: new Date().toLocaleDateString('zh-CN'),
    }
    const newWishes = [
      ...wishes.filter(w => w.id !== wish.id),
      doneWish,
    ]
    saveAll(newWishes, newPts)
    setConfirmRedeem(null)
  }

  const activeWishes = wishes.filter(w => !w.isDone)
  const doneWishes = wishes.filter(w => w.isDone)

  return (
    <div style={{ padding: '20px 16px 16px', position: 'relative' }}>

      <div style={{
        fontSize: '18px',
        fontWeight: '500',
        color: 'rgba(40,30,70,0.9)',
        marginBottom: '4px',
      }}>
        心愿
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '6px',
        marginBottom: '16px',
      }}>
        <span style={{
          fontSize: '26px',
          fontWeight: '500',
          color: 'rgba(40,30,70,0.9)',
        }}>
          {pts.remain}
        </span>
        <span style={{ fontSize: '12px', color: 'rgba(40,30,70,0.4)' }}>
          / 总计 {pts.total} pts
        </span>
        <span style={{
          fontSize: '12px',
          color: 'rgba(100,80,140,0.5)',
          marginLeft: 'auto',
        }}>
          ♡ 心愿值
        </span>
      </div>

      {activeWishes.map(wish => {
        const progress = Math.min(pts.remain / wish.cost, 1)
        const canRedeem = pts.remain >= wish.cost
        const isConfirming = confirmRedeem === wish.id

        return (
          <div
            key={wish.id}
            style={{
              background: 'rgba(255,255,255,0.35)',
              border: '0.5px solid rgba(255,255,255,0.55)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '12px 14px',
              marginBottom: '9px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}>
                {wish.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'rgba(40,30,70,0.9)',
                }}>
                  {wish.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(40,30,70,0.4)',
                  marginTop: '1px',
                }}>
                  需要 {wish.cost} pts
                </div>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <div
                  onClick={() => setEditingWish(wish)}
                  style={{
                    fontSize: '11px',
                    color: 'rgba(100,80,140,0.6)',
                    background: 'rgba(160,130,200,0.15)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                  }}
                >
                  编辑
                </div>
                {!wish.isDefault && (
                  <div
                    onClick={() => handleDelete(wish.id)}
                    style={{
                      fontSize: '11px',
                      color: 'rgba(180,60,60,0.6)',
                      background: 'rgba(220,80,80,0.1)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    删除
                  </div>
                )}
              </div>
            </div>

            <div style={{
              height: '5px',
              borderRadius: '3px',
              background: 'rgba(160,130,200,0.2)',
              marginBottom: '7px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: '3px',
                background: canRedeem
                  ? 'rgba(100,180,120,0.7)'
                  : 'rgba(140,110,200,0.5)',
                width: `${Math.round(progress * 100)}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontSize: '11px',
                color: canRedeem
                  ? 'rgba(80,140,90,0.8)'
                  : 'rgba(40,30,70,0.4)',
              }}>
                {canRedeem
                  ? '已达成！可以兑换了'
                  : `${pts.remain} / ${wish.cost} pts · 还差 ${wish.cost - pts.remain} 次`}
              </span>
              {canRedeem && (
                <div
                  onClick={() => isConfirming
                    ? handleRedeem(wish)
                    : setConfirmRedeem(wish.id)
                  }
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isConfirming
                      ? 'rgba(140,110,200,0.75)'
                      : 'rgba(140,110,200,0.45)',
                    color: 'rgba(255,255,255,0.95)',
                  }}
                >
                  {isConfirming ? '确认兑换' : '兑换'}
                </div>
              )}
            </div>
          </div>
        )
      })}

      <button
        onClick={() => setShowAddModal(true)}
        style={{
          width: '100%',
          padding: '11px',
          borderRadius: '13px',
          border: '0.5px dashed rgba(160,130,200,0.4)',
          background: 'rgba(255,255,255,0.2)',
          color: 'rgba(100,80,140,0.5)',
          fontSize: '13px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: '16px',
        }}
      >
        + 添加心愿
      </button>

      {doneWishes.length > 0 && (
        <div style={{
          borderTop: '0.5px solid rgba(255,255,255,0.3)',
          paddingTop: '14px',
        }}>
          <div style={{
            fontSize: '12px',
            color: 'rgba(40,30,70,0.35)',
            marginBottom: '8px',
          }}>
            已实现
          </div>
          {doneWishes.map(wish => (
            <div
              key={wish.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 0',
                borderBottom: '0.5px solid rgba(255,255,255,0.2)',
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(100,180,120,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'rgba(20,80,30,0.8)',
                flexShrink: 0,
              }}>
                ✓
              </div>
              <span style={{
                fontSize: '12px',
                color: 'rgba(40,30,70,0.45)',
                flex: 1,
              }}>
                {wish.emoji} {wish.name}
              </span>
              <span style={{
                fontSize: '10px',
                color: 'rgba(40,30,70,0.3)',
              }}>
                {wish.doneAt}
              </span>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddWishModal
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingWish && (
        <AddWishModal
          existingWish={editingWish}
          onAdd={handleEdit}
          onClose={() => setEditingWish(null)}
        />
      )}
    </div>
  )
}

export default WishPage