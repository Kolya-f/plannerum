'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Users, MessageCircle, BarChart3, Plus, Clock } from 'lucide-react'

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    events: 0,
    participants: 0,
    messages: 0,
    votes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const eventsRes = await fetch('/api/events')
        const events = await eventsRes.json()
        
        const messagesRes = await fetch('/api/chat/messages')
        const messages = await messagesRes.json()
        
        setStats({
          events: events.length,
          participants: events.reduce((acc: number, event: any) => acc + (event.votes?.length || 0), 0),
          messages: messages.length,
          votes: events.reduce((acc: number, event: any) => acc + (event.votes?.length || 0), 0)
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Завантаження статистики...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель управління</h1>
          <p className="text-gray-600">Керуйте подіями та відстежуйте активність</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.events}</div>
                <div className="text-sm text-gray-600">Подій</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.participants}</div>
                <div className="text-sm text-gray-600">Учасників</div>
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

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.votes}</div>
                <div className="text-sm text-gray-600">Голосів</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Швидкі дії</h2>
            <div className="space-y-4">
              <Link
                href="/create-event"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Створити подію</div>
                    <div className="text-sm text-gray-600">Заплануйте нову зустріч</div>
                  </div>
                </div>
              </Link>

              <Link
                href="/events"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Мої події</div>
                    <div className="text-sm text-gray-600">Переглянути всі події</div>
                  </div>
                </div>
              </Link>

              <Link
                href="/chat"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Глобальний чат</div>
                    <div className="text-sm text-gray-600">Спілкування з учасниками</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Останні активності</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-700">Нещодавно створено подію</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">Планування наступного тижня</div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-700">Нові учасники</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">5 людей приєдналося до події</div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-700">Активне голосування</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">Голосування за дати триває</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
