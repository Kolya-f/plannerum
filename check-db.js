const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  try {
    // Перевірка структури таблиці Event
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Event'
      ORDER BY ordinal_position
    `
    
    console.log('Columns in Event table:')
    console.table(columns)
    
    // Спробуємо створити подію без createdById
    const event = await prisma.event.create({
      data: {
        title: 'Test Event',
        creatorName: 'Test User',
        isPublic: true
      }
    })
    
    console.log('✅ Event created successfully! ID:', event.id)
    
    // Видалимо тестову подію
    await prisma.event.delete({ where: { id: event.id } })
    console.log('✅ Test event deleted')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Error code:', error.code)
  } finally {
    await prisma.$disconnect()
  }
}

check()
