import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMembershipsResolver } from './project-memberships.resolver';
import { ProjectMembershipsService } from './project-memberships.service';

describe('ProjectMembershipsResolver', () => {
  let resolver: ProjectMembershipsResolver;

  beforeEach(async () => {
    const mockProjectMembershipsService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectMembershipsResolver, ProjectMembershipsService],
    })
      .overrideProvider(ProjectMembershipsService)
      .useValue(mockProjectMembershipsService)
      .compile();

    resolver = module.get<ProjectMembershipsResolver>(
      ProjectMembershipsResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
