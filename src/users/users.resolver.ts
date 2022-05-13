import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { Prisma, User } from '@prisma/client';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('users')
  async getUsers() {
    return this.usersService.getUsers({});
  }

  @Query('user')
  async getUser(@Args('input') input: Prisma.UserWhereUniqueInput) {
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
    input: {
      where: Prisma.UserWhereUniqueInput;
      data: Prisma.UserUpdateInput;
    },
  ): Promise<User> {
    return this.usersService.updateUser(input);
  }

  @Mutation()
  async deleteUser(
    @Args('input')
    input: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    return this.usersService.deleteUser(input);
  }
}
