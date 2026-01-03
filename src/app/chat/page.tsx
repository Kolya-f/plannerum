'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Users, Clock, User, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

interface Message {
  id: string
  content: string
  userId: string
  userName: string
  userEmail: string
  eventId: string | null
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  event: {
    title: string
  } | null
}

interface OnlineUser {
  id: string
  userId: string
  userName: string
  userEmail: string
  lastSeen: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkAuth()
    fetchMessages()
    fetchOnlineUsers()
    
    // Polling для новых сообщений
    const interval = setInterval(fetchMessages, 3000)
    const onlineInterval = setInterval(fetchOnlineUsers, 10000)
    
    return () => {
      clearInterval(interval)
      clearInterval(onlineInterval)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('plannerum-user')
      if (savedUser) {
        setIsLoggedIn(true)
        setUser(JSON.parse(savedUser))
      }
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/chat/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setLoading(false)
    }
  }

  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch('/api/chat/online')
      if (response.ok) {
        const data = await response.json()
        setOnlineUsers(data)
      }
    } catch (error) {
      console.error('Error fetching online users:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !isLoggedIn) {
      if (!isLoggedIn) {
        alert('Будь ласка, увійдіть для відправки повідомлень')
        return
      }
      return
    }

    const messageToSend = newMessage
    setNewMessage('')

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: messageToSend,
          userId: user?.id || 'anonymous',
          userName: user?.name || 'Анонім',
          userEmail: user?.email || 'anonymous@example.com'
        })
      })

      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageToSend) // Возвращаем сообщение если ошибка
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLoginRedirect = () => {
    window.location.href = '/auth'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Список онлайн пользователей */}
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Онлайн</h2>
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {onlineUsers.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {user.userName || 'Користувач'}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(new Date(user.lastSeen), 'HH:mm', { locale: uk })}
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
            {onlineUsers.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                Поки що немає онлайн користувачів
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Основной чат */}
      <div className="flex-1 flex flex-col">
        {/* Заголовок */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Глобальний чат</h1>
              <p className="text-gray-600">Обговорюйте події та знаходьте спільний час</p>
            </div>
            <div className="flex items-center gap-4">
              {!isLoggedIn && (
                <button
                  onClick={handleLoginRedirect}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Увійти для чату
                </button>
              )}
              <div className="text-sm text-gray-600">
                {messages.length} повідомлень
              </div>
            </div>
          </div>
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-400">Завантаження повідомлень...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <MessageCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Чат порожній
              </h3>
              <p className="text-gray-600 mb-4">
                Напишіть перше повідомлення!
              </p>
              {!isLoggedIn && (
                <button
                  onClick={handleLoginRedirect}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Увійти та написати
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-medium">
                      {message.userName?.[0]?.toUpperCase() || message.user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-gray-900 mr-2">
                        {message.userName || message.user?.name || 'Анонім'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(message.createdAt), 'dd MMM HH:mm', { locale: uk })}
                      </span>
                      {message.event && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {message.event.title}
                        </span>
                      )}
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <p className="text-gray-800">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Поле ввода */}
        <div className="bg-white border-t border-gray-200 p-6">
          {isLoggedIn ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Напишіть повідомлення..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <p className="text-yellow-800 mb-2">
                🔒 Для участі в чаті потрібно увійти
              </p>
              <button
                onClick={handleLoginRedirect}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Увійти
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
