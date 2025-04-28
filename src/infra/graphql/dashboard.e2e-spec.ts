import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { FarmerFactory } from 'test/factories/make-farmer';
import { FarmFactory } from 'test/factories/make-farm';
import { HarvestFactory } from 'test/factories/make-harvest';
import { PlantedCropFactory } from 'test/factories/make-planted-crop';

describe('Dashboard Resolver (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let farmerFactory: FarmerFactory;
  let farmFactory: FarmFactory;
  let harvestFactory: HarvestFactory;
  let plantedCropFactory: PlantedCropFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();

    farmerFactory = new FarmerFactory(prisma);
    farmFactory = new FarmFactory(prisma);
    harvestFactory = new HarvestFactory(prisma);
    plantedCropFactory = new PlantedCropFactory(prisma);
  });

  it('should return dashboard metrics', async () => {
    const farmer = await farmerFactory.makePrismaFarmer();
    const farm = await farmFactory.makePrismaFarm({
      farmerId: farmer.id,
      state: 'SP',
      arableArea: 100,
      vegetationArea: 50,
      totalArea: 150,
    });
    await farmFactory.makePrismaFarm({
      farmerId: farmer.id,
      state: 'PR',
      arableArea: 100,
      vegetationArea: 50,
      totalArea: 150,
    });
    await farmFactory.makePrismaFarm({
      farmerId: farmer.id,
      state: 'PR',
      arableArea: 100,
      vegetationArea: 50,
      totalArea: 150,
    });
    const harvest = await harvestFactory.makePrismaHarvest({
      description: 'Safra 2023',
      year: 2023,
    });
    await plantedCropFactory.makePrismaPlantedCrop({
      farmId: farm.id,
      harvestId: harvest.id,
      name: 'Soja',
    });
    await plantedCropFactory.makePrismaPlantedCrop({
      farmId: farm.id,
      harvestId: harvest.id,
      name: 'Soja',
    });
    await plantedCropFactory.makePrismaPlantedCrop({
      farmId: farm.id,
      harvestId: harvest.id,
      name: 'Milho',
    });
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            dashboard {
              totalFarms
              totalHectares
              byState { state count }
              byCrop { crop count }
              landUsage { arableArea vegetationArea }
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.dashboard).toEqual({
      totalFarms: 3,
      totalHectares: 450,
      byState: [
        { state: 'SP', count: 1 },
        { state: 'PR', count: 2 },
      ],
      byCrop: [
        { crop: 'Soja', count: 2 },
        { crop: 'Milho', count: 1 },
      ],
      landUsage: {
        arableArea: 300,
        vegetationArea: 150,
      },
    });
    expect(response.body.data.dashboard).toHaveProperty('byState');
  });

  afterAll(async () => {
    await app.close();
  });
});
