'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, Meh } from 'lucide-react'

interface VoteButtonsProps {
  eventId: string
  dateOptionId: string
  initialVote?: string | null
  onVoteSuccess?: () => void
  disabled?: boolean
  onVote: (voteType: string) => void
}

export default function VoteButtons({ 
  eventId, 
  dateOptionId, 
  initialVote,
  onVoteSuccess,
  disabled = false,
  onVote
}: VoteButtonsProps) {
  const [currentVote, setCurrentVote] = useState<string | null>(initialVote || null)
  const [loading, setLoading] = useState(false)

  const handleVote = async (voteType: string) => {
    if (disabled || loading) return
    
    setLoading(true)
    try {
      await onVote(voteType)
      setCurrentVote(voteType)
      if (onVoteSuccess) {
        onVoteSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  const voteTypes = [
    { type: 'yes', label: 'Так', icon: ThumbsUp, color: 'bg-green-500 hover:bg-green-600 text-white' },
    { type: 'no', label: 'Ні', icon: ThumbsDown, color: 'bg-red-500 hover:bg-red-600 text-white' },
    { type: 'maybe', label: 'Можливо', icon: Meh, color: 'bg-yellow-500 hover:bg-yellow-600 text-white' }
  ]

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {voteTypes.map(({ type, label, icon: Icon, color }) => {
          const isActive = currentVote === type
          const baseColor = color.split(' ')[0]
          
          return (
            <button
              key={type}
              onClick={() => handleVote(type)}
              disabled={disabled || loading}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium
                transition-all disabled:opacity-50 disabled:cursor-not-allowed
                ${isActive 
                  ? `${baseColor} ring-2 ring-offset-2 ring-${baseColor.split('-')[1]}-300` 
                  : `${color}`
                }
                ${loading ? 'opacity-70 cursor-wait' : ''}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              {loading && currentVote === type && (
                <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>
          )
        })}
      </div>
      
      {disabled && !currentVote && (
        <div className="text-sm text-gray-500 italic">
          Увійдіть для голосування
        </div>
      )}
    </div>
  )
}
