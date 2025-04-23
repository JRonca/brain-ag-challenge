import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { DocumentValidator } from '@/core/validators/document.validator';

@Injectable()
export class DocumentValidationPipe implements PipeTransform {
  documentValidator: DocumentValidator;

  constructor() {
    this.documentValidator = new DocumentValidator();
  }
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body') {
      const { document } = value;

      const documentType = this.documentValidator.handle(document);

      if (!documentType) {
        throw new BadRequestException('Invalid document');
      }

      value.document_type = documentType;
    }
    return value;
  }
}
