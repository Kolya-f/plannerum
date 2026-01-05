const { Client } = require('pg')

const connectionString = "postgresql://neondb_owner:npg_X0BwMnU9TkKP@ep-nameless-surf-ahu56hgm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

async function checkStructure() {
  console.log('🔍 Checking Event table structure...')
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })
  
  try {
    await client.connect()
    
    // Перевіримо колонки
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Event'
      ORDER BY ordinal_position
    `)
    
    console.log('\n📊 Event table columns:')
    columns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : ''}`)
    })
    
    // Перевіримо декілька записів
    console.log('\n🎯 Sample events:')
    const sample = await client.query('SELECT * FROM "Event" LIMIT 3')
    sample.rows.forEach((event, i) => {
      console.log(`\nEvent ${i + 1}:`)
      Object.entries(event).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`)
      })
    })
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

checkStructure()
