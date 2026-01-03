import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

// Mock votes data
const votes = [
  {
    id: '1',
    eventId: '1',
    option: 'yes',
    userEmail: 'test@example.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    eventId: '1',
    option: 'maybe',
    userEmail: 'admin@example.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    eventId: '2',
    option: 'yes',
    userEmail: 'test@example.com',
    createdAt: new Date().toISOString(),
  }
]

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    let filteredVotes = votes
    
    if (eventId) {
      filteredVotes = votes.filter(v => v.eventId === eventId)
    }

    // Count votes by option
    const voteCounts = filteredVotes.reduce((acc, vote) => {
      acc[vote.option] = (acc[vote.option] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      votes: filteredVotes,
      totalVotes: filteredVotes.length,
      voteCounts,
      userVoted: filteredVotes.some(v => v.userEmail === session.user.email)
    })
  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}
