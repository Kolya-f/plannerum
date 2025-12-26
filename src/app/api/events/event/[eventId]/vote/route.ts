import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: Promise<{ params: { eventId: string } }>
) {
  try {
    // Очікуємо params (фікс для Next.js 15+)
    const { eventId } = await params;
    const session = await getServerSession(authOptions);
    
    const { dateOptionId, voteType } = await request.json();

    console.log('🔵 POST /api/events/event/[eventId]/vote - Голосування:', {
      eventId,
      dateOptionId,
      voteType,
      userId: session?.user?.id
    });

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
      console.error('❌ Подія не знайдена:', eventId);
      return NextResponse.json(
        { error: 'Подія не знайдена' },
        { status: 404 }
      );
    }

    console.log('✅ Подія знайдена:', event.title);

    // Перевірка, чи дата належить події
    const dateOptionExists = event.dateOptions.some(opt => opt.id === dateOptionId);
    if (!dateOptionExists) {
      console.error('❌ Дата не знайдена у події:', { dateOptionId, eventId });
      return NextResponse.json(
        { error: 'Дата не знайдена у цій події' },
        { status: 404 }
      );
    }

    // Створення або оновлення голосу
    console.log('📝 Створення/оновлення голосу...');
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

    console.log('✅ Голос збережено:', vote.id);

    // Отримати оновлені результати
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
      message: 'Голос успішно враховано',
      event: updatedEvent
    });

  } catch (error) {
    console.error('❌ Помилка голосування:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера', details: error instanceof Error ? error.message : 'Невідома помилка' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: Promise<{ params: { eventId: string } }>
) {
  try {
    // Очікуємо params (фікс для Next.js 15+)
    const { eventId } = await params;

    console.log('🔵 GET /api/events/event/[eventId]/vote - Отримання результатів:', eventId);

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
      console.error('❌ Подія не знайдена для GET:', eventId);
      return NextResponse.json(
        { error: 'Подія не знайдена' },
        { status: 404 }
      );
    }

    console.log('✅ Результати завантажені для події:', event.title);
    return NextResponse.json(event);
    
  } catch (error) {
    console.error('❌ Помилка отримання результатів:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
