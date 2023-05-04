import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockService } from 'src/utils/mock/mock.service';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';

describe('TasksResolver', () => {
  let resolver: TasksResolver;
  let tasksService: TasksService;

  beforeEach(async () => {
    const mockTasksService = {
      getTasks: jest.fn().mockResolvedValue(MockService.tasksArray),
      getTask: jest.fn().mockResolvedValue(MockService.task),
      getTaskUser: jest.fn().mockResolvedValue(MockService.user),
      createTask: jest.fn().mockReturnValue(MockService.task),
      updateTask: jest.fn().mockResolvedValue(MockService.task),
      deleteTask: jest.fn().mockResolvedValue(MockService.task),
      deleteTasks: jest.fn().mockResolvedValue(MockService.bulkOperationResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksResolver, TasksService, MockService],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    tasksService = module.get<TasksService>(TasksService);
    resolver = module.get<TasksResolver>(TasksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      const returnedTasks = await resolver.getTasks({});

      expect(returnedTasks).toEqual(MockService.tasksArray);
      expect(tasksService.getTasks).toHaveBeenCalledTimes(1);
      expect(tasksService.getTasks).toHaveBeenCalledWith({});
    });
  });

  describe('getTask', () => {
    it('should return one task', async () => {
      const returnedTask = await resolver.getTask({ id: MockService.taskId });

      expect(returnedTask).toEqual(MockService.task);
      expect(tasksService.getTask).toHaveBeenCalledTimes(1);
      expect(tasksService.getTask).toHaveBeenCalledWith({
        id: MockService.taskId,
      });
    });
  });

  describe('getTaskUser', () => {
    it('should return one user', async () => {
      const returnedUser = await resolver.getTaskUser(MockService.task);

      expect(returnedUser).toEqual(MockService.user);
      expect(tasksService.getTaskUser).toHaveBeenCalledTimes(1);
      expect(tasksService.getTaskUser).toHaveBeenCalledWith(MockService.task);
    });
  });

  describe('createTask', () => {
    it('should create one task', async () => {
      const returnedTask = await resolver.createTask(MockService.task);

      expect(returnedTask).toEqual(MockService.task);
      expect(tasksService.createTask).toHaveBeenCalledTimes(1);
      expect(tasksService.createTask).toHaveBeenCalledWith(MockService.task);
    });
  });

  describe('updateTask', () => {
    it('should update one task', async () => {
      const returnedTask = await resolver.updateTask(MockService.task);

      expect(returnedTask).toEqual(MockService.task);
      expect(tasksService.updateTask).toHaveBeenCalledTimes(1);
      expect(tasksService.updateTask).toHaveBeenCalledWith(MockService.task);
    });
  });

  describe('deleteTask', () => {
    it('should delete one task', async () => {
      const returnedTask = await resolver.deleteTask({
        id: MockService.taskId,
      });

      expect(returnedTask).toEqual(MockService.task);
      expect(tasksService.deleteTask).toHaveBeenCalledTimes(1);
      expect(tasksService.deleteTask).toHaveBeenCalledWith({
        id: MockService.taskId,
      });
    });
  });

  describe('deleteTasks', () => {
    it('should delete many tasks', async () => {
      const returnedBulkOperationResult = await resolver.deleteTasks({
        ids: MockService.taskIdArray,
      });

      expect(returnedBulkOperationResult).toEqual(
        MockService.bulkOperationResult,
      );
      expect(tasksService.deleteTasks).toHaveBeenCalledTimes(1);
      expect(tasksService.deleteTasks).toHaveBeenCalledWith({
        ids: MockService.taskIdArray,
      });
    });
  });
});
