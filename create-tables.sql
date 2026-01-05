-- Виконай цей SQL в Neon SQL Editor

-- Таблиця User
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    emailVerified TIMESTAMP(3),
    image TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);

-- Таблиця Event
CREATE TABLE IF NOT EXISTS "Event" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    creatorId TEXT NOT NULL,
    isPublic BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL,
    FOREIGN KEY (creatorId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Таблиця DateOption
CREATE TABLE IF NOT EXISTS "DateOption" (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL,
    date TIMESTAMP(3) NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES "Event"(id) ON DELETE CASCADE
);

-- Таблиця Vote
CREATE TABLE IF NOT EXISTS "Vote" (
    id TEXT PRIMARY KEY,
    dateOptionId TEXT NOT NULL,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dateOptionId) REFERENCES "DateOption"(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Індекси
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "Event_creatorId_idx" ON "Event"("creatorId");
CREATE INDEX IF NOT EXISTS "DateOption_eventId_idx" ON "DateOption"("eventId");
CREATE INDEX IF NOT EXISTS "Vote_dateOptionId_idx" ON "Vote"("dateOptionId");
CREATE INDEX IF NOT EXISTS "Vote_userId_idx" ON "Vote"("userId");
