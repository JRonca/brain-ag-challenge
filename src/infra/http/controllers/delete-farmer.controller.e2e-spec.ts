import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { FarmerFactory } from 'test/factories/make-farmer';

describe('Delete Farmer (E2E)', () => {
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

  it('[DELETE] /farmer', async () => {
    const farmer = await farmerFactory.makePrismaFarmer();
    const farmerId = farmer.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/farmer/${farmerId}`)
      .expect(204);

    expect(response.status).toBe(204);

    const farmerOnDatabase = await prisma.farmer.findUnique({
      where: {
        id: farmerId,
      },
    });

    expect(farmerOnDatabase).toBeFalsy();
  });

  it('should return 404 if farmer does not exists', async () => {
    const farmerId = 'non-existing-id';

    const response = await request(app.getHttpServer())
      .delete(`/farmer/${farmerId}`)
      .expect(404);

    expect(response.body.message).toEqual(
      `Resource Farmer with identifier ${farmerId} not found`,
    );
    expect(response.body.statusCode).toEqual(404);
  });
});
