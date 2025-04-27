import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';

describe('Create Harvest (E2E)', () => {
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

  it('[POST] /harvest', async () => {
    const description = 'Harvest Description';
    const response = await request(app.getHttpServer()).post('/harvest').send({
      description,
      year: 2023,
    });

    expect(response.status).toBe(201);

    const harvestOnDatabase = await prisma.harvest.findFirst({
      where: {
        description,
      },
    });

    expect(harvestOnDatabase).toBeTruthy();

    if (harvestOnDatabase) {
      expect(harvestOnDatabase.description).toEqual(description);
      expect(harvestOnDatabase.year).toEqual(2023);
    }
  });
});
