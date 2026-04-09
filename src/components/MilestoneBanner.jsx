import { useEffect, useRef } from 'react'

function MilestoneBanner({ emoji, text, bonus, onHide }) {
  const bannerRef = useRef(null)

  useEffect(() => {
    // 2.8秒后自动消失
    const timer = setTimeout(() => {
      const el = bannerRef.current
      if (!el) return
      el.style.animation = 'bannerOut 0.35s ease forwards'
      setTimeout(onHide, 350)
    }, 2800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={bannerRef}
      style={{
        position: 'absolute',
        top: '70px',
        left: '16px',
        right: '16px',
        background: 'rgba(255,255,255,0.7)',
        border: '0.5px solid rgba(255,255,255,0.8)',
        borderRadius: '12px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 200,
        backdropFilter: 'blur(12px)',
        animation: 'bannerIn 0.3s ease forwards',
      }}
    >
      <span style={{ fontSize: '18px' }}>{emoji}</span>
      <span style={{
        flex: 1,
        fontSize: '13px',
        fontWeight: '500',
        color: 'rgba(40,30,70,0.85)',
      }}>
        {text}
      </span>
      <span style={{
        fontSize: '12px',
        fontWeight: '500',
        color: 'rgba(80,140,90,0.9)',
        background: 'rgba(180,230,180,0.45)',
        borderRadius: '5px',
        padding: '2px 8px',
      }}>
        +{bonus} 奖励
      </span>
    </div>
  )
}

export default MilestoneBanner