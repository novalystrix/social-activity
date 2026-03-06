import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // During build time, return a dummy client that won't connect
    return new PrismaClient() as any;
  }
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter } as any);
}

const prisma: PrismaClient = global._prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}

export default prisma;
