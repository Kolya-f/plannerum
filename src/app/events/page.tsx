'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface PublicEvent {
  id: string
  title: string
  description: string | null
  isPublic: boolean
  createdAt: string
  creator: {
    name: string | null
    email: string
  }
  dateOptions: Array<{
    _count: {
      votes: number
    }
  }>
  _count: {
    dateOptions: number
  }
}

export default function AllEventsPage() {
  const { data: session, status } = useSession()
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'public' | 'mine'>('all')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/all')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  // Фільтрація подій
  const filteredEvents = events.filter(event => {
    // Пошук по назві та опису
    if (search && !event.title.toLowerCase().includes(search.toLowerCase()) && 
        !(event.description && event.description.toLowerCase().includes(search.toLowerCase()))) {
      return false
    }
    
    // Фільтр по типу
    if (filter === 'public' && !event.isPublic) return false
    if (filter === 'mine' && session?.user?.id && event.creator.email !== session.user.email) return false
    
    return true
  })

  const totalVotes = events.reduce((sum, event) => 
    sum + event.dateOptions.reduce((optSum, opt) => optSum + opt._count.votes, 0), 0
  )

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Навігація */}
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '16px 32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#1e293b',
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              P
            </div>
            Plannerum
          </Link>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/" style={{
              padding: '8px 16px',
              color: '#475569',
              textDecoration: 'none'
            }}>
              Home
            </Link>
            <Link href="/dashboard" style={{
              padding: '8px 16px',
              color: '#475569',
              textDecoration: 'none'
            }}>
              Dashboard
            </Link>
            <Link href="/create-event" style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Create Event
            </Link>
          </div>
        </div>
      </nav>

      {/* Основний контент */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        {/* Заголовок і статистика */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            All Public Events
          </h1>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            Discover and join events from our community
          </p>
          
          {/* Статистика */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                {events.length}
              </div>
              <div style={{ color: '#64748b' }}>Total Events</div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                {totalVotes}
              </div>
              <div style={{ color: '#64748b' }}>Total Votes</div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
                {events.filter(e => e.isPublic).length}
              </div>
              <div style={{ color: '#64748b' }}>Public Events</div>
            </div>
          </div>

          {/* Пошук і фільтри */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <input
                type="text"
                placeholder="Search events by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              >
                <option value="all">All Events</option>
                <option value="public">Public Only</option>
                {status === 'authenticated' && <option value="mine">My Events</option>}
              </select>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              color: '#64748b'
            }}>
              <div>
                Showing {filteredEvents.length} of {events.length} events
              </div>
              <Link href="/create-event" style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                + Create New Event
              </Link>
            </div>
          </div>
        </div>

        {/* Список подій */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #dbeafe', 
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#64748b', marginTop: '16px' }}>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#3b82f6',
              margin: '0 auto 16px'
            }}>
              🔍
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '8px'
            }}>
              No events found
            </h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              {search ? 'Try a different search term' : 'Be the first to create an event!'}
            </p>
            <Link href="/create-event" style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Create First Event
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {filteredEvents.map((event) => {
              const totalEventVotes = event.dateOptions.reduce((sum, opt) => sum + opt._count.votes, 0)
              const isMyEvent = status === 'authenticated' && event.creator.email === session?.user?.email
              
              return (
                <div key={event.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: isMyEvent ? '2px solid #3b82f6' : 'none'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#0f172a',
                        marginBottom: '4px'
                      }}>
                        {event.title}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '8px'
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          borderRadius: '999px',
                          backgroundColor: event.isPublic ? '#d1fae5' : '#f1f5f9',
                          color: event.isPublic ? '#065f46' : '#475569'
                        }}>
                          {event.isPublic ? '🌍 Public' : '🔒 Private'}
                        </span>
                        {isMyEvent && (
                          <span style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            borderRadius: '999px',
                            backgroundColor: '#dbeafe',
                            color: '#1d4ed8'
                          }}>
                            My Event
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {event.description && (
                    <p style={{
                      color: '#64748b',
                      marginBottom: '16px',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      {event.description}
                    </p>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#1d4ed8',
                        fontWeight: 'bold'
                      }}>
                        {event.creator.name?.[0]?.toUpperCase() || event.creator.email[0].toUpperCase()}
                      </div>
                      <span>{event.creator.name || event.creator.email.split('@')[0]}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: '500' }}>{totalEventVotes}</span> votes
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>{event._count.dateOptions}</span> dates
                    </div>
                    <div>
                      {new Date(event.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/event/${event.id}`}
                      style={{
                        flex: 1,
                        padding: '8px',
                        textAlign: 'center',
                        backgroundColor: '#dbeafe',
                        color: '#1d4ed8',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      {event.isPublic ? 'Join & Vote' : 'View Event'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
