import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsResolver } from './permissions.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PermissionsResolver, PermissionsService],
  imports: [PrismaModule],
})
export class PermissionsModule {}
