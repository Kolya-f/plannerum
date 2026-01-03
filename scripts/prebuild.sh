#!/bin/bash

echo "=== Running prebuild script ==="

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  WARNING: DATABASE_URL is not set"
else
  echo "✅ DATABASE_URL is set"
  # Push schema to database
  echo "Pushing Prisma schema to database..."
  npx prisma db push --accept-data-loss
fi

echo "=== Prebuild complete ==="
