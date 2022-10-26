import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsResolver } from './credentials.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [CredentialsResolver, CredentialsService],
  exports: [CredentialsService],
  imports: [PrismaModule],
})
export class CredentialsModule {}
