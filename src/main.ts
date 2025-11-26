import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const DEFAULT_PORT = 3000;
  const startPort = Number(process.env.PORT) || DEFAULT_PORT;

  // Try to bind to ports starting at startPort, increasing until a free port
  // is found or until we hit a maximum attempt count. This avoids failing
  // immediately when the default port is occupied (common during dev).
  const MAX_ATTEMPTS = 10;
  let currentPort = startPort;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      await app.listen(currentPort);
      console.log(`Application listening on port ${currentPort}`);
      return;
    } catch (err: any) {
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${currentPort} is already in use — trying next port (${currentPort + 1})`);
        currentPort += 1;
        continue; // try next port
      }
      // for other errors rethrow so the process fails and stacktrace is visible
      throw err;
    }
  }

  // If we get here, we did not find a free port after attempts
  console.error(`Could not find a free port starting from ${startPort} (tried ${MAX_ATTEMPTS} ports).`);
  console.error('Either free a port manually or set a specific PORT environment variable.');
  process.exit(1);
}
bootstrap();