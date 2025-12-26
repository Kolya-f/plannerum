'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface DateOption {
  id: string
  date: string
  votes: Array<{
    id: string
    type: string
    user: {
      id: string
      name: string | null
    }
  }>
  _count: {
    votes: number
  }
}

interface Event {
  id: string
  title: string
  description: string | null
  isPublic: boolean
  createdAt: string
  creator: {
    id: string
    name: string | null
    email: string
  }
  dateOptions: DateOption[]
}

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const publicId = params.publicId as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔵 Fetching event:', publicId)
        const response = await fetch(`/api/events/${publicId}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to load event: ${response.status}`)
        }

        const data = await response.json()
        console.log('✅ Event loaded:', data.title)
        setEvent(data)
      } catch (err: any) {
        console.error('❌ Error loading event:', err)
        setError(err.message || 'Failed to load event')
      } finally {
        setLoading(false)
      }
    }

    if (publicId) {
      fetchEvent()
    }
  }, [publicId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.73 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Event not found</h3>
            <p className="mt-2 text-gray-600">{error || 'The event could not be loaded.'}</p>
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Підрахунок голосів
  const totalVotes = event.dateOptions.reduce((sum, option) => sum + option._count.votes, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          {event.description && (
            <p className="mt-2 text-gray-600">{event.description}</p>
          )}
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>Created by {event.creator.name || event.creator.email}</span>
            <span className="mx-2">•</span>
            <span>{new Date(event.createdAt).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{event.isPublic ? 'Public' : 'Private'} event</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Date Options ({event.dateOptions.length})
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="px-6 py-5">
            <div className="space-y-4">
              {event.dateOptions.map((option) => {
                const voteCount = option._count.votes
                const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0
                
                return (
                  <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {new Date(option.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-blue-600">
                          {voteCount} vote{voteCount !== 1 ? 's' : ''}
                        </span>
                        {totalVotes > 0 && (
                          <div className="text-sm text-gray-500">{percentage}%</div>
                        )}
                      </div>
                    </div>
                    
                    {voteCount > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {option.votes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-sm font-medium text-gray-700 mb-1">Votes:</div>
                        <div className="flex flex-wrap gap-2">
                          {option.votes.map((vote) => (
                            <div
                              key={vote.id}
                              className={`px-2 py-1 rounded text-sm ${
                                vote.type === 'yes'
                                  ? 'bg-green-100 text-green-800'
                                  : vote.type === 'maybe'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {vote.user.name || 'Anonymous'}: {vote.type}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {event.dateOptions.length === 0 && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No date options yet</h3>
                <p className="mt-2 text-gray-500">Add some dates for people to vote on.</p>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Share this link: <code className="ml-2 px-2 py-1 bg-gray-100 rounded">
                  {typeof window !== 'undefined' ? `${window.location.origin}/event/${event.id}` : ''}
                </code>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/event/${event.id}`)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Copy Link
                </button>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
