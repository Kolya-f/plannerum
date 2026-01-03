'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dateOptions, setDateOptions] = useState<string[]>([
    new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Завтра
    new Date(Date.now() + 172800000).toISOString().slice(0, 16), // Післязавтра
  ])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const addDateOption = () => {
    setDateOptions([...dateOptions, new Date().toISOString().slice(0, 16)])
  }

  const removeDateOption = (index: number) => {
    if (dateOptions.length > 1) {
      const newDates = [...dateOptions]
      newDates.splice(index, 1)
      setDateOptions(newDates)
    }
  }

  const updateDateOption = (index: number, value: string) => {
    const newDates = [...dateOptions]
    newDates[index] = value
    setDateOptions(newDates)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!session) {
      setError('Будь ласка, увійдіть в систему')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          dateOptions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Помилка при створенні події')
      }

      setSuccess('Подію успішно створено!')
      setTimeout(() => {
        router.push('/events')
      }, 1500)

    } catch (error: any) {
      console.error('Error creating event:', error)
      setError(error.message || 'Щось пішло не так')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="container mx-auto px-4 py-8">Завантаження...</div>
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Увійдіть в систему</h1>
        <p className="mb-4">Для створення події потрібно увійти в систему</p>
        <Link
          href="/auth/signin"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Увійти
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Створити нову подію</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Назва події *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Назва вашої події"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Опис (необов'язково)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Опишіть вашу подію..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дати для голосування *
          </label>
          <div className="space-y-3">
            {dateOptions.map((date, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => updateDateOption(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {dateOptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDateOption(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Видалити
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDateOption}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              + Додати ще одну дату
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Створення...' : 'Створити подію'}
          </button>
        </div>
      </form>
    </div>
  )
}
