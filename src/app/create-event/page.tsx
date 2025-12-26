'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface DateOption {
  date: string
  time: string
}

export default function CreateEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dateOptions, setDateOptions] = useState<DateOption[]>([
    { date: '', time: '18:00' }
  ])

  const addDateOption = () => {
    setDateOptions([...dateOptions, { date: '', time: '18:00' }])
  }

  const removeDateOption = (index: number) => {
    if (dateOptions.length > 1) {
      const newOptions = [...dateOptions]
      newOptions.splice(index, 1)
      setDateOptions(newOptions)
    }
  }

  const updateDateOption = (index: number, field: keyof DateOption, value: string) => {
    const newOptions = [...dateOptions]
    newOptions[index][field] = value
    setDateOptions(newOptions)
  }

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>
            Access Denied
          </h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>You must be signed in to create events.</p>
          <Link
            href="/auth/signin"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Валідація дат
    const invalidDates = dateOptions.filter(opt => !opt.date)
    if (invalidDates.length > 0) {
      setError('Please fill in all date fields')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          isPublic,
          dateOptions: dateOptions.map(opt => ({
            date: new Date(`${opt.date}T${opt.time}`).toISOString()
          }))
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event')
      }

      // Перенаправляємо на сторінку події
      router.push(`/event/${data.event.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '32px 16px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#3b82f6',
              textDecoration: 'none',
              marginBottom: '16px'
            }}
          >
            ← Back to Dashboard
          </Link>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            Create New Event
          </h1>
          <p style={{ color: '#64748b' }}>Plan your event and invite others to vote on dates.</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#dc2626',
                padding: '12px 16px',
                borderRadius: '8px'
              }}>
                {error}
              </div>
            )}

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="Team Meeting, Birthday Party, etc."
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Description (optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical'
                }}
                placeholder="Add details about your event..."
              />
            </div>

            {/* Вибір публічність/приватність */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '12px'
              }}>
                Event Visibility
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="visibility"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>🌍 Public Event</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Anyone with the link can view and vote</div>
                  </div>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="visibility"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>🔒 Private Event</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Only you and invited people can view</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Додавання дат */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Date Options *
                </label>
                <button
                  type="button"
                  onClick={addDateOption}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  + Add Date
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {dateOptions.map((option, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="date"
                        required
                        value={option.date}
                        onChange={(e) => updateDateOption(index, 'date', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="time"
                        value={option.time}
                        onChange={(e) => updateDateOption(index, 'time', e.target.value)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    {dateOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDateOption(index)}
                        style={{
                          padding: '8px',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: loading ? '#93c5fd' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          <p>Participants will be able to vote on which date works best for them.</p>
        </div>
      </div>
    </div>
  )
}
