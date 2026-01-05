'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Calendar, MessageCircle, Home, PlusCircle, Users, Menu, X, Bell, Search, Sparkles, LogIn, LogOut, User } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogin = () => {
    // Перенаправляємо на сторінку входу
    window.location.href = '/auth/signin'
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
    setIsMenuOpen(false)
  }

  const navItems = [
    { href: '/', label: 'Головна', icon: <Home className="w-5 h-5" /> },
    { href: '/events', label: 'Події', icon: <Calendar className="w-5 h-5" /> },
    { href: '/chat', label: 'Чат', icon: <MessageCircle className="w-5 h-5" /> },
    { href: '/create-event', label: 'Створити', icon: <PlusCircle className="w-5 h-5" /> },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-white/90 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Plannerum
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Плануй разом</p>
              </div>
            </Link>
          </div>

          {/* Десктопне меню */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-100'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Користувач та кнопки */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user?.name?.[0]?.toUpperCase() || user?.email[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <div className="font-medium text-gray-900">
                      {user?.name || user?.email?.split('@')[0] || 'Користувач'}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline">Вийти</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
              >
                <LogIn className="w-5 h-5" />
                <span>Увійти</span>
              </button>
            )}
          </div>

          {/* Мобільне меню кнопка */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Мобільне меню */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {isLoading ? (
                <div className="px-4 py-3 flex justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : isAuthenticated ? (
                <>
                  <div className="px-4 py-3 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.[0]?.toUpperCase() || user?.email[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user?.name || user?.email?.split('@')[0] || 'Користувач'}
                      </div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Вийти</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Увійти</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
