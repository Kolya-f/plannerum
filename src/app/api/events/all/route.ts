export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    console.log('🔵 GET /api/events/all - Fetching all events')
    const session = await getServerSession(authOptions)

    // Отримуємо всі публічні події + приватні події поточного користувача
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { isPublic: true }, // Всі публічні події
          ...(session?.user?.id ? [{ creatorId: session.user.id }] : []) // Приватні події поточного користувача
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        dateOptions: {
          include: {
            _count: {
              select: {
                votes: true
              }
            }
          }
        },
        _count: {
          select: {
            dateOptions: true
          }
        }
      }
    })

    console.log(`✅ GET /api/events/all - Found ${events.length} events`)
    return NextResponse.json(events)

  } catch (error) {
    console.error('❌ GET /api/events/all - Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
