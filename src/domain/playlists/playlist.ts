export const isValidSequence = (value: number) =>
  Number.isInteger(value) && value > 0;

export const isValidDuration = (value: number) =>
  Number.isInteger(value) && value > 0;

export const nextSequence = (sequences: number[]) => {
  const max = sequences.length === 0 ? 0 : Math.max(...sequences);
  return max + 10;
};
