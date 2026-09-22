import type { GeneratedCase, GeneratorOptions, TestField } from "@/domain";

import { GeneratorError } from "./generator-error";
import { getRegisteredGenerators } from "./generator-registry";

export function generateFieldCases(
  field: TestField,
  options: GeneratorOptions,
): GeneratedCase[] {
  const generator = getRegisteredGenerators().find((candidate) =>
    candidate.supports(field),
  );

  if (!generator) {
    throw new GeneratorError(
      `No generator registered for field type "${field.type}".`,
    );
  }

  return generator.generate(field, options);
}
