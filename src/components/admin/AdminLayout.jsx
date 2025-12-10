// components/layout/AdminLayout.js
'use client'

import Header from '@/components/admin/Navbar'
import Sidebar from '@/components/admin/Sidebar'
import { useState } from 'react'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

     
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
