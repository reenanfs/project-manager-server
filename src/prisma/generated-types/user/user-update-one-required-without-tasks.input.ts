import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserCreateWithoutTasksInput } from './user-create-without-tasks.input';
import { UserCreateOrConnectWithoutTasksInput } from './user-create-or-connect-without-tasks.input';
import { UserUpsertWithoutTasksInput } from './user-upsert-without-tasks.input';
import { UserWhereUniqueInput } from './user-where-unique.input';
import { UserUpdateWithoutTasksInput } from './user-update-without-tasks.input';

@InputType()
export class UserUpdateOneRequiredWithoutTasksInput {

    @Field(() => UserCreateWithoutTasksInput, {nullable:true})
    create?: UserCreateWithoutTasksInput;

    @Field(() => UserCreateOrConnectWithoutTasksInput, {nullable:true})
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput;

    @Field(() => UserUpsertWithoutTasksInput, {nullable:true})
    upsert?: UserUpsertWithoutTasksInput;

    @Field(() => UserWhereUniqueInput, {nullable:true})
    connect?: UserWhereUniqueInput;

    @Field(() => UserUpdateWithoutTasksInput, {nullable:true})
    update?: UserUpdateWithoutTasksInput;
}
