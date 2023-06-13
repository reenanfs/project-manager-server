import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { MockService } from 'src/utils/mock/mock.service';

let prisma: PrismaService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [PrismaService, MockService],
  }).compile();

  prisma = module.get<PrismaService>(PrismaService);
});

beforeEach(async () => {
  await prisma.user.createMany({ data: [...MockService.createManyUsersInput] });
  const role = await prisma.role.create({
    data: { ...MockService.createRoleInput },
  });
  const users = await prisma.user.findMany();

  await prisma.project.create({
    data: {
      ...MockService.createProjectInput,
      ownerId: users[0].id,
      projectMemberships: {
        createMany: {
          data: [
            {
              userId: users[0].id,
              roleId: role.id,
            },
            {
              userId: users[1].id,
              roleId: role.id,
            },
          ],
        },
      },
      tasks: {
        createMany: {
          data: [
            { ...MockService.createManyTasksInput[0], userId: users[0].id },
            { ...MockService.createManyTasksInput[1], userId: users[1].id },
          ],
        },
      },
    },
  });
});

afterEach(async () => {
  await prisma.$transaction([
    prisma.credential.deleteMany(),
    prisma.project.deleteMany(),
    prisma.task.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
