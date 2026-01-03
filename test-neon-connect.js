const { Client } = require('pg')

const connectionString = "postgresql://neondb_owner:npg_X0BwMnU9TkKP@ep-nameless-surf-ahu56hgm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

async function test() {
  console.log('🧪 Testing Neon connection...')
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })
  
  try {
    await client.connect()
    console.log('✅ Connected successfully!')
    
    // 1. Перевіримо таблиці
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    console.log('\n📋 Available tables:')
    tables.rows.forEach(table => console.log(`  - ${table.table_name}`))
    
    // 2. Перевіримо Event таблицю
    console.log('\n📅 Checking Event table structure:')
    const eventColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Event'
      ORDER BY ordinal_position
    `)
    eventColumns.rows.forEach(col => console.log(`  ${col.column_name}: ${col.data_type}`))
    
    // 3. Декілька івентів
    console.log('\n🎯 Sample events:')
    const events = await client.query('SELECT id, title, "description" FROM "Event" LIMIT 5')
    events.rows.forEach(event => {
      console.log(`  ID: ${event.id}`)
      console.log(`  Title: ${event.title}`)
      console.log(`  Desc: ${event.description || 'No description'}`)
      console.log('  ---')
    })
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
    console.log('\n🔌 Connection closed')
  }
}

test()
