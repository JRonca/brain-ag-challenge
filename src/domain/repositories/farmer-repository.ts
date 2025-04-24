import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Farmer } from '../entities/farmer';

export abstract class FarmersRepository {
  abstract list(): Promise<Farmer[]>;
  abstract findById(id: UniqueEntityID): Promise<Farmer | null>;
  abstract findByDocument(document: string): Promise<Farmer | null>;
  abstract create(farmer: Farmer): Promise<Farmer>;
  abstract update(farmer: Farmer): Promise<Farmer>;
  abstract delete(id: UniqueEntityID): Promise<void>;
}
