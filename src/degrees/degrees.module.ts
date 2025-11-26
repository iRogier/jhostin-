import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { DegreesController } from './degrees.controller';

@Module({
  providers: [DegreesService],
  controllers: [DegreesController]
})
export class DegreesModule {}
