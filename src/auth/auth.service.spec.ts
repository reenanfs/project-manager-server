import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashService } from 'src/utils/hash/hash.service';
import { BlacklistService } from 'src/utils/blacklist/blacklist.service';
import { CredentialsService } from 'src/credentials/credentials.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockPrismaService = {};

    const mockCredentialsService = {};

    const mockBlacklistService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        HashService,
        BlacklistService,
        CredentialsService,
        JwtService,
        ConfigService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(CredentialsService)
      .useValue(mockCredentialsService)
      .overrideProvider(BlacklistService)
      .useValue(mockBlacklistService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
