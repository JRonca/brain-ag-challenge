import { DocumentType } from '@infra/database/prisma/enums/document-type.enum';
import { DocumentValidator } from './document.validator';
import { generateValidCNPJ, generateValidCPF } from 'test/utils';

let documentValidator: DocumentValidator;

describe('Document Validator', () => {
  beforeAll(() => {
    documentValidator = new DocumentValidator();
  });

  it('should be able to validate a valid CPF', async () => {
    const cpf = generateValidCPF();

    const result = documentValidator.getValidDocumentType(cpf);

    expect(result).toBe(DocumentType.CPF);
  });

  it('should be able to validate a valid CNPJ', async () => {
    const cnpj = generateValidCNPJ();

    const result = documentValidator.getValidDocumentType(cnpj);

    expect(result).toBe(DocumentType.CNPJ);
  });

  it('should not be able to validate an invalids CPF', async () => {
    let invalidCpf = '63136160071';

    const resultInvalidFirstDigit =
      documentValidator.getValidDocumentType(invalidCpf);

    invalidCpf = '63136160066';

    const resultInvalidSecondDigit =
      documentValidator.getValidDocumentType(invalidCpf);

    expect(resultInvalidFirstDigit).toBe(null);
    expect(resultInvalidSecondDigit).toBe(null);
  });

  it('should not be able to validate an invalids CNPJ', async () => {
    let invalidCnpj = '18408818000173';

    const resultInvalidFirstDigit =
      documentValidator.getValidDocumentType(invalidCnpj);

    invalidCnpj = '18408818000105';

    const resultInvalidSecondDigit =
      documentValidator.getValidDocumentType(invalidCnpj);

    expect(resultInvalidFirstDigit).toBe(null);
    expect(resultInvalidSecondDigit).toBe(null);
  });
});
