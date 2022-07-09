import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { MockService } from 'src/utils/mock/mock.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      task: {
        findMany: jest.fn().mockResolvedValue(MockService.tasksArray),
        findUnique: jest.fn().mockResolvedValue(MockService.task),
        create: jest.fn().mockReturnValue(MockService.task),
        update: jest.fn().mockResolvedValue(MockService.task),
        delete: jest.fn().mockResolvedValue(MockService.task),
        deleteMany: jest
          .fn()
          .mockResolvedValue(MockService.bulkOperationResult),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue(MockService.user),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, PrismaService, MockService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      const returnedTasks = await service.getTasks({});

      expect(returnedTasks).toEqual(MockService.tasksArray);
      expect(prisma.task.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        orderBy: undefined,
      });
    });
  });

  describe('getTask', () => {
    it('should return one task', async () => {
      const returnedTask = await service.getTask({ id: MockService.taskId });

      expect(returnedTask).toEqual(MockService.task);
      expect(prisma.task.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: {
          id: MockService.taskId,
        },
      });
    });
  });

  describe('createTask', () => {
    it('should create one task', async () => {
      const returnedTask = await service.createTask(MockService.task);

      expect(returnedTask).toEqual(MockService.task);
      expect(prisma.task.create).toHaveBeenCalledTimes(1);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: MockService.task,
      });
    });

    it('should return null if no user exists', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      const returnedTask = await service.createTask(MockService.task);
      expect(returnedTask).toEqual(null);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.task.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('updateTask', () => {
    it('should update one task', async () => {
      const returnedTask = await service.updateTask(MockService.task);

      expect(returnedTask).toEqual(MockService.task);
      expect(prisma.task.update).toHaveBeenCalledTimes(1);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: MockService.taskId },
        data: MockService.task,
      });
    });

    it('should return null if no task exists', async () => {
      prisma.task.findUnique = jest.fn().mockResolvedValue(null);

      const returnedTask = await service.updateTask(MockService.task);
      expect(returnedTask).toEqual(null);
      expect(prisma.task.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.task.update).toHaveBeenCalledTimes(0);
    });
  });

  describe('deleteTask', () => {
    it('should delete one task', async () => {
      const returnedTask = await service.deleteTask({ id: MockService.taskId });

      expect(returnedTask).toEqual(MockService.task);
      expect(prisma.task.delete).toHaveBeenCalledTimes(1);
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: {
          id: MockService.taskId,
        },
      });
    });

    it('should return null if no task exists', async () => {
      prisma.task.findUnique = jest.fn().mockResolvedValue(null);

      const returnedTask = await service.deleteTask({ id: MockService.taskId });
      expect(returnedTask).toEqual(null);
      expect(prisma.task.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.task.delete).toHaveBeenCalledTimes(0);
    });
  });

  describe('deleteTasks', () => {
    it('should delete many tasks', async () => {
      const returneBulkOperationResult = await service.deleteTasks({
        ids: MockService.taskIdArray,
      });

      expect(returneBulkOperationResult).toEqual(
        MockService.bulkOperationResult,
      );
      expect(prisma.task.deleteMany).toHaveBeenCalledTimes(1);
      expect(prisma.task.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: MockService.taskIdArray },
        },
      });
    });
  });

  describe('getTaskUser', () => {
    it('should get tasks related to task', async () => {
      prisma.task.findUnique = jest.fn().mockReturnValue({
        user: jest.fn().mockResolvedValue(MockService.user),
      });

      const returnedUser = await service.getTaskUser(MockService.task);

      expect(returnedUser).toEqual(MockService.user);
      expect(prisma.task.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: {
          id: MockService.taskId,
        },
      });
    });
  });
});
