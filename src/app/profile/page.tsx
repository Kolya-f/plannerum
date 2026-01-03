'use client'
import { useAuth } from '@/lib/auth/context'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UserStats {
  totalEvents: number
  totalVotes: number
  upcomingEvents: number
}

export default function ProfilePage() {
  const { data: session, status } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchStats()
    }
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold text-blue-700">Events Created</h3>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-semibold text-green-700">Votes Cast</h3>
                <p className="text-2xl font-bold">{stats.totalVotes}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h3 className="font-semibold text-purple-700">Upcoming Events</h3>
                <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Your Recent Activity</h3>
          <p className="text-gray-600">
            {stats && stats.totalEvents > 0
              ? `You have created ${stats.totalEvents} events and cast ${stats.totalVotes} votes.`
              : 'No activity yet. Create your first event!'}
          </p>
        </div>
      </div>
    </div>
  )
}
