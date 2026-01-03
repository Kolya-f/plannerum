'use client'

import { Event } from '@prisma/client'
import VoteButtons from './VoteButtons'

interface EventCardProps {
  event: Event & {
    user: {
      name: string | null
      email: string | null
    }
    dateOptions: {
      id: string
      date: Date
    }[]
  }
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: uk })
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
            <p className="text-gray-500 text-sm mt-1">
              Автор: {event.user?.name || event.user?.email || 'Невідомо'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.isPublic 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {event.isPublic ? 'Публічна' : 'Приватна'}
          </span>
        </div>

        {event.description && (
          <p className="text-gray-600 mb-6">{event.description}</p>
        )}

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Дати для голосування:</h4>
          
          {event.dateOptions.map((option) => (
            <div key={option.id} className="border border-gray-200 rounded-lg p-4 mb-3">
              <VoteButtons 
                eventId={event.id}
                dateOptionId={option.id}
                date={option.date}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
          Створено: {format(new Date(event.createdAt), 'dd MMMM yyyy', { locale: uk })}
        </div>
      </div>
    </div>
  )
}
