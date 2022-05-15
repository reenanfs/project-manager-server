import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { TaskWhereUniqueInput } from './task-where-unique.input';
import { TaskUpdateWithoutUserInput } from './task-update-without-user.input';
import { TaskCreateWithoutUserInput } from './task-create-without-user.input';

@InputType()
export class TaskUpsertWithWhereUniqueWithoutUserInput {

    @Field(() => TaskWhereUniqueInput, {nullable:false})
    where!: TaskWhereUniqueInput;

    @Field(() => TaskUpdateWithoutUserInput, {nullable:false})
    update!: TaskUpdateWithoutUserInput;

    @Field(() => TaskCreateWithoutUserInput, {nullable:false})
    create!: TaskCreateWithoutUserInput;
}
