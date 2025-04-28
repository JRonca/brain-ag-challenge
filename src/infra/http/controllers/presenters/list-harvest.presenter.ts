import { Harvest } from '@domain/entities/harvest';

export class HarvestPresenter {
  static toHTTP(harvest: Harvest) {
    return {
      id: harvest.id.toString(),
      description: harvest.description,
      year: harvest.year,
    };
  }
}
