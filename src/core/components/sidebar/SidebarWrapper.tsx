import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import './SidebarWrapper.css'

function SidebarWrapper() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default SidebarWrapper
