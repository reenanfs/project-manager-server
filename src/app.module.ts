import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DateTimeResolver } from 'graphql-scalars';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { ProjectMembershipsModule } from './project-memberships/project-memberships.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      typePaths: ['./**/*.graphql'],
      resolvers: { DateTime: DateTimeResolver },
    }),
    TasksModule,
    UsersModule,
    AuthModule,
    RolesModule,
    ProjectsModule,
    PermissionsModule,
    ProjectMembershipsModule,
  ],
})
export class AppModule {}
