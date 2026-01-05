'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import EventCard from '@/components/EventCard'
import { Search, Filter, Calendar, Users, Clock, TrendingUp } from 'lucide-react'

// Типы для событий
interface EventType {
  id: string
  title: string
  description: string | null
  location: string | null
  category: string
  isPublic: boolean
  maxParticipants: number | null
  createdAt: string
  updatedAt: string
  user: {
    name: string | null
    email: string
  }
  dateOptions: Array<{ date: string }>
  votes: Array<any>
  _count?: {
    votes: number
    chatMessages: number
  }
}

// Категории для фильтра
const categories = [
  { value: 'all', label: 'Усі категорії' },
  { value: 'meeting', label: 'Зустріч' },
  { value: 'workshop', label: 'Воркшоп' },
  { value: 'party', label: 'Вечірка' },
  { value: 'conference', label: 'Конференція' },
  { value: 'other', label: 'Інше' },
]

// Типы сортировки
const sortOptions = [
  { value: 'newest', label: 'Найновіші', icon: Clock },
  { value: 'popular', label: 'Найпопулярніші', icon: TrendingUp },
  { value: 'participants', label: 'Більше учасників', icon: Users },
]

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [privacyFilter, setPrivacyFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 9

  // Загрузка событий
  useEffect(() => {
    fetchEvents()
  }, [])

  // Фильтрация и сортировка
  useEffect(() => {
    let result = [...events]

    // Поиск по названию и описанию
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(event => {
        const title = event.title?.toLowerCase() || ''
        const description = event.description?.toLowerCase() || ''
        const location = event.location?.toLowerCase() || ''
        
        return title.includes(query) ||
               description.includes(query) ||
               location.includes(query)
      })
    }

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      result = result.filter(event => event.category === selectedCategory)
    }

    // Фильтр по приватности
    if (privacyFilter !== 'all') {
      const isPublic = privacyFilter === 'public'
      result = result.filter(event => event.isPublic === isPublic)
    }

    // Сортировка
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'popular':
          const votesA = a._count?.votes || a.votes?.length || 0
          const votesB = b._count?.votes || b.votes?.length || 0
          return votesB - votesA
        case 'participants':
          const participantsA = a._count?.votes || a.votes?.length || 0
          const participantsB = b._count?.votes || b.votes?.length || 0
          return participantsB - participantsA
        default:
          return 0
      }
    })

    setFilteredEvents(result)
  }, [events, searchQuery, selectedCategory, privacyFilter, sortBy])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  // Пагинация
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)

  // Быстрые действия
  const quickActions = [
    {
      title: 'Швидка зустріч',
      description: 'Створити зустріч на сьогодні',
      icon: Clock,
      color: 'bg-blue-500',
      onClick: () => window.location.href = '/create-event?quick=meeting'
    },
    {
      title: 'Груповий івент',
      description: 'Для 10+ учасників',
      icon: Users,
      color: 'bg-green-500',
      onClick: () => window.location.href = '/create-event?quick=group'
    },
    {
      title: 'Онлайн воркшоп',
      description: 'Віртуальна подія',
      icon: Calendar,
      color: 'bg-purple-500',
      onClick: () => window.location.href = '/create-event?quick=workshop'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Заголовок и статистика */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Усі події</h1>
            <p className="text-gray-600">
              Знайдіть та приєднайтеся до {filteredEvents.length} цікавих подій
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{events.filter(e => e.isPublic).length} публічних</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{events.length} всього</span>
              </div>
            </div>
            <Link
              href="/create-event"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl inline-flex items-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Створити подію
            </Link>
          </div>
        </div>

        {/* Швидкі дії */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-8 bg-blue-600 rounded mr-2"></span>
            Швидкі дії
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-blue-600">
                        {action.title}
                      </div>
                      <div className="text-sm text-gray-600">{action.description}</div>
                    </div>
                  </div>
                  <div className="text-blue-600 text-sm font-medium flex items-center">
                    Створити зараз
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Поиск */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Пошук подій за назвою, описом чи місцем..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            {/* Категории */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Приватность */}
            <div>
              <select
                value={privacyFilter}
                onChange={(e) => setPrivacyFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Усі події</option>
                <option value="public">Тільки публічні</option>
                <option value="private">Тільки приватні</option>
              </select>
            </div>

            {/* Сортировка (отдельный ряд) */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-4 mt-4">
                <span className="text-gray-700 font-medium flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Сортувати:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                          sortBy === option.value
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Информация о фильтрах */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>Знайдено: {filteredEvents.length} подій</span>
            {(searchQuery || selectedCategory !== 'all' || privacyFilter !== 'all') && (
              <>
                <span>•</span>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setPrivacyFilter('all')
                    setSortBy('newest')
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Скинути всі фільтри
                </button>
              </>
            )}
          </div>
        </div>

        {/* Список событий */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-600">Завантаження подій...</div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Попередня
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Наступна
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Подій не знайдено
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'За вашим запитом подій не знайдено. Спробуйте інший пошук.'
                : 'Подій ще немає. Створіть першу подію!'
              }
            </p>
            {(searchQuery || selectedCategory !== 'all' || privacyFilter !== 'all') ? (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setPrivacyFilter('all')
                }}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Показати всі події
              </button>
            ) : (
              <Link
                href="/create-event"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Створити подію
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
