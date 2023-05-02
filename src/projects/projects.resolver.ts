import { NotFoundException } from '@nestjs/common';
import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Prisma, Project, ProjectMembership, Task, User } from '@prisma/client';
import { DeleteMultipleItemsDto } from 'src/common/dtos/delete-multiple-items.dto';
import {
  ProjectWhereUniqueInput,
  CreateProjectInput,
  UpdateProjectInput,
  AddMembershipInput,
} from 'src/typescript/gql-generated-types';

import { ProjectsService } from './projects.service';

@Resolver('Project')
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query('projects')
  async getProjects(): Promise<Project[]> {
    return this.projectsService.getProjects();
  }

  @Query('project')
  async getProject(
    @Args('input') input: ProjectWhereUniqueInput,
  ): Promise<Project> {
    return this.projectsService.getProject(input);
  }

  @ResolveField('owner')
  async getProjectOwner(@Parent() project: Project): Promise<User> {
    return this.projectsService.getProjectOwner(project);
  }

  @ResolveField('usersCurrentProject')
  async getCurrentProjectUsers(@Parent() project: Project): Promise<User[]> {
    return this.projectsService.getCurrentProjectUsers(project);
  }

  @ResolveField('projectMemberships')
  async getProjectMemberships(
    @Parent() project: Project,
  ): Promise<ProjectMembership[]> {
    return this.projectsService.getProjectMemberships(project);
  }

  @ResolveField('tasks')
  async getProjectTasks(@Parent() project: Project): Promise<Task[]> {
    return this.projectsService.getProjectTasks(project);
  }

  @Mutation()
  async createProject(
    @Args('input') input: CreateProjectInput,
  ): Promise<Project> {
    return this.projectsService.createProject(input);
  }

  @Mutation()
  async updateProject(
    @Args('input')
    input: UpdateProjectInput,
  ): Promise<Project> {
    return this.projectsService.updateProject(input);
  }

  @Mutation()
  async deleteProject(
    @Args('input')
    input: ProjectWhereUniqueInput,
  ): Promise<Project> {
    return this.projectsService.deleteProject(input);
  }

  @Mutation()
  async deleteProjects(
    @Args('input')
    input: DeleteMultipleItemsDto,
  ): Promise<Prisma.BatchPayload> {
    return this.projectsService.deleteProjects(input);
  }

  @Mutation()
  async addMembership(
    @Args('input')
    input: AddMembershipInput,
  ): Promise<Project> {
    return this.projectsService.addMembership(input);
  }
}
