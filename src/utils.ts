export function camelToKebabCase(input: string): string {
  const output = input.replaceAll(/([^A-Z])([A-Z])/g, "$1-$2").toLowerCase();
  return output;
}

