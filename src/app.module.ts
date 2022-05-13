import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { DateTimeResolver } from 'graphql-scalars';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql/typescript-typings.ts'),
      },
      resolvers: { DateTime: DateTimeResolver },
    }),
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}
