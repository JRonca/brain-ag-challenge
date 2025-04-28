import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PlantedCropFactory } from 'test/factories/make-planted-crop';
import { FarmFactory } from 'test/factories/make-farm';
import { HarvestFactory } from 'test/factories/make-harvest';
import { FarmerFactory } from 'test/factories/make-farmer';

describe('List Planted Crop (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let plantedCropFactory: PlantedCropFactory;
  let farmFactory: FarmFactory;
  let harvestFactory: HarvestFactory;
  let farmerFactory: FarmerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    plantedCropFactory = new PlantedCropFactory(prisma);

    farmFactory = new FarmFactory(prisma);

    harvestFactory = new HarvestFactory(prisma);

    farmerFactory = new FarmerFactory(prisma);

    await app.init();
  });

  it('[GET] /planted-crop', async () => {
    const farmer = await farmerFactory.makePrismaFarmer();
    const farmerId = farmer.id;

    const farm = await farmFactory.makePrismaFarm({
      farmerId,
    });

    const harvest = await harvestFactory.makePrismaHarvest();

    const plantedCrop1 = await plantedCropFactory.makePrismaPlantedCrop({
      farmId: farm.id,
      harvestId: harvest.id,
    });
    const plantedCrop2 = await plantedCropFactory.makePrismaPlantedCrop({
      farmId: farm.id,
      harvestId: harvest.id,
    });

    const response = await request(app.getHttpServer()).get('/planted-crop');

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      plantedCrops: expect.arrayContaining([
        expect.objectContaining({
          id: plantedCrop1.id.toString(),
          name: plantedCrop1.name,
          farmId: farm.id.toString(),
          harvestId: harvest.id.toString(),
        }),
        expect.objectContaining({
          id: plantedCrop2.id.toString(),
          name: plantedCrop2.name,
          farmId: farm.id.toString(),
          harvestId: harvest.id.toString(),
        }),
      ]),
      page: 1,
      limit: 10,
    });
  });

  it('should return 400 if got a invalid param', async () => {
    const response = await request(app.getHttpServer())
      .get('/planted-crop')
      .query({ page: 'invalid' });

    expect(response.status).toBe(400);

    expect(response.body.message).toEqual('Validation failed');
    expect(response.body.statusCode).toEqual(400);
  });
});
