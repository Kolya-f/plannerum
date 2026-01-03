import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

// In-memory storage
const events: any[] = []
const users: any[] = []

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, date, location } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Знаходимо або створюємо користувача
    let user = users.find(u => u.email === session.user.email)
    if (!user) {
      user = {
        id: Date.now().toString(),
        email: session.user.email,
        name: session.user.name || session.user.email.split('@')[0],
      }
      users.push(user)
    }

    // Створюємо подію
    const event = {
      id: Date.now().toString(),
      title,
      description,
      date: date || new Date(Date.now() + 86400000).toISOString(),
      location,
      userId: user.id,
      createdAt: new Date().toISOString(),
    }
    
    events.push(event)

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
