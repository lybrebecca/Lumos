import { useState } from 'react'
import './App.css'
import TabBar from './components/TabBar'
import HomePage from './pages/HomePage'
import StatsPage from './pages/StatsPage'
import WishPage from './pages/WishPage'
import ForestPage from './pages/ForestPage'

function App() {
  const [activePage, setActivePage] = useState('home')

  function renderPage() {
    switch (activePage) {
      case 'home':   return <HomePage />
      case 'stats':  return <StatsPage />
      case 'wish':   return <WishPage />
      case 'forest': return <ForestPage />
      default:       return <HomePage />
    }
  }

  return (
    <div className="app-container" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}>
      {/* 页面内容，占满剩余空间，可滚动 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {renderPage()}
      </div>

      {/* TabBar 固定在底部 */}
      <div style={{ flexShrink: 0 }}>
        <TabBar
          activePage={activePage}
          onTabChange={setActivePage}
        />
      </div>
    </div>
  )
}

export default App