import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Prisma, Task, User } from '@prisma/client';
import {
  GetTasksInput,
  TaskWhereUniqueInput,
} from 'src/typescript/gql-generated-types';

import { Nullable } from 'src/typescript/types';
import { CreateTaskDto } from './dtos/create-task.dto';
import { DeleteTasksDto } from './dtos/delete-tasks.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

import { TasksService } from './tasks.service';

@Resolver('Task')
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Query('tasks')
  async getTasks(
    @Args('input') input: GetTasksInput,
  ): Promise<Nullable<Task[]>> {
    return this.tasksService.getTasks(input);
  }

  @Query('task')
  async getTask(
    @Args('input') input: TaskWhereUniqueInput,
  ): Promise<Nullable<Task>> {
    const task = await this.tasksService.getTask(input);

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    return task;
  }

  @ResolveField('user')
  async getTaskUser(@Parent() task: Task): Promise<User> {
    return this.tasksService.getTaskUser(task);
  }

  @Mutation()
  async createTask(@Args('input') input: CreateTaskDto): Promise<Task> {
    const task = await this.tasksService.createTask(input);

    if (!task) {
      throw new NotFoundException('User does not exist.');
    }

    return task;
  }

  @Mutation()
  async updateTask(
    @Args('input')
    input: UpdateTaskDto,
  ): Promise<Nullable<Task>> {
    const task = await this.tasksService.updateTask(input);

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    return task;
  }

  @Mutation()
  async deleteTask(
    @Args('input')
    input: TaskWhereUniqueInput,
  ): Promise<Nullable<Task>> {
    const task = await this.tasksService.deleteTask(input);

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    return task;
  }

  @Mutation()
  async deleteTasks(
    @Args('input')
    input: DeleteTasksDto,
  ): Promise<Prisma.BatchPayload> {
    return this.tasksService.deleteTasks(input);
  }
}
