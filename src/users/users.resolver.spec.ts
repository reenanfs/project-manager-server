import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockService } from 'src/utils/mock/mock.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  beforeEach(async () => {
    const mockUsersService = {
      getUsers: jest.fn().mockResolvedValue(MockService.usersArray),
      getUser: jest.fn().mockResolvedValue(MockService.user),
      getUserTasks: jest.fn().mockResolvedValue(MockService.tasksArray),
      createUser: jest.fn().mockReturnValue(MockService.user),
      updateUser: jest.fn().mockResolvedValue(MockService.user),
      deleteUser: jest.fn().mockResolvedValue(MockService.user),
      deleteUsers: jest.fn().mockResolvedValue(MockService.bulkOperationResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver, UsersService, MockService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    service = module.get<UsersService>(UsersService);
    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const returnedUsers = await resolver.getUsers({});

      expect(returnedUsers).toEqual(MockService.usersArray);
      expect(service.getUsers).toHaveBeenCalledTimes(1);
      expect(service.getUsers).toHaveBeenCalledWith({});
    });
  });

  describe('getUser', () => {
    it('should return one user', async () => {
      const returnedUser = await resolver.getUser({ id: MockService.userId });

      expect(returnedUser).toEqual(MockService.user);
      expect(service.getUser).toHaveBeenCalledTimes(1);
      expect(service.getUser).toHaveBeenCalledWith({
        id: MockService.userId,
      });
    });

    it('should throw an error if user does not exist', async () => {
      service.getUser = jest.fn().mockResolvedValue(null);

      expect(resolver.getUser({ id: MockService.userId })).rejects.toThrow(
        NotFoundException,
      );
      expect(resolver.getUser({ id: MockService.userId })).rejects.toThrow(
        'User does not exist.',
      );
    });
  });

  describe('getUserTasks', () => {
    it('should return an array of tasks', async () => {
      const returnedTasks = await resolver.getUserTasks(MockService.user);

      expect(returnedTasks).toEqual(MockService.tasksArray);
      expect(service.getUserTasks).toHaveBeenCalledTimes(1);
      expect(service.getUserTasks).toHaveBeenCalledWith(MockService.user);
    });
  });

  describe('createUser', () => {
    it('should create one user', async () => {
      const returnedUser = await resolver.createUser(MockService.user);

      expect(returnedUser).toEqual(MockService.user);
      expect(service.createUser).toHaveBeenCalledTimes(1);
      expect(service.createUser).toHaveBeenCalledWith(MockService.user);
    });
  });

  describe('updateUser', () => {
    it('should update one user', async () => {
      const returnedUser = await resolver.updateUser(MockService.user);

      expect(returnedUser).toEqual(MockService.user);
      expect(service.updateUser).toHaveBeenCalledTimes(1);
      expect(service.updateUser).toHaveBeenCalledWith(MockService.user);
    });

    it('should throw an error if user does not exist', async () => {
      service.updateUser = jest.fn().mockResolvedValue(null);

      expect(resolver.updateUser(MockService.user)).rejects.toThrow(
        NotFoundException,
      );
      expect(resolver.updateUser(MockService.user)).rejects.toThrow(
        'User does not exist.',
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete one user', async () => {
      const returnedUser = await resolver.deleteUser({
        id: MockService.userId,
      });

      expect(returnedUser).toEqual(MockService.user);
      expect(service.deleteUser).toHaveBeenCalledTimes(1);
      expect(service.deleteUser).toHaveBeenCalledWith({
        id: MockService.userId,
      });
    });

    it('should throw an error if user does not exist', async () => {
      service.deleteUser = jest.fn().mockResolvedValue(null);

      expect(resolver.deleteUser({ id: MockService.userId })).rejects.toThrow(
        NotFoundException,
      );
      expect(resolver.deleteUser({ id: MockService.userId })).rejects.toThrow(
        'User does not exist.',
      );
    });
  });

  describe('deleteUsers', () => {
    it('should delete many users', async () => {
      const returnedBulkOperationResult = await resolver.deleteUsers({
        ids: MockService.userIdArray,
      });

      expect(returnedBulkOperationResult).toEqual(
        MockService.bulkOperationResult,
      );
      expect(service.deleteUsers).toHaveBeenCalledTimes(1);
      expect(service.deleteUsers).toHaveBeenCalledWith({
        ids: MockService.userIdArray,
      });
    });
  });
});
