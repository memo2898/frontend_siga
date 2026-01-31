import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import './SidebarWrapper.css'
import logo_principal_c from '/logo_combinados.svg'
function SidebarWrapper() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className='cont-logo-principal-c'>
          <img src={logo_principal_c} alt="" className="logo_principal-c" />
        </div>
        <Outlet />
      </main>
    </div>
  )
}

export default SidebarWrapper
