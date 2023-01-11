import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { UsersModule } from 'src/users/users.module';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksResolver, TasksService],
  imports: [PrismaModule, UsersModule, ProjectsModule],
})
export class TasksModule {}
