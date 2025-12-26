import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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

    const { dateOptionId, voteType } = await request.json()
    
    if (!dateOptionId || !voteType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Перевіримо чи існує голос (правильний спосіб для composite unique)
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: user.id,
        dateOptionId: dateOptionId
      }
    })

    let vote
    if (existingVote) {
      // Оновимо існуючий голос
      vote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { type: voteType }
      })
    } else {
      // Створимо новий голос
      vote = await prisma.vote.create({
        data: {
          dateOptionId,
          userId: user.id,
          type: voteType
        }
      })
    }

    return NextResponse.json({
      success: true,
      vote: vote
    })

  } catch (error: any) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Failed to vote', details: error.message },
      { status: 500 }
    )
  }
}
