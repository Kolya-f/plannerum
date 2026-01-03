'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'

interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  category: string | null
  maxParticipants: number | null
  isPublic: boolean
  createdAt: string
  user: {
    name: string | null
    email: string | null
  }
  dateOptions: {
    id: string
    date: string
    votes?: number
  }[]
}

interface Vote {
  id: string
  voteType: string
  userId: string
  userEmail: string
  dateOptionId: string
}

export default function EventPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [votes, setVotes] = useState<Vote[]>([])
  const [userVote, setUserVote] = useState<Vote | null>(null)
  const [voting, setVoting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchEvent()
      fetchVotes()
    }
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      } else {
        setError('Подію не знайдено')
      }
    } catch (error) {
      setError('Помилка завантаження події')
    } finally {
      setLoading(false)
    }
  }

  const fetchVotes = async () => {
    try {
      const response = await fetch(`/api/votes?eventId=${id}`)
      if (response.ok) {
        const data = await response.json()
        setVotes(data.votes || [])
        
        // Знаходимо голос поточного користувача
        if (session?.user?.email) {
          const userVote = data.votes.find(
            (vote: Vote) => vote.userEmail === session.user.email
          )
          setUserVote(userVote || null)
        }
      }
    } catch (error) {
      console.error('Error fetching votes:', error)
    }
  }

  const handleVote = async (dateOptionId: string, voteType: 'yes' | 'no' | 'maybe') => {
    if (!session?.user?.email) {
      alert('Будь ласка, увійдіть для голосування')
      return
    }

    setVoting(true)
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: id,
          dateOptionId,
          voteType
        })
      })

      if (response.ok) {
        const newVote = await response.json()
        setUserVote(newVote)
        fetchVotes() // Оновлюємо статистику
        alert('Ваш голос враховано!')
      } else {
        alert('Помилка голосування')
      }
    } catch (error) {
      console.error('Error voting:', error)
      alert('Помилка голосування')
    } finally {
      setVoting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Завантаження події...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Подію не знайдено</h1>
        <p>{error || 'Подія не існує'}</p>
        <button
          onClick={() => router.push('/events')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Назад до подій
        </button>
      </div>
    )
  }

  // Рахуємо голоси для кожної дати
  const dateOptionsWithVotes = event.dateOptions.map(option => {
    const optionVotes = votes.filter(vote => vote.dateOptionId === option.id)
    const yesVotes = optionVotes.filter(v => v.voteType === 'yes').length
    const noVotes = optionVotes.filter(v => v.voteType === 'no').length
    const maybeVotes = optionVotes.filter(v => v.voteType === 'maybe').length
    const totalVotes = optionVotes.length

    return {
      ...option,
      votes: totalVotes,
      yesVotes,
      noVotes,
      maybeVotes
    }
  })

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Назад
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-gray-700 mb-4">{event.description || 'Без опису'}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {event.location && (
              <div>
                <h3 className="font-semibold text-gray-600">Місце</h3>
                <p>📍 {event.location}</p>
              </div>
            )}
            
            {event.category && (
              <div>
                <h3 className="font-semibold text-gray-600">Категорія</h3>
                <p>{event.category}</p>
              </div>
            )}
            
            {event.maxParticipants && (
              <div>
                <h3 className="font-semibold text-gray-600">Максимум учасників</h3>
                <p>👥 {event.maxParticipants}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-600">Створив</h3>
            <p>{event.user?.name || event.user?.email || 'Невідомо'}</p>
            <p className="text-sm text-gray-500">
              {formatDate(event.createdAt)}
            </p>
          </div>
        </div>

        {/* Секція голосування */}
        {event.dateOptions.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Голосування за дати</h2>
            <p className="text-gray-600 mb-6">
              Оберіть дату та проголосуйте за найкращий варіант
            </p>

            {session ? (
              <div className="space-y-6">
                {dateOptionsWithVotes.map((option) => (
                  <div key={option.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {formatDate(option.date)}
                      </h3>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
                        {option.votes} голосів
                      </span>
                    </div>

                    {/* Кнопки голосування */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        onClick={() => handleVote(option.id, 'yes')}
                        disabled={voting || userVote?.dateOptionId === option.id}
                        className={`px-4 py-2 rounded ${
                          userVote?.dateOptionId === option.id && userVote?.voteType === 'yes'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        👍 Так ({option.yesVotes})
                      </button>
                      
                      <button
                        onClick={() => handleVote(option.id, 'no')}
                        disabled={voting || userVote?.dateOptionId === option.id}
                        className={`px-4 py-2 rounded ${
                          userVote?.dateOptionId === option.id && userVote?.voteType === 'no'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        👎 Ні ({option.noVotes})
                      </button>
                      
                      <button
                        onClick={() => handleVote(option.id, 'maybe')}
                        disabled={voting || userVote?.dateOptionId === option.id}
                        className={`px-4 py-2 rounded ${
                          userVote?.dateOptionId === option.id && userVote?.voteType === 'maybe'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        🤷 Можливо ({option.maybeVotes})
                      </button>
                    </div>

                    {/* Прогрес-бари */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-16 text-sm">Так:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(option.yesVotes / Math.max(option.votes, 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">{option.yesVotes}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="w-16 text-sm">Ні:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(option.noVotes / Math.max(option.votes, 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">{option.noVotes}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="w-16 text-sm">Можливо:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${(option.maybeVotes / Math.max(option.votes, 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">{option.maybeVotes}</span>
                      </div>
                    </div>

                    {userVote?.dateOptionId === option.id && (
                      <p className="mt-3 text-sm text-blue-600">
                        ✅ Ви проголосували: <strong>{userVote.voteType === 'yes' ? 'Так' : userVote.voteType === 'no' ? 'Ні' : 'Можливо'}</strong>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-600">
                Будь ласка, <a href="/auth/signin" className="text-blue-600 hover:underline">увійдіть</a> для голосування
              </p>
            )}

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Загальна статистика:</h3>
              <p className="text-gray-600">
                Усього голосів: <strong>{votes.length}</strong> • 
                Унікальних голосуючих: <strong>{new Set(votes.map(v => v.userId)).size}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Чат для події */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Обговорення події</h2>
          <p className="text-gray-600 mb-4">
            Обговоріть деталі з іншими учасниками
          </p>
          <button
            onClick={() => router.push('/chat')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Перейти до чату →
          </button>
        </div>
      </div>
    </div>
  )
}
