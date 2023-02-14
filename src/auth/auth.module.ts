import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { HashModule } from 'src/utils/hash/hash.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { CredentialsModule } from 'src/credentials/credentials.module';
import { AccessTokenStrategy } from './strategies/access-token-jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token-jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BlacklistModule } from 'src/utils/blacklist/blacklist.module';

@Module({
  imports: [
    HashModule,
    BlacklistModule,
    PassportModule,
    PrismaModule,
    UsersModule,
    CredentialsModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
