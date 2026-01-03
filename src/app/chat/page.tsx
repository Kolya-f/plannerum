'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Автоматический логин
    const savedUser = localStorage.getItem('plannerum-user')
    if (!savedUser) {
      const demoUser = {
        id: 'main-chat-user',
        name: 'Учасник чату',
        email: 'chat@example.com'
      }
      localStorage.setItem('plannerum-user', JSON.stringify(demoUser))
    }
    
    // Загрузка сообщений
    loadMessages()
    
    // Автообновление
    const interval = setInterval(loadMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/chat/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    
    try {
      const user = JSON.parse(localStorage.getItem('plannerum-user') || '{}')
      
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: input,
          userId: user.id,
          userName: user.name,
          userEmail: user.email
        })
      })
      
      if (response.ok) {
        setInput('')
        loadMessages()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Не вдалося надіслати повідомлення')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💬 Глобальний чат Plannerum</h1>
          <p className="text-gray-600">Спілкуйтесь з іншими користувачами</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Левая колонка - информация */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">📊 Статистика</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Повідомлень:</span>
                  <span className="font-bold">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Користувач онлайн:</span>
                  <span className="font-bold text-green-600">Ви</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">🔗 Швидкі посилання</h2>
              <div className="space-y-2">
                <Link href="/chat/simple" className="block text-blue-600 hover:text-blue-800">
                  🧪 Проста версія чату
                </Link>
                <Link href="/chat/working" className="block text-blue-600 hover:text-blue-800">
                  ✅ Робочий чат
                </Link>
                <Link href="/events" className="block text-blue-600 hover:text-blue-800">
                  📅 Події
                </Link>
              </div>
            </div>
          </div>

          {/* Правая колонка - чат */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Заголовок чата */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Чат кімната</h2>
                    <p className="text-blue-100">Обговорення подій та планування</p>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-lg">
                    <span className="font-medium">{messages.length} повідомлень</span>
                  </div>
                </div>
              </div>

              {/* Список сообщений */}
              <div className="h-[500px] overflow-y-auto p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="text-gray-600">Завантаження повідомлень...</div>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Чат порожній</h3>
                    <p className="text-gray-600 mb-6">Напишіть перше повідомлення!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-start">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-blue-600 font-bold text-lg">
                            {msg.userName?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="font-bold text-gray-900 mr-2">
                              {msg.userName || 'Анонім'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(msg.createdAt).toLocaleTimeString('uk-UA')}
                            </span>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-gray-800">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ПОЛЕ ДЛЯ ВВОДА СООБЩЕНИЙ - ОБЯЗАТЕЛЬНО ВИДИМОЕ! */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    ✍️ Ваше повідомлення:
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Напишіть ваше повідомлення тут..."
                    className="w-full border-2 border-blue-300 rounded-xl px-6 py-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {input.length}/1000 символів
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    📤 Надіслати
                  </button>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Натисніть Ctrl+Enter для відправки</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
