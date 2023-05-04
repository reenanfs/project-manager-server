import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { MockService } from 'src/utils/mock/mock.service';
import { TasksService } from './tasks.service';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';
import { CustomNotFoundException } from 'src/common/errors/custom-exceptions/not-found.exception';

describe('TasksService', () => {
  let tasksService: TasksService;
  let projectsService: ProjectsService;
  let usersService: UsersService;
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

    const mockProjectsService = {
      ensureProjectExists: jest.fn().mockResolvedValue({}),
    };

    const mockUsersService = {
      ensureUserExists: jest.fn().mockResolvedValue(MockService.user),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        PrismaService,
        MockService,
        ProjectsService,
        UsersService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(ProjectsService)
      .useValue(mockProjectsService)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    tasksService = module.get<TasksService>(TasksService);
    projectsService = module.get<ProjectsService>(ProjectsService);
    usersService = module.get<UsersService>(UsersService);
    tasksService = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      const returnedTasks = await tasksService.getTasks({});

      expect(returnedTasks).toEqual(MockService.tasksArray);
      expect(prisma.task.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        orderBy: undefined,
      });
    });
  });

  describe('getTask', () => {
    it('should return one task', async () => {
      const returnedTask = await tasksService.getTask({
        id: MockService.taskId,
      });

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
    it('should call usersService.ensureUserExists with the correct argument', async () => {
      await tasksService.createTask(MockService.createTaskInput);

      expect(usersService.ensureUserExists).toHaveBeenCalledWith({
        id: MockService.createTaskInput.userId,
      });
    });

    it('should call projectsService.ensureProjectExists with the correct argument', async () => {
      await tasksService.createTask(MockService.createTaskInput);

      expect(projectsService.ensureProjectExists).toHaveBeenCalledWith({
        id: MockService.createTaskInput.projectId,
      });
    });

    it('should call prismaService.task.create with the correct argument', async () => {
      await tasksService.createTask(MockService.createTaskInput);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: MockService.createTaskInput,
      });
    });

    it('should create one task', async () => {
      const returnedTask = await tasksService.createTask(
        MockService.createTaskInput,
      );

      expect(returnedTask).toEqual(MockService.task);
      expect(prisma.task.create).toHaveBeenCalledTimes(1);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: MockService.createTaskInput,
      });
    });

    it('should throw error if no user exists', async () => {
      usersService.ensureUserExists = jest
        .fn()
        .mockRejectedValue(new CustomNotFoundException('User not found.'));

      await expect(
        tasksService.createTask(MockService.createTaskInput),
      ).rejects.toThrowError(CustomNotFoundException);
      expect(usersService.ensureUserExists).toBeCalledWith({
        id: MockService.createTaskInput.userId,
      });
      expect(projectsService.ensureProjectExists).toHaveBeenCalledTimes(0);
      expect(prisma.task.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('updateTask', () => {
    it('should update one task', async () => {
      const returnedTask = await tasksService.updateTask(MockService.task);

      expect(returnedTask).toEqual(MockService.task);
      expect(prisma.task.update).toHaveBeenCalledTimes(1);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: MockService.taskId },
        data: MockService.task,
      });
    });

    it('should throw error if no user exists', async () => {
      tasksService.ensureTaskExists = jest
        .fn()
        .mockRejectedValue(new CustomNotFoundException('User not found.'));

      await expect(
        tasksService.updateTask(MockService.updateTaskInput),
      ).rejects.toThrowError(CustomNotFoundException);
      expect(tasksService.ensureTaskExists).toBeCalledWith({
        id: MockService.updateTaskInput.id,
      });
      expect(prisma.task.update).toHaveBeenCalledTimes(0);
    });
  });

  describe('deleteTask', () => {
    it('should delete one task', async () => {
      const returnedTask = await tasksService.deleteTask({
        id: MockService.taskId,
      });

      expect(returnedTask).toEqual(MockService.task);
      expect(prisma.task.delete).toHaveBeenCalledTimes(1);
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: {
          id: MockService.taskId,
        },
      });
    });

    it('should throw error if no task exists', async () => {
      tasksService.ensureTaskExists = jest
        .fn()
        .mockRejectedValue(new CustomNotFoundException('User not found.'));

      await expect(
        tasksService.deleteTask({
          id: MockService.taskId,
        }),
      ).rejects.toThrowError(CustomNotFoundException);

      expect(tasksService.ensureTaskExists).toBeCalledWith({
        id: MockService.taskId,
      });
      expect(prisma.task.delete).toHaveBeenCalledTimes(0);
    });
  });

  describe('deleteTasks', () => {
    it('should delete many tasks', async () => {
      const returneBulkOperationResult = await tasksService.deleteTasks({
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

      const returnedUser = await tasksService.getTaskUser(MockService.task);

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
