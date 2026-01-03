import { NextResponse } from 'next/server'

// Mock events data
const events = [
  {
    id: '1',
    title: 'Welcome to Plannerum!',
    description: 'This is a sample event to get started',
    userId: '1',
    date: new Date(Date.now() + 86400000).toISOString(),
    location: 'Online',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Community Meeting',
    description: 'Join our monthly community gathering',
    userId: '2',
    date: new Date(Date.now() + 172800000).toISOString(),
    location: 'City Hall',
    createdAt: new Date().toISOString(),
  }
]

const users = [
  { id: '1', email: 'test@example.com', name: 'Test User' },
  { id: '2', email: 'admin@example.com', name: 'Admin User' }
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    
    const event = events.find(e => e.id === id)
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const user = users.find(u => u.id === event.userId) || users[0]
    
    const eventWithUser = {
      ...event,
      user: {
        name: user.name,
        email: user.email
      }
    }

    return NextResponse.json(eventWithUser)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}
