import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PasswordModule } from 'src/utils/password/password.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PasswordModule, PassportModule],
  providers: [AuthResolver, AuthService, LocalStrategy, PrismaService],
})
export class AuthModule {}
