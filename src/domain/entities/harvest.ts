import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

export interface HarvestProps {
  description: string;
  year: number;
}

export class Harvest extends Entity<HarvestProps> {
  get description(): string {
    return this.props.description;
  }
  get year(): number {
    return this.props.year;
  }

  static create(props: Omit<HarvestProps, 'id'>, id?: UniqueEntityID): Harvest {
    const harvest = new Harvest(
      {
        ...props,
      },
      id,
    );

    return harvest;
  }
}
