import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { FarmerFactory } from 'test/factories/make-farmer';
import { FarmFactory } from 'test/factories/make-farm';
import { HarvestFactory } from 'test/factories/make-harvest';

import { UniqueEntityID } from '@core/entities/unique-entity-id';

describe('Create Planted Crop (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let farmFactory: FarmFactory;
  let harvestFactory: HarvestFactory;
  let farmerFactory: FarmerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    farmFactory = new FarmFactory(prisma);

    harvestFactory = new HarvestFactory(prisma);

    farmerFactory = new FarmerFactory(prisma);

    await app.init();
  });

  it('[POST] /planted-crop', async () => {
    const farmer = await farmerFactory.makePrismaFarmer();
    const farmerId = farmer.id;

    const farm = await farmFactory.makePrismaFarm({
      farmerId,
    });
    const farmId = farm.id.toString();

    const harvest = await harvestFactory.makePrismaHarvest();
    const harvestId = harvest.id.toString();

    const name = 'Planted Crop Name';

    const response = await request(app.getHttpServer())
      .post('/planted-crop')
      .send({
        farmId,
        harvestId,
        name,
      });

    expect(response.status).toBe(201);

    const farmOnDatabase = await prisma.plantedCrop.findFirst({
      where: {
        name,
      },
    });

    expect(farmOnDatabase).toBeTruthy();

    if (farmOnDatabase) {
      expect(farmOnDatabase.name).toEqual(name);
      expect(farmOnDatabase.farmId).toEqual(farmId);
      expect(farmOnDatabase.harvestId).toEqual(harvestId);
    }
  });

  it('should return 404 if farm or harvest not found', async () => {
    const farmId = new UniqueEntityID().toString();
    const harvestId = new UniqueEntityID().toString();
    const response = await request(app.getHttpServer())
      .post('/planted-crop')
      .send({
        farmId,
        harvestId,
        name: 'Planted Crop Name',
      });

    expect(response.status).toBe(404);

    expect(response.body.message).toContain('not found');
    expect(response.body.statusCode).toEqual(404);
  });
});
