import type { GeneratedCase, GeneratorOptions, TestField } from "@/domain";

export interface FieldGenerator {
  /**
   * Returns true when this generator supports the supplied field.
   */
  supports(field: TestField): boolean;

  /**
   * Generates QA test cases for a field.
   *
   * Implementations must not mutate the supplied field or options.
   */
  generate(field: TestField, options: GeneratorOptions): GeneratedCase[];
}
