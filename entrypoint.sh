#!/bin/sh

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting application..."
npm run start:prod