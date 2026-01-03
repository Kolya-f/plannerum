'use client'

import { useState, useEffect } from 'react'

export default function WorkingChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')

  // Автоматически логиним
  useEffect(() => {
    const demoUser = {
      id: 'user-' + Date.now(),
      name: 'Демо Користувач',
      email: 'demo@example.com'
    }
    localStorage.setItem('plannerum-user', JSON.stringify(demoUser))
    
    loadMessages()
    
    // Автообновление
    const interval = setInterval(loadMessages, 2000)
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
      loadMessages()
    } catch (error) {
      console.error('Error:', error)
      alert('Помилка відправки')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">💬 РОБОЧИЙ ЧАТ</h1>
        <p className="text-gray-600 mb-4">Тут є поле для вводу повідомлень!</p>
        
        {/* Список сообщений */}
        <div className="bg-white rounded-xl shadow p-4 mb-4 h-96 overflow-y-auto border">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-2">💬</div>
              <div>Ще немає повідомлень. Напишіть перше!</div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="mb-3 p-3 bg-gray-50 rounded">
                <div className="font-medium">{msg.userName}:</div>
                <div>{msg.content}</div>
                <div className="text-sm text-gray-500">
                  {new Date(msg.createdAt).toLocaleTimeString('uk-UA')}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* ПОЛЕ ДЛЯ ВВОДА - ОБЯЗАТЕЛЬНО ВИДИМОЕ */}
        <div className="bg-white rounded-xl shadow p-4 border-2 border-blue-500">
          <div className="font-medium mb-2 text-blue-600">Ваше повідомлення:</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Напишіть тут..."
              className="flex-1 border-2 border-blue-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Надіслати
            </button>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Натисніть Enter для швидкої відправки
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-green-100 rounded">
          <div className="font-medium">✅ Статус:</div>
          <div>• Поле для вводу: <span className="font-bold text-green-600">ПРАЦЮЄ</span></div>
          <div>• Повідомлень: <span className="font-bold">{messages.length}</span></div>
        </div>
      </div>
    </div>
  )
}
