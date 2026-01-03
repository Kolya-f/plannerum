import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
    const { title, description, date, location, category, maxParticipants } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Знаходимо або створюємо користувача
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || session.user.email.split('@')[0],
      },
    })

    // Створюємо подію
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: date ? new Date(date) : null,
        location,
        category: category || 'other',
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        userId: user.id,
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
