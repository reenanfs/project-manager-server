import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { useContainer } from 'class-validator';
import { MockService } from 'src/utils/mock/mock.service';

const gql = '/graphql';

describe('Users (e2e)', () => {
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

  describe('@Query(users)', () => {
    it('should return array of users', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{users { id name updatedAt }}`,
        });
      expect(status).toBe(200);
      expect(body.data.users[0].name).toEqual(MockService.usersArray[0].name);
    });

    it('should return ordered array of users', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: GetUsersInput) {
            users(input: $input) {
              name
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
      expect(body.data.users[0].name).toEqual(MockService.usersArray[1].name);
    });
  });

  describe('@Query(user)', () => {
    it('should return one user', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: UserWhereUniqueInput!) {
            user(input: $input) {
              name
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.user.name).toEqual(MockService.user.name);
    });

    it('should return nestjs error if user does not exist', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: UserWhereUniqueInput!) {
            user(input: $input) {
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
      expect(body.data.user).toBe(null);
      expect(body.errors[0].message).toEqual('User does not exist.');
      expect(body.errors[0].extensions.code).toEqual('404');
    });
  });

  describe('@ResolveField(tasks)', () => {
    it('should return array of tasks related to user', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: UserWhereUniqueInput!) {
            user(input: $input) {
              tasks {
                name
              }
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.user.tasks[0].name).toEqual(MockService.task.name);
    });
  });

  describe('@Mutation(createUser)', () => {
    it('should create one user', async () => {
      const { status: createStatus, body: createBody } = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateUserInput!) {
            createUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              name: 'User3',
              role: 'Role3',
              email: 'email3@gmail.com',
            },
          },
        });
      expect(createStatus).toBe(200);
      expect(createBody.data.createUser.id).toBeTruthy();

      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: UserWhereUniqueInput!) {
            user(input: $input) {
              name
            }
          }`,
          variables: {
            input: {
              id: createBody.data.createUser.id,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.user.name).toEqual('User3');
    });

    it('should return graphql error if name is empty', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateUserInput!) {
            createUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              name: null,
              role: 'Role3',
              email: 'email3@gmail.com',
            },
          },
        })
        .expect(400);
    });

    it('should return graphql error if name is not a string', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateUserInput!) {
            createUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              name: 24,
              role: 'Role3',
              email: 'email3@gmail.com',
            },
          },
        })
        .expect(400);
    });

    it('should return graphql error if role is empty', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateUserInput!) {
            createUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              name: 'User3',
              role: null,
              email: 'email3@gmail.com',
            },
          },
        })
        .expect(400);
    });

    it('should return graphql error if role is not a string', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateUserInput!) {
            createUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              name: 'User3',
              role: 23,
              email: 'email3@gmail.com',
            },
          },
        })
        .expect(400);
    });

    it('should return graphql error if email is empty', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateUserInput!) {
            createUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              name: 'User3',
              role: 'Role3',
              email: null,
            },
          },
        })
        .expect(400);
    });

    it('should return nestjs error if email is not a valid string', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: CreateUserInput!) {
            createUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              name: 'User3',
              role: 'Role3',
              email: 'email3',
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.createUser).toBe(null);
      expect(body.errors[0].message).toEqual('Bad Request Exception');
    });
  });

  describe('@Mutation(updateUser)', () => {
    it('should update one user', async () => {
      const { status: updateStatus, body: updateBody } = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
              name: 'User3',
            },
          },
        });
      expect(updateStatus).toBe(200);
      expect(updateBody.data.updateUser.id).toBeTruthy();

      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: UserWhereUniqueInput!) {
            user(input: $input) {
              name
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.user.name).toEqual('User3');
    });

    it('should return nestjs error if name is empty', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
              name: null,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.updateUser).toBe(null);
      expect(body.errors[0].message).toEqual('Bad Request Exception');
    });

    it('should return graphql error if name is not a string', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
              name: 24,
            },
          },
        })
        .expect(400);
    });

    it('should return nestjs error if role is empty', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
              role: null,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.updateUser).toBe(null);
      expect(body.errors[0].message).toEqual('Bad Request Exception');
    });

    it('should return graphql error if role is not a string', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
              role: 23,
            },
          },
        })
        .expect(400);
    });

    it('should return nestjs error if email is empty', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
              email: null,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.updateUser).toBe(null);
      expect(body.errors[0].message).toEqual('Bad Request Exception');
    });

    it('should return nestjs error if email is not a valid string', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
              email: 'email3',
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.updateUser).toBe(null);
      expect(body.errors[0].message).toEqual('Bad Request Exception');
    });
  });

  describe('@Mutation(deleteUser)', () => {
    it('should delete one user', async () => {
      const { status: deleteStatus, body: deleteBody } = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: `mutation Mutation($input: UserWhereUniqueInput!) {
            deleteUser(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
            },
          },
        });
      expect(deleteStatus).toBe(200);
      expect(deleteBody.data.deleteUser.id).toBeTruthy();

      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query Query($input: UserWhereUniqueInput!) {
            user(input: $input) {
              name
            }
          }`,
          variables: {
            input: {
              id: MockService.userId,
            },
          },
        });
      expect(status).toBe(200);
      expect(body.data.user).toBe(null);
      expect(body.errors[0].message).toEqual('User does not exist.');
      expect(body.errors[0].extensions.code).toEqual('404');
    });
  });

  describe('@Mutation(deleteUsers)', () => {
    it('should delete several users', async () => {
      const { status: deleteStatus, body: deleteBody } = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: `mutation Mutation($input: DeleteUsersInput) {
            deleteUsers(input: $input) {
              count
            }
          }`,
          variables: {
            input: {
              ids: [MockService.userId, MockService.usersArray[1].id],
            },
          },
        });
      expect(deleteStatus).toBe(200);
      expect(deleteBody.data.deleteUsers.count).toEqual(2);
    });

    it('should return count 0 if users does not exist', async () => {
      const { status: deleteStatus, body: deleteBody } = await request(
        app.getHttpServer(),
      )
        .post(gql)
        .send({
          query: `mutation Mutation($input: DeleteUsersInput) {
            deleteUsers(input: $input) {
              count
            }
          }`,
          variables: {
            input: {
              ids: ['wrongId', 'wrongId2'],
            },
          },
        });
      expect(deleteStatus).toBe(200);
      expect(deleteBody.data.deleteUsers.count).toEqual(0);
    });

    it('should return graphql error if ids is not an array of string', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation Mutation($input: DeleteUsersInput) {
            deleteUsers(input: $input) {
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
