import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { useContainer } from 'class-validator';
import { MockService } from 'src/utils/mock/mock.service';

const gql = '/graphql';

describe('Tasks (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [MockService],
    }).compile();

    app = moduleFixture.createNestApplication();

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('@Query(tasks)', () => {
    it('should return array of tasks', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{tasks { id taskName updatedAt }}`,
        });
      expect(status).toBe(200);
      expect(body.data.tasks[0].taskName).toEqual(
        MockService.tasksArray[0].taskName,
      );
    });

    it('should return ordered array of tasks', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: GetTasksInput) {
            tasks(input: $input) {
              taskName
            }
          }`,
          variables: {
            input: {
              orderBy: {
                updatedAt: 'desc',
              },
            },
          },
        });

      expect(status).toBe(200);
      expect(body.data.tasks[0].taskName).toEqual(
        MockService.tasksArray[1].taskName,
      );
    });
  });

  describe('@Query(task)', () => {
    it('should return one task', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: TaskWhereUniqueInput!) {
            task(input: $input) {
              taskName
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.task.taskName).toEqual(MockService.task.taskName);
    });

    it('should return nestjs error if task does not exist', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: TaskWhereUniqueInput!) {
            task(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: 'wrongId',
            },
          },
        });

      expect(status).toBe(200);
      expect(body.data.task).toBe(null);
      expect(body.errors[0].message).toEqual('Task does not exist.');
      expect(body.errors[0].extensions.code).toEqual('404');
    });
  });

  describe('@ResolveField(user)', () => {
    it('should return one user related to task', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: TaskWhereUniqueInput!) {
            task(input: $input) {
              user {
                name
              }
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.task.user.name).toEqual(MockService.user.name);
    });
  });

  describe('@Mutation(createTask)', () => {
    it('should create one task', async () => {
      const { status: createStatus, body: createBody } = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateTaskInput!) {
            createTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              taskName: 'Task3',
              userId: MockService.userId,
              completed: false,
            },
          },
        });
      expect(createStatus).toBe(200);
      expect(createBody.data.createTask.id).toBeTruthy();

      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: TaskWhereUniqueInput!) {
            task(input: $input) {
              taskName
            }
          }`,
          variables: {
            input: {
              id: createBody.data.createTask.id,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.task.taskName).toEqual('Task3');
    });

    it('should return nestjs error if user related to task does not exist', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateTaskInput!) {
            createTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              taskName: 'Task3',
              userId: 'wrongId',
              completed: false,
            },
          },
        });

      expect(status).toBe(200);
      expect(body.data.createTask).toBe(null);
      expect(body.errors[0].message).toEqual('User does not exist.');
      expect(body.errors[0].extensions.code).toEqual('404');
    });

    it('should return graphql error if taskName is empty', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateTaskInput!) {
            createTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              taskName: null,
              userId: MockService.userId,
              completed: false,
            },
          },
        })
        .expect(400);
    });

    it('should return graphql error if taskName is not a string', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateTaskInput!) {
            createTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              taskName: 24,
              userId: MockService.userId,
              completed: false,
            },
          },
        })
        .expect(400);
    });

    it('should return graphql error if userId is empty', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateTaskInput!) {
            createTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              taskName: 'Task4',
              userId: null,
              completed: false,
            },
          },
        })
        .expect(400);
    });

    it('should return graphql error if startDate is not a Date Object', async () => {
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateTaskInput!) {
            createTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              taskName: 'Task4',
              userId: MockService.userId,
              completed: false,
              startDate: 'sdsds',
            },
          },
        })
        .expect(400);
    });

    it('should return graphql error if dueDate is not a Date Object', async () => {
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateTaskInput!) {
            createTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              taskName: 'Task4',
              userId: MockService.userId,
              completed: false,
              dueDate: 'sdsds',
            },
          },
        })
        .expect(400);
    });
  });

  describe('@Mutation(updateTask)', () => {
    it('should update one task', async () => {
      const { status: updateStatus, body: updateBody } = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateTaskInput!) {
            updateTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
              taskName: 'Task5',
            },
          },
        });
      expect(updateStatus).toBe(200);
      expect(updateBody.data.updateTask.id).toBeTruthy();

      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: TaskWhereUniqueInput!) {
            task(input: $input) {
              taskName
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.task.taskName).toEqual('Task5');
    });

    it('should return nestjs error if task does not exist', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateTaskInput!) {
            updateTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: 'wrongId',
              taskName: 'Task6',
            },
          },
        });

      expect(status).toBe(200);
      expect(body.data.updateTask).toBe(null);
      expect(body.errors[0].message).toEqual('Task does not exist.');
      expect(body.errors[0].extensions.code).toEqual('404');
    });

    it('should return nestjs error if taskName is empty', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateTaskInput!) {
            updateTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
              taskName: null,
            },
          },
        });

      expect(status).toBe(200);
      expect(body.data.updateTask).toBe(null);
      expect(body.errors[0].message).toEqual('Bad Request Exception');
    });

    it('should return  graphql error if taskName is not a string', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateTaskInput!) {
            updateTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
              taskName: 24,
            },
          },
        })
        .expect(400);
    });

    it('should return nestjs error if userId is empty', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateTaskInput!) {
            updateTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
              userId: null,
            },
          },
        });

      expect(status).toBe(200);
      expect(body.data.updateTask).toBe(null);
      expect(body.errors[0].message).toEqual('Bad Request Exception');
    });

    it('should return graphql error if startDate is not a Date Object', async () => {
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateTaskInput!) {
            updateTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
              startDate: 'sdsds',
            },
          },
        })
        .expect(400);
    });

    it('should graphql return error if dueDate is not a Date Object', async () => {
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateTaskInput!) {
            updateTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
              dueDate: 'sdsds',
            },
          },
        })
        .expect(400);
    });

    it('should return graphql error if completionDate is not a Date Object', async () => {
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateTaskInput!) {
            updateTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
              completionDate: 'sdsds',
            },
          },
        })
        .expect(400);
    });

    it('should return graphql error if completed is not a Boolean', async () => {
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateTaskInput!) {
            updateTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
              completed: 'ghf',
            },
          },
        })
        .expect(400);
    });

    it('should return nestjs error if completed is empty', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateTaskInput!) {
            updateTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
              completed: null,
            },
          },
        });

      expect(status).toBe(200);
      expect(body.data.updateTask).toBe(null);
      expect(body.errors[0].message).toEqual('Bad Request Exception');
    });
  });

  describe('@Mutation(deleteTask)', () => {
    it('should delete one task', async () => {
      const { status: deleteStatus, body: deleteBody } = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: `mutation Mutation($input: TaskWhereUniqueInput!) {
            deleteTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
            },
          },
        });
      expect(deleteStatus).toBe(200);
      expect(deleteBody.data.deleteTask.id).toBeTruthy();

      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: TaskWhereUniqueInput!) {
            task(input: $input) {
              taskName
            }
          }`,
          variables: {
            input: {
              id: MockService.taskId,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.task).toBe(null);
      expect(body.errors[0].message).toEqual('Task does not exist.');
      expect(body.errors[0].extensions.code).toEqual('404');
    });

    it('should return nestjs error if task does not exist', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: TaskWhereUniqueInput!) {
            deleteTask(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: 'wrongId',
            },
          },
        });

      expect(status).toBe(200);
      expect(body.data.deleteTask).toBe(null);
      expect(body.errors[0].message).toEqual('Task does not exist.');
      expect(body.errors[0].extensions.code).toEqual('404');
    });
  });

  describe('@Mutation(deleteTasks)', () => {
    it('should delete nestjs several tasks', async () => {
      const { status: deleteStatus, body: deleteBody } = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: `mutation Mutation($input: DeleteTasksInput) {
            deleteTasks(input: $input) {
              count
            }
          }`,
          variables: {
            input: {
              ids: [MockService.taskId, MockService.tasksArray[1].id],
            },
          },
        });
      expect(deleteStatus).toBe(200);
      expect(deleteBody.data.deleteTasks.count).toEqual(2);
    });

    it('should return count 0 if tasks does not exist', async () => {
      const { status: deleteStatus, body: deleteBody } = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: `mutation Mutation($input: DeleteTasksInput) {
            deleteTasks(input: $input) {
              count
            }
          }`,
          variables: {
            input: {
              ids: ['wrongId', 'wrongId2'],
            },
          },
        });
      expect(deleteStatus).not.toBe(200);
      expect(deleteBody.data.deleteTasks.count).toEqual(0);
    });

    it('should return error if ids is not an array of string', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: DeleteTasksInput) {
            deleteTasks(input: $input) {
              count
            }
          }`,
          variables: {
            input: {
              ids: 12,
            },
          },
        })
        .expect(400);
    });
  });
});
