import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

interface FarmerProps {
  name: string;
  document: string;
  documentType: string;
}

export class Farmer extends Entity<FarmerProps> {
  get name(): string {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
  }

  get document(): string {
    return this.props.document;
  }
  set document(document: string) {
    this.props.document = document;
  }

  get documentType(): string {
    return this.props.documentType;
  }
  set documentType(documentType: string) {
    this.props.documentType = documentType;
  }

  static create(props: Omit<FarmerProps, 'id'>, id?: UniqueEntityID): Farmer {
    const farmer = new Farmer(
      {
        ...props,
      },
      id,
    );

    return farmer;
  }
}
