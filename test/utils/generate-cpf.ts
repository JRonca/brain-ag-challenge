export function generateValidCPF(): string {
  const randomDigits = (): number => Math.floor(Math.random() * 9);

  const base = Array.from({ length: 9 }, randomDigits);

  let firstDigit = 0;
  let secondDigit = 0;

  for (let i = 0; i < 9; i++) {
    firstDigit += base[i] * (10 - i);
  }
  firstDigit = (firstDigit * 10) % 11;
  if (firstDigit === 10 || firstDigit === 11) {
    firstDigit = 0;
  }

  base.push(firstDigit);

  for (let i = 0; i < 10; i++) {
    secondDigit += base[i] * (11 - i);
  }
  secondDigit = (secondDigit * 10) % 11;
  if (secondDigit === 10 || secondDigit === 11) {
    secondDigit = 0;
  }

  return [...base, secondDigit].join('');
}
