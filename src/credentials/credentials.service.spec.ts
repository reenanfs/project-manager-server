import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsService } from './credentials.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('CredentialsService', () => {
  let service: CredentialsService;

  beforeEach(async () => {
    const mockPrismaService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [CredentialsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<CredentialsService>(CredentialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
