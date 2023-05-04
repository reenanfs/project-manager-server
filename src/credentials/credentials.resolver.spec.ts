import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsResolver } from './credentials.resolver';
import { CredentialsService } from './credentials.service';

describe('CredentialsResolver', () => {
  let resolver: CredentialsResolver;

  beforeEach(async () => {
    const mockCredentialsService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [CredentialsResolver, CredentialsService],
    })
      .overrideProvider(CredentialsService)
      .useValue(mockCredentialsService)
      .compile();

    resolver = module.get<CredentialsResolver>(CredentialsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
