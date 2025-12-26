'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Event {
  id: string
  title: string
  description: string | null
  isPublic: boolean
  createdAt: string
  dateOptions: Array<{
    _count: {
      votes: number
    }
  }>
  _count: {
    dateOptions: number
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    if (status === 'authenticated') {
      fetchEvents()
    }
  }, [status, router])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
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

  if (status === 'loading' || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div>Loading dashboard...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

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
            <Link href="/events" style={{
              padding: '8px 16px',
              color: '#475569',
              textDecoration: 'none'
            }}>
              All Events
            </Link>
            <button
              onClick={() => signOut()}
              style={{
                padding: '8px 16px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
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
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            Welcome back, {session?.user?.name || session?.user?.email?.split('@')[0]}!
          </h1>
          <p style={{ color: '#64748b', marginBottom: '32px' }}>
            Manage your events and see voting results
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
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
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <Link href="/create-event" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                <span>+</span>
                <span>Create New Event</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Список подій */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#0f172a'
            }}>
              Your Events
            </h2>
            <Link href="/events" style={{
              padding: '8px 16px',
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              View All Public Events →
            </Link>
          </div>

          {events.length === 0 ? (
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
                📅
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                No events yet
              </h3>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>
                Create your first event to start planning!
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
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {events.map((event) => {
                const totalEventVotes = event.dateOptions.reduce((sum, opt) => sum + opt._count.votes, 0)
                
                return (
                  <div key={event.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.3s'
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
                          <span style={{
                            fontSize: '14px',
                            color: '#94a3b8'
                          }}>
                            {new Date(event.createdAt).toLocaleDateString()}
                          </span>
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
                      <div>
                        <span style={{ fontWeight: '500' }}>{event._count.dateOptions}</span> dates
                      </div>
                      <div>
                        <span style={{ fontWeight: '500' }}>{totalEventVotes}</span> votes
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
                        View Event
                      </Link>
                      <Link
                        href={`/event/${event.id}/results`}
                        style={{
                          flex: 1,
                          padding: '8px',
                          textAlign: 'center',
                          backgroundColor: '#f0f9ff',
                          color: '#0369a1',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        Results
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
