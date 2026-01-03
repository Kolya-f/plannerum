const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_X0BwMnU9TkKP@ep-nameless-surf-ahu56hgm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function test() {
  console.log('Testing connection...');
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected!');
    
    // Перевіримо Event таблицю
    const res = await client.query('SELECT COUNT(*) as count FROM "Event"');
    console.log(`📊 Total events in database: ${res.rows[0].count}`);
    
    // Покажемо декілька
    const events = await client.query('SELECT id, title FROM "Event" LIMIT 3');
    console.log('🎯 Sample events:');
    events.rows.forEach(event => {
      console.log(`  - ${event.id}: ${event.title}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

test();
