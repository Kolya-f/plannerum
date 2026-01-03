const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testNeon() {
  console.log('🔵 Testing Neon PostgreSQL connection...')
  
  try {
    const result = await prisma.$queryRaw`SELECT 1 as neon_test`
    console.log('✅ Neon connection successful!', result)
    
    // Створимо тестову таблицю
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS neon_test (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    
    // Додамо тестові дані
    await prisma.$executeRaw`
      INSERT INTO neon_test (message) 
      VALUES ('🚀 Plannerum connected to Neon!')
    `
    
    // Прочитаємо
    const data = await prisma.$queryRaw`SELECT * FROM neon_test`
    console.log('📊 Test data:', data)
    
  } catch (error) {
    console.error('❌ Neon connection failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testNeon()
