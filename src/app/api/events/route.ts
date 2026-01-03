import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('📡 Fetching events from database...')
    const startTime = Date.now()
    
    // Отримуємо події - використовуємо creatorName, не creatorId
    const events = await prisma.event.findMany({
      include: {
        dateOptions: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      // Обмежуємо для тесту
      take: 50
    })

    const duration = Date.now() - startTime
    console.log(`✅ Connected in ${duration}ms`)
    console.log(`✅ Query took ${duration}ms, found ${events.length} events`)
    
    // Форматуємо дати для фронтенду
    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      creatorName: event.creatorName, // Тільки creatorName
      location: event.location,
      category: event.category,
      maxParticipants: event.maxParticipants,
      isPublic: event.isPublic,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      dateOptions: event.dateOptions.map(option => ({
        id: option.id,
        date: option.date?.toISOString(),
        createdAt: option.createdAt.toISOString()
      }))
    }))

    return NextResponse.json(formattedEvents)
    
  } catch (error: any) {
    console.error('❌ Database error:', error.message)
    
    // Повертаємо тестові дані для розробки
    return NextResponse.json([
      {
        id: 'test-1',
        title: 'Team Meeting',
        description: 'Weekly team sync',
        creatorName: 'Alex Johnson',
        location: 'Conference Room A',
        category: 'meeting',
        maxParticipants: 10,
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dateOptions: []
      },
      {
        id: 'test-2',
        title: 'Birthday Party',
        description: 'Celebrating Sarah\'s birthday',
        creatorName: 'Mike Smith',
        location: 'Central Park',
        category: 'party',
        maxParticipants: 30,
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dateOptions: []
      }
    ])
  } finally {
    await prisma.$disconnect()
  }
}
