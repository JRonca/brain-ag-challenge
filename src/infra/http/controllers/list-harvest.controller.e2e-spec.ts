import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { HarvestFactory } from 'test/factories/make-harvest';

describe('List Harvest (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let harvestFactory: HarvestFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
    harvestFactory = new HarvestFactory(prisma);
  });

  it('[GET] /harvest', async () => {
    const harvest1 = await harvestFactory.makePrismaHarvest();
    const harvest2 = await harvestFactory.makePrismaHarvest();

    const response = await request(app.getHttpServer()).get('/harvest');

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      harvests: expect.arrayContaining([
        expect.objectContaining({
          id: harvest1.id.toString(),
          description: harvest1.description,
          year: harvest1.year,
        }),
        expect.objectContaining({
          id: harvest2.id.toString(),
          description: harvest2.description,
          year: harvest2.year,
        }),
      ]),
      page: 1,
      limit: 10,
    });
  });

  it('should return 400 if got a invalid param', async () => {
    const response = await request(app.getHttpServer())
      .get('/harvest')
      .query({ page: 'invalid' });

    expect(response.status).toBe(400);

    expect(response.body.message).toEqual('Validation failed');
    expect(response.body.statusCode).toEqual(400);
  });
});
