'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load user from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('plannerum-user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          console.error('Failed to parse user from localStorage:', e)
        }
      }
    }
  }, [])

  const login = async (email: string, name?: string) => {
    setIsLoading(true)
    try {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name || 'Демо Користувач',
        email: email || 'demo@example.com'
      }
      setUser(newUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('plannerum-user', JSON.stringify(newUser))
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('plannerum-user')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
