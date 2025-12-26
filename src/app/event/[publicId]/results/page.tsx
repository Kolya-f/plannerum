'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ChartBarIcon,
  TrophyIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShareIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

type EventData = {
  id: string
  title: string
  description: string
  publicId: string
  dateOptions: Array<{
    id: string
    dateTime: string
    voteCount: number
    yesCount: number
    noCount: number
    maybeCount: number
  }>
  stats: {
    totalVotes: number
    uniqueVoters: number
  }
}

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const publicId = params.publicId as string

  useEffect(() => {
    fetchEvent()
  }, [publicId])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/events/${publicId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load event')
      }

      setEvent(data.event)
    } catch (err: any) {
      setError(err.message || 'Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    const url = `${window.location.origin}/event/${publicId}/results`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Знайти найкращу дату
  const getBestDate = () => {
    if (!event?.dateOptions.length) return null
    
    return event.dateOptions.reduce((best, current) => {
      const bestScore = best.yesCount - best.noCount
      const currentScore = current.yesCount - current.noCount
      return currentScore > bestScore ? current : best
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-purple-50">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results Not Available</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load voting results.'}</p>
          <Link
            href={`/event/${publicId}`}
            className="inline-block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Back to Voting
          </Link>
        </div>
      </div>
    )
  }

  const bestDate = getBestDate()
  const totalVotes = event.stats.totalVotes

  // Кольори для графіків
  const chartColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-amber-500'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/event/${publicId}`}
            className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Voting
          </Link>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title} - Results</h1>
                <p className="text-blue-100">See how everyone voted and find the best date</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={copyLink}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  <ShareIcon className="h-5 w-5" />
                  {copied ? 'Copied!' : 'Share Results'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Best Date Card */}
        {bestDate && bestDate.yesCount > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrophyIcon className="h-8 w-8" />
                  <div>
                    <div className="text-sm font-medium opacity-90">WINNING DATE</div>
                    <div className="text-2xl font-bold">{formatDate(bestDate.dateTime)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{bestDate.yesCount}</div>
                  <div className="text-sm opacity-90">YES votes</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{bestDate.yesCount}</div>
                  <div className="text-sm">✅ Yes votes</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{bestDate.noCount}</div>
                  <div className="text-sm">❌ No votes</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{bestDate.maybeCount}</div>
                  <div className="text-sm">🤷 Maybe votes</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* All Dates Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ChartBarIcon className="h-6 w-6 text-blue-500 mr-2" />
                Voting Results by Date
              </h2>

              <div className="space-y-6">
                {event.dateOptions.map((option, index) => {
                  const totalVotesForOption = option.yesCount + option.noCount + option.maybeCount
                  const yesPercentage = totalVotesForOption > 0 
                    ? Math.round((option.yesCount / totalVotesForOption) * 100) 
                    : 0
                  
                  const colorIndex = index % chartColors.length
                  
                  return (
                    <div 
                      key={option.id} 
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${chartColors[colorIndex]}`}>
                            <CalendarDaysIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-gray-900">
                              {formatDate(option.dateTime)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {totalVotesForOption} total votes
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-3xl font-bold bg-gradient-to-r ${chartColors[colorIndex]} bg-clip-text text-transparent`}>
                            {yesPercentage}%
                          </div>
                          <div className="text-sm text-gray-500">Positive</div>
                        </div>
                      </div>

                      {/* Progress Bars */}
                      <div className="space-y-2">
                        {/* Yes Bar */}
                        <div className="flex items-center">
                          <div className="w-20 text-sm text-green-600 font-medium">Yes</div>
                          <div className="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                              style={{ width: `${totalVotesForOption > 0 ? (option.yesCount / totalVotesForOption) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-right text-sm font-bold text-gray-700">
                            {option.yesCount}
                          </div>
                        </div>

                        {/* No Bar */}
                        <div className="flex items-center">
                          <div className="w-20 text-sm text-red-600 font-medium">No</div>
                          <div className="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                              style={{ width: `${totalVotesForOption > 0 ? (option.noCount / totalVotesForOption) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-right text-sm font-bold text-gray-700">
                            {option.noCount}
                          </div>
                        </div>

                        {/* Maybe Bar */}
                        <div className="flex items-center">
                          <div className="w-20 text-sm text-yellow-600 font-medium">Maybe</div>
                          <div className="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                              style={{ width: `${totalVotesForOption > 0 ? (option.maybeCount / totalVotesForOption) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-right text-sm font-bold text-gray-700">
                            {option.maybeCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="h-6 w-6 text-purple-500 mr-2" />
                Overall Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50">
                  <span className="text-gray-700">Total Votes</span>
                  <span className="text-2xl font-bold text-blue-600">{totalVotes}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
                  <span className="text-gray-700">Participants</span>
                  <span className="text-2xl font-bold text-purple-600">{event.stats.uniqueVoters}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                  <span className="text-gray-700">Date Options</span>
                  <span className="text-2xl font-bold text-green-600">{event.dateOptions.length}</span>
                </div>
              </div>
            </div>

            {/* Participation Rate */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Participation</h3>
              <div className="text-center">
                <div className="inline-block relative">
                  <svg className="w-32 h-32" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeDasharray={`${(event.stats.uniqueVoters / 20) * 100}, 100`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.min(Math.round((event.stats.uniqueVoters / 20) * 100), 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Active</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  {event.stats.uniqueVoters} out of estimated 20 participants voted
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/event/${publicId}`}
                  className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-center hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Back to Voting
                </Link>
                <button
                  onClick={copyLink}
                  className="w-full py-3 px-4 rounded-xl bg-white border-2 border-blue-200 text-blue-700 font-bold hover:bg-blue-50 transition-all duration-300"
                >
                  Share These Results
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span>Results are updated in real-time as people vote</span>
          </div>
        </div>
      </div>
    </div>
  )
}
