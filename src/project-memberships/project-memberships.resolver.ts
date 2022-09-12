import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Project, ProjectMembership, Role, User } from '@prisma/client';
import { Nullable } from 'src/typescript/types';
import { ProjectMembershipsService } from './project-memberships.service';

@Resolver('ProjectMembership')
export class ProjectMembershipsResolver {
  constructor(
    private readonly projectMembershipsService: ProjectMembershipsService,
  ) {}

  @ResolveField('user')
  async getProjectMembershipUser(
    @Parent() projectMembership: ProjectMembership,
  ): Promise<Nullable<User>> {
    return this.projectMembershipsService.getProjectMembershipUser(
      projectMembership,
    );
  }

  @ResolveField('project')
  async getProjectMembershipProject(
    @Parent() projectMembership: ProjectMembership,
  ): Promise<Nullable<Project>> {
    return this.projectMembershipsService.getProjectMembershipProject(
      projectMembership,
    );
  }

  @ResolveField('role')
  async getProjectMembershipRole(
    @Parent() projectMembership: ProjectMembership,
  ): Promise<Nullable<Role>> {
    return this.projectMembershipsService.getProjectMembershipRole(
      projectMembership,
    );
  }
}
