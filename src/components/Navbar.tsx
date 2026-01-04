'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, MessageCircle, Home, PlusCircle, Users, Menu, X, Bell, Search, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('plannerum-user')
    if (savedUser) {
      setIsLoggedIn(true)
      setUser(JSON.parse(savedUser))
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogin = () => {
    const demoUser = {
      id: 'demo-user',
      name: 'Демо Користувач',
      email: 'demo@example.com'
    }
    localStorage.setItem('plannerum-user', JSON.stringify(demoUser))
    setIsLoggedIn(true)
    setUser(demoUser)
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('plannerum-user')
    setIsLoggedIn(false)
    setUser(null)
    setIsMenuOpen(false)
  }

  const navItems = [
    { href: '/', label: 'Головна', icon: <Home className="w-5 h-5" /> },
    { href: '/events', label: 'Події', icon: <Calendar className="w-5 h-5" /> },
    { href: '/chat', label: 'Чат', icon: <MessageCircle className="w-5 h-5" /> },
    { href: '/create-event', label: 'Створити', icon: <PlusCircle className="w-5 h-5" /> },
  ]

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                scrolled ? 'bg-blue-600 text-white' : 'bg-white/20 text-white'
              }`}>
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold tracking-tight ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Plannerum
                </span>
                <span className={`text-xs ${
                  scrolled ? 'text-gray-600' : 'text-blue-100'
                }`}>
                  Плануй разом
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    pathname === item.href
                      ? scrolled
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                      : scrolled
                        ? 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth & User */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <button className="p-2 text-gray-600 hover:text-blue-600 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <div className="flex items-center space-x-3 pl-3 border-l border-gray-300">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                      <span className="text-xs text-gray-500">Онлайн</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Вийти
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-6 py-2.5 bg-gradient-to-r from-white to-blue-50 text-blue-600 font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 border border-blue-200"
                >
                  Увійти
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-16">
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative bg-white/95 backdrop-blur-xl w-full max-w-xs ml-auto h-full shadow-2xl border-l border-gray-200/50">
            <div className="p-6">
              {/* User Info */}
              {isLoggedIn && user && (
                <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-500">Онлайн</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
                      pathname === item.href
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <button className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl">
                      <Bell className="w-5 h-5 mr-3" />
                      Сповіщення
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <X className="w-5 h-5 mr-3" />
                      Вийти
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Увійти в акаунт
                  </button>
                )}
              </div>

              {/* App Info */}
              <div className="mt-8 text-center text-xs text-gray-500">
                <p>Plannerum v1.0 • 2024</p>
                <p className="mt-1">Зручне планування подій</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  )
}
