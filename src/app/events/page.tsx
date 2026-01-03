'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Event {
  id: string
  title: string
  description: string | null
  user: {
    name: string | null
    email: string | null
  }
}

export default function EventsPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/all')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        setError('Failed to load events')
      }
    } catch (error) {
      setError('Failed to load events')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Events</h1>
        <p>Loading events...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        {session && (
          <Link
            href="/create-event"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Event
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p>No events found. Be the first to create one!</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4">
                {event.description || 'No description'}
              </p>
              <div className="text-sm text-gray-500">
                Created by: {event.user?.name || event.user?.email || 'Unknown'}
              </div>
              <Link
                href={`/events/${event.id}`}
                className="mt-4 inline-block text-blue-500 hover:text-blue-600"
              >
                View Details →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
