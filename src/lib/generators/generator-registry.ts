import type { FieldGenerator } from "./generator.interface";

const generators: FieldGenerator[] = [];

export function registerGenerator(generator: FieldGenerator): void {
  if (generators.includes(generator)) {
    return;
  }

  generators.push(generator);
}

export function getRegisteredGenerators(): readonly FieldGenerator[] {
  return generators;
}
