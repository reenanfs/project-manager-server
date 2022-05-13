import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UserInput } from 'src/graphql/typescript-typings';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation('userCreate')
  async createUser(@Args('input') input: UserInput) {}
}
