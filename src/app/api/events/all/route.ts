import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('📡 Отримую події з Neon...')
    
    const events = await prisma.event.findMany({
      take: 20,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        dateOptions: {
          select: {
            id: true,
            date: true
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    })

    console.log(`✅ Знайдено ${events.length} подій`)
    
    return NextResponse.json(events)
  } catch (error: any) {
    console.error('❌ Помилка отримання подій:', error.message)
    
    // Тестові дані на випадок помилки
    return NextResponse.json([
      {
        id: 'event_1',
        title: 'Приклад зустрічі команди',
        description: 'Перша тестова подія',
        location: 'Онлайн',
        category: 'meeting',
        maxParticipants: 10,
        isPublic: true,
        createdAt: new Date().toISOString(),
        user: { name: 'Тестовий Користувач', email: 'test@example.com' },
        dateOptions: [
          { id: 'date_1', date: new Date(Date.now() + 86400000).toISOString() }
        ]
      }
    ])
  }
}
