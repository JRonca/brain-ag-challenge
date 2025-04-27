import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

export interface PlantedCropProps {
  farmId: UniqueEntityID;
  harvestId: UniqueEntityID;
  name: string;
}

export class PlantedCrop extends Entity<PlantedCropProps> {
  get farmId(): UniqueEntityID {
    return this.props.farmId;
  }
  get harvestId(): UniqueEntityID {
    return this.props.harvestId;
  }
  get name(): string {
    return this.props.name;
  }

  static create(props: PlantedCropProps, id?: UniqueEntityID): PlantedCrop {
    const plantedCrop = new PlantedCrop(
      {
        ...props,
      },
      id,
    );

    return plantedCrop;
  }
}
