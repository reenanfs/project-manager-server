import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { Prisma, User } from '@prisma/client';
import { Nullable } from 'src/types/typescript.types';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('users')
  async getUsers(): Promise<Nullable<User[]>> {
    return this.usersService.getUsers({});
  }

  @Query('user')
  async getUser(
    @Args('input') input: Prisma.UserWhereUniqueInput,
  ): Promise<Nullable<User>> {
    return this.usersService.getUser(input);
  }

  @Mutation()
  async createUser(
    @Args('input') input: Prisma.UserCreateInput,
  ): Promise<User> {
    return this.usersService.createUser(input);
  }

  @Mutation()
  async updateUser(
    @Args('input')
    input: Prisma.UserUpdateInput,
  ): Promise<Nullable<User>> {
    return this.usersService.updateUser(input);
  }

  @Mutation()
  async deleteUser(
    @Args('input')
    input: Prisma.UserWhereUniqueInput,
  ): Promise<Nullable<User>> {
    return this.usersService.deleteUser(input);
  }
}
