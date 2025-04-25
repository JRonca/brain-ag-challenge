import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

export interface FarmProps {
  farmerId: UniqueEntityID;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
}

export class Farm extends Entity<FarmProps> {
  get farmerId(): UniqueEntityID {
    return this.props.farmerId;
  }
  get name(): string {
    return this.props.name;
  }
  get city(): string {
    return this.props.city;
  }
  get state(): string {
    return this.props.state;
  }
  get totalArea(): number {
    return this.props.totalArea;
  }
  get arableArea(): number {
    return this.props.arableArea;
  }
  get vegetationArea(): number {
    return this.props.vegetationArea;
  }

  static create(props: Omit<FarmProps, 'id'>, id?: UniqueEntityID): Farm {
    const farm = new Farm(
      {
        ...props,
      },
      id,
    );

    return farm;
  }
}
