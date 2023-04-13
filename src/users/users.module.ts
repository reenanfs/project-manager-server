import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { FileUploaderModule } from 'src/utils/file-uploader/file-uploader.module';

@Module({
  exports: [UsersService],
  providers: [UsersResolver, UsersService],
  imports: [PrismaModule, FileUploaderModule],
})
export class UsersModule {}
