const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testAll() {
  console.log('🔍 Testing all models...')
  
  try {
    // 1. User
    const userCount = await prisma.user.count()
    console.log(`👥 Users: ${userCount}`)
    
    // 2. Event
    const events = await prisma.event.findMany({
      take: 2,
      select: { id: true, title: true, creatorId: true }
    })
    console.log(`📅 Events: ${events.length}`, events)
    
    // 3. DateOption
    const dateOptions = await prisma.dateOption.count()
    console.log(`📆 DateOptions: ${dateOptions}`)
    
    // 4. Vote
    const votes = await prisma.vote.count()
    console.log(`🗳️ Votes: ${votes}`)
    
    // 5. Структура Event
    const eventColumns = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'Event'
    `
    console.log('🗂️ Event columns:', eventColumns)
    
  } catch (error) {
    console.error('❌ TEST ERROR:', error.message)
    console.error('Code:', error.code)
    console.error('Meta:', error.meta?.target || 'No target')
  } finally {
    await prisma.$disconnect()
  }
}

testAll()
