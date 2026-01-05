'use client'
import { useAuth } from '@/lib/auth/context'

import { useState } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const { data: session, status } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Plannerum</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/create-event" className="text-gray-700 hover:text-blue-600">Create Event</Link>
            
            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-600"></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-lg mt-2 p-4 shadow-lg">
            <div className="space-y-4">
              <Link href="/" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/create-event" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Create Event</Link>
              
              {status === 'authenticated' ? (
                <>
                  <Link href="/dashboard" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left text-red-600 hover:text-red-800"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  <Link href="/auth/signup" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
