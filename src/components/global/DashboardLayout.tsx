import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

type DashboardLayoutProps = {
  pageTitle: string
  children: ReactNode
}

export default function DashboardLayout({ pageTitle, children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-full items-start bg-[#fbfbfb]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Topbar pageTitle={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
