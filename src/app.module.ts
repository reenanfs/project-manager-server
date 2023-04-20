import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DateTimeResolver } from 'graphql-scalars';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { ProjectMembershipsModule } from './project-memberships/project-memberships.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards/access-token-jwt.guard';
import { CORS_CONFIG } from './common/constants';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env.NODE_ENV;
console.log(ENV);
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }) => ({ req, res }),
      cors: CORS_CONFIG,
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      typePaths: ['./**/*.graphql'],
      resolvers: { DateTime: DateTimeResolver, Upload: GraphQLUpload },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/.env.${ENV}`,
    }),
    TasksModule,
    UsersModule,
    AuthModule,
    RolesModule,
    ProjectsModule,
    PermissionsModule,
    ProjectMembershipsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
