'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CreateEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dates, setDates] = useState<string[]>(['', ''])
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const addDateField = () => {
    setDates([...dates, ''])
  }

  const removeDateField = (index: number) => {
    if (dates.length > 2) {
      const newDates = [...dates]
      newDates.splice(index, 1)
      setDates(newDates)
    }
  }

  const updateDate = (index: number, value: string) => {
    const newDates = [...dates]
    newDates[index] = value
    setDates(newDates)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Валідація
    if (!title.trim()) {
      setError('Event title is required')
      setLoading(false)
      return
    }

    const validDates = dates
      .map(date => date.trim())
      .filter(date => date !== '')
      .map(date => {
        // Переконуємося, що дата має правильний формат
        const d = new Date(date)
        return d.toISOString()
      })

    if (validDates.length < 2) {
      setError('Please add at least 2 valid date options')
      setLoading(false)
      return
    }

    try {
      console.log('📤 Creating event...', { title, dates: validDates })
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          dates: validDates,
          isPublic
        }),
      })

      const data = await response.json()
      console.log('📥 Response:', data)

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create event')
      }

      console.log('✅ Event created successfully, redirecting to:', `/event/${data.event.publicId}`)
      router.push(`/event/${data.event.publicId}`)
      
    } catch (err: any) {
      console.error('❌ Create event error:', err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-600 mt-2">Plan your event and let others vote on the best time</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Team Meeting, Birthday Party, etc."
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your event..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date & Time Options *
                </label>
                <span className="text-sm text-gray-500">Add at least 2 options</span>
              </div>
              
              <div className="space-y-3">
                {dates.map((date, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => updateDate(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required={index < 2}
                    />
                    <button
                      type="button"
                      onClick={() => removeDateField(index)}
                      disabled={dates.length <= 2}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        dates.length <= 2
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={addDateField}
                className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200"
              >
                + Add Another Date
              </button>
              
              <p className="mt-2 text-sm text-gray-500">
                Date format: YYYY-MM-DDTHH:MM (e.g., 2024-12-25T14:30)
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                Make this event public (anyone with the link can vote)
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Event'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                View My Events →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
