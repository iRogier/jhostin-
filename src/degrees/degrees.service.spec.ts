import { Test, TestingModule } from '@nestjs/testing';
import { DegreesService } from './degrees.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DegreesService', () => {
  let service: DegreesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DegreesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<DegreesService>(DegreesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
