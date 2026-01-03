const { Client } = require('pg')

const connectionString = "postgresql://neondb_owner:npg_X0BwMnU9TkKP@ep-nameless-surf-ahu56hgm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

async function test() {
  console.log('🔌 Testing connection...')
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000, // 5 секунд таймаут
  })
  
  const startTime = Date.now()
  
  try {
    await client.connect()
    console.log(`✅ Connected in ${Date.now() - startTime}ms`)
    
    // Простий запит
    console.log('📊 Testing query...')
    const queryStart = Date.now()
    const result = await client.query('SELECT COUNT(*) as count FROM "Event"')
    console.log(`✅ Query took ${Date.now() - queryStart}ms`)
    console.log(`📅 Total events: ${result.rows[0].count}`)
    
    // Тест з JOIN
    console.log('\n🧪 Testing JOIN query...')
    const joinStart = Date.now()
    const joinResult = await client.query(`
      SELECT 
        e.id,
        e.title,
        e.description,
        e."creatorId",
        e."createdAt",
        u."name" as "creatorName"
      FROM "Event" e
      LEFT JOIN "User" u ON e."creatorId" = u.id
      LIMIT 3
    `)
    console.log(`✅ JOIN query took ${Date.now() - joinStart}ms`)
    console.log('🎯 Results:', joinResult.rows)
    
  } catch (error) {
    console.error(`❌ Error after ${Date.now() - startTime}ms:`, error.message)
  } finally {
    await client.end()
    console.log('\n🔌 Connection closed')
  }
}

// Запуск з таймаутом
const timeout = setTimeout(() => {
  console.error('⏰ Timeout - connection taking too long')
  process.exit(1)
}, 10000)

test().then(() => {
  clearTimeout(timeout)
}).catch(err => {
  clearTimeout(timeout)
  console.error('Test failed:', err)
})
