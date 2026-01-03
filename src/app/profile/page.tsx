'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

interface UserStats {
  totalEvents: number
  totalVotes: number
  upcomingEvents: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserStats()
    }
  }, [session])

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/user/stats?userId=${session?.user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Завантаження...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Увійдіть в систему</h1>
        <p className="mb-4">Для перегляду профілю потрібно увійти в систему</p>
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{session.user.name}</h1>
            <p className="text-gray-600 mt-2">{session.user.email}</p>
            {session.user.createdAt && (
              <p className="text-gray-500 text-sm mt-1">
                З нами з {format(new Date(session.user.createdAt), 'dd MMMM yyyy', { locale: uk })}
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link
              href="/create-event"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Створити подію
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Завантаження статистики...</div>
        ) : (
          <>
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-600">
                  {stats?.totalEvents || 0}
                </div>
                <div className="text-gray-600 mt-2">Створених подій</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-600">
                  {stats?.totalVotes || 0}
                </div>
                <div className="text-gray-600 mt-2">Відданих голосів</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-600">
                  {stats?.upcomingEvents || 0}
                </div>
                <div className="text-gray-600 mt-2">Майбутніх подій</div>
              </div>
            </div>

            {/* Дії */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold mb-4">Швидкі дії</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/events"
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border border-gray-200 transition-colors"
                >
                  <div className="font-medium text-gray-800">Переглянути всі події</div>
                  <div className="text-gray-600 text-sm mt-1">Знайти події для участі</div>
                </Link>
                
                <Link
                  href="/chat"
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border border-gray-200 transition-colors"
                >
                  <div className="font-medium text-gray-800">Ком'юніті чат</div>
                  <div className="text-gray-600 text-sm mt-1">Спілкування з ком'юніті</div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
