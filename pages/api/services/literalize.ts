export type deep<A> = (A | A[])[];

//A list of literals to be converted
//Any language can be added
const literals: Record<
  number,
  { alias: boolean; dec: number; refs: deep<string | null> }
> = {
  0: {
    alias: true,
    dec: 0,
    refs: [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ],
  },
  1: {
    alias: true,
    dec: 0,
    refs: [
      null,
      [
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "ninety",
      ],
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ],
  },
  2: { alias: false, dec: 0, refs: [null, "hundred"] },
  3: { alias: false, dec: 0, refs: [null, "thousand"] },
  4: { alias: false, dec: 1, refs: [null, "thousand"] },
  5: { alias: false, dec: 2, refs: [null, "thousand"] },
};

const length10 = (x: number): number =>
  x / 10 >= 1 ? length10(x / 10) + 1 : 0;

export function literalize(x: number, allowZero = true): string {
  const decimals = length10(x);
  const { alias, refs, dec } = literals[decimals];
  if (!allowZero && x == 0) {
    return "";
  }

  const firstDigit = Math.trunc(x / Math.pow(10, decimals));
  const rec = refs[alias ? firstDigit : 1];
  if (Array.isArray(rec)) {
    return rec[Math.trunc(x % Math.pow(10, decimals))] || "?";
  }

  const decimal = Math.trunc(x / Math.pow(10, decimals - dec));
  const value =
    (!alias ? literalize(decimal, false) : "") +
    " " +
    refs[alias ? firstDigit : 1];

  return (
    value +
    (x / 10 < 1
      ? ""
      : literalize(
          Math.trunc(x % Math.pow(10, decimals - (!alias ? dec : 0))),
          false
        ))
  );
}
