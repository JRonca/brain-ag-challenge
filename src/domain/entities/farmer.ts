import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { DocumentType } from '@infra/database/prisma/enums/document-type.enum';
export interface FarmerProps {
  name: string;
  document: string;
  documentType: DocumentType;
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

  get documentType(): DocumentType {
    return this.props.documentType;
  }
  set documentType(documentType: DocumentType) {
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
