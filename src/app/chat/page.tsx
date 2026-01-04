'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Send, Users, MessageSquare, Clock, User, Paperclip, Smile, MoreVertical, Zap, TrendingUp, Calendar, Star, RefreshCw } from 'lucide-react'

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [activeTab, setActiveTab] = useState('chat')
  const [userTyping, setUserTyping] = useState(false)
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalUsers: 0,
    activeToday: 0
  })
  const [apiError, setApiError] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Автоматический логин
    const savedUser = localStorage.getItem('plannerum-user')
    if (!savedUser) {
      const demoUser = {
        id: 'main-chat-user',
        name: 'Учасник чату',
        email: 'chat@example.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      }
      localStorage.setItem('plannerum-user', JSON.stringify(demoUser))
    }
    
    // Загрузка сообщений и статистики
    loadMessages()
    loadStats()
    
    // Автообновление каждые 5 секунд (для сообщений)
    const interval = setInterval(() => {
      loadMessages()
      loadStats()
    }, 5000)
    
    // Симуляция набора текста другими пользователями
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7 && messages.length > 0 && !apiError) {
        setUserTyping(true)
        setTimeout(() => setUserTyping(false), 2000)
      }
    }, 8000)
    
    return () => {
      clearInterval(interval)
      clearInterval(typingInterval)
    }
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/chat/stats')
      if (res.ok) {
        const data = await res.json()
        setStats({
          totalMessages: data.totalMessages || 0,
          totalUsers: data.totalUsers || 0,
          activeToday: data.activeToday || 0
        })
        setOnlineUsers(data.onlineUsers || 1)
        setApiError(false)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
      setApiError(true)
      // Демо данные при ошибке
      setOnlineUsers(Math.floor(Math.random() * 10) + 3)
      setStats({
        totalMessages: 156,
        totalUsers: 42,
        activeToday: 12
      })
    }
  }

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/chat/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
        setApiError(false)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      setApiError(true)
      // Демо сообщения если API не работает
      if (messages.length === 0) {
        const demoMessages = [
          {
            id: 1,
            content: 'Привіт всім! Хто планує події на ці вихідні? 🎉',
            userName: 'Олександр',
            userEmail: 'alex@example.com',
            createdAt: new Date(Date.now() - 3600000),
            isOnline: true
          },
          {
            id: 2,
            content: 'Ми організовуємо пікнік у парку в неділю о 14:00. Приєднуйтесь! 🌳',
            userName: 'Марія',
            userEmail: 'maria@example.com',
            createdAt: new Date(Date.now() - 1800000),
            isOnline: true
          },
          {
            id: 3,
            content: 'Чудова ідея! Я принесу напої та закуски. 🍹',
            userName: 'Андрій',
            userEmail: 'andrii@example.com',
            createdAt: new Date(Date.now() - 600000),
            isOnline: false
          }
        ]
        setMessages(demoMessages)
      }
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
          userEmail: user.email,
          userAvatar: user.avatar
        })
      })
      
      if (response.ok) {
        setInput('')
        // Обновляем сообщения и статистику после отправки
        loadMessages()
        loadStats()
      }
    } catch (error) {
      console.error('Error:', error)
      // Если API не работает, добавляем сообщение локально
      const user = JSON.parse(localStorage.getItem('plannerum-user') || '{}')
      const newMessage = {
        id: Date.now(),
        content: input,
        userName: user.name || 'Ви',
        userEmail: user.email || 'chat@example.com',
        createdAt: new Date(),
        isOnline: true
      }
      setMessages(prev => [...prev, newMessage])
      setInput('')
      setOnlineUsers(prev => Math.max(prev, 1))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      sendMessage()
    }
  }

  const refreshData = () => {
    setLoading(true)
    loadMessages()
    loadStats()
  }

  // ⚡ ОНОВЛЕННЯ: Змінено інтервал з 30000 на 10000 мс (10 секунд)
  const updateOnlineStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('plannerum-user') || '{}')
      if (user.id) {
        await fetch('/api/chat/online', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            userName: user.name,
            userEmail: user.email
          })
        })
      }
    } catch (error) {
      console.error('Error updating online status:', error)
    }
  }

  // ⚡ ОНОВЛЕННЯ: Викликаємо кожні 10 секунд замість 30
  useEffect(() => {
    updateOnlineStatus()
    const onlineInterval = setInterval(updateOnlineStatus, 10000) // Кожні 10 секунд
    return () => clearInterval(onlineInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Plannerum Community Chat
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Спілкуйтесь, плануйте та надихайте один одного у реальному часі
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Левая панель */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Статистика
                </h2>
                <button 
                  onClick={refreshData}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Оновити дані"
                >
                  <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-gray-700">Всього користувачів</span>
                  </div>
                  <span className="font-bold text-2xl text-blue-600">{stats.totalUsers}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-gray-700">Онлайн зараз</span>
                  </div>
                  <span className="font-bold text-2xl text-green-600">{onlineUsers}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="text-gray-700">Всього повідомлень</span>
                  </div>
                  <span className="font-bold text-2xl text-purple-600">{stats.totalMessages}</span>
                </div>
              </div>
              
              {apiError && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Демо-режим: використовуються демо-дані
                  </p>
                </div>
              )}
            </div>

            {/* Быстрые действия */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-500" />
                Швидкі дії
              </h2>
              
              <div className="space-y-3">
                <Link href="/chat/simple" className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Простий чат</div>
                    <div className="text-sm text-gray-600">Базова версія</div>
                  </div>
                </Link>
                
                <Link href="/chat/working" className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Робочий чат</div>
                    <div className="text-sm text-gray-600">Для подій</div>
                  </div>
                </Link>
                
                <Link href="/events" className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Події</div>
                    <div className="text-sm text-gray-600">Планування</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Чат */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Заголовок чата с табами */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold">Глобальний чат</h2>
                    <p className="text-blue-100">Обговорення, планування, спілкування</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'chat' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    >
                      💬 Чат ({messages.length})
                    </button>
                    <button 
                      onClick={() => setActiveTab('events')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'events' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    >
                      📅 Події
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm">Онлайн: {onlineUsers} користувачів</span>
                    </div>
                    {userTyping && (
                      <div className="text-sm text-blue-200 animate-pulse">
                        ✍️ Хтось пише повідомлення...
                      </div>
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="text-blue-100">Останнє оновлення: </span>
                    <span>{new Date().toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>

              {/* Область сообщений */}
              <div className="h-[550px] overflow-y-auto p-6 bg-gradient-to-b from-white to-blue-50/30">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="text-gray-600 font-medium">Завантаження повідомлень...</div>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Чат порожній</h3>
                    <p className="text-gray-600 mb-6">Напишіть перше повідомлення!</p>
                    <button
                      onClick={() => setInput('Привіт всім! 🎉')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Привітатися зі спільнотою
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.userEmail === 'chat@example.com' ? 'flex-row-reverse' : 'items-start'}`}
                      >
                        <div className={`flex ${msg.userEmail === 'chat@example.com' ? 'flex-row-reverse ml-4' : 'mr-4'}`}>
                          <div className="relative">
                            <div 
                              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg"
                              style={{
                                backgroundImage: msg.userAvatar ? `url(${msg.userAvatar})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            >
                              {!msg.userAvatar && (msg.userName?.[0]?.toUpperCase() || 'U')}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                        </div>
                        
                        <div className={`flex-1 ${msg.userEmail === 'chat@example.com' ? 'text-right' : ''}`}>
                          <div className={`flex ${msg.userEmail === 'chat@example.com' ? 'justify-end' : 'items-center'} mb-1`}>
                            <span className="font-bold text-gray-900 mr-2">
                              {msg.userName || 'Анонім'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(msg.createdAt).toLocaleTimeString('uk-UA', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className={`inline-block max-w-[80%] ${msg.userEmail === 'chat@example.com' 
                            ? 'float-right' : ''
                          }`}>
                            <div className={`rounded-2xl px-4 py-3 ${msg.userEmail === 'chat@example.com' 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' 
                              : 'bg-white shadow border border-gray-100 rounded-bl-none'
                            }`}>
                              <p className="break-words">{msg.content}</p>
                            </div>
                            <div className={`text-xs text-gray-400 mt-1 ${msg.userEmail === 'chat@example.com' ? 'text-right' : ''}`}>
                              {new Date(msg.createdAt).toLocaleDateString('uk-UA', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Поле ввода сообщения */}
              <div className="border-t border-gray-200 p-6 bg-white">
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    <label className="text-gray-700 font-medium">
                      Ваше повідомлення до спільноти:
                    </label>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value)
                        updateOnlineStatus() // Оновлюємо статус при наборі тексту
                      }}
                      onKeyDown={handleKeyPress}
                      placeholder="Напишіть ваше повідомлення тут... Використовуйте Ctrl+Enter для відправки"
                      className="w-full border-2 border-gray-300 rounded-2xl px-6 py-4 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none pr-24"
                      rows={3}
                      maxLength={1000}
                    />
                    
                    <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-gray-500">
                      {input.length}/1000 символів
                    </div>
                    <div className="text-sm text-gray-500">
                      Ctrl+Enter — швидка відправка
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Ви онлайн • {onlineUsers} користувачів активні
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setInput('')}
                      className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      Очистити
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Надіслати
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Информация о системе */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-center">
              <div className="text-sm text-gray-600">
                💬 Загальний чат Plannerum • {onlineUsers} онлайн • {stats.totalMessages} повідомлень • 
                <button 
                  onClick={refreshData} 
                  className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Оновити
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
