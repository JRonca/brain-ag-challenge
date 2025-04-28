import { Farm } from '@domain/entities/farm';

export class FarmPresenter {
  static toHTTP(farm: Farm) {
    return {
      id: farm.id.toString(),
      farmerId: farm.farmerId.toString(),
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: farm.totalArea,
      arableArea: farm.arableArea,
      vegetationArea: farm.vegetationArea,
    };
  }
}
