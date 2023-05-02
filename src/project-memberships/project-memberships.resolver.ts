import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Project, ProjectMembership, Role, User } from '@prisma/client';

import { ProjectMembershipsService } from './project-memberships.service';
import { NotFoundException } from '@nestjs/common';
import { ProjectMembershipWhereUniqueInput } from 'src/typescript/gql-generated-types';

@Resolver('ProjectMembership')
export class ProjectMembershipsResolver {
  constructor(
    private readonly projectMembershipsService: ProjectMembershipsService,
  ) {}

  @Query('projectMembership')
  async getProjectMembership(
    @Args('input') input: ProjectMembershipWhereUniqueInput,
  ): Promise<ProjectMembership> {
    return this.projectMembershipsService.getProjectMembership(input);
  }

  @ResolveField('user')
  async getProjectMembershipUser(
    @Parent() projectMembership: ProjectMembership,
  ): Promise<User> {
    return this.projectMembershipsService.getProjectMembershipUser(
      projectMembership,
    );
  }

  @ResolveField('project')
  async getProjectMembershipProject(
    @Parent() projectMembership: ProjectMembership,
  ): Promise<Project> {
    return this.projectMembershipsService.getProjectMembershipProject(
      projectMembership,
    );
  }

  @ResolveField('role')
  async getProjectMembershipRole(
    @Parent() projectMembership: ProjectMembership,
  ): Promise<Role> {
    return this.projectMembershipsService.getProjectMembershipRole(
      projectMembership,
    );
  }
}
