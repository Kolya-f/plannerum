import { Client } from 'pg'

export async function queryNeon(sql: string, params?: any[]) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })
  
  try {
    await client.connect()
    const result = await client.query(sql, params)
    return result.rows
  } finally {
    await client.end()
  }
}

export async function getEvents() {
  return queryNeon(`
    SELECT 
      e.*,
      u."name" as "creatorName",
      COUNT(v.id) as "voteCount"
    FROM "Event" e
    LEFT JOIN "User" u ON e."creatorId" = u.id
    LEFT JOIN "Vote" v ON e.id = v."eventId"
    GROUP BY e.id, u.id
    ORDER BY e."createdAt" DESC
    LIMIT 20
  `)
}
