'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Calendar, MapPin, Users, User, Clock, MessageCircle, ThumbsUp, ThumbsDown, Meh, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import VoteButtons from '@/components/VoteButtons'

interface EventType {
  id: string
  title: string
  description: string | null
  location: string | null
  category: string
  maxParticipants: number | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
  userId: string
  userName: string
  userEmail: string
  user: {
    name: string | null
    email: string
  }
  dateOptions: {
    id: string
    date: string
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
    createdAt: string
    user: {
      name: string | null
    }
  }[]
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [event, setEvent] = useState<EventType | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [error, setError] = useState<string | null>(null)

  const isLoggedIn = status === 'authenticated'
  const user = session?.user

  useEffect(() => {
    fetchEvent()
  }, [params.id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
        setError(null)
      } else {
        setError('Не вдалося завантажити подію')
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      setError('Мережева помилка')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (dateOptionId: string, voteType: string) => {
    if (!isLoggedIn || !user) {
      alert('Будь ласка, увійдіть для голосування')
      router.push('/auth/signin')
      return
    }

    setVoting(true)
    setError(null)

    try {
      console.log('🗳️ Голосування для користувача:', user.email)

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user.id || user.email
        },
        body: JSON.stringify({
          eventId: params.id,
          dateOptionId,
          voteType
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        console.log('✅ Голос успішно зараховано!', data)
        fetchEvent()
        setError('✅ Ваш голос зараховано!')
        setTimeout(() => setError(null), 3000)
      } else {
        setError(data.error || 'Не вдалося проголосувати')
      }
    } catch (error) {
      console.error('❌ Мережева помилка:', error)
      setError('Мережева помилка')
    } finally {
      setVoting(false)
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
              <p className="text-blue-100 text-lg">{event.description || 'Опис відсутній'}</p>
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

      <div className="container mx-auto px-4 py-8">
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

        {error && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center text-blue-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Статус:</span>
            </div>
            <p className="mt-1 text-blue-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'voting' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Голосування за дати
                    {!isLoggedIn && (
                      <span className="ml-4 text-sm font-normal text-yellow-600">
                        (Увійдіть для голосування)
                      </span>
                    )}
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
                              disabled={!isLoggedIn || voting}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
