import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ProjectsResolver, ProjectsService],
  imports: [PrismaModule],
})
export class ProjectsModule {}
