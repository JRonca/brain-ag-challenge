import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Farmer } from '../entities/farmer';

export interface FarmerRepository {
  list(): Promise<Farmer[]>;
  findById(id: UniqueEntityID): Promise<Farmer | null>;
  findByDocument(document: string): Promise<Farmer | null>;
  create(farmer: Farmer): Promise<Farmer>;
  update(farmer: Farmer): Promise<Farmer>;
  delete(id: UniqueEntityID): Promise<void>;
}
