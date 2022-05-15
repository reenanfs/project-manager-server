import { registerEnumType } from '@nestjs/graphql';

export enum TaskScalarFieldEnum {
    id = "id",
    taskName = "taskName",
    description = "description",
    userId = "userId",
    startDate = "startDate",
    dueDate = "dueDate",
    completionDate = "completionDate"
}


registerEnumType(TaskScalarFieldEnum, { name: 'TaskScalarFieldEnum', description: undefined })
