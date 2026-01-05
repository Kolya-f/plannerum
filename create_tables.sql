-- Створюємо таблиці вручну
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMP,
  image TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Event" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  category TEXT DEFAULT 'other',
  "maxParticipants" INTEGER,
  "isPublic" BOOLEAN DEFAULT TRUE,
  "userId" TEXT NOT NULL,
  "userName" TEXT,
  "userEmail" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "DateOption" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "eventId" TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Vote" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "voteType" TEXT DEFAULT 'yes',
  "userId" TEXT NOT NULL,
  "userName" TEXT,
  "userEmail" TEXT,
  "eventId" TEXT NOT NULL,
  "dateOptionId" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "eventId")
);

CREATE TABLE IF NOT EXISTS "ChatMessage" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "userName" TEXT,
  "userEmail" TEXT,
  "eventId" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "OnlineUser" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT UNIQUE NOT NULL,
  "userName" TEXT,
  "userEmail" TEXT,
  "lastSeen" TIMESTAMP DEFAULT NOW(),
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Додамо тестові дані
INSERT INTO "User" (id, name, email) 
VALUES 
  ('user_1', 'Тестовий Користувач', 'test@example.com'),
  ('user_2', 'Адміністратор', 'admin@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Event" (id, title, description, location, category, "maxParticipants", "userId", "userName", "userEmail")
VALUES 
  ('event_1', 'Приклад зустрічі команди', 'Перша тестова подія', 'Онлайн', 'meeting', 10, 'user_1', 'Тестовий Користувач', 'test@example.com')
ON CONFLICT (id) DO NOTHING;

SELECT '✅ Таблиці створені!' as status;
