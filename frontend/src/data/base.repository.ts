import { PrismaClient } from '@prisma/client';

export class BaseRepository {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }

  async connect() {
    try {
      await this.prisma.$connect();
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
