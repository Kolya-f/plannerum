import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { Calendar, Users, MessageCircle, Sparkles, ArrowRight, Clock, Trophy, Zap } from 'lucide-react'

export default async function HomePage() {
  const events = await prisma.event.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      dateOptions: true,
      votes: true
    }
  })

  const stats = await prisma.$queryRaw`
    SELECT 
      (SELECT COUNT(*) FROM events) as total_events,
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM chat_messages) as total_messages
  `

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Голосування за дати",
      description: "Створюйте варіанти дат та голосуйте за найкращий час зустрічі",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Вбудований чат",
      description: "Обговорюйте деталі в реальному чаті прямо на сторінці події",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Управління учасниками",
      description: "Встановлюйте обмеження учасників та керуйте запрошеннями",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Автоматичний вибір",
      description: "Система автоматично визначає найкращу дату на основі голосів",
      color: "from-amber-500 to-amber-600"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=2000')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm">Новий спосіб планування</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Плануйте зустрічі
              <span className="block text-blue-100">разом з Plannerum</span>
            </h1>
            <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto">
              Простий та ефективний інструмент для організації зустрічей, голосування за дати та спілкування в чаті
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create-event"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Створити подію
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                <Users className="w-6 h-6 mr-3" />
                Переглянути події
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats Floating Bar */}
        <div className="container mx-auto px-4 -mb-12 relative">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 hover:scale-105 transition-transform">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                  {events.length}+
                </div>
                <div className="text-gray-700 font-medium">Активних подій</div>
                <div className="text-sm text-gray-500 mt-1">Зараз на платформі</div>
              </div>
              <div className="text-center p-6 hover:scale-105 transition-transform">
                <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
                  {stats[0]?.total_users || 0}
                </div>
                <div className="text-gray-700 font-medium">Користувачів</div>
                <div className="text-sm text-gray-500 mt-1">Приєдналися до нас</div>
              </div>
              <div className="text-center p-6 hover:scale-105 transition-transform">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-2">
                  {stats[0]?.total_messages || 0}
                </div>
                <div className="text-gray-700 font-medium">Повідомлень</div>
                <div className="text-sm text-gray-500 mt-1">В чаті платформи</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Чому обирають Plannerum?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Сучасний інструмент, що поєднує в собі все необхідне для ефективного планування
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 
                               group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <Zap className="w-4 h-4 mr-2" />
                    <span>Працює моментально</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Останні події
                <span className="block text-2xl text-gray-600 font-normal mt-2">
                  Приєднуйтесь до найцікавіших обговорень
                </span>
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Всі події
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 
                                            hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Event Header */}
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-white/90">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {event.dateOptions.length} варіантів дати
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 line-clamp-2">
                      {event.description || 'Опис відсутній'}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium">
                            {event.user.name?.[0]?.toUpperCase() || event.user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {event.user.name || 'Анонім'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(event.createdAt).toLocaleDateString('uk-UA')}
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        href={`/events/${event.id}`}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg font-medium 
                                 hover:from-blue-100 hover:to-blue-200 transition-all hover:scale-105"
                      >
                        Детальніше
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-300">
              <div className="inline-flex p-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl mb-6">
                <Calendar className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Подій ще немає</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Створіть першу подію та запрошуйте друзів для планування зустрічей
              </p>
              <Link
                href="/create-event"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                         rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all"
              >
                <PlusCircle className="w-6 h-6 mr-3" />
                Створити першу подію
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white mb-8">
              <Sparkles className="w-5 h-5 mr-3" />
              <span className="font-medium">Готові почати?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Приєднуйтесь до Plannerum
              <span className="block text-2xl text-gray-600 font-normal mt-4">
                Безкоштовно • Просто • Ефективно
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                href="/create-event"
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl 
                         font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Розпочати зараз
              </Link>
              <Link
                href="/chat"
                className="px-10 py-5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-2xl 
                         font-bold text-lg hover:shadow-xl transition-all duration-300 border border-gray-300"
              >
                Спробувати чат
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
