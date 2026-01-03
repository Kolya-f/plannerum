import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession()
    
    // Mock stats
    const stats = {
      totalEvents: 5,
      totalVotes: 12,
      upcomingEvents: 3
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to get stats',
      totalEvents: 0,
      totalVotes: 0,
      upcomingEvents: 0
    }, { status: 500 })
  }
}
