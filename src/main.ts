import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const DEFAULT_PORT = 3000;
  const port = Number(process.env.PORT) || DEFAULT_PORT;

  try {
    await app.listen(port);
    console.log(`Application listening on port ${port}`);
  } catch (err: any) {
    // Friendly handling for common startup error: port already in use
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Please free the port or set a different PORT environment variable.`);
      console.error('On Windows you can find and kill the process using the port:');
      console.error('  netstat -ano | findstr ":' + port + '"');
      console.error('  Stop-Process -Id <PID> -Force');
      process.exit(1);
    }
    // rethrow other unexpected errors
    throw err;
  }
}
bootstrap();