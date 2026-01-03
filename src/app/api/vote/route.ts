export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      eventId,
      dateOptionId,
      userId,
      userName,
      userEmail,
      voteType
    } = body

    if (!eventId || !dateOptionId || !voteType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate vote type
    const validVoteTypes = ['yes', 'no', 'maybe']
    if (!validVoteTypes.includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      )
    }

    // Create or update vote
    const vote = await prisma.vote.upsert({
      where: {
        userId_eventId: {
          userId: userId || 'demo-user',
          eventId
        }
      },
      update: {
        dateOptionId,
        voteType,
        userName: userName || 'Демо Користувач',
        userEmail: userEmail || 'demo@example.com'
      },
      create: {
        eventId,
        dateOptionId,
        userId: userId || 'demo-user',
        userName: userName || 'Демо Користувач',
        userEmail: userEmail || 'demo@example.com',
        voteType
      },
      include: {
        user: true,
        dateOption: true,
        event: true
      }
    })

    return NextResponse.json(vote, { status: 201 })
  } catch (error) {
    console.error('Error creating vote:', error)
    return NextResponse.json(
      { error: 'Failed to create vote' },
      { status: 500 }
    )
  }
}
