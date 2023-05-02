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
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards/access-token-jwt.guard';
import { CORS_CONFIG } from './common/constants';
import { ConfigModule } from '@nestjs/config';
import { GraphqlExceptionFilter } from './common/errors/filter/GraphqlExceptionFilter';

const ENV = process.env.NODE_ENV;

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
      formatError: (error: any) => {
        const graphQLFormattedError = {
          message: error.extensions?.response?.message || error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          name: error.extensions?.name || error.name,
        };
        return graphQLFormattedError;
      },
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
    {
      provide: APP_FILTER,
      useClass: GraphqlExceptionFilter,
    },
  ],
})
export class AppModule {}
