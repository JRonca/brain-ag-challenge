import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { generateValidCNPJ, generateValidCPF } from 'test/utils';
import { FarmerFactory } from 'test/factories/make-farmer';

describe('List Farmer (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let farmerFactory: FarmerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
    farmerFactory = new FarmerFactory(prisma);
  });

  it('[GET] /farmer', async () => {
    const documentCPF = generateValidCPF();
    const documentCNPJ = generateValidCNPJ();

    await farmerFactory.makePrismaFarmer({
      document: documentCPF,
      documentType: 'CPF',
    });

    await farmerFactory.makePrismaFarmer({
      document: documentCNPJ,
      documentType: 'CNPJ',
    });

    const response = await request(app.getHttpServer()).get('/farmer');

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      farmers: expect.arrayContaining([
        expect.objectContaining({
          document: documentCPF,
          documentType: 'CPF',
        }),
        expect.objectContaining({
          document: documentCNPJ,
          documentType: 'CNPJ',
        }),
      ]),
      page: 1,
      limit: 10,
    });
  });

  it('should return 400 if got a invalid param', async () => {
    const response = await request(app.getHttpServer())
      .get('/farmer')
      .query({ page: 'invalid' });

    expect(response.status).toBe(400);

    expect(response.body.message).toEqual('Validation failed');
    expect(response.body.statusCode).toEqual(400);
  });
});
