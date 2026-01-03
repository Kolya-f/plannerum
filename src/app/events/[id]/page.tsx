'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, MapPin, Users, User, Clock, MessageCircle, ThumbsUp, ThumbsDown, Meh } from 'lucide-react'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import VoteButtons from '@/components/VoteButtons'

interface EventType {
  id: string
  title: string
  description: string
  location: string
  category: string
  maxParticipants: number | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  userName: string
  userEmail: string
  user: {
    name: string | null
    email: string
  }
  dateOptions: {
    id: string
    date: Date
    votes: {
      voteType: string
      user: {
        name: string | null
      }
    }[]
  }[]
  votes: {
    id: string
    voteType: string
    user: {
      name: string | null
    }
  }[]
  chatMessages: {
    id: string
    content: string
    createdAt: Date
    user: {
      name: string | null
    }
  }[]
}

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<EventType | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchEvent()
    checkAuth()
  }, [params.id])

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('plannerum-user')
      setIsLoggedIn(!!savedUser)
      setUser(savedUser ? JSON.parse(savedUser) : null)
    }
  }

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (dateOptionId: string, voteType: string) => {
    if (!isLoggedIn) {
      alert('Будь ласка, увійдіть для голосування')
      return
    }

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'demo-user'
        },
        body: JSON.stringify({
          eventId: params.id,
          dateOptionId,
          voteType
        })
      })

      if (response.ok) {
        fetchEvent()
      } else {
        console.error('Failed to vote')
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const getVoteStats = (dateOption: EventType['dateOptions'][0]) => {
    const yes = dateOption.votes.filter(v => v.voteType === 'yes').length
    const no = dateOption.votes.filter(v => v.voteType === 'no').length
    const maybe = dateOption.votes.filter(v => v.voteType === 'maybe').length
    return { yes, no, maybe, total: yes + no + maybe }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Завантаження події...</div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">Подію не знайдено</div>
          <div className="text-gray-600">Ця подія могла бути видалена або її не існує</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20`}>
                  {event.category}
                </span>
                {event.isPublic ? (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Публічна</span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">Приватна</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-blue-100 text-lg">{event.description}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-sm text-blue-100 mb-2">Створив</div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-medium">
                    {event.user.name?.[0]?.toUpperCase() || event.user.email[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{event.user.name || 'Анонім'}</div>
                  <div className="text-sm text-blue-100">
                    {format(new Date(event.createdAt), 'dd MMMM yyyy', { locale: uk })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Деталі
          </button>
          <button
            onClick={() => setActiveTab('voting')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'voting'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Голосування
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Чат ({event.chatMessages.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'details' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Опис події</h3>
                  <p className="text-gray-700 whitespace-pre-line">{event.description || 'Опис відсутній'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.location && (
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Місце проведення</div>
                        <div className="text-gray-600">{event.location}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Учасники</div>
                      <div className="text-gray-600">
                        {event.maxParticipants 
                          ? `До ${event.maxParticipants} осіб` 
                          : 'Без обмежень'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Статистика</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">
                        {event.dateOptions.length}
                      </div>
                      <div className="text-sm text-gray-600">Варіантів дат</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        {event.votes.length}
                      </div>
                      <div className="text-sm text-gray-600">Голосів</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">
                        {event.chatMessages.length}
                      </div>
                      <div className="text-sm text-gray-600">Повідомлень</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voting' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Голосування за дати
                  </h3>
                  
                  <div className="space-y-4">
                    {event.dateOptions.map((dateOption) => {
                      const stats = getVoteStats(dateOption)
                      const bestDate = event.dateOptions.reduce((best, current) => {
                        const currentStats = getVoteStats(current)
                        return currentStats.yes > best.yes ? currentStats : best
                      }, { yes: 0, no: 0, maybe: 0, total: 0 })
                      
                      const isBestDate = stats.yes === bestDate.yes && stats.yes > 0
                      
                      return (
                        <div key={dateOption.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div className="font-medium text-gray-900">
                                  {format(new Date(dateOption.date), 'EEEE, d MMMM yyyy, HH:mm', { locale: uk })}
                                </div>
                                {isBestDate && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    🏆 Найкраща дата
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="w-4 h-4 text-green-500" />
                                  <span>{stats.yes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ThumbsDown className="w-4 h-4 text-red-500" />
                                  <span>{stats.no}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Meh className="w-4 h-4 text-yellow-500" />
                                  <span>{stats.maybe}</span>
                                </div>
                                <div>Всього: {stats.total}</div>
                              </div>
                            </div>
                            
                            <VoteButtons
                              eventId={event.id}
                              dateOptionId={dateOption.id}
                              onVote={(voteType) => handleVote(dateOption.id, voteType)}
                              disabled={!isLoggedIn}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Чат події</h3>
                
                {event.chatMessages.length > 0 ? (
                  <div className="space-y-4">
                    {event.chatMessages.map((message) => (
                      <div key={message.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-medium">
                              {message.user.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {message.user.name || 'Анонім'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {format(new Date(message.createdAt), 'HH:mm')}
                              </span>
                            </div>
                            <p className="text-gray-700">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <div>Повідомлень ще немає</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Швидкі дії</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                  Запросити друзів
                </button>
                <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50">
                  Поділитися
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50">
                  Експортувати в календар
                </button>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Учасники</h3>
              <div className="space-y-3">
                {event.votes.slice(0, 5).map((vote) => (
                  <div key={vote.id} className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {vote.user.name || 'Анонім'}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      vote.voteType === 'yes' ? 'bg-green-100 text-green-800' :
                      vote.voteType === 'no' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vote.voteType === 'yes' ? 'Так' : 
                       vote.voteType === 'no' ? 'Ні' : 'Можливо'}
                    </span>
                  </div>
                ))}
                {event.votes.length > 5 && (
                  <div className="text-center text-sm text-gray-500 pt-2">
                    та ще {event.votes.length - 5} учасників
                  </div>
                )}
                {event.votes.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    Поки що немає учасників
                  </div>
                )}
              </div>
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Інформація</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Створено:</span>
                  <span className="font-medium">
                    {format(new Date(event.createdAt), 'dd.MM.yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Оновлено:</span>
                  <span className="font-medium">
                    {format(new Date(event.updatedAt), 'dd.MM.yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Статус:</span>
                  <span className={`font-medium ${
                    new Date() > new Date(Math.max(...event.dateOptions.map(d => new Date(d.date).getTime())))
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}>
                    {new Date() > new Date(Math.max(...event.dateOptions.map(d => new Date(d.date).getTime())))
                      ? 'Завершено'
                      : 'Активна'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
