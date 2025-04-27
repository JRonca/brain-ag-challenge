import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { generateValidCPF } from 'test/utils';

describe('Create Farmer (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it('[POST] /farmer', async () => {
    const document = generateValidCPF();
    const response = await request(app.getHttpServer()).post('/farmer').send({
      name: 'John Doe',
      document,
    });

    expect(response.status).toBe(201);

    const farmerOnDatabase = await prisma.farmer.findUnique({
      where: {
        document,
      },
    });

    expect(farmerOnDatabase).toBeTruthy();
  });

  it('should return 409 if farmer already exists', async () => {
    const document = generateValidCPF();
    const payload = {
      name: 'John Doe',
      document,
    };

    await request(app.getHttpServer())
      .post('/farmer')
      .send(payload)
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/farmer')
      .send(payload)
      .expect(409);

    expect(response.body.message).toEqual(`Farmer ${document} already exists.`);
    expect(response.body.statusCode).toEqual(409);
  });

  it('should return 400 if got a validation error', async () => {
    const payload = {
      name: 'John Doe',
      document: '123456789',
    };

    const response = await request(app.getHttpServer())
      .post('/farmer')
      .send(payload)
      .expect(400);

    expect(response.body.message).toEqual('Validation failed');
    expect(response.body.statusCode).toEqual(400);
  });

  it('should return 400 if got a invalid document', async () => {
    const payload = {
      name: 'John Doe',
      document: '40056809094',
    };

    const response = await request(app.getHttpServer())
      .post('/farmer')
      .send(payload)
      .expect(400);

    expect(response.body.message).toEqual('Invalid document.');
    expect(response.body.statusCode).toEqual(400);
  });
});
