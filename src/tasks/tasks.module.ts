import { Module } from '@nestjs/common';
import { ProjectsModule } from 'src/projects/projects.module';
import { UsersModule } from 'src/users/users.module';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [TasksResolver, TasksService],
  imports: [PrismaModule, UsersModule, ProjectsModule],
})
export class TasksModule {}
