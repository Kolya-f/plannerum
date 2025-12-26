'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

type Event = {
  id: string
  title: string
  description: string
  publicId: string
  createdAt: string
  dateOptions: Array<{
    id: string
    votes: Array<any>
  }>
  votes: Array<any>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session) {
      fetchEvents()
    }
  }, [session])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }

      const data = await response.json()
      setEvents(data.events || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load events')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Calculate stats for an event
  const getEventStats = (event: Event) => {
    const totalVotes = event.votes.length
    const uniqueVoters = new Set(event.votes.map(v => v.userId)).size
    const dateOptionsCount = event.dateOptions.length
    
    return { totalVotes, uniqueVoters, dateOptionsCount }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-md max-w-md text-center">
          <CalendarDaysIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your events
          </p>
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="block w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Events
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track your created events
            </p>
          </div>
          
          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            Create New
          </Link>
        </div>

        {/* Welcome message */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-blue-800">
            Welcome back, <span className="font-medium">{session.user?.name || session.user?.email}</span>!
            {events.length === 0 ? ' Create your first event to get started.' : ''}
          </p>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your events...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Events List */}
      {!loading && !error && (
        <>
          {events.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first event to start planning with others
              </p>
              <Link
                href="/create-event"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const stats = getEventStats(event)
                
                return (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200"
                  >
                    <div className="p-5">
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Created {formatDate(event.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Event Description */}
                      {event.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {stats.dateOptionsCount}
                          </div>
                          <div className="text-xs text-gray-500">Dates</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {stats.totalVotes}
                          </div>
                          <div className="text-xs text-gray-500">Votes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {stats.uniqueVoters}
                          </div>
                          <div className="text-xs text-gray-500">People</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/event/${event.publicId}`}
                          className="flex-1 py-2 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium text-center"
                        >
                          View Event
                        </Link>
                        <Link
                          href={`/event/${event.publicId}/results`}
                          className="flex-1 py-2 px-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium text-center"
                        >
                          Results
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Quick Stats */}
          {events.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{events.length}</div>
                    <div className="text-sm text-gray-600">Total Events</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-3">
                  <ChartBarIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {events.reduce((sum, event) => sum + event.votes.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Votes</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-3">
                  <UserGroupIcon className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(events.flatMap(event => event.votes.map(v => v.userId))).size}
                    </div>
                    <div className="text-sm text-gray-600">Unique Voters</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
