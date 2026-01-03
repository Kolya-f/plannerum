'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Message {
  text: string
  user_name: string
  created_at: string
}

export default function ChatPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    fetchMessages()
    // Оновлюємо повідомлення кожні 5 секунд
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/chat')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
        setError('')
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setIsConnected(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !session?.user?.email) {
      setError('Будь ласка, увійдіть в систему або введіть повідомлення')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newMessage
        })
      })

      const data = await response.json()

      if (response.ok) {
        setNewMessage('')
        fetchMessages() // Оновити повідомлення
      } else {
        setError(data.error || 'Помилка при відправці повідомлення')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Помилка при відправці повідомлення')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">💬 Global Chat</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Plannerum
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Статус бар */}
        <div className={`px-6 py-3 ${isConnected ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {session ? `Signed in as ${session.user?.name || session.user?.email}` : 'Guest'}
            </div>
          </div>
        </div>

        {/* Чат контейнер */}
        <div className="p-6">
          {!session ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center mb-6">
              <p className="text-yellow-700 mb-4">
                ⚠️ Please sign in to participate in chat
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          ) : null}

          {/* Повідомлення */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💭</div>
                <p className="text-gray-500 text-lg">No messages yet. Be the first to say hi! 👋</p>
                <p className="text-gray-400 text-sm mt-2">Messages will appear here...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${msg.user_name === (session?.user?.name || session?.user?.email) ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-gray-100'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-gray-800">
                          {msg.user_name}
                        </span>
                        {msg.user_name === (session?.user?.name || session?.user?.email) && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{msg.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Форма відправки */}
          {session ? (
            <>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !newMessage.trim()}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>

              {error && (
                <div className="mt-3 text-red-600 text-sm bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500 flex justify-between">
                <div>
                  Press <kbd className="px-2 py-1 bg-gray-100 rounded border">Enter</kbd> to send
                </div>
                <div>
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 text-sm">
              <p>💡 Sign in to send messages and use your real name!</p>
            </div>
          )}
        </div>
      </div>

      {/* Додаткова інформація */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">💬 Chat Rules</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Be respectful to others</li>
            <li>• No spam or advertising</li>
            <li>• Keep conversations friendly</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">🔄 Real-time Updates</h3>
          <p className="text-sm text-gray-600">
            Messages update automatically every 5 seconds. 
            No need to refresh the page!
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">👥 Community</h3>
          <p className="text-sm text-gray-600">
            Connect with other event organizers, 
            share ideas and get feedback!
          </p>
        </div>
      </div>
    </div>
  )
}
