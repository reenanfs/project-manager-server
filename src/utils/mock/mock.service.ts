import { Injectable } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { ReadStream } from 'fs';
import { FileUpload } from 'src/common/interfaces/file-upload.interface';
import {
  BulkOperationResult,
  CreateCredentialInput,
  CreatePermissionInput,
  CreateProjectInput,
  CreateRoleInput,
  CreateTaskInput,
  Credential,
  CredentialUserInput,
  UpdateTaskInput,
} from 'src/typescript/gql-generated-types';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';

@Injectable()
export class MockService {
  static usersArray: User[] = [
    {
      id: 'a13cc5b8-ecee-4bf1-8fad-4b8dc04e4805',
      name: 'Name1',
      profilePictureName: 'sdfsdfsdfsdfs.jpg',
      currentProjectId: null,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'fd210632-3ccc-4e0f-b561-f44ddec6d8a7',
      name: 'Name2',
      profilePictureName: 'sdfsdfsdfsdfs.jpg',
      currentProjectId: null,
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

  static photoFile: FileUpload = {
    filename: 'filename',
    mimetype: 'mimetype',
    encoding: 'encoding',
    createReadStream: () => new ReadStream(),
  };

  static createUserInput: CreateUserDto = {
    name: 'Name1',
    photoFile: MockService.photoFile,
    currentProjectId: '0825f430-bbbb-41d2-a24d-afc33f2fc8b7',
    isAdmin: false,
  };

  static createManyUsersInput = [
    {
      name: 'Name1',
      profilePictureName: 'Picture 1',
      isAdmin: false,
    },
    {
      name: 'Name2',
      profilePictureName: 'Picture 2',
      isAdmin: false,
    },
  ];

  static updateUserInput: UpdateUserDto = {
    id: 'a13cc5b8-ecee-4bf1-8fad-4b8dc04e4805',
    name: 'Name1',
    currentProjectId: '0825f430-bbbb-41d2-a24d-afc33f2fc8b7',
    isAdmin: false,
  };

  static credential: Credential & { password: string } = {
    id: 'a1332325b8-ecee-4bf1-8fad-4b8dc04e4805',
    email: 'test@email.com',
    password: 'fakepassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  static createCredentialInput: CreateCredentialInput = {
    email: 'test@email.com',
    password: 'Fakepassword25',
    user: {
      name: 'Name1',
      isAdmin: false,
    },
  };

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

  static createTaskInput = {
    name: 'Task2',
    description: 'Description2',
    userId: MockService.userIdArray[1],
    startDate: new Date(),
    dueDate: new Date(),
    completionDate: new Date(),
    completed: true,
    projectId: '0825f430-bbbb-41d2-a24d-afc33f2fc8b7',
  };

  static createManyTasksInput = [
    {
      name: 'Task1',
      description: 'Description1',
      userId: MockService.userIdArray[0],
      startDate: new Date(),
      dueDate: new Date(),
      completionDate: new Date(),
      completed: true,
    },
    {
      name: 'Task2',
      description: 'Description2',
      userId: MockService.userIdArray[1],
      startDate: new Date(),
      dueDate: new Date(),
      completionDate: new Date(),
      completed: true,
    },
  ];

  static updateTaskInput: UpdateTaskInput = {
    id: '0825f430-bbbb-41d2-a24d-afc33f2fc8b7',
    name: 'Task2',
    description: 'Description2',
    userId: MockService.userIdArray[1],
    startDate: new Date(),
    dueDate: new Date(),
    completionDate: new Date(),
    completed: true,
    projectId: '0825f430-bbbb-41d2-a24d-afc33f2fc8b7',
  };

  static createProjectInput = {
    name: 'Project 1',
    description: 'Project 1',
  };

  static createRoleInput: CreateRoleInput = {
    name: 'Role 1',
    description: 'Role 1',
  };

  static createPermissionInput: CreatePermissionInput = {
    name: 'Permission 1',
    description: 'Permission 1',
  };
}
