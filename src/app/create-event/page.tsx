'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

interface EventFormData {
  title: string
  description: string
  location: string
  category: string
  maxParticipants: string
}

export default function CreateEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>()
  
  const [dateOptions, setDateOptions] = useState<string[]>([''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (status === 'loading') {
    return <div>Завантаження...</div>
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const addDateOption = () => {
    setDateOptions([...dateOptions, ''])
  }

  const removeDateOption = (index: number) => {
    const newDates = [...dateOptions]
    newDates.splice(index, 1)
    setDateOptions(newDates)
  }

  const updateDateOption = (index: number, value: string) => {
    const newDates = [...dateOptions]
    newDates[index] = value
    setDateOptions(newDates)
  }

  const onSubmit = async (data: EventFormData) => {
    try {
      setLoading(true)
      setError('')

      // Фільтруємо пусті дати
      const validDates = dateOptions.filter(date => date.trim() !== '')

      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          maxParticipants: data.maxParticipants || null,
          dateOptions: validDates
        })
      })

      if (response.ok) {
        const event = await response.json()
        router.push(`/events/${event.id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Помилка створення події')
      }
    } catch (error) {
      setError('Помилка мережі')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Створити подію</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Назва */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Назва події *
            </label>
            <input
              {...register('title', { required: 'Назва обов\'язкова' })}
              className="w-full p-3 border rounded-lg"
              placeholder="Наприклад: Зустріч команди"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Опис */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Опис
            </label>
            <textarea
              {...register('description')}
              className="w-full p-3 border rounded-lg"
              placeholder="Опишіть подію..."
              rows={4}
            />
          </div>

          {/* Місце */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Місце проведення
            </label>
            <input
              {...register('location')}
              className="w-full p-3 border rounded-lg"
              placeholder="Наприклад: Офіс або онлайн"
            />
          </div>

          {/* Категорія */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Категорія
            </label>
            <select
              {...register('category')}
              className="w-full p-3 border rounded-lg"
              defaultValue="other"
            >
              <option value="meeting">Зустріч</option>
              <option value="workshop">Воркшоп</option>
              <option value="party">Вечірка</option>
              <option value="sport">Спорт</option>
              <option value="other">Інше</option>
            </select>
          </div>

          {/* Максимум учасників */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Максимальна кількість учасників
            </label>
            <input
              {...register('maxParticipants')}
              type="number"
              className="w-full p-3 border rounded-lg"
              placeholder="Наприклад: 20 (залишіть пустим для без обмежень)"
            />
          </div>

          {/* Варіанти дат для голосування */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Дати для голосування
              </label>
              <button
                type="button"
                onClick={addDateOption}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Додати дату
              </button>
            </div>
            
            <div className="space-y-3">
              {dateOptions.map((date, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => updateDateOption(index, e.target.value)}
                    className="flex-1 p-3 border rounded-lg"
                  />
                  {dateOptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDateOption(index)}
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Видалити
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-600 mt-2">
              Додайте дати, за які учасники зможуть голосувати
            </p>
          </div>

          {/* Кнопка створення */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Створення...' : 'Створити подію'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">💡 Порада:</h3>
          <p className="text-sm text-gray-700">
            Додайте кілька варіантів дат, щоб учасники могли проголосувати за найкращий час.
            Після створення події ви зможете побачити результати голосування на сторінці події.
          </p>
        </div>
      </div>
    </div>
  )
}
