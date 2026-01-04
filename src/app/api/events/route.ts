import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        dateOptions: {
          select: {
            id: true,
            date: true
          }
        },
        votes: {
          select: {
            id: true,
            voteType: true
          }
        },
        chatMessages: {
          select: {
            id: true
          }
        }
      }
    })

    // Добавляем количество для удобства
    const eventsWithCounts = events.map(event => ({
      ...event,
      _count: {
        votes: event.votes.length,
        chatMessages: event.chatMessages.length
      }
    }))

    return NextResponse.json({ 
      events: eventsWithCounts,
      total: events.length 
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ 
      events: [],
      total: 0,
      error: 'Failed to fetch events'
    })
  }
}
