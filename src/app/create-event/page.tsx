'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, Tag, Lock, Globe, Plus, X } from 'lucide-react'

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dateOptions, setDateOptions] = useState<Date[]>([new Date(Date.now() + 24 * 60 * 60 * 1000)])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'other',
    maxParticipants: '',
    isPublic: true
  })

  const categories = [
    { value: 'meeting', label: 'Зустріч', color: 'bg-blue-100 text-blue-600' },
    { value: 'workshop', label: 'Воркшоп', color: 'bg-green-100 text-green-600' },
    { value: 'party', label: 'Вечірка', color: 'bg-purple-100 text-purple-600' },
    { value: 'conference', label: 'Конференція', color: 'bg-red-100 text-red-600' },
    { value: 'other', label: 'Інше', color: 'bg-gray-100 text-gray-600' },
  ]

  const handleAddDate = () => {
    const newDate = new Date(dateOptions[dateOptions.length - 1])
    newDate.setDate(newDate.getDate() + 1)
    setDateOptions([...dateOptions, newDate])
  }

  const handleRemoveDate = (index: number) => {
    if (dateOptions.length > 1) {
      setDateOptions(dateOptions.filter((_, i) => i !== index))
    }
  }

  const handleDateChange = (index: number, newDate: string) => {
    const newDates = [...dateOptions]
    newDates[index] = new Date(newDate)
    setDateOptions(newDates)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dateOptions,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
          userId: 'demo-user', // В реальном приложении из сессии
          userName: 'Демо Користувач',
          userEmail: 'demo@example.com'
        })
      })

      if (response.ok) {
        const event = await response.json()
        router.push(`/events/${event.id}`)
      }
    } catch (error) {
      console.error('Error creating event:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Створити нову подію
            </h1>
            <p className="text-gray-600">
              Заповніть форму нижче, щоб створити подію та запросити учасників
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Основная информация */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Назва події *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Наприклад: Зустріч команди"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Опис події
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Додайте детальний опис вашої події..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Місце проведення
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Онлайн, офіс, кафе..."
                />
              </div>
            </div>

            {/* Категория и настройки */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Категорія
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Максимальна кількість учасників
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Без обмежень"
                />
              </div>
            </div>

            {/* Варианты дат */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Варіанти дат для голосування *
                </label>
                <button
                  type="button"
                  onClick={handleAddDate}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Додати дату
                </button>
              </div>
              
              <div className="space-y-3">
                {dateOptions.map((date, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="datetime-local"
                      required
                      value={date.toISOString().slice(0, 16)}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {dateOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Настройки приватности */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Видимість події
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isPublic: true})}
                  className={`flex-1 flex items-center justify-center p-4 border-2 rounded-xl transition-colors ${
                    formData.isPublic
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Globe className={`w-5 h-5 mr-2 ${formData.isPublic ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <div className={`font-medium ${formData.isPublic ? 'text-blue-600' : 'text-gray-700'}`}>
                      Публічна
                    </div>
                    <div className="text-sm text-gray-500">
                      Видима всім користувачам
                    </div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isPublic: false})}
                  className={`flex-1 flex items-center justify-center p-4 border-2 rounded-xl transition-colors ${
                    !formData.isPublic
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Lock className={`w-5 h-5 mr-2 ${!formData.isPublic ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <div className={`font-medium ${!formData.isPublic ? 'text-blue-600' : 'text-gray-700'}`}>
                      Приватна
                    </div>
                    <div className="text-sm text-gray-500">
                      Тільки за запрошенням
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Створення...
                  </span>
                ) : (
                  'Створити подію'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
