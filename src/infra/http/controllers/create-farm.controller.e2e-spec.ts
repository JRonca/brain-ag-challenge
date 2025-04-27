import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { FarmerFactory } from 'test/factories/make-farmer';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

describe('Create Farm (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let farmerFactory: FarmerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    farmerFactory = new FarmerFactory(prisma);

    await app.init();
  });

  it('[POST] /farm', async () => {
    const farmer = await farmerFactory.makePrismaFarmer();
    const farmerId = farmer.id.toString();

    const response = await request(app.getHttpServer()).post('/farm').send({
      farmerId,
      name: 'Farm Name',
      city: 'Maringá',
      state: 'PR',
      totalArea: 100,
      arableArea: 50,
      vegetationArea: 50,
    });

    expect(response.status).toBe(201);

    const farmOnDatabase = await prisma.farm.findFirst({
      where: {
        name: 'Farm Name',
      },
    });

    expect(farmOnDatabase).toBeTruthy();

    if (farmOnDatabase) {
      expect(farmOnDatabase.name).toEqual('Farm Name');
      expect(farmOnDatabase.city).toEqual('Maringá');
      expect(farmOnDatabase.state).toEqual('PR');
      expect(farmOnDatabase.totalArea).toEqual(100);
    }
  });

  it('should return 404 if farmer not found', async () => {
    const farmerId = new UniqueEntityID().toString();
    const response = await request(app.getHttpServer()).post('/farm').send({
      farmerId,
      name: 'Farm Name',
      city: 'Maringá',
      state: 'PR',
      totalArea: 100,
      arableArea: 50,
      vegetationArea: 50,
    });

    expect(response.status).toBe(404);

    expect(response.body.message).toEqual(
      `Resource Farmer with identifier ${farmerId} not found`,
    );
    expect(response.body.statusCode).toEqual(404);
  });

  it('should return 400 if got a validation error or invalid total area', async () => {
    const farmer = await farmerFactory.makePrismaFarmer();
    const farmerId = farmer.id.toString();

    const response = await request(app.getHttpServer()).post('/farm').send({
      farmerId,
      name: 'Farm Name',
      city: 'Maringá',
      state: 'Invalid State',
      totalArea: 100,
      arableArea: 50,
      vegetationArea: 50,
    });

    expect(response.body.message).toEqual('Validation failed');
    expect(response.body.statusCode).toEqual(400);
  });
});
