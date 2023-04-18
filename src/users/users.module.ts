import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { FileUploaderModule } from 'src/utils/file-uploader/file-uploader.module';
import { RolesModule } from 'src/roles/roles.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectMembershipsModule } from 'src/project-memberships/project-memberships.module';

@Module({
  exports: [UsersService],
  providers: [UsersResolver, UsersService],
  imports: [
    PrismaModule,
    FileUploaderModule,
    RolesModule,
    ProjectMembershipsModule,
    forwardRef(() => ProjectsModule),
  ],
})
export class UsersModule {}
