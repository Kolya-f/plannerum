import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId: eventId } = await params
    const session = await getServerSession(authOptions)
    
    console.log('🟢 POST /api/events/[publicId]/vote - Event:', eventId)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to vote.' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { dateOptionId, voteType = 'yes' } = await request.json()
    
    console.log('📝 Vote data:', { dateOptionId, voteType, userId: user.id })
    
    if (!dateOptionId) {
      return NextResponse.json(
        { error: 'Missing dateOptionId' },
        { status: 400 }
      )
    }

    const dateOption = await prisma.dateOption.findFirst({
      where: {
        id: dateOptionId,
        eventId: eventId
      }
    })

    if (!dateOption) {
      return NextResponse.json(
        { error: 'Date option not found in this event' },
        { status: 404 }
      )
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: user.id,
        dateOptionId: dateOptionId
      }
    })

    let vote
    if (existingVote) {
      vote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { type: voteType }
      })
      console.log('🔄 Updated existing vote:', vote.id)
    } else {
      vote = await prisma.vote.create({
        data: {
          dateOptionId,
          userId: user.id,
          type: voteType
        }
      })
      console.log('✅ Created new vote:', vote.id)
    }

    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        dateOptions: {
          include: {
            votes: {
              include: {
                user: {
                  select: { name: true, email: true }
                }
              }
            },
            _count: {
              select: { votes: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: existingVote ? 'Vote updated' : 'Vote submitted',
      vote: vote,
      event: updatedEvent
    })

  } catch (error: any) {
    console.error('🔴 POST /api/events/[publicId]/vote - Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process vote',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId: eventId } = await params
    
    console.log('🔵 GET /api/events/[publicId]/vote - Event:', eventId)

    const votes = await prisma.vote.findMany({
      where: {
        dateOption: {
          eventId: eventId
        }
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        dateOption: {
          select: { date: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const votesByDate = votes.reduce((acc, vote) => {
      const dateStr = vote.dateOption.date.toISOString()
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(vote)
      return acc
    }, {} as Record<string, typeof votes>)

    return NextResponse.json({
      success: true,
      totalVotes: votes.length,
      votesByDate,
      votes: votes
    })

  } catch (error: any) {
    console.error('🔴 GET /api/events/[publicId]/vote - Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes', details: error.message },
      { status: 500 }
    )
  }
}
