'use client'

import Link from 'next/link'
import { Calendar, Users, MapPin, MessageCircle, Clock, ThumbsUp } from 'lucide-react'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

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
  chatMessages: { id: string }[]
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: uk })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meeting': return 'from-blue-500 to-cyan-500'
      case 'workshop': return 'from-green-500 to-emerald-500'
      case 'party': return 'from-purple-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'meeting': return 'Зустріч'
      case 'workshop': return 'Воркшоп'
      case 'party': return 'Вечірка'
      default: return 'Подія'
    }
  }

  const votesCount = event.votes?.length || 0
  const messagesCount = event.chatMessages?.length || 0
  const hasUpcomingDates = event.dateOptions?.some(opt => new Date(opt.date) > new Date())

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover">
      {/* Category Badge */}
      <div className={`h-2 bg-gradient-to-r ${getCategoryColor(event.category)}`}></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}>
              {getCategoryLabel(event.category)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {event.isPublic ? (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                Публічна
              </span>
            ) : (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                Приватна
              </span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description || 'Опис відсутній'}
        </p>

        <div className="space-y-3 mb-6">
          {event.location && (
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm truncate">{event.location}</span>
            </div>
          )}
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">
              {event.dateOptions?.length || 0} варіантів дати
              {!hasUpcomingDates && ' (завершено)'}
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">
              {event.maxParticipants ? `До ${event.maxParticipants} учасників` : 'Без обмежень'}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <ThumbsUp className="w-4 h-4 mr-1 text-blue-500" />
            <span>{votesCount} голосів</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MessageCircle className="w-4 h-4 mr-1 text-purple-500" />
            <span>{messagesCount} повід.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-medium">
                {event.user?.name?.[0]?.toUpperCase() || event.user?.email?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {event.user?.name || 'Анонім'}
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(event.createdAt)}
              </div>
            </div>
          </div>
          
          <Link
            href={`/events/${event.id}`}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            <span className="text-sm">Детальніше</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
