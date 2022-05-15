import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserUpdateWithoutTasksInput } from './user-update-without-tasks.input';
import { UserCreateWithoutTasksInput } from './user-create-without-tasks.input';

@InputType()
export class UserUpsertWithoutTasksInput {

    @Field(() => UserUpdateWithoutTasksInput, {nullable:false})
    update!: UserUpdateWithoutTasksInput;

    @Field(() => UserCreateWithoutTasksInput, {nullable:false})
    create!: UserCreateWithoutTasksInput;
}
