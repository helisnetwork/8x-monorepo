export function extractNumber(object): any {
  if (typeof object.toNumber == 'function') {
    return object.toNumber();
  }

  return object;
}