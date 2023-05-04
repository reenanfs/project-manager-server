import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { MockService } from 'src/utils/mock/mock.service';
import { UsersService } from './users.service';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectMembershipsService } from 'src/project-memberships/project-memberships.service';
import { FileUploaderService } from 'src/utils/file-uploader/file-uploader.service';
import { RolesService } from 'src/roles/roles.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findMany: jest.fn().mockResolvedValue(MockService.usersArray),
        findUnique: jest.fn().mockResolvedValue(MockService.user),
        create: jest.fn().mockReturnValue(MockService.user),
        update: jest.fn().mockResolvedValue(MockService.user),
        delete: jest.fn().mockResolvedValue(MockService.user),
        deleteMany: jest
          .fn()
          .mockResolvedValue(MockService.bulkOperationResult),
      },
    };

    const mockfileUploaderService = {
      uploadFile: jest.fn().mockResolvedValue(MockService.photoFile.filename),
      deleteFile: jest.fn().mockResolvedValue({}),
    };

    const mockRoleService = {
      ensureProjectExists: jest.fn().mockResolvedValue({}),
    };

    const mockProjectMembershipsService = {
      ensureProjectExists: jest.fn().mockResolvedValue({}),
    };

    const mockProjectsService = {
      ensureProjectExists: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
        MockService,
        ProjectsService,
        ProjectMembershipsService,
        FileUploaderService,
        RolesService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(FileUploaderService)
      .useValue(mockfileUploaderService)
      .overrideProvider(RolesService)
      .useValue(mockRoleService)
      .overrideProvider(ProjectMembershipsService)
      .useValue(mockProjectMembershipsService)
      .overrideProvider(ProjectsService)
      .useValue(mockProjectsService)
      .compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const returnedUsers = await service.getUsers({});

      expect(returnedUsers).toEqual(MockService.usersArray);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        orderBy: undefined,
      });
    });
  });

  describe('getUser', () => {
    it('should return one user', async () => {
      const returnedUser = await service.getUser({ id: MockService.userId });

      expect(returnedUser).toEqual(MockService.user);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: MockService.userId,
        },
      });
    });
  });

  describe('createUser', () => {
    it('should create one user', async () => {
      const returnedUser = await service.createUser(
        MockService.createUserInput,
      );

      expect(returnedUser).toEqual(MockService.user);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...MockService.createUserInput,
          profilePictureName: MockService.photoFile.filename,
        },
      });
    });
  });

  describe('updateUser', () => {
    it('should update one user', async () => {
      const returnedUser = await service.updateUser(
        MockService.updateUserInput,
      );

      expect(returnedUser).toEqual(MockService.user);
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: MockService.userId },
        data: MockService.updateUserInput,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete one user', async () => {
      const returnedUser = await service.deleteUser({ id: MockService.userId });

      expect(returnedUser).toEqual(MockService.user);
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: {
          id: MockService.userId,
        },
      });
    });
  });

  describe('deleteUsers', () => {
    it('should delete many users', async () => {
      const returneBulkOperationResult = await service.deleteUsers({
        ids: MockService.userIdArray,
      });

      expect(returneBulkOperationResult).toEqual(
        MockService.bulkOperationResult,
      );
      expect(prisma.user.deleteMany).toHaveBeenCalledTimes(1);
      expect(prisma.user.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: MockService.userIdArray },
        },
      });
    });
  });

  describe('getUserTasks', () => {
    it('should get tasks related to user', async () => {
      prisma.user.findUnique = jest.fn().mockReturnValue({
        tasks: jest.fn().mockResolvedValue(MockService.tasksArray),
      });

      const returnedTasks = await service.getUserTasks(MockService.user);

      expect(returnedTasks).toEqual(MockService.tasksArray);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: MockService.userId,
        },
      });
    });
  });
});
