import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import EventCard from '@/components/EventCard'

export default async function HomePage() {
  // Получаем последние события
  const events = await prisma.event.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      dateOptions: true,
      votes: true
    }
  })

  // Получаем статистику
  const stats = await prisma.$queryRaw`
    SELECT 
      (SELECT COUNT(*) FROM events) as total_events,
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM chat_messages) as total_messages
  `

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Плануйте зустрічі
          <span className="text-blue-600 block">Разом з Plannerum</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Простий інструмент для планування зустрічей, голосування за дати та спілкування в чаті
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create-event"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Створити подію
          </Link>
          <Link
            href="/events"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
          >
            Переглянути події
          </Link>
          <Link
            href="/chat"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            Глобальний чат
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {events.length}+
              </div>
              <div className="text-gray-700 font-medium">Активних подій</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats[0]?.total_users || 0}
              </div>
              <div className="text-gray-700 font-medium">Користувачів</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {stats[0]?.total_messages || 0}
              </div>
              <div className="text-gray-700 font-medium">Повідомлень в чаті</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Останні події</h2>
          <Link
            href="/events"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Дивитись усі →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">
              Ще немає подій. Створіть першу!
            </div>
            <Link
              href="/create-event"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Створити подію
            </Link>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Чому обирають Plannerum?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗓️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Голосування за дати</h3>
              <p className="text-gray-600">
                Додавайте варіанти дат та голосуйте за найкращий час для зустрічі
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Вбудований чат</h3>
              <p className="text-gray-600">
                Обговорюйте деталі в реальному чаті для кожної події
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Гнучке планування</h3>
              <p className="text-gray-600">
                Встановлюйте обмеження учасників та категорії подій
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
