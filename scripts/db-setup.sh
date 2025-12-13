#!/bin/bash
# Database setup script for Vercel deployment

echo "Initializing database..."
npx prisma db push --accept-data-loss

echo "Database initialized successfully!"
