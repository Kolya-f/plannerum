'use client'

import { useState, useEffect } from 'react'

export default function SimpleChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    // Автологин
    const user = {
      id: 'simple-user',
      name: 'Ви',
      email: 'you@example.com'
    }
    localStorage.setItem('plannerum-user', JSON.stringify(user))
    
    // Загрузка сообщений
    fetchMessages()
    
    // Автообновление
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    
    try {
      const user = JSON.parse(localStorage.getItem('plannerum-user') || '{}')
      
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: input,
          userId: user.id,
          userName: user.name,
          userEmail: user.email
        })
      })
      
      setInput('')
      fetchMessages()
    } catch (error) {
      console.error('Error:', error)
      alert('Не вдалося надіслати')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💬 Супер простий чат</h1>
          <p className="text-gray-600">Пишіть та спілкуйтеся з іншими</p>
        </div>
        
        {/* Сообщения */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 h-[400px] overflow-y-auto border border-gray-200">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">Немає повідомлень</p>
              <p className="text-gray-400">Будьте першим!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold">
                        {msg.userName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold">{msg.userName || 'Анонім'}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(msg.createdAt).toLocaleTimeString('uk-UA', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="pl-13 text-gray-800">{msg.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Поле для ввода - САМОЕ ГЛАВНОЕ! */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-400">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✍️ Напишіть повідомлення:</h2>
          
          <div className="mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Введіть ваше повідомлення тут..."
              className="w-full border-2 border-blue-300 rounded-xl px-6 py-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            📤 Надіслати повідомлення
          </button>
          
          <div className="mt-4 text-center text-gray-500 text-sm">
            <p>Натисніть Enter для швидкої відправки</p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600">
          <p>Кількість повідомлень: <span className="font-bold text-blue-600">{messages.length}</span></p>
          <p className="mt-2">Ви увійшли як: <span className="font-bold">Ви</span></p>
        </div>
      </div>
    </div>
  )
}
