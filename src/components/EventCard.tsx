'use client'

import Link from 'next/link'
import { Calendar, Users, MapPin } from 'lucide-react'

interface Event {
  id: string
  title: string
  description?: string
  location?: string
  category: string
  maxParticipants?: number
  isPublic: boolean
  createdAt: Date
  user: {
    name?: string
    email: string
  }
  dateOptions: { date: Date }[]
  votes: { id: string }[]
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meeting': return 'bg-blue-100 text-blue-600'
      case 'workshop': return 'bg-green-100 text-green-600'
      case 'party': return 'bg-purple-100 text-purple-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  // Проверяем, залогинен ли пользователь (простая проверка)
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('plannerum-user')

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
              {event.category || 'other'}
            </span>
          </div>
          {event.isPublic ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Публічна</span>
          ) : (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Приватна</span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description || 'Опис відсутній'}
        </p>

        <div className="space-y-2 mb-6">
          {event.location && (
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.location}</span>
            </div>
          )}
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {event.dateOptions.length} варіант(ів) дати
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {event.maxParticipants ? `До ${event.maxParticipants} учасників` : 'Без обмежень'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <span className="text-blue-600 font-medium text-sm">
                {event.user?.name?.[0]?.toUpperCase() || event.user?.email?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {event.user?.name || 'Анонім'}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(event.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/events/${event.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Детальніше
            </Link>
            {isLoggedIn && (
              <button className="border border-blue-600 text-blue-600 px-3 py-2 rounded-lg font-medium hover:bg-blue-50 text-sm">
                Голосувати
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
