import { Farmer } from '@domain/entities/farmer';

export class FarmerPresenter {
  static toHTTP(farmer: Farmer) {
    return {
      id: farmer.id.toString(),
      name: farmer.name,
      document: farmer.document,
      documentType: farmer.documentType,
    };
  }
}
