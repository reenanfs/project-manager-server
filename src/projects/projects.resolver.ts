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
import { Nullable } from 'src/typescript/types';
import { ProjectsService } from './projects.service';

@Resolver('Project')
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query('projects')
  async getProjects(): Promise<Nullable<Project[]>> {
    return this.projectsService.getProjects();
  }

  @Query('project')
  async getProject(
    @Args('input') input: ProjectWhereUniqueInput,
  ): Promise<Nullable<Project>> {
    const project = await this.projectsService.getProject(input);

    if (!project) {
      throw new NotFoundException('Project does not exist.');
    }

    return project;
  }

  @ResolveField('owner')
  async getProjectUsers(@Parent() project: Project): Promise<Nullable<User>> {
    return this.projectsService.getProjectOwner(project);
  }

  @ResolveField('projectMemberships')
  async getProjectMemberships(
    @Parent() project: Project,
  ): Promise<Nullable<ProjectMembership[]>> {
    return this.projectsService.getProjectMemberships(project);
  }

  @ResolveField('tasks')
  async getProjectTasks(@Parent() project: Project): Promise<Nullable<Task[]>> {
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
  ): Promise<Nullable<Project>> {
    const project = await this.projectsService.updateProject(input);

    if (!project) {
      throw new NotFoundException('Project does not exist.');
    }

    return project;
  }

  @Mutation()
  async deleteProject(
    @Args('input')
    input: ProjectWhereUniqueInput,
  ): Promise<Nullable<Project>> {
    const project = await this.projectsService.deleteProject(input);

    if (!project) {
      throw new NotFoundException('Project does not exist.');
    }

    return project;
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
  ): Promise<Nullable<Project>> {
    const project = await this.projectsService.addMembership(input);

    if (!project) {
      throw new NotFoundException('Role, Project or User does not exist.');
    }

    return project;
  }
}
