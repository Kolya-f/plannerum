'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, Meh } from 'lucide-react'

interface VoteButtonsProps {
  eventId: string
  dateOptionId: string
  onVote: (voteType: string) => Promise<void>
  currentVote?: string | null
  disabled?: boolean
}

export default function VoteButtons({ 
  eventId, 
  dateOptionId, 
  onVote, 
  currentVote,
  disabled = false
}: VoteButtonsProps) {
  const [loading, setLoading] = useState(false)

  const handleVote = async (voteType: string) => {
    if (disabled) {
      alert('Будь ласка, увійдіть для голосування')
      return
    }

    setLoading(true)
    try {
      await onVote(voteType)
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setLoading(false)
    }
  }

  if (disabled) {
    return (
      <div className="text-sm text-gray-500">
        Увійдіть для голосування
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleVote('yes')}
        disabled={loading}
        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
          currentVote === 'yes'
            ? 'bg-green-600 text-white'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        } disabled:opacity-50`}
      >
        <ThumbsUp className="w-4 h-4 inline mr-1" />
        Так
      </button>
      
      <button
        onClick={() => handleVote('no')}
        disabled={loading}
        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
          currentVote === 'no'
            ? 'bg-red-600 text-white'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        } disabled:opacity-50`}
      >
        <ThumbsDown className="w-4 h-4 inline mr-1" />
        Ні
      </button>
      
      <button
        onClick={() => handleVote('maybe')}
        disabled={loading}
        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
          currentVote === 'maybe'
            ? 'bg-yellow-600 text-white'
            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
        } disabled:opacity-50`}
      >
        <Meh className="w-4 h-4 inline mr-1" />
        Можливо
      </button>
    </div>
  )
}
