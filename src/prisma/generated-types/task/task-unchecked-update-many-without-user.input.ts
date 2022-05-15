import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { TaskCreateWithoutUserInput } from './task-create-without-user.input';
import { TaskCreateOrConnectWithoutUserInput } from './task-create-or-connect-without-user.input';
import { TaskUpsertWithWhereUniqueWithoutUserInput } from './task-upsert-with-where-unique-without-user.input';
import { TaskCreateManyUserInputEnvelope } from './task-create-many-user-input-envelope.input';
import { TaskWhereUniqueInput } from './task-where-unique.input';
import { TaskUpdateWithWhereUniqueWithoutUserInput } from './task-update-with-where-unique-without-user.input';
import { TaskUpdateManyWithWhereWithoutUserInput } from './task-update-many-with-where-without-user.input';
import { TaskScalarWhereInput } from './task-scalar-where.input';

@InputType()
export class TaskUncheckedUpdateManyWithoutUserInput {

    @Field(() => [TaskCreateWithoutUserInput], {nullable:true})
    create?: Array<TaskCreateWithoutUserInput>;

    @Field(() => [TaskCreateOrConnectWithoutUserInput], {nullable:true})
    connectOrCreate?: Array<TaskCreateOrConnectWithoutUserInput>;

    @Field(() => [TaskUpsertWithWhereUniqueWithoutUserInput], {nullable:true})
    upsert?: Array<TaskUpsertWithWhereUniqueWithoutUserInput>;

    @Field(() => TaskCreateManyUserInputEnvelope, {nullable:true})
    createMany?: TaskCreateManyUserInputEnvelope;

    @Field(() => [TaskWhereUniqueInput], {nullable:true})
    set?: Array<TaskWhereUniqueInput>;

    @Field(() => [TaskWhereUniqueInput], {nullable:true})
    disconnect?: Array<TaskWhereUniqueInput>;

    @Field(() => [TaskWhereUniqueInput], {nullable:true})
    delete?: Array<TaskWhereUniqueInput>;

    @Field(() => [TaskWhereUniqueInput], {nullable:true})
    connect?: Array<TaskWhereUniqueInput>;

    @Field(() => [TaskUpdateWithWhereUniqueWithoutUserInput], {nullable:true})
    update?: Array<TaskUpdateWithWhereUniqueWithoutUserInput>;

    @Field(() => [TaskUpdateManyWithWhereWithoutUserInput], {nullable:true})
    updateMany?: Array<TaskUpdateManyWithWhereWithoutUserInput>;

    @Field(() => [TaskScalarWhereInput], {nullable:true})
    deleteMany?: Array<TaskScalarWhereInput>;
}
