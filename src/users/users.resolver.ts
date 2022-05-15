import { NotFoundException } from '@nestjs/common';
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { Prisma, User } from '@prisma/client';
import { UserWhereUniqueInput } from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
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
    @Args('input') input: UserWhereUniqueInput,
  ): Promise<Nullable<User>> {
    return this.usersService.getUser(input);
  }

  @Mutation()
  async createUser(@Args('input') input: CreateUserDto): Promise<User> {
    return this.usersService.createUser(input);
  }

  @Mutation()
  async updateUser(
    @Args('input')
    input: UpdateUserDto,
  ): Promise<Nullable<User>> {
    const { id } = input;

    const user = await this.usersService.getUser({ id });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return this.usersService.updateUser(input);
  }

  @Mutation()
  async deleteUser(
    @Args('input')
    input: UserWhereUniqueInput,
  ): Promise<Nullable<User>> {
    const { id } = input;

    const user = await this.usersService.getUser({ id });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return this.usersService.deleteUser(input);
  }
}
