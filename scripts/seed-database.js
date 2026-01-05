const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем сидинг базы данных...')

  // Очищаем существующие данные
  console.log('🧹 Очищаем старые данные...')
  await prisma.verificationToken.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.onlineUser.deleteMany()
  await prisma.chatMessage.deleteMany()
  await prisma.vote.deleteMany()
  await prisma.dateOption.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()

  // Создаем тестовых пользователей
  console.log('👥 Создаем тестовых пользователей...')
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user_1',
        name: 'Тестовий Користувач',
        email: 'test@example.com',
        emailVerified: new Date()
      }
    }),
    prisma.user.create({
      data: {
        id: 'user_2',
        name: 'Адміністратор',
        email: 'admin@example.com',
        emailVerified: new Date()
      }
    }),
    prisma.user.create({
      data: {
        id: 'demo-user',
        name: 'Демо Користувач',
        email: 'demo@example.com',
        emailVerified: new Date()
      }
    })
  ])

  console.log(`✅ Создано ${users.length} пользователей`)

  // Создаем тестовые события
  console.log('🗓️ Создаем тестовые события...')
  
  const events = await Promise.all([
    prisma.event.create({
      data: {
        id: 'event_1',
        title: 'Приклад зустрічі команди',
        description: 'Перша тестова подія для демонстрації функціоналу платформи. Обговорення нових проектів та планів на наступний квартал.',
        location: 'Онлайн (Zoom)',
        category: 'meeting',
        maxParticipants: 10,
        isPublic: true,
        userId: users[0].id,
        userName: users[0].name,
        userEmail: users[0].email
      }
    }),
    prisma.event.create({
      data: {
        id: 'event_2',
        title: 'Воркшоп з веб-розробки',
        description: 'Навчання сучасним технологіям веб-розробки: Next.js 14, TypeScript, Prisma та Tailwind CSS. Практичні завдання та реальні проекти.',
        location: 'Tech Hub, Київ',
        category: 'workshop',
        maxParticipants: 25,
        isPublic: true,
        userId: users[1].id,
        userName: users[1].name,
        userEmail: users[1].email
      }
    }),
    prisma.event.create({
      data: {
        id: 'event_3',
        title: 'Планування корпоративу',
        description: 'Обговорення деталей річних корпоративних заходів, вибір дати, місця та формату проведення.',
        location: 'Ресторан "Старий Київ"',
        category: 'party',
        maxParticipants: 50,
        isPublic: false,
        userId: users[0].id,
        userName: users[0].name,
        userEmail: users[0].email
      }
    })
  ])

  console.log(`✅ Создано ${events.length} событий`)

  // Создаем варианты дат
  console.log('📅 Создаем варианты дат...')
  
  const dateOptions = await Promise.all([
    prisma.dateOption.create({
      data: {
        id: 'date_1',
        eventId: events[0].id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000) // Завтра
      }
    }),
    prisma.dateOption.create({
      data: {
        id: 'date_2',
        eventId: events[0].id,
        date: new Date(Date.now() + 48 * 60 * 60 * 1000) // Послезавтра
      }
    }),
    prisma.dateOption.create({
      data: {
        id: 'date_3',
        eventId: events[1].id,
        date: new Date(Date.now() + 72 * 60 * 60 * 1000) // Через 3 дня
      }
    }),
    prisma.dateOption.create({
      data: {
        id: 'date_4',
        eventId: events[2].id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Через неделю
      }
    })
  ])

  console.log(`✅ Создано ${dateOptions.length} вариантов дат`)

  // Создаем голосования
  console.log('🗳️ Создаем тестовые голосования...')
  
  const votes = await Promise.all([
    prisma.vote.create({
      data: {
        eventId: events[0].id,
        dateOptionId: dateOptions[0].id,
        userId: users[0].id,
        userName: users[0].name,
        userEmail: users[0].email,
        voteType: 'yes'
      }
    }),
    prisma.vote.create({
      data: {
        eventId: events[0].id,
        dateOptionId: dateOptions[1].id,
        userId: users[1].id,
        userName: users[1].name,
        userEmail: users[1].email,
        voteType: 'maybe'
      }
    }),
    prisma.vote.create({
      data: {
        eventId: events[1].id,
        dateOptionId: dateOptions[2].id,
        userId: users[0].id,
        userName: users[0].name,
        userEmail: users[0].email,
        voteType: 'yes'
      }
    }),
    prisma.vote.create({
      data: {
        eventId: events[1].id,
        dateOptionId: dateOptions[2].id,
        userId: users[1].id,
        userName: users[1].name,
        userEmail: users[1].email,
        voteType: 'yes'
      }
    })
  ])

  console.log(`✅ Создано ${votes.length} голосов`)

  // Создаем тестовые сообщения в чате
  console.log('💬 Создаем тестовые сообщения в чате...')
  
  const chatMessages = await Promise.all([
    prisma.chatMessage.create({
      data: {
        content: 'Привет всем! Как ваши дела?',
        userId: users[0].id,
        userName: users[0].name,
        userEmail: users[0].email,
        eventId: events[0].id
      }
    }),
    prisma.chatMessage.create({
      data: {
        content: 'Привет! Все отлично, жду нашей встречи!',
        userId: users[1].id,
        userName: users[1].name,
        userEmail: users[1].email,
        eventId: events[0].id
      }
    }),
    prisma.chatMessage.create({
      data: {
        content: 'Когда начинаем воркшоп? Уже не терпится!',
        userId: users[0].id,
        userName: users[0].name,
        userEmail: users[0].email,
        eventId: events[1].id
      }
    }),
    prisma.chatMessage.create({
      data: {
        content: 'Всем доброго дня! Кто будет на встрече?',
        userId: users[0].id,
        userName: users[0].name,
        userEmail: users[0].email,
        eventId: null // Глобальное сообщение
      }
    }),
    prisma.chatMessage.create({
      data: {
        content: 'Я буду! Жду не дождусь нашего обсуждения.',
        userId: users[1].id,
        userName: users[1].name,
        userEmail: users[1].email,
        eventId: null // Глобальное сообщение
      }
    }),
    prisma.chatMessage.create({
      data: {
        content: 'Кто знает хорошие места для проведения корпоратива?',
        userId: users[0].id,
        userName: users[0].name,
        userEmail: users[0].email,
        eventId: events[2].id
      }
    })
  ])

  console.log(`✅ Создано ${chatMessages.length} сообщений в чате`)

  // Добавляем пользователей в онлайн
  console.log('🟢 Добавляем пользователей в онлайн...')
  
  const onlineUsers = await Promise.all(
    users.map(user =>
      prisma.onlineUser.create({
        data: {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          lastSeen: new Date()
        }
      })
    )
  )

  console.log(`✅ Добавлено ${onlineUsers.length} пользователей в онлайн`)

  // Выводим статистику
  const finalStats = await prisma.$queryRaw`
    SELECT 
      (SELECT COUNT(*) FROM users) as users_count,
      (SELECT COUNT(*) FROM events) as events_count,
      (SELECT COUNT(*) FROM date_options) as date_options_count,
      (SELECT COUNT(*) FROM votes) as votes_count,
      (SELECT COUNT(*) FROM chat_messages) as chat_messages_count,
      (SELECT COUNT(*) FROM online_users) as online_users_count
  `

  console.log('\n📊 Итоговая статистика базы данных:')
  console.log(`   👥 Пользователей: ${finalStats[0].users_count}`)
  console.log(`   🗓️  Событий: ${finalStats[0].events_count}`)
  console.log(`   📅 Вариантов дат: ${finalStats[0].date_options_count}`)
  console.log(`   🗳️  Голосов: ${finalStats[0].votes_count}`)
  console.log(`   💬 Сообщений в чате: ${finalStats[0].chat_messages_count}`)
  console.log(`   🟢 Пользователей онлайн: ${finalStats[0].online_users_count}`)
  console.log('\n🎉 База данных успешно заполнена тестовыми данными!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при сидинге:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
