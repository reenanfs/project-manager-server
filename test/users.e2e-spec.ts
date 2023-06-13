import * as request from 'supertest';
import {
  INestApplication,
  ValidationPipe,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { useContainer } from 'class-validator';
import { MockService } from 'src/utils/mock/mock.service';
import { Cache } from 'cache-manager';

const gql = '/graphql';
let jwtToken: string;

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
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

  describe('@Query(users)', () => {
    it('should return array of users', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{users { id name updatedAt }}`,
        })
        .set('Authorization', `Bearer ${jwtToken}`);
      expect(status).toBe(200);
      expect(body.data.users[0].name).toEqual(
        MockService.createManyUsersInput[0].name,
      );
    });
  });
});
