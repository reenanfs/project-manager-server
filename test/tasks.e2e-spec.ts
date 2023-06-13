import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { useContainer } from 'class-validator';
import { MockService } from 'src/utils/mock/mock.service';

const gql = '/graphql';
let jwtToken: string;

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

    const signUpResponse = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        query: `
          mutation Mutation($input: LocalSignupInput!) {
            localSignup(input: $input) {
              access_token
              refresh_token
            }
          }
        `,
        variables: {
          input: {
            email: MockService.createCredentialInput.email,
            password: MockService.createCredentialInput.password,
            name: MockService.createCredentialInput.user.name,
          },
        },
      });

    jwtToken = signUpResponse.body.data.localSignup.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('@Query(tasks)', () => {
    it('should return array of tasks', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          query: `{tasks { id name updatedAt }}`,
        });
      expect(status).toBe(200);
      expect(body.data.tasks[0].name).toEqual(MockService.tasksArray[0].name);
    });
  });
});
