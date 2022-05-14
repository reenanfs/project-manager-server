import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Prisma, Task, User } from '@prisma/client';
import { Nullable } from 'src/types/typescript.types';
import { UsersService } from 'src/users/users.service';

import { TasksService } from './tasks.service';

@Resolver('Task')
export class TasksResolver {
  constructor(
    private tasksService: TasksService,
    private usersService: UsersService,
  ) {}

  @Query('tasks')
  async getTasks(): Promise<Nullable<Task[]>> {
    return this.tasksService.getTasks({});
  }

  @Query('task')
  async getTask(
    @Args('input') input: Prisma.TaskWhereUniqueInput,
  ): Promise<Nullable<Task>> {
    return this.tasksService.getTask(input);
  }

  @ResolveField('user')
  async getUser(@Parent() task: Task): Promise<User> {
    const { userId: id } = task;

    return this.usersService.getUser({ id });
  }

  @Mutation()
  async createTask(
    @Args('input') input: Prisma.TaskCreateInput,
  ): Promise<Task> {
    return this.tasksService.createTask(input);
  }

  @Mutation()
  async updateTask(
    @Args('input')
    input: Prisma.TaskUpdateInput,
  ): Promise<Nullable<Task>> {
    return this.tasksService.updateTask(input);
  }

  @Mutation()
  async deleteTask(
    @Args('input')
    input: Prisma.TaskWhereUniqueInput,
  ): Promise<Nullable<Task>> {
    return this.tasksService.deleteTask(input);
  }
}
