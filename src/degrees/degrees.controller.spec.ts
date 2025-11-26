import { Test, TestingModule } from '@nestjs/testing';
import { DegreesController } from './degrees.controller';
import { DegreesService } from './degrees.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DegreesController', () => {
  let controller: DegreesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DegreesController],
      providers: [
        DegreesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<DegreesController>(DegreesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
