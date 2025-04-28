import { Farm } from '../entities/farm';
import { PaginationParams } from '@core/repositories/pagination-params';

export abstract class FarmsRepository {
  abstract create(farm: Farm): Promise<Farm>;
  abstract findById(id: string): Promise<Farm | null>;
  abstract list(params: PaginationParams): Promise<Farm[]>;
  abstract countFarms(): Promise<number>;
  abstract sumTotalArea(): Promise<number>;
  abstract groupByState(): Promise<{ state: string; count: number }[]>;
  abstract getLandUsage(): Promise<{
    arableArea: number;
    vegetationArea: number;
  }>;
}
