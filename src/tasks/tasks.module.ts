import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksResolver, TasksService, PrismaService],
})
export class TasksModule {}
