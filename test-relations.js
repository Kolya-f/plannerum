const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  console.log('🔍 Testing bidirectional relations...')
  
  try {
    // 1. Перевірка підключення
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection OK')
    
    // 2. Отримаємо користувача з подіями
    const userWithEvents = await prisma.user.findFirst({
      include: {
        events: {
          take: 2,
          select: { id: true, title: true }
        }
      }
    })
    
    console.log('👤 User with events:', {
      email: userWithEvents?.email,
      eventCount: userWithEvents?.events?.length || 0,
      events: userWithEvents?.events
    })
    
    // 3. Отримаємо події з creator
    const eventsWithCreator = await prisma.event.findMany({
      take: 2,
      include: {
        creator: {
          select: { email: true }
        }
      }
    })
    
    console.log('📅 Events with creator:', eventsWithCreator.map(e => ({
      title: e.title,
      creator: e.creator.email
    })))
    
    // 4. Спробуємо створити нову подію
    if (userWithEvents) {
      const newEvent = await prisma.event.create({
        data: {
          title: 'Test Event ' + Date.now(),
          description: 'Testing bidirectional relations',
          creatorId: userWithEvents.id,
          isPublic: true
        },
        include: {
          creator: {
            select: { email: true }
          }
        }
      })
      
      console.log('✅ New event created:', {
        title: newEvent.title,
        creatorEmail: newEvent.creator.email,
        creatorId: newEvent.creatorId
      })
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message)
    console.error('Code:', error.code)
    console.error('Stack:', error.stack?.split('\n')[0])
  } finally {
    await prisma.$disconnect()
  }
}

test()
