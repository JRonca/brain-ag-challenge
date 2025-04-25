import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';

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
    const response = await request(app.getHttpServer()).post('/farmer').send({
      name: 'John Doe',
      document: '56860070986',
      documentType: 'CPF',
    });

    expect(response.status).toBe(201);

    const farmerOnDatabase = await prisma.farmer.findUnique({
      where: {
        document: '56860070986',
      },
    });

    expect(farmerOnDatabase).toBeTruthy();
  });
});
