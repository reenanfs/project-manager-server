import { BadRequestException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Prisma, Task, User } from '@prisma/client';
import { TaskWhereUniqueInput } from 'src/typescript/gql-generated-types';

import { Nullable } from 'src/typescript/types';
import { UsersService } from 'src/users/users.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { DeleteTasksDto } from './dtos/delete-tasks.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

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
    @Args('input') input: TaskWhereUniqueInput,
  ): Promise<Nullable<Task>> {
    return this.tasksService.getTask(input);
  }

  @ResolveField('user')
  async getTaskUser(@Parent() task: Task): Promise<User> {
    return this.tasksService.getTaskUser(task);
  }

  @Mutation()
  async createTask(@Args('input') input: CreateTaskDto): Promise<Task> {
    const { userId: id } = input;

    const user = await this.usersService.getUser({ id });

    if (!user) {
      throw new BadRequestException('Provided user does not exist!');
    }

    return this.tasksService.createTask(input);
  }

  @Mutation()
  async updateTask(
    @Args('input')
    input: UpdateTaskDto,
  ): Promise<Nullable<Task>> {
    const { id } = input;

    const task = await this.tasksService.getTask({ id });

    if (!task) {
      throw new BadRequestException('Task does not exist!');
    }

    return this.tasksService.updateTask(input);
  }

  @Mutation()
  async deleteTask(
    @Args('input')
    input: TaskWhereUniqueInput,
  ): Promise<Nullable<Task>> {
    const { id } = input;

    const task = await this.tasksService.getTask({ id });

    if (!task) {
      throw new BadRequestException('Task does not exist!');
    }

    return this.tasksService.deleteTask(input);
  }

  @Mutation()
  async deleteTasks(
    @Args('input')
    input: DeleteTasksDto,
  ): Promise<Prisma.BatchPayload> {
    return this.tasksService.deleteTasks(input);
  }
}
