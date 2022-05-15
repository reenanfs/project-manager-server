import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserWhereUniqueInput } from './user-where-unique.input';
import { UserCreateWithoutTasksInput } from './user-create-without-tasks.input';

@InputType()
export class UserCreateOrConnectWithoutTasksInput {

    @Field(() => UserWhereUniqueInput, {nullable:false})
    where!: UserWhereUniqueInput;

    @Field(() => UserCreateWithoutTasksInput, {nullable:false})
    create!: UserCreateWithoutTasksInput;
}
