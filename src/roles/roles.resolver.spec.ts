import { Test, TestingModule } from '@nestjs/testing';
import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';

describe('RolesResolver', () => {
  let resolver: RolesResolver;

  beforeEach(async () => {
    const mockRolesService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesResolver, RolesService],
    })
      .overrideProvider(RolesService)
      .useValue(mockRolesService)
      .compile();

    resolver = module.get<RolesResolver>(RolesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
