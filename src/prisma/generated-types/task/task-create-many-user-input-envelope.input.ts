import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { TaskCreateManyUserInput } from './task-create-many-user.input';

@InputType()
export class TaskCreateManyUserInputEnvelope {

    @Field(() => [TaskCreateManyUserInput], {nullable:false})
    data!: Array<TaskCreateManyUserInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
