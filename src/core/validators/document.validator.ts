import { DocumentType } from '@prisma/client';

export class DocumentValidator {
  handle(document: string): DocumentType | null {
    const cleaned = document.replace(/\D/g, '');

    if (cleaned.length === 11) {
      return this.isCpf(cleaned);
    }

    if (cleaned.length === 14) {
      return this.isCnpj(cleaned);
    }

    return null;
  }

  private isCpf(cpf: string): DocumentType | null {
    let firstDigit = 0;
    let secondDigit = 0;
    for (let i = 0; i < 9; i++) {
      firstDigit += parseInt(cpf[i]) * (10 - i);
    }
    firstDigit = (firstDigit * 10) % 11;
    if (firstDigit === 10 || firstDigit === 11) {
      firstDigit = 0;
    }
    if (firstDigit !== parseInt(cpf[9])) {
      return null;
    }

    for (let i = 0; i < 10; i++) {
      secondDigit += parseInt(cpf[i]) * (11 - i);
    }
    secondDigit = (secondDigit * 10) % 11;
    if (secondDigit === 10 || secondDigit === 11) {
      secondDigit = 0;
    }
    if (secondDigit !== parseInt(cpf[10])) {
      return null;
    }
    return 'CPF';
  }

  private isCnpj(cnpj: string): DocumentType | null {
    let firstDigit = 0;
    let secondDigit = 0;
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i = 0; i < weights1.length; i++) {
      firstDigit += parseInt(cnpj[i]) * weights1[i];
    }
    firstDigit = firstDigit % 11 < 2 ? 0 : 11 - (firstDigit % 11);
    if (firstDigit !== parseInt(cnpj[12])) {
      return null;
    }

    for (let i = 0; i < weights2.length; i++) {
      secondDigit += parseInt(cnpj[i]) * weights2[i];
    }
    secondDigit = secondDigit % 11 < 2 ? 0 : 11 - (secondDigit % 11);
    if (secondDigit !== parseInt(cnpj[13])) {
      return null;
    }
    return 'CNPJ';
  }
}
