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
    <div className="app-container">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderPage()}
      </div>
      <TabBar
        activePage={activePage}
        onTabChange={setActivePage}
      />
    </div>
  )
}

export default App