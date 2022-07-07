import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

describe('TasksResolver', () => {
  let resolver: TasksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksResolver, TasksService, PrismaService, UsersService],
    }).compile();

    resolver = module.get<TasksResolver>(TasksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
