import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Avoid hard-failing when DATABASE_URL is not present. This allows running the
    // app in local/test environments that don't have DB configured without crashing.
    // Prisma will still work when DATABASE_URL is defined.
    if (!process.env.DATABASE_URL) {
      // Helpful warning for devs — we explicitly don't connect so the app won't crash
      // during startup when a database is not configured.
      // If you want an automatic error instead (fail fast), remove this guard.
      // Also note: many tests mock PrismaService, so behavior won't change for unit tests.
      // eslint-disable-next-line no-console
      console.warn('Prisma: Skipping DB connection because DATABASE_URL is not set in environment variables.');
      return;
    }

    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
