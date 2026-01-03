'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Check, Clock, Users, ArrowLeft, ThumbsUp, ThumbsDown, HelpCircle, AlertCircle } from 'lucide-react'

interface DateOption {
  id: string
  date: string | null
  createdAt: string
}

interface Event {
  id: string
  title: string
  description: string | null
  creatorName: string
  dateOptions: DateOption[]
}

export default function EventVotePage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [votes, setVotes] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/events/${eventId}`)
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setEvent(data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = (dateOptionId: string, voteType: string) => {
    setVotes(prev => ({
      ...prev,
      [dateOptionId]: voteType
    }))
    
    console.log('Voted:', { dateOptionId, voteType })
    
    // Тимчасово показуємо повідомлення
    alert(`✅ Vote submitted: ${voteType}`)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not specified'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-telegram-bg p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telegram-primary mx-auto"></div>
            <p className="mt-4 text-telegram-text-muted">Loading event...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-telegram-bg p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-red-400">Error: {error}</p>
            <Link
              href="/events"
              className="mt-4 inline-flex items-center gap-2 text-telegram-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-telegram-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Навігація */}
        <div className="mb-8">
          <Link 
            href="/events" 
            className="inline-flex items-center gap-2 text-telegram-text-muted hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>

        {event ? (
          <>
            {/* Заголовок події */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-telegram-text-muted mb-4">
                Created by {event.creatorName}
              </p>
              {event.description && (
                <div className="bg-telegram-bg-tertiary rounded-xl p-4 mb-6">
                  <p className="text-telegram-text">{event.description}</p>
                </div>
              )}
            </div>

            {/* Секція голосування */}
            <div className="bg-telegram-bg-tertiary rounded-xl border border-telegram-border p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                🗳️ Vote for Date
              </h2>
              
              <p className="text-telegram-text-muted mb-8">
                Select the best date for this event. Vote for one or more options.
              </p>

              {event.dateOptions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 mx-auto text-telegram-text-muted mb-4" />
                  <p className="text-telegram-text-muted">No date options available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {event.dateOptions.map((option, index) => {
                    const userVote = votes[option.id]
                    return (
                      <div 
                        key={option.id}
                        className="bg-telegram-bg rounded-xl border border-telegram-border p-6 hover:border-telegram-primary/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">
                              Option {index + 1}
                            </h3>
                            <div className="flex items-center gap-2 text-telegram-text-muted">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(option.date)}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold">0 votes</div>
                            <div className="text-sm text-telegram-text-muted">
                              No votes yet
                            </div>
                          </div>
                        </div>

                        {/* Кнопки голосування */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleVote(option.id, 'yes')}
                            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                              userVote === 'yes'
                                ? 'bg-green-500/20 border-2 border-green-500'
                                : 'bg-telegram-bg hover:bg-telegram-border border border-telegram-border'
                            }`}
                          >
                            <ThumbsUp className="w-5 h-5" />
                            <span className="font-bold">Yes</span>
                            {userVote === 'yes' && (
                              <Check className="w-4 h-4 text-green-400" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleVote(option.id, 'maybe')}
                            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                              userVote === 'maybe'
                                ? 'bg-yellow-500/20 border-2 border-yellow-500'
                                : 'bg-telegram-bg hover:bg-telegram-border border border-telegram-border'
                            }`}
                          >
                            <HelpCircle className="w-5 h-5" />
                            <span className="font-bold">Maybe</span>
                            {userVote === 'maybe' && (
                              <Check className="w-4 h-4 text-yellow-400" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleVote(option.id, 'no')}
                            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                              userVote === 'no'
                                ? 'bg-red-500/20 border-2 border-red-500'
                                : 'bg-telegram-bg hover:bg-telegram-border border border-telegram-border'
                            }`}
                          >
                            <ThumbsDown className="w-5 h-5" />
                            <span className="font-bold">No</span>
                            {userVote === 'no' && (
                              <Check className="w-4 h-4 text-red-400" />
                            )}
                          </button>
                        </div>

                        {userVote && (
                          <div className={`mt-4 p-3 rounded-lg text-center ${
                            userVote === 'yes' ? 'bg-green-500/10 text-green-400' :
                            userVote === 'maybe' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            <div className="flex items-center justify-center gap-2">
                              <Check className="w-4 h-4" />
                              <span>You voted: <strong>{userVote.toUpperCase()}</strong></span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Інструкція */}
              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium">How voting works:</p>
                    <ul className="text-sm text-telegram-text-muted mt-2 space-y-1">
                      <li>• <strong>Yes</strong> - You can attend at this time</li>
                      <li>• <strong>Maybe</strong> - You might be able to attend</li>
                      <li>• <strong>No</strong> - You cannot attend at this time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <p className="text-red-400">Event not found</p>
            <Link
              href="/events"
              className="mt-4 inline-flex items-center gap-2 text-telegram-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
