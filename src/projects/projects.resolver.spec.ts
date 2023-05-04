import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';

describe('ProjectsResolver', () => {
  let resolver: ProjectsResolver;

  beforeEach(async () => {
    const mockProjectsService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsResolver, ProjectsService],
    })
      .overrideProvider(ProjectsService)
      .useValue(mockProjectsService)
      .compile();

    resolver = module.get<ProjectsResolver>(ProjectsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
