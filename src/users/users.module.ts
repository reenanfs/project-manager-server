import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  exports: [UsersService],
  providers: [UsersResolver, UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
