import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addPositionColumn() {
  try {
    console.log('Adding position column to User table...');

    // Check if column already exists
    const result = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'position'
    ` as any[];

    if (result.length > 0) {
      console.log('✓ Column "position" already exists');
      return;
    }

    // Add the position column
    await prisma.$executeRaw`
      ALTER TABLE "User" ADD COLUMN "position" TEXT
    `;

    console.log('✓ Successfully added "position" column to User table');
  } catch (error) {
    console.error('Error adding position column:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addPositionColumn();
