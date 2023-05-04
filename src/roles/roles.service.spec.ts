import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const mockPrismaService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
