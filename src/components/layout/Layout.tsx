
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 px-4 md:px-6 py-4">
          <Outlet />
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}

export default Layout
