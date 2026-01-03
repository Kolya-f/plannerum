import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Fetching events from database...')
    
    // Тестуємо підключення до бази
    await prisma.$connect()
    
    const events = await prisma.event.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    console.log(`Found ${events.length} events`)
    
    await prisma.$disconnect()
    
    return NextResponse.json(events)
  } catch (error) {
    console.error('Database error:', error)
    
    // Fallback data if database fails
    const fallbackEvents = [
      {
        id: '1',
        title: 'Community Meeting',
        description: 'Monthly community gathering',
        user: { name: 'Test User', email: 'test@example.com' },
        createdAt: new Date().toISOString(),
        date: new Date().toISOString(),
        location: 'Online'
      },
      {
        id: '2',
        title: 'Birthday Party',
        description: "Celebrating John's birthday",
        user: { name: 'John Doe', email: 'john@example.com' },
        createdAt: new Date().toISOString(),
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'City Park'
      }
    ]
    
    return NextResponse.json(fallbackEvents)
  }
}
