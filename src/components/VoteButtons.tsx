'use client';

import { useState } from 'react';

interface VoteButtonsProps {
  dateOptionId: string;
  eventId: string;
  currentVote?: string;
  onVoteSuccess?: () => void;
}

export default function VoteButtons({ 
  dateOptionId, 
  eventId, 
  currentVote,
  onVoteSuccess 
}: VoteButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVote, setSelectedVote] = useState(currentVote);

  const handleVote = async (voteType: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateOptionId,
          voteType
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedVote(voteType);
        if (onVoteSuccess) {
          onVoteSuccess();
        }
        alert('✅ Голос успішно враховано!');
      } else {
        alert(`❌ Помилка: ${data.error}`);
      }
    } catch (error) {
      console.error('Помилка голосування:', error);
      alert('❌ Помилка при голосуванні');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonClass = (voteType: string) => {
    const baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-200 ";
    
    if (selectedVote === voteType) {
      switch(voteType) {
        case 'yes': return baseClass + "bg-green-600 text-white shadow-lg";
        case 'maybe': return baseClass + "bg-yellow-600 text-white shadow-lg";
        case 'no': return baseClass + "bg-red-600 text-white shadow-lg";
        default: return baseClass;
      }
    } else {
      return baseClass + "bg-gray-100 hover:bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={() => handleVote('yes')}
        disabled={isLoading}
        className={getButtonClass('yes')}
      >
        {isLoading && selectedVote === 'yes' ? '...' : '👍 Так'}
      </button>
      
      <button
        onClick={() => handleVote('maybe')}
        disabled={isLoading}
        className={getButtonClass('maybe')}
      >
        {isLoading && selectedVote === 'maybe' ? '...' : '🤔 Можливо'}
      </button>
      
      <button
        onClick={() => handleVote('no')}
        disabled={isLoading}
        className={getButtonClass('no')}
      >
        {isLoading && selectedVote === 'no' ? '...' : '👎 Ні'}
      </button>
    </div>
  );
}
