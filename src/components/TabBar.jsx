const TABS = [
    {
      id: 'home',
      label: '今天',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="7.5"
            stroke={active ? 'rgba(80,60,120,0.85)' : 'rgba(80,60,120,0.35)'}
            strokeWidth="1.3"/>
          <path d="M8 11.5l2 2 4-4"
            stroke={active ? 'rgba(80,60,120,0.85)' : 'rgba(80,60,120,0.35)'}
            strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'stats',
      label: '数据',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="5" width="16" height="13" rx="2"
            stroke={active ? 'rgba(80,60,120,0.85)' : 'rgba(80,60,120,0.35)'}
            strokeWidth="1.3"/>
          <path d="M7 3v4M15 3v4M3 10h16"
            stroke={active ? 'rgba(80,60,120,0.85)' : 'rgba(80,60,120,0.35)'}
            strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'wish',
      label: '心愿',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 3l2.2 5h5.3l-4.3 3.1 1.6 5L11 13l-4.8 3.1 1.6-5L3.5 8h5.3z"
            stroke={active ? 'rgba(80,60,120,0.85)' : 'rgba(80,60,120,0.35)'}
            strokeWidth="1.3" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'forest',
      label: '森林',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 18c0-4 3-7 7-7s7 3 7 7"
            stroke={active ? 'rgba(80,60,120,0.85)' : 'rgba(80,60,120,0.35)'}
            strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M11 11V6M8 8l3-3 3 3"
            stroke={active ? 'rgba(80,60,120,0.85)' : 'rgba(80,60,120,0.35)'}
            strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]
  
  function TabBar({ activePage, onTabChange }) {
    return (
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.3)',
        borderTop: '0.5px solid rgba(255,255,255,0.4)',
        backdropFilter: 'blur(8px)',
        padding: '10px 0 8px',
      }}>
        {TABS.map((tab) => {
          const active = activePage === tab.id
          return (
            <div
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
              }}
            >
              {tab.icon(active)}
              <span style={{
                fontSize: '9px',
                color: active ? 'rgba(80,60,120,0.85)' : 'rgba(80,60,120,0.35)',
                fontWeight: active ? '500' : '400',
              }}>
                {tab.label}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
  
  export default TabBar