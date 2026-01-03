import { NextResponse } from 'next/server'

// In-memory storage
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
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
  }
]

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Додамо інформацію про користувачів
    const eventsWithUsers = events.map(event => {
      const user = users.find(u => u.id === event.userId) || users[0]
      return {
        ...event,
        user: {
          name: user.name,
          email: user.email
        }
      }
    })
    
    return NextResponse.json(eventsWithUsers)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json([
      {
        id: 'fallback-1',
        title: 'Sample Event 1',
        description: 'This is a fallback event',
        user: { name: 'System', email: 'system@example.com' },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'fallback-2',
        title: 'Sample Event 2',
        description: 'Try creating your own event!',
        user: { name: 'Admin', email: 'admin@example.com' },
        createdAt: new Date().toISOString(),
      }
    ])
  }
}
