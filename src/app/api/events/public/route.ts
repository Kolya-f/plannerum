import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔵 GET /api/events/public - Fetching public events')

    // Отримуємо тільки публічні події
    const publicEvents = await prisma.event.findMany({
      where: {
        isPublic: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20, // Обмежуємо кількість
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            dateOptions: true
          }
        }
      }
    })

    console.log(`✅ GET /api/events/public - Found ${publicEvents.length} events`)
    return NextResponse.json(publicEvents)

  } catch (error) {
    console.error('❌ GET /api/events/public - Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch public events' },
      { status: 500 }
    )
  }
}
