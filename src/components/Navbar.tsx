'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, MessageCircle, User, Home, LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'

// Временная функция, пока не наладим контекст
const useTempAuth = () => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem('plannerum-user')
    return saved ? JSON.parse(saved) : null
  })

  const login = () => {
    const demoUser = {
      id: 'demo-user',
      name: 'Демо Користувач',
      email: 'demo@example.com'
    }
    localStorage.setItem('plannerum-user', JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const logout = () => {
    localStorage.removeItem('plannerum-user')
    setUser(null)
  }

  return { user, login, logout, isLoading: false }
}

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, login, logout } = useTempAuth()

  const navItems = [
    { href: '/', label: 'Головна', icon: <Home className="w-5 h-5" /> },
    { href: '/events', label: 'Події', icon: <Calendar className="w-5 h-5" /> },
    { href: '/chat', label: 'Чат', icon: <MessageCircle className="w-5 h-5" /> },
    { href: '/create-event', label: 'Створити подію', icon: <Calendar className="w-5 h-5" /> },
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Plannerum</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-blue-600 font-medium text-sm">
                      {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{user.name}</div>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  <span>Вийти</span>
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <LogIn className="w-5 h-5 mr-2" />
                <span>Увійти</span>
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-gray-600"></div>
              <div className="w-6 h-0.5 bg-gray-600"></div>
              <div className="w-6 h-0.5 bg-gray-600"></div>
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="flex items-center px-4 py-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">
                          {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-gray-100 rounded-lg"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Вийти</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      login()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center bg-blue-600 text-white px-4 py-3 rounded-lg justify-center w-full"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    <span>Увійти</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
