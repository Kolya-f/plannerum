const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testVote() {
  try {
    // 1. Створити тестову подію
    const event = await prisma.event.create({
      data: {
        title: 'Test Event for Voting',
        creatorName: 'Test User',
        creatorId: 'test-user-id'
      }
    })
    console.log('✅ Event created:', event.id)

    // 2. Створити дати для голосування
    const dateOption = await prisma.dateOption.create({
      data: {
        eventId: event.id,
        date: new Date()
      }
    })
    console.log('✅ Date option created:', dateOption.id)

    // 3. Проголосувати
    const vote = await prisma.vote.create({
      data: {
        dateOptionId: dateOption.id,
        userId: 'user-123',
        userName: 'John Doe',
        voteType: 'yes'
      }
    })
    console.log('✅ Vote created:', vote.id)

    // 4. Перевірити голоси
    const votes = await prisma.vote.findMany({
      where: { dateOptionId: dateOption.id }
    })
    console.log('✅ Votes found:', votes.length)

    // 5. Очистити тестові дані
    await prisma.vote.deleteMany({ where: { dateOptionId: dateOption.id } })
    await prisma.dateOption.deleteMany({ where: { eventId: event.id } })
    await prisma.event.deleteMany({ where: { id: event.id } })
    console.log('✅ Test data cleaned up')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testVote()
