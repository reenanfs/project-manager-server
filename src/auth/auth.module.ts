import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PasswordModule } from 'src/utils/hash/hash.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { CredentialsModule } from 'src/credentials/credentials.module';
import { AtJwtStrategy } from './strategies/access-token-jwt.strategy';
import { RtJwtStrategy } from './strategies/refresh-token-jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PasswordModule,
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
    AtJwtStrategy,
    RtJwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
