import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockService } from 'src/utils/mock/mock.service';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

describe('TasksResolver', () => {
  let resolver: TasksResolver;
  let service: TasksService;

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

    service = module.get<TasksService>(TasksService);
    resolver = module.get<TasksResolver>(TasksResolver);
  });

  it('should be defined', () => {
    expect(resolver).not.toBeDefined();
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      const returnedTasks = await resolver.getTasks({});

      expect(returnedTasks).toEqual(MockService.tasksArray);
      expect(service.getTasks).toHaveBeenCalledTimes(1);
      expect(service.getTasks).toHaveBeenCalledWith({});
    });
  });

  describe('getTask', () => {
    it('should return one task', async () => {
      const returnedTask = await resolver.getTask({ id: MockService.taskId });

      expect(returnedTask).toEqual(MockService.task);
      expect(service.getTask).toHaveBeenCalledTimes(1);
      expect(service.getTask).toHaveBeenCalledWith({
        id: MockService.taskId,
      });
    });

    it('should throw an error if task does not exist', async () => {
      service.getTask = jest.fn().mockResolvedValue(null);

      expect(resolver.getTask({ id: MockService.taskId })).rejects.toThrow(
        NotFoundException,
      );
      expect(resolver.getTask({ id: MockService.taskId })).rejects.toThrow(
        'Task does not exist.',
      );
    });
  });

  describe('getTaskUser', () => {
    it('should return one user', async () => {
      const returnedUser = await resolver.getTaskUser(MockService.task);

      expect(returnedUser).toEqual(MockService.user);
      expect(service.getTaskUser).toHaveBeenCalledTimes(1);
      expect(service.getTaskUser).toHaveBeenCalledWith(MockService.task);
    });
  });

  describe('createTask', () => {
    it('should create one task', async () => {
      const returnedTask = await resolver.createTask(MockService.task);

      expect(returnedTask).toEqual(MockService.task);
      expect(service.createTask).toHaveBeenCalledTimes(1);
      expect(service.createTask).toHaveBeenCalledWith(MockService.task);
    });

    it('should throw an error if user does not exist', async () => {
      service.createTask = jest.fn().mockResolvedValue(null);

      expect(resolver.createTask(MockService.task)).rejects.toThrow(
        NotFoundException,
      );
      expect(resolver.createTask(MockService.task)).rejects.toThrow(
        'User does not exist.',
      );
    });
  });

  describe('updateTask', () => {
    it('should update one task', async () => {
      const returnedTask = await resolver.updateTask(MockService.task);

      expect(returnedTask).toEqual(MockService.task);
      expect(service.updateTask).toHaveBeenCalledTimes(1);
      expect(service.updateTask).toHaveBeenCalledWith(MockService.task);
    });

    it('should throw an error if task does not exist', async () => {
      service.updateTask = jest.fn().mockResolvedValue(null);

      expect(resolver.updateTask(MockService.task)).rejects.toThrow(
        NotFoundException,
      );
      expect(resolver.updateTask(MockService.task)).rejects.toThrow(
        'Task does not exist.',
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete one task', async () => {
      const returnedTask = await resolver.deleteTask({
        id: MockService.taskId,
      });

      expect(returnedTask).toEqual(MockService.task);
      expect(service.deleteTask).toHaveBeenCalledTimes(1);
      expect(service.deleteTask).toHaveBeenCalledWith({
        id: MockService.taskId,
      });
    });

    it('should throw an error if task does not exist', async () => {
      service.deleteTask = jest.fn().mockResolvedValue(null);

      expect(resolver.deleteTask({ id: MockService.taskId })).rejects.toThrow(
        NotFoundException,
      );
      expect(resolver.deleteTask({ id: MockService.taskId })).rejects.toThrow(
        'Task does not exist.',
      );
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
      expect(service.deleteTasks).toHaveBeenCalledTimes(1);
      expect(service.deleteTasks).toHaveBeenCalledWith({
        ids: MockService.taskIdArray,
      });
    });
  });
});
