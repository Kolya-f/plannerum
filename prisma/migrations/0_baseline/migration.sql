-- Baseline migration for existing database
-- Database already contains tables from previous setup

-- Create tables that already exist (for reference)
-- User table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    "emailVerified" TIMESTAMP(3),
    image TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Event table
CREATE TABLE IF NOT EXISTS "Event" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    "creatorId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- DateOption table
CREATE TABLE IF NOT EXISTS "DateOption" (
    id TEXT PRIMARY KEY,
    "eventId" TEXT NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
    date TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Vote table
CREATE TABLE IF NOT EXISTS "Vote" (
    id TEXT PRIMARY KEY,
    "dateOptionId" TEXT NOT NULL REFERENCES "DateOption"(id) ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("dateOptionId", "userId")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "Event_creatorId_idx" ON "Event"("creatorId");
CREATE INDEX IF NOT EXISTS "DateOption_eventId_idx" ON "DateOption"("eventId");
CREATE INDEX IF NOT EXISTS "Vote_dateOptionId_idx" ON "Vote"("dateOptionId");
CREATE INDEX IF NOT EXISTS "Vote_userId_idx" ON "Vote"("userId");
