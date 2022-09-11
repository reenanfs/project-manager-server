import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PasswordModule } from 'src/utils/password/password.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [PasswordModule, PassportModule],
  providers: [AuthResolver, AuthService, LocalStrategy],
})
export class AuthModule {}
