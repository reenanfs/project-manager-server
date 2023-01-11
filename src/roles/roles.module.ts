import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [RolesResolver, RolesService],
  imports: [PrismaModule],
  exports: [RolesService],
})
export class RolesModule {}
