import { Test, TestingModule } from '@nestjs/testing';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './specialties.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SpecialtiesController', () => {
  let controller: SpecialtiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialtiesController],
      providers: [
        SpecialtiesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<SpecialtiesController>(SpecialtiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
