import { Query, Resolver } from '@nestjs/graphql';
import { TasksService } from './tasks.service';

@Resolver('Task')
export class TasksResolver {
  // constructor(private tasksService: TasksService) {}
  sampleTasks = [
    {
      id: 'random id sample',
      taskName: 'String!',
      description: 'String',
      user: 'String',
      startDate: 'String!',
      dueDate: 'String!',
      completionDate: 'String',
    },
  ];

  @Query('tasks')
  getTasks() {
    return this.sampleTasks;
  }
}
