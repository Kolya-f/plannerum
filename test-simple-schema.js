const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  console.log('🔍 Testing simplified schema...')
  
  try {
    // 1. Створимо тестову подію
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('❌ No users found')
      return
    }
    
    const event = await prisma.event.create({
      data: {
        title: 'Test Event - Simple Schema',
        description: 'Testing without votes in Event',
        creatorId: user.id,
        isPublic: true,
        dateOptions: {
          create: [
            { date: new Date('2024-12-29T10:00:00Z') }
          ]
        }
      },
      include: {
        dateOptions: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        }
      }
    })
    
    console.log('✅ Event created:', event.title)
    console.log('Date options:', event.dateOptions.length)
    
    // 2. Отримаємо події з підрахунком голосів
    const events = await prisma.event.findMany({
      where: { creatorId: user.id },
      include: {
        dateOptions: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        }
      }
    })
    
    console.log('\\n📊 All events for user:')
    events.forEach(e => {
      const totalVotes = e.dateOptions.reduce((sum, opt) => sum + opt._count.votes, 0)
      console.log(`- ${e.title}: ${e.dateOptions.length} dates, ${totalVotes} votes`)
    })
    
  } catch (error) {
    console.error('❌ ERROR:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()
