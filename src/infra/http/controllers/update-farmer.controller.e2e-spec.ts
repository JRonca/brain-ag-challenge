import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { generateValidCNPJ, generateValidCPF } from 'test/utils';
import { FarmerFactory } from 'test/factories/make-farmer';

describe('Update Farmer (E2E)', () => {
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

  it('[PUT] /farmer', async () => {
    const creationDocument = generateValidCPF();
    const farmer = await farmerFactory.makePrismaFarmer({
      document: creationDocument,
      documentType: 'CPF',
    });
    const farmerId = farmer.id.toString();

    const updateDocument = generateValidCNPJ();

    const response = await request(app.getHttpServer())
      .put(`/farmer/${farmerId}`)
      .send({
        name: 'John Doe',
        document: updateDocument,
      });

    expect(response.status).toBe(204);

    const farmerOnDatabase = await prisma.farmer.findUnique({
      where: {
        document: updateDocument,
      },
    });

    expect(farmerOnDatabase).toBeTruthy();
    if (farmerOnDatabase) {
      expect(farmerOnDatabase.document).toEqual(updateDocument);
      expect(farmerOnDatabase.document_type).toEqual('CNPJ');
      expect(farmerOnDatabase.name).toEqual('John Doe');
    }
  });

  it('should return 404 if farmer does not exists', async () => {
    const farmerId = 'non-existing-id';

    const response = await request(app.getHttpServer())
      .put(`/farmer/${farmerId}`)
      .send({
        document: generateValidCNPJ(),
      })
      .expect(404);

    expect(response.body.message).toEqual(
      `Resource Farmer with identifier ${farmerId} not found`,
    );
    expect(response.body.statusCode).toEqual(404);
  });

  it('should return 400 if got a validation error or invalid document', async () => {
    const farmer = await farmerFactory.makePrismaFarmer();
    const farmerId = farmer.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/farmer/${farmerId}`)
      .send({
        document: '908',
      })
      .expect(400);

    expect(response.body.message).toEqual('Validation failed');
    expect(response.body.statusCode).toEqual(400);
  });
});
