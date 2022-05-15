import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { TaskCreateWithoutUserInput } from './task-create-without-user.input';
import { TaskCreateOrConnectWithoutUserInput } from './task-create-or-connect-without-user.input';
import { TaskCreateManyUserInputEnvelope } from './task-create-many-user-input-envelope.input';
import { TaskWhereUniqueInput } from './task-where-unique.input';

@InputType()
export class TaskUncheckedCreateNestedManyWithoutUserInput {

    @Field(() => [TaskCreateWithoutUserInput], {nullable:true})
    create?: Array<TaskCreateWithoutUserInput>;

    @Field(() => [TaskCreateOrConnectWithoutUserInput], {nullable:true})
    connectOrCreate?: Array<TaskCreateOrConnectWithoutUserInput>;

    @Field(() => TaskCreateManyUserInputEnvelope, {nullable:true})
    createMany?: TaskCreateManyUserInputEnvelope;

    @Field(() => [TaskWhereUniqueInput], {nullable:true})
    connect?: Array<TaskWhereUniqueInput>;
}
