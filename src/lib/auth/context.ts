'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, User } from './auth'

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
    // Загружаем пользователя при монтировании
    const savedUser = authService.getUser()
    setUser(savedUser)
  }, [])

  const login = async (email: string, name?: string) => {
    setIsLoading(true)
    try {
      const user = authService.login(email, name)
      setUser(user)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      authService.logout()
      setUser(null)
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
