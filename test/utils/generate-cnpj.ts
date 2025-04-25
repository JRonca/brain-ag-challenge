export function generateValidCNPJ(): string {
  const randomDigits = (): number => Math.floor(Math.random() * 9);
  const base = [...Array.from({ length: 8 }, randomDigits), 0, 0, 0, 1];

  let firstDigit = 0;
  let secondDigit = 0;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  for (let i = 0; i < weights1.length; i++) {
    firstDigit += base[i] * weights1[i];
  }
  firstDigit = firstDigit % 11 < 2 ? 0 : 11 - (firstDigit % 11);

  base.push(firstDigit);

  for (let i = 0; i < weights2.length; i++) {
    secondDigit += base[i] * weights2[i];
  }
  secondDigit = secondDigit % 11 < 2 ? 0 : 11 - (secondDigit % 11);

  return [...base, secondDigit].join('');
}
