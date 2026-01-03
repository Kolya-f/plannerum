'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface VoteButtonsProps {
  eventId: string
  dateOptionId: string
  date: Date
}

export default function VoteButtons({ eventId, dateOptionId, date }: VoteButtonsProps) {
  const { data: session } = useSession()
  const [userVote, setUserVote] = useState<string | null>(null)
  const [voteStats, setVoteStats] = useState({ yes: 0, no: 0, maybe: 0 })
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (session?.user?.email && !initialized) {
      fetchVoteData()
      setInitialized(true)
    }
  }, [session, eventId, dateOptionId])

  const fetchVoteData = async () => {
    try {
      const response = await fetch(`/api/vote?eventId=${eventId}`)
      if (response.ok) {
        const data = await response.json()
        
        // Знайти голос користувача для цієї дати
        const userVoteForThisDate = data.userVotes?.find(
          (vote: any) => vote.dateOptionId === dateOptionId
        )
        
        setUserVote(userVoteForThisDate?.userVote || null)
        
        // Оновити статистику
        const stats = data.stats?.[dateOptionId] || { yes: 0, no: 0, maybe: 0 }
        setVoteStats(stats)
      }
    } catch (error) {
      console.error('Error fetching vote data:', error)
    }
  }

  const handleVote = async (voteType: string) => {
    if (!session?.user?.email) {
      alert('Будь ласка, увійдіть в систему для голосування')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateOptionId,
          voteType
        })
      })

      const data = await response.json()

      if (response.ok) {
        setUserVote(voteType)
        setVoteStats(data.stats || { yes: 0, no: 0, maybe: 0 })
      } else {
        alert(data.error || 'Помилка при голосуванні')
      }
    } catch (error) {
      console.error('Error voting:', error)
      alert('Помилка при голосуванні')
    } finally {
      setLoading(false)
    }
  }

  const getButtonClass = (type: string) => {
    const baseClass = "flex-1 py-2 px-3 text-sm rounded-md transition-colors duration-200 font-medium "
    
    if (userVote === type) {
      switch(type) {
        case 'yes': return baseClass + "bg-green-500 text-white"
        case 'no': return baseClass + "bg-red-500 text-white"
        case 'maybe': return baseClass + "bg-yellow-500 text-white"
        default: return baseClass + "bg-gray-200"
      }
    }
    
    return baseClass + "bg-gray-100 hover:bg-gray-200 text-gray-700"
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('uk-UA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="mt-3">
      <div className="text-sm text-gray-600 mb-2">
        {formatDate(date)}
      </div>
      
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => handleVote('yes')}
          disabled={loading}
          className={getButtonClass('yes')}
          title="Так"
        >
          👍 {voteStats.yes}
        </button>
        
        <button
          onClick={() => handleVote('maybe')}
          disabled={loading}
          className={getButtonClass('maybe')}
          title="Можливо"
        >
          🤔 {voteStats.maybe}
        </button>
        
        <button
          onClick={() => handleVote('no')}
          disabled={loading}
          className={getButtonClass('no')}
          title="Ні"
        >
          👎 {voteStats.no}
        </button>
      </div>
      
      {userVote && (
        <div className="text-xs text-gray-500 mt-1">
          Ваш голос: 
          <span className={`ml-1 font-medium ${
            userVote === 'yes' ? 'text-green-600' :
            userVote === 'no' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {userVote === 'yes' ? 'Так' : userVote === 'no' ? 'Ні' : 'Можливо'}
          </span>
        </div>
      )}
      
      <div className="text-xs text-gray-400 mt-1">
        Всього голосів: {voteStats.yes + voteStats.no + voteStats.maybe}
      </div>
    </div>
  )
}
