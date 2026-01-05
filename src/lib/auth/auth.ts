export interface User {
  id: string
  name: string
  email: string
}

export const authService = {
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem('plannerum-user')
    return saved ? JSON.parse(saved) : null
  },

  login: (email: string, name?: string): User => {
    const user: User = {
      id: `user-${Date.now()}`,
      name: name || 'Демо Користувач',
      email: email || 'demo@example.com'
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('plannerum-user', JSON.stringify(user))
    }
    
    return user
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('plannerum-user')
    }
  }
}
