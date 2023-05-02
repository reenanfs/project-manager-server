import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Prisma, Project, Task, User } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import {
  CreateTaskInput,
  GetTasksInput,
  TaskWhereUniqueInput,
} from 'src/typescript/gql-generated-types';

import { UpdateTaskDto } from './dtos/update-task.dto';

import { TasksService } from './tasks.service';

@Resolver('Task')
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Query('tasks')
  async getTasks(@Args('input') input: GetTasksInput): Promise<Task[]> {
    return this.tasksService.getTasks(input);
  }

  @Query('task')
  async getTask(@Args('input') input: TaskWhereUniqueInput): Promise<Task> {
    return this.tasksService.getTask(input);
  }

  @ResolveField('user')
  async getTaskUser(@Parent() task: Task): Promise<User> {
    return this.tasksService.getTaskUser(task);
  }

  @ResolveField('project')
  async getTaskProject(@Parent() task: Task): Promise<Project> {
    return this.tasksService.getTaskProject(task);
  }

  @Mutation()
  async createTask(@Args('input') input: CreateTaskInput): Promise<Task> {
    return this.tasksService.createTask(input);
  }

  @Mutation()
  async updateTask(
    @Args('input')
    input: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(input);
  }

  @Mutation()
  async deleteTask(
    @Args('input')
    input: TaskWhereUniqueInput,
  ): Promise<Task> {
    return this.tasksService.deleteTask(input);
  }

  @Mutation()
  async deleteTasks(
    @Args('input')
    input: DeleteMultipleItemsDto,
  ): Promise<Prisma.BatchPayload> {
    return this.tasksService.deleteTasks(input);
  }
}
