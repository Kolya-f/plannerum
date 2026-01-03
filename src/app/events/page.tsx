'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  category: string | null
  maxParticipants: number | null
  isPublic: boolean
  createdAt: string
}

export default function EventsPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/all')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        setError('Не вдалося завантажити події')
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Помилка завантаження подій')
    } finally {
      setLoading(false)
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
        <h1 className="text-3xl font-bold mb-6">Події</h1>
        <p>Завантаження подій...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Події</h1>
        {session && (
          <Link
            href="/create-event"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Створити подію
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-gray-600">Ще немає подій. Створіть першу!</p>
            {session && (
              <Link
                href="/create-event"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Створити першу подію
              </Link>
            )}
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border rounded-lg p-6 shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                {event.category && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {event.category}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">
                {event.description || 'Без опису'}
              </p>
              
              {event.location && (
                <p className="text-sm text-gray-500 mb-2">
                  📍 {event.location}
                </p>
              )}
              
              {event.maxParticipants && (
                <p className="text-sm text-gray-500 mb-3">
                  👥 Макс. учасників: {event.maxParticipants}
                </p>
              )}
              
              <div className="text-sm text-gray-500 mt-4 pt-4 border-t">
                Створено: {formatDate(event.createdAt)}
              </div>
              
              <div className="flex justify-end mt-4">
                <Link
                  href={`/events/${event.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Детальніше →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
