import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const mockPrismaService = {};

    const mockRolesService = {};

    const mockUsersService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService, PrismaService, UsersService, RolesService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(RolesService)
      .useValue(mockRolesService)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
