import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';

const mockedUsers = [
  {
    id: 'a13cc5b8-ecee-4bf1-8fad-4b8dc04e4805',
    name: 'Name1',
    role: 'Role1',
    email: 'email1@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'fd210632-3ccc-4e0f-b561-f44ddec6d8a7',
    name: 'Name2',
    role: 'Role2',
    email: 'email2@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockedTasks = [
  {
    id: 'a13cc5b8-ecee-4bf1-8fad-4b8dc04e4805',
    taskName: 'Name1',
    description: 'Role1',
    user_id: 'email1@gmail.com',
    start_date: new Date(),
    due_date: new Date(),
    completion_date: new Date(),
    completed: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockedUser = mockedUsers[0];

const mockedBatchPayload = { count: 2 };

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findMany: jest.fn().mockResolvedValue(mockedUsers),
        findUnique: jest.fn().mockResolvedValue(mockedUser),
        create: jest.fn().mockReturnValue(mockedUser),
        update: jest.fn().mockResolvedValue(mockedUser),
        delete: jest.fn().mockResolvedValue(mockedUser),
        deleteMany: jest.fn().mockResolvedValue(mockedBatchPayload),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
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

      expect(returnedUsers).toEqual(mockedUsers);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        orderBy: undefined,
      });
    });
  });

  describe('getUser', () => {
    it('should return one user', async () => {
      const returnedUser = await service.getUser({ id: '1' });

      expect(returnedUser).toEqual(mockedUser);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
  });

  describe('createUser', () => {
    it('should create one user', async () => {
      const returnedUser = await service.createUser(mockedUser);

      expect(returnedUser).toEqual(mockedUser);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: mockedUser,
      });
    });
  });

  describe('updateUser', () => {
    it('should update one user', async () => {
      const returnedUser = await service.updateUser(mockedUser);

      expect(returnedUser).toEqual(mockedUser);
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockedUser.id },
        data: mockedUser,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete one user', async () => {
      const returnedUser = await service.deleteUser({ id: '1' });

      expect(returnedUser).toEqual(mockedUser);
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
  });

  describe('deleteUsers', () => {
    it('should delete one user', async () => {
      const returnedBatchPayload = await service.deleteUsers({
        ids: ['1', '2'],
      });

      expect(returnedBatchPayload).toEqual(mockedBatchPayload);
      expect(prisma.user.deleteMany).toHaveBeenCalledTimes(1);
      expect(prisma.user.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['1', '2'] },
        },
      });
    });
  });

  describe('getUserTasks', () => {
    it('should get tasks related to user', async () => {
      prisma.user.findUnique = jest.fn().mockReturnValue({
        tasks: jest.fn().mockResolvedValue(mockedTasks),
      });

      const returnedTasks = await service.getUserTasks(mockedUser);

      expect(returnedTasks).toEqual(mockedTasks);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockedUser.id,
        },
      });
    });
  });
});
