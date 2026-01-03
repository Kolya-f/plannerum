'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Calendar, MessageCircle, ThumbsUp, Settings, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    events: 0,
    votes: 0,
    messages: 0
  })

  useEffect(() => {
    // Load user from localStorage
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('plannerum-user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }

    // Load stats
    const loadStats = async () => {
      try {
        const eventsRes = await fetch('/api/events')
        const events = await eventsRes.json()
        
        const messagesRes = await fetch('/api/chat/messages')
        const messages = await messagesRes.json()
        
        setStats({
          events: events.length,
          votes: events.reduce((acc: number, event: any) => acc + (event.votes?.length || 0), 0),
          messages: messages.length
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    
    loadStats()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('plannerum-user')
    window.location.href = '/'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Завантаження профілю...</div>
          <div className="mt-4">
            <a href="/auth" className="text-blue-600 hover:text-blue-700">
              Увійти
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">
                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <div className="flex items-center text-blue-100">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Вийти
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.events}</div>
                <div className="text-sm text-gray-600">Створених подій</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.votes}</div>
                <div className="text-sm text-gray-600">Голосів</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.messages}</div>
                <div className="text-sm text-gray-600">Повідомлень</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Інформація про користувача</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <div className="text-sm text-gray-600">Ім'я</div>
                <div className="font-medium">{user.name}</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Settings className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <div className="text-sm text-gray-600">ID користувача</div>
                <div className="font-medium text-sm">{user.id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Налаштування</h2>
          <div className="space-y-4">
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Змінити ім'я</div>
              <div className="text-sm text-gray-600">Оновіть ваше відображуване ім'я</div>
            </button>
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Сповіщення</div>
              <div className="text-sm text-gray-600">Налаштуйте сповіщення про події</div>
            </button>
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Конфіденційність</div>
              <div className="text-sm text-gray-600">Керуйте налаштуваннями конфіденційності</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
