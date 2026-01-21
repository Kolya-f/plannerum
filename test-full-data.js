const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  console.log('🎯 Creating test data and testing relations...')
  
  try {
    // 1. Створимо тестового користувача
    const testUser = await prisma.user.create({
      data: {
        name: 'Test Creator',
        email: `creator_${Date.now()}@test.com`,
        password: 'hashed_password_123'
      }
    })
    console.log('✅ Test user created:', testUser.email)
    
    // 2. Створимо тестову подію
    const testEvent = await prisma.event.create({
      data: {
        title: 'Team Meeting',
        description: 'Weekly sync meeting',
        creatorId: testUser.id,
        isPublic: true,
        dateOptions: {
          create: [
            { date: new Date('2024-12-26T10:00:00Z') },
            { date: new Date('2024-12-27T14:00:00Z') },
            { date: new Date('2024-12-28T16:00:00Z') }
          ]
        }
      },
      include: {
        creator: true,
        dateOptions: true
      }
    })
    console.log('✅ Test event created:', {
      title: testEvent.title,
      creator: testEvent.creator.email,
      dateOptions: testEvent.dateOptions.length
    })
    
    // 3. Створимо голоси
    const votes = await Promise.all(
      testEvent.dateOptions.map(async (option, index) => {
        return await prisma.vote.create({
          data: {
            dateOptionId: option.id,
            userId: testUser.id,
            type: index === 0 ? 'yes' : 'maybe' // Перший варіант - yes, інші - maybe
          }
        })
      })
    )
    console.log('✅ Votes created:', votes.length)
    
    // 4. ПЕРЕВІРКА ЗВ'ЯЗКІВ
    
    // A. Користувач → Події
    const userFromDb = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        events: {
          include: {
            dateOptions: {
              include: {
                votes: true
              }
            }
          }
        },
        votes: true
      }
    })
    
    console.log('\\n🔗 USER → EVENTS RELATION:')
    console.log('User has', userFromDb.events.length, 'events')
    console.log('First event title:', userFromDb.events[0]?.title)
    console.log('Total votes by user:', userFromDb.votes.length)
    
    // B. Подія → Користувач
    const eventFromDb = await prisma.event.findUnique({
      where: { id: testEvent.id },
      include: {
        creator: { select: { email: true, name: true } },
        dateOptions: {
          include: {
            votes: {
              include: {
                user: { select: { email: true } }
              }
            }
          }
        },
        _count: {
          select: { dateOptions: true, votes: true }
        }
      }
    })
    
    console.log('\\n🔗 EVENT → CREATOR RELATION:')
    console.log('Event creator:', eventFromDb.creator.email)
    console.log('Date options:', eventFromDb._count.dateOptions)
    console.log('Total votes:', eventFromDb._count.votes)
    
    // 5. Перевірка всіх даних
    console.log('\\n📊 ALL DATA SUMMARY:')
    const userCount = await prisma.user.count()
    const eventCount = await prisma.event.count()
    const dateOptionCount = await prisma.dateOption.count()
    const voteCount = await prisma.vote.count()
    
    console.log('Total users:', userCount)
    console.log('Total events:', eventCount)
    console.log('Total date options:', dateOptionCount)
    console.log('Total votes:', voteCount)
    
    return {
      testUser,
      testEvent,
      votes
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message)
    console.error('Details:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

test().then(() => {
  console.log('\\n🎉 Test completed successfully!')
}).catch((error) => {
  console.error('\\n💥 Test failed:', error.message)
  process.exit(1)
})
