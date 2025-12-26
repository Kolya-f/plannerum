import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const eventId = params.id;
    
    const { dateOptionId, voteType } = await request.json();

    // Валідація типу голосу
    if (!['yes', 'no', 'maybe'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Невірний тип голосу. Дозволені значення: yes, no, maybe' },
        { status: 400 }
      );
    }

    // Перевірка авторизації
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необхідно авторизуватися' },
        { status: 401 }
      );
    }

    // Перевірка, чи існує подія
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { dateOptions: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Подія не знайдена' },
        { status: 404 }
      );
    }

    // Перевірка, чи дата належить події
    const dateOptionExists = event.dateOptions.some(opt => opt.id === dateOptionId);
    if (!dateOptionExists) {
      return NextResponse.json(
        { error: 'Дата не знайдена у цій події' },
        { status: 404 }
      );
    }

    // Створення або оновлення голосу
    const vote = await prisma.vote.upsert({
      where: {
        dateOptionId_userId: {
          dateOptionId,
          userId: session.user.id
        }
      },
      update: {
        type: voteType
      },
      create: {
        dateOptionId,
        userId: session.user.id,
        type: voteType
      }
    });

    // Отримати оновлені результати
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        dateOptions: {
          include: {
            votes: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Голос успішно враховано',
      event: updatedEvent
    });

  } catch (error) {
    console.error('Помилка голосування:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

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
        { error: 'Подія не знайдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
    
  } catch (error) {
    console.error('Помилка отримання результатів:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
