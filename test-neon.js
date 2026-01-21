const { PrismaClient } = require('@prisma/client')

async function test() {
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    console.log('✅ Connected to Neon successfully!')
    
    const userCount = await prisma.user.count()
    const eventCount = await prisma.event.count()
    
    console.log(`Users: ${userCount}`)
    console.log(`Events: ${eventCount}`)
    
    if (eventCount === 0) {
      console.log('No events yet. Creating a test event...')
      
      // Створимо тестового користувача
      const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
          email: 'test@example.com',
          name: 'Test User',
        },
      })
      
      // Створимо тестову подію
      const event = await prisma.event.create({
        data: {
          title: 'Test Event from CLI',
          description: 'This is a test event created via CLI',
          userId: user.id,
        },
      })
      
      console.log(`✅ Test event created: ${event.id}`)
    }
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error connecting to Neon:', error.message)
  }
}

test()
