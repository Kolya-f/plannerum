import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Тип для сесії NextAuth
interface UserSession {
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
}

// Для Next.js 15+ параметри - це Promise
interface RouteContext {
  params: Promise<{ eventId: string }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Очікуємо params з Promise
    const { eventId } = await context.params;
    const session = await getServerSession(authOptions) as UserSession;
    
    const { dateOptionId, voteType } = await request.json();

    // Валідація
    if (!['yes', 'no', 'maybe'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      );
    }

    // Перевірка авторизації
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Перевірка події
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { dateOptions: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Перевірка дати
    const dateOptionExists = event.dateOptions.some(opt => opt.id === dateOptionId);
    if (!dateOptionExists) {
      return NextResponse.json(
        { error: 'Date option not found' },
        { status: 404 }
      );
    }

    // Голосування
    const vote = await prisma.vote.upsert({
      where: {
        dateOptionId_userId: {
          dateOptionId,
          userId: userId
        }
      },
      update: {
        type: voteType
      },
      create: {
        dateOptionId,
        userId: userId,
        type: voteType
      }
    });

    // Оновлені результати
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        dateOptions: {
          include: {
            votes: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Vote recorded',
      event: updatedEvent
    });

  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { eventId } = await context.params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        dateOptions: {
          include: {
            votes: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
    
  } catch (error) {
    console.error('Get votes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
