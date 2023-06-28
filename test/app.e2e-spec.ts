import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { request, spec } from 'pactum';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const PORT = 3003;
const baseUrl = `http://localhost:${PORT}`;

describe('App EndToEnd tests', () => {
  let app: INestApplication;

  let prismaService: PrismaService;

  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    await app.init();

    await app.listen(PORT);

    prismaService = app.get(PrismaService);

    await prismaService.cleanDatabase();

    request.setBaseUrl(baseUrl);
  });

  afterAll(async () => {
    app.close();
  });

  describe('Test Authentication', () => {
    describe('Register', () => {
      it('should register', () => {
        return spec()
          .post('/auth/register')
          .withBody({
            email: 'nhhai4@gmail.com',
            password: '123456',
          })
          .expectStatus(201);
      });

      it('should show error with emply email', () => {
        return spec()
          .post('/auth/register')
          .withBody({
            email: '',
            password: '123456',
          })
          .expectStatus(400);
      });

      it('should show error with invalid email format', () => {
        return spec()
          .post('/auth/register')
          .withBody({
            email: 'nhhai4@gmail',
            password: '123456',
          })
          .expectStatus(400);
      });

      it('should show error with emply password', () => {
        return spec()
          .post('/auth/register')
          .withBody({
            email: 'nhhai4@gmail.com',
            password: '',
          })
          .expectStatus(400);
      });
    });

    describe('Login', () => {
      it('should login', () => {
        return spec()
          .post('/auth/login')
          .withBody({
            email: 'nhhai4@gmail.com',
            password: '123456',
          })
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
      });
    });

    describe('User', () => {
      it('should get detail user', () => {
        return spec()
          .get('/user/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .stores('userId', 'id');
      });
    });

    describe('Note', () => {
      it('should insert first note', () => {
        return spec()
          .post('/note')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({
            title: 'Note 1',
            url: 'https://example.com/1',
          })
          .expectStatus(201)
          .stores('noteId01', 'id');
      });

      it('should insert second note', () => {
        return spec()
          .post('/note')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({
            title: 'Note 2',
            url: 'https://example.com/2',
          })
          .expectStatus(201)
          .stores('noteId02', 'id');
      });

      it('should insert thirdly note', () => {
        return spec()
          .post('/note')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({
            title: 'Note 3',
            url: 'https://example.com/3',
          })
          .expectStatus(201)
          .stores('noteId03', 'id');
      });

      it('should get all note', () => {
        return spec()
          .get('/note')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });

      it('should get first note', () => {
        return spec()
          .get('/note')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '${noteId01}')
          .expectStatus(200);
      });

      it('should get second note', () => {
        return spec()
          .get('/note')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '${noteId02}')
          .expectStatus(200);
      });

      it('should get thirdly note', () => {
        return spec()
          .get('/note')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '${noteId03}')
          .expectStatus(200);
      });

      it('should delete first note', () => {
        return spec()
          .delete('/note')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withQueryParams('id', '$S{noteId01}')
          .expectStatus(204);
      });

      it('should delete second note', () => {
        return spec()
          .delete('/note')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withQueryParams('id', '$S{noteId02}')
          .expectStatus(204);
      });

      it('should delete thirdly note', () => {
        return spec()
          .delete('/note')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withQueryParams('id', '$S{noteId03}')
          .expectStatus(204);
      });
    });
  });
});
