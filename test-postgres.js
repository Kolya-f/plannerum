const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testPostgres() {
  console.log('🔵 Testing PostgreSQL connection...')
  
  try {
    // Проста перевірка підключення
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ PostgreSQL connection successful!', result)
    
    // Спробуємо створити таблиці
    console.log('🔵 Running Prisma migrate...')
    
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message)
    console.log('Error details:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPostgres()
