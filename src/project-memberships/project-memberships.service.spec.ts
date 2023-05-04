import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMembershipsService } from './project-memberships.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ProjectMembershipsService', () => {
  let service: ProjectMembershipsService;

  beforeEach(async () => {
    const mockPrismaService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectMembershipsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<ProjectMembershipsService>(ProjectMembershipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
