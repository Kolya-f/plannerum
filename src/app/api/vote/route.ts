import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

// In-memory storage for votes
const votes: any[] = []

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { eventId, option } = body

    if (!eventId || !option) {
      return NextResponse.json(
        { error: 'Event ID and option are required' },
        { status: 400 }
      )
    }

    // Check if user already voted for this event
    const existingVoteIndex = votes.findIndex(
      v => v.eventId === eventId && v.userEmail === session.user.email
    )

    if (existingVoteIndex >= 0) {
      // Update existing vote
      votes[existingVoteIndex] = {
        ...votes[existingVoteIndex],
        option,
        updatedAt: new Date().toISOString()
      }
    } else {
      // Create new vote
      votes.push({
        id: Date.now().toString(),
        eventId,
        option,
        userEmail: session.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Vote recorded',
      totalVotes: votes.length
    })
  } catch (error) {
    console.error('Error recording vote:', error)
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's votes
    const userVotes = votes.filter(v => v.userEmail === session.user.email)

    return NextResponse.json({
      votes: userVotes,
      totalVotes: userVotes.length
    })
  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}
