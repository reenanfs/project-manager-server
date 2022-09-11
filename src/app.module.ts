import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DateTimeResolver } from 'graphql-scalars';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProjectsModule } from './projects/projects.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
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
  ],
})
export class AppModule {}
