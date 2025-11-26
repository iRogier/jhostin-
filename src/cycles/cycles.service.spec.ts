import { Test, TestingModule } from '@nestjs/testing';
import { CyclesService } from './cycles.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CyclesService', () => {
  let service: CyclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CyclesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<CyclesService>(CyclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
