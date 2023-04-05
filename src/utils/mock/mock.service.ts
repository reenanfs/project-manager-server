import { Injectable } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { BulkOperationResult } from 'src/typescript/gql-generated-types';

@Injectable()
export class MockService {
  static usersArray: User[] = [
    {
      id: 'a13cc5b8-ecee-4bf1-8fad-4b8dc04e4805',
      name: 'Name1',
      photoUrl: 'https://url.com',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'fd210632-3ccc-4e0f-b561-f44ddec6d8a7',
      name: 'Name2',
      photoUrl: 'https://url.com',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date('2100-12-12'),
    },
  ];

  static user: User = MockService.usersArray[0];

  static userId: string = MockService.user.id;

  static userIdArray: string[] = [
    MockService.userId,
    MockService.usersArray[1].id,
  ];

  static bulkOperationResult: BulkOperationResult = { count: 2 };

  static tasksArray: Task[] = [
    {
      id: '0825f430-8de1-41d2-a24d-afc33f2fc8b7',
      name: 'Task1',
      description: 'Description1',
      userId: MockService.userId,
      startDate: new Date(),
      dueDate: new Date(),
      completionDate: new Date(),
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      projectId: '0825f430-aaaa-41d2-a24d-afc33f2fc8b7',
    },
    {
      id: '36f46331-6a70-4fac-8289-9eb34d1ebf4c',
      name: 'Task2',
      description: 'Description2',
      userId: MockService.userIdArray[1],
      startDate: new Date(),
      dueDate: new Date(),
      completionDate: new Date(),
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date('2100-12-12'),
      projectId: '0825f430-bbbb-41d2-a24d-afc33f2fc8b7',
    },
  ];

  static task: Task = MockService.tasksArray[0];

  static taskId: string = MockService.task.id;

  static taskIdArray: string[] = [
    MockService.taskId,
    MockService.tasksArray[1].id,
  ];
}
