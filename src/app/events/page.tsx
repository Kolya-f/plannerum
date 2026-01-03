import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import EventCard from '@/components/EventCard'
import Link from 'next/link'

export default async function EventsPage() {
  const session = await getServerSession()
  const events = await prisma.event.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      dateOptions: {
        include: {
          _count: {
            select: { votes: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Події</h1>
        {session && (
          <Link
            href="/create-event"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            + Створити подію
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Поки що немає подій</p>
          {!session && (
            <p className="text-gray-400 mt-2">
              <Link href="/auth/signin" className="text-blue-500 hover:underline">
                Увійдіть
              </Link>
              , щоб створити подію
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
