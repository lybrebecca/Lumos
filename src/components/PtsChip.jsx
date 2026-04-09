import { useEffect, useRef } from 'react'

function PtsChip({ remain, total }) {
  const valRef = useRef(null)

  // 每次 remain 变化，触发数字弹跳动画
  useEffect(() => {
    const el = valRef.current
    if (!el) return
    el.style.animation = 'none'
    void el.offsetWidth        // 强制浏览器重置动画
    el.style.animation = 'ptsBump 0.35s ease'
  }, [remain])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(255,255,255,0.45)',
      border: '0.5px solid rgba(255,255,255,0.6)',
      borderRadius: '20px',
      padding: '6px 12px',
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{ fontSize: '14px' }}>♡</span>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span
            ref={valRef}
            style={{
              fontSize: '15px',
              fontWeight: '500',
              color: 'rgba(60,40,90,0.9)',
              display: 'inline-block',
            }}
          >
            {remain}
          </span>
          <span style={{ fontSize: '11px', color: 'rgba(60,40,90,0.4)' }}>
            / 总计 {total}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PtsChip