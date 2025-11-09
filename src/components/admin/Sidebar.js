// components/layout/Sidebar.js
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaProductHunt, FaUser } from 'react-icons/fa'
import { MdBorderAll, MdBrandingWatermark, MdCategory, MdDashboard, MdDeliveryDining } from 'react-icons/md'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: <MdDashboard></MdDashboard> },
  { name: 'Categories', href: '/categories', icon: <MdCategory></MdCategory> },
  { name: 'Brands', href: '/brands', icon: <MdBrandingWatermark></MdBrandingWatermark> },
  { name: 'Users', href: '/users', icon: <FaUser></FaUser> },
  { name: 'Products', href: '/products', icon: <FaProductHunt></FaProductHunt> },
  { name: 'Delivery Cost', href: '/delivery_cost', icon: <MdDeliveryDining></MdDeliveryDining> },
  { name: 'Orders', href: '/orders', icon: <MdBorderAll></MdBorderAll> },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
]

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-blue-500"
          >
            ✕
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => onClose()}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">AD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}