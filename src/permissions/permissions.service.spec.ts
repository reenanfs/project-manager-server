import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(async () => {
    const mockPrismaService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
