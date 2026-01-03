'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'

interface Event {
  id: string
  title: string
  description: string | null
  date: string | null
  location: string | null
  createdAt: string
  user: {
    name: string | null
    email: string | null
  }
}

export default function EventPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      } else {
        setError('Event not found')
      }
    } catch (error) {
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading event...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p>{error || 'The event you are looking for does not exist.'}</p>
        <button
          onClick={() => router.push('/events')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Events
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-6 text-blue-500 hover:text-blue-600"
      >
        ← Back
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <p className="text-gray-700 mb-4">{event.description || 'No description provided.'}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {event.date && (
              <div>
                <h3 className="font-semibold text-gray-600">Date</h3>
                <p>{new Date(event.date).toLocaleDateString()}</p>
              </div>
            )}
            
            {event.location && (
              <div>
                <h3 className="font-semibold text-gray-600">Location</h3>
                <p>{event.location}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-600">Created by</h3>
            <p>{event.user?.name || event.user?.email || 'Unknown'}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {session && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Vote on this event</h2>
            <div className="flex space-x-4">
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded">
                👍 Yes
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded">
                👎 No
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded">
                🤷 Maybe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
