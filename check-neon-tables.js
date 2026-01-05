const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  try {
    // Перевірка таблиць
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log('✅ Tables found:', tables.map(t => t.table_name))
    
    // Спробуємо створити тестового користувача
    const testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "test123"
      }
    })
    console.log('✅ Test user created:', testUser.email)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

check()
