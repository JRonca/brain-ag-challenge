import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { FarmFactory } from 'test/factories/make-farm';
import { FarmerFactory } from 'test/factories/make-farmer';

describe('List Farm (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let farmFactory: FarmFactory;
  let farmerFactory: FarmerFactory;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
    farmFactory = new FarmFactory(prisma);
    farmerFactory = new FarmerFactory(prisma);
  });

  it('[GET] /farm', async () => {
    const farmer = await farmerFactory.makePrismaFarmer();
    const farm1 = await farmFactory.makePrismaFarm({
      farmerId: farmer.id,
    });
    const farm2 = await farmFactory.makePrismaFarm({
      farmerId: farmer.id,
    });

    const response = await request(app.getHttpServer()).get('/farm');

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      farms: expect.arrayContaining([
        expect.objectContaining({
          id: farm1.id.toString(),
          name: farm1.name,
        }),
        expect.objectContaining({
          id: farm2.id.toString(),
          name: farm2.name,
        }),
      ]),
      page: 1,
      limit: 10,
    });
  });

  it('should return 400 if got a invalid param', async () => {
    const response = await request(app.getHttpServer())
      .get('/farm')
      .query({ page: 'invalid' });

    expect(response.status).toBe(400);

    expect(response.body.message).toEqual('Validation failed');
    expect(response.body.statusCode).toEqual(400);
  });
});
