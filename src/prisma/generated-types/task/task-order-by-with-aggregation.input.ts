import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { SortOrder } from '../prisma/sort-order.enum';
import { TaskCountOrderByAggregateInput } from './task-count-order-by-aggregate.input';
import { TaskMaxOrderByAggregateInput } from './task-max-order-by-aggregate.input';
import { TaskMinOrderByAggregateInput } from './task-min-order-by-aggregate.input';

@InputType()
export class TaskOrderByWithAggregationInput {

    @Field(() => SortOrder, {nullable:true})
    id?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    taskName?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    description?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    userId?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    startDate?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    dueDate?: keyof typeof SortOrder;

    @Field(() => SortOrder, {nullable:true})
    completionDate?: keyof typeof SortOrder;

    @Field(() => TaskCountOrderByAggregateInput, {nullable:true})
    _count?: TaskCountOrderByAggregateInput;

    @Field(() => TaskMaxOrderByAggregateInput, {nullable:true})
    _max?: TaskMaxOrderByAggregateInput;

    @Field(() => TaskMinOrderByAggregateInput, {nullable:true})
    _min?: TaskMinOrderByAggregateInput;
}
