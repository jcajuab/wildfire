const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const isValidTime = (value: string) => timeRegex.test(value);

export const isValidDaysOfWeek = (value: number[]) =>
  value.length > 0 &&
  value.every((day) => Number.isInteger(day) && day >= 0 && day <= 6);

const toMinutes = (value: string) => {
  const match = timeRegex.exec(value);
  if (!match) return 0;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours * 60 + minutes;
};

export const isWithinTimeWindow = (
  current: string,
  start: string,
  end: string,
) => {
  if (!isValidTime(current) || !isValidTime(start) || !isValidTime(end)) {
    return false;
  }

  const currentMinutes = toMinutes(current);
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);

  if (startMinutes === endMinutes) {
    return false;
  }

  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
};
