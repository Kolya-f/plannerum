'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, MapPin, Users, Tag, Lock, Globe, Plus, X, Zap, AlertCircle } from 'lucide-react'

export default function CreateEventPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  // Обработка быстрых действий
  useEffect(() => {
    const quick = searchParams.get('quick')
    if (quick) {
      handleQuickAction(quick)
    }
  }, [searchParams])

  const handleQuickAction = (type: string) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    switch (type) {
      case 'meeting':
        setFormData({
          title: 'Швидка зустріч команди',
          description: 'Обговорення поточних завдань та планів',
          location: 'Онлайн (Google Meet)',
          category: 'meeting',
          maxParticipants: '10',
          isPublic: false
        })
        setDateOptions([today, tomorrow])
        break
        
      case 'group':
        setFormData({
          title: 'Груповий івент',
          description: 'Масштабна подія для великої кількості учасників',
          location: 'Конференц-зал',
          category: 'conference',
          maxParticipants: '50',
          isPublic: true
        })
        setDateOptions([nextWeek, new Date(nextWeek.getTime() + 24 * 60 * 60 * 1000)])
        break
        
      case 'workshop':
        setFormData({
          title: 'Онлайн воркшоп',
          description: 'Навчальний захід з практичними завданнями',
          location: 'Zoom / Google Meet',
          category: 'workshop',
          maxParticipants: '25',
          isPublic: true
        })
        setDateOptions([tomorrow, new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000)])
        break
    }
  }

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
    setError(null)

    // Логування даних для дебагу
    console.log('📤 Відправляємо дані:')
    console.log('Form data:', formData)
    console.log('Date options:', dateOptions)
    console.log('Date options as ISO:', dateOptions.map(d => d.toISOString()))

    try {
      const user = JSON.parse(localStorage.getItem('plannerum-user') || '{}')
      
      console.log('👤 Користувач:', user)
      
      const payload = {
        ...formData,
        dateOptions: dateOptions.map(d => d.toISOString()),
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        userId: user.id || 'demo-user-' + Date.now(),
        userName: user.name || 'Демо Користувач',
        userEmail: user.email || 'demo@example.com'
      }
      
      console.log('📦 Payload:', payload)

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('📥 Відповідь:', response.status, response.statusText)

      const responseData = await response.json()
      console.log('📊 Дані відповіді:', responseData)

      if (response.ok) {
        console.log('✅ Подія створена успішно:', responseData.id)
        router.push(`/events/${responseData.id}`)
        router.refresh()
      } else {
        console.error('❌ Помилка від сервера:', responseData)
        setError(responseData.error || responseData.details || 'Не вдалося створити подію')
      }
    } catch (error) {
      console.error('❌ Помилка мережі:', error)
      setError('Мережева помилка. Перевірте консоль для деталей.')
    } finally {
      setLoading(false)
    }
  }

  const quickTemplates = [
    {
      name: 'Швидка зустріч',
      description: 'Командна зустріч на сьогодні',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      type: 'meeting'
    },
    {
      name: 'Груповий івент',
      description: 'Для 10+ учасників',
      icon: Users,
      color: 'from-green-500 to-green-600',
      type: 'group'
    },
    {
      name: 'Онлайн воркшоп',
      description: 'Віртуальна подія',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      type: 'workshop'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Боковая панель с шаблонами */}
          <div className="lg:w-1/3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-500" />
                Швидкі шаблони
              </h2>
              
              <div className="space-y-4">
                {quickTemplates.map((template) => {
                  const Icon = template.icon
                  return (
                    <button
                      key={template.type}
                      onClick={() => handleQuickAction(template.type)}
                      className={`w-full p-4 bg-gradient-to-r ${template.color} text-white rounded-xl text-left hover:opacity-90 transition-opacity`}
                    >
                      <div className="flex items-center mb-2">
                        <Icon className="w-5 h-5 mr-2" />
                        <span className="font-bold">{template.name}</span>
                      </div>
                      <p className="text-sm opacity-90">{template.description}</p>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Поради</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Додайте кілька дат для голосування
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Чітко опишіть подію
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Вкажіть точне місце проведення
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Основная форма */}
          <div className="lg:w-2/3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Створити нову подію
                </h1>
                <p className="text-gray-600">
                  Заповніть форму нижче, щоб створити подію та запросити учасників
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center text-red-700">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Помилка:</span>
                  </div>
                  <p className="mt-1 text-red-600 text-sm">{error}</p>
                  <p className="mt-2 text-red-500 text-xs">
                    Перевірте консоль браузера (F12) для детальної інформації
                  </p>
                </div>
              )}

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
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
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
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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
      </div>
    </div>
  )
}
