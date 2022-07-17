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
  await prisma.user.createMany({ data: MockService.usersArray });
  await prisma.task.createMany({
    data: MockService.tasksArray,
  });
});

afterEach(async () => {
  const deleteOrderDetails = prisma.task.deleteMany();
  const deleteProduct = prisma.user.deleteMany();

  await prisma.$transaction([deleteOrderDetails, deleteProduct]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
